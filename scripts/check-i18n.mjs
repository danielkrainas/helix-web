#!/usr/bin/env node
// Checks the site's translations (`pnpm check-i18n`). Fails when:
//
// - a component has hard-coded user-visible text: a text node in a template,
//   a static attribute a person reads or hears (aria-label, alt, title,
//   placeholder, …), or a prose-looking string in a script (a `label:` /
//   `title:` / `text:` … property, a message for createError/useSeoMeta, or
//   a sentence);
// - a message key used in code is missing from the English messages;
// - a message file isn't valid, has a key English doesn't have, has a
//   message whose placeholders differ from English, or lacks `_meta`.
//
// Unused English keys are reported as warnings. A line can opt out with an
// `i18n-ignore` comment on it or on the line before (for text that is the
// same in every language and isn't in a script string or `{{ }}`).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseSfc, babelParse } from '@vue/compiler-sfc'

const root = fileURLToPath(new URL('..', import.meta.url))
const appDir = join(root, 'app')
const localeDir = join(root, 'i18n', 'locales')
const sourceLocale = 'en'

const errors = []
const warnings = []
const err = (file, line, msg) => errors.push(`${relative(root, file)}:${line}: ${msg}`)

// --- Messages ---------------------------------------------------------------

function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out)
    else out.set(key, v)
  }
  return out
}

const placeholders = msg => [...String(msg).matchAll(/\{\s*([\w.]+)\s*\}/g)].map(m => m[1]).sort().join(',')

const catalogs = new Map()
for (const file of readdirSync(localeDir).filter(f => f.endsWith('.json'))) {
  const path = join(localeDir, file)
  try {
    catalogs.set(file.replace(/\.json$/, ''), { path, messages: flatten(JSON.parse(readFileSync(path, 'utf8'))) })
  }
  catch (e) {
    err(path, 1, `invalid JSON: ${e.message}`)
  }
}

const en = catalogs.get(sourceLocale)
if (!en) {
  console.error(`i18n/locales/${sourceLocale}.json is missing`)
  process.exit(1)
}

for (const [code, { path, messages }] of catalogs) {
  if (!messages.has('_meta.status')) err(path, 1, '`_meta.status` is missing (source, machine or reviewed)')
  else if (!['source', 'machine', 'reviewed'].includes(messages.get('_meta.status')))
    err(path, 1, '`_meta.status` must be source, machine or reviewed')
  for (const [key, msg] of messages) {
    if (typeof msg !== 'string') {
      err(path, 1, `${key}: messages must be strings`)
      continue
    }
    // `@` starts a linked message and breaks compilation; write {'@'}.
    if (/@(?![.:])/.test(msg.replace(/\{'@'\}/g, ''))) err(path, 1, `${key}: escape "@" as {'@'}`)
    if (key.startsWith('_meta.')) continue
    if (code === sourceLocale) continue
    if (!en.messages.has(key)) err(path, 1, `${key}: not in ${sourceLocale}.json`)
    else if (placeholders(msg) !== placeholders(en.messages.get(key)))
      err(path, 1, `${key}: placeholders {${placeholders(msg)}} differ from English {${placeholders(en.messages.get(key))}}`)
  }
}

// --- Sources ----------------------------------------------------------------

function walkDir(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walkDir(path) : [path]
  })
}

// Attributes whose value is read or announced to people.
const textAttrs = new Set(['alt', 'title', 'placeholder', 'label', 'aria-label', 'aria-description',
  'aria-placeholder', 'aria-roledescription', 'aria-valuetext', 'summary', 'abbr'])
// Script object properties that hold user-visible text.
const textProps = new Set(['label', 'title', 'text', 'description', 'statusMessage', 'message',
  'alt', 'placeholder', 'ariaLabel', 'caption', 'name', 'ogTitle', 'ogDescription', 'ogSiteName',
  'twitterTitle', 'twitterDescription', 'titleTemplate'])
const keyPattern = /^[a-z][\w]*(?:\.[\w-]+)+$/
const namespaces = new Set([...en.messages.keys()].map(k => k.split('.')[0]))
const hasLetter = s => /\p{L}/u.test(s)
// A sentence or phrase: two or more words, starting with a capital letter.
const looksLikeProse = s => /^\p{Lu}[\p{Ll}’']+[\s,]+\p{L}/u.test(s.trim())

const usedKeys = new Set()

function ignored(lines, line) {
  return /i18n-ignore/.test(lines[line - 1] ?? '') || /i18n-ignore/.test(lines[line - 2] ?? '')
}

function useKey(file, line, key) {
  usedKeys.add(key)
  if (!en.messages.has(key)) err(file, line, `message key "${key}" is not in ${sourceLocale}.json`)
}

// A string literal that looks like one of our keys must be one.
function checkLiteral(file, lines, line, value, prop) {
  if (keyPattern.test(value) && namespaces.has(value.split('.')[0])) return useKey(file, line, value)
  if (ignored(lines, line) || !hasLetter(value)) return
  if (prop && textProps.has(prop) && /\s/.test(value)) err(file, line, `hard-coded text in "${prop}": ${JSON.stringify(value)}`)
  else if (prop && textProps.has(prop) && /^\p{Lu}/u.test(value) && prop !== 'name') err(file, line, `hard-coded text in "${prop}": ${JSON.stringify(value)}`)
  else if (looksLikeProse(value)) err(file, line, `hard-coded text: ${JSON.stringify(value)}`)
}

function walkAst(node, visit, parent) {
  if (!node || typeof node.type !== 'string') return
  visit(node, parent)
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments') continue
    const v = node[k]
    if (Array.isArray(v)) v.forEach(c => walkAst(c, visit, node))
    else if (v && typeof v.type === 'string') walkAst(v, visit, node)
  }
}

// Scans a JS/TS expression or program for message keys and hard-coded text.
function checkScript(file, lines, code, lineOffset, { expression = false } = {}) {
  let ast
  try {
    ast = expression
      ? babelParse(`(${code})`, { plugins: ['typescript'] })
      : babelParse(code, { sourceType: 'module', plugins: ['typescript'] })
  }
  catch (e) {
    err(file, lineOffset + 1, `could not parse: ${e.message}`)
    return
  }
  walkAst(ast, (node, parent) => {
    const line = lineOffset + (node.loc?.start.line ?? 1)
    if (node.type === 'StringLiteral') {
      if (parent?.type === 'ImportDeclaration' || parent?.type === 'TSLiteralType') return
      // The first argument of t('…') / $t('…') / te('…') is always a key.
      if (parent?.type === 'CallExpression' && parent.arguments[0] === node
        && ['t', '$t', 'te', '$te', 'tm', '$tm'].includes(parent.callee.name ?? parent.callee.property?.name))
        return useKey(file, line, node.value)
      if (parent?.type === 'ObjectProperty' && parent.key === node) return
      const prop = parent?.type === 'ObjectProperty' && parent.value === node
        ? (parent.key.name ?? parent.key.value)
        : undefined
      checkLiteral(file, lines, line, node.value, prop)
    }
    else if (node.type === 'TemplateLiteral') {
      const text = node.quasis.map(q => q.value.cooked).join(' ')
      if (!ignored(lines, line) && looksLikeProse(text)) err(file, line, `hard-coded text: ${JSON.stringify(text)}`)
    }
  })
}

function checkTemplate(file, lines, nodes) {
  for (const node of nodes) {
    const line = node.loc?.start.line ?? 1
    if (node.type === 2 /* TEXT */) {
      if (hasLetter(node.content) && !ignored(lines, line))
        err(file, line, `hard-coded text: ${JSON.stringify(node.content.trim())}`)
    }
    else if (node.type === 5 /* INTERPOLATION */) {
      checkScript(file, lines, node.content.content, line - 1, { expression: true })
    }
    else if (node.type === 1 /* ELEMENT */) {
      for (const p of node.props) {
        const pline = p.loc?.start.line ?? line
        if (p.type === 6 /* static attribute */) {
          if (p.name === 'keypath' && p.value) useKey(file, pline, p.value.content)
          else if (textAttrs.has(p.name) && p.value && hasLetter(p.value.content) && !ignored(lines, pline))
            err(file, pline, `hard-coded ${p.name}: ${JSON.stringify(p.value.content)}`)
        }
        else if (p.type === 7 /* directive */ && p.exp?.content && p.name !== 'for' && p.name !== 'slot' && p.name !== 'on') {
          checkScript(file, lines, p.exp.content, pline - 1, { expression: true })
        }
        else if (p.type === 7 && p.name === 'for' && p.forParseResult?.source) {
          checkScript(file, lines, p.forParseResult.source.content, pline - 1, { expression: true })
        }
      }
      checkTemplate(file, lines, node.children ?? [])
    }
    else if (node.children) {
      checkTemplate(file, lines, node.children)
    }
  }
}

for (const file of walkDir(appDir)) {
  const ext = extname(file)
  if (ext !== '.vue' && ext !== '.ts') continue
  const source = readFileSync(file, 'utf8')
  const lines = source.split('\n')
  if (ext === '.ts') {
    checkScript(file, lines, source, 0)
    continue
  }
  const { descriptor, errors: sfcErrors } = parseSfc(source, { filename: file })
  sfcErrors.forEach(e => err(file, e.loc?.start.line ?? 1, `SFC parse error: ${e.message}`))
  for (const block of [descriptor.script, descriptor.scriptSetup].filter(Boolean))
    checkScript(file, lines, block.content, block.loc.start.line - 1)
  if (descriptor.template?.ast) checkTemplate(file, lines, descriptor.template.ast.children)
}

for (const key of en.messages.keys()) {
  if (!key.startsWith('_meta.') && !usedKeys.has(key)) warnings.push(`i18n/locales/${sourceLocale}.json: "${key}" is not used`)
}

warnings.forEach(w => console.warn(`warning: ${w}`))
if (errors.length) {
  errors.forEach(e => console.error(`error: ${e}`))
  console.error(`\ncheck-i18n: ${errors.length} error(s). Move user-visible text to i18n/locales/${sourceLocale}.json and use t('key').`)
  process.exit(1)
}
const others = [...catalogs.keys()].filter(c => c !== sourceLocale)
console.log(`check-i18n: ok (${en.messages.size - [...en.messages.keys()].filter(k => k.startsWith('_meta.')).length} English messages, ${usedKeys.size} keys used${others.length ? `, translations: ${others.join(', ')}` : ''})`)
