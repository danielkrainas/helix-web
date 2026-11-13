#!/usr/bin/env node
// Builds the /docs content tree from the canonical Helix specification
// (helix-desktop-spec). The spec location is read from package.json
// ("helix.specDir", relative to this project) and can be overridden with the
// HELIX_SPEC_DIR environment variable.
//
// What it does:
//   - copies every Markdown file into .spec/ with frontmatter (title,
//     description, source files) and the leading H1 removed (the page header
//     renders it)
//   - merges each D-Bus / extension introspection XML file into its companion
//     Markdown page (or a page of its own) as a formatted API reference
//   - rewrites links and `file.md` / `file.xml` code references so they point
//     at the matching docs page
//   - orders top-level sections with Nuxt Content numeric prefixes
//
// Usage: node scripts/sync-spec.mjs [specDir]

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const OUT_DIR = path.join(ROOT, '.spec')
const DOCS_PREFIX = '/docs'

// Order of known top-level entries; anything else is appended alphabetically.
const ORDER = {
  '': ['README.md', 'SCOPE.md', 'components', 'contracts', 'proposals', 'gaps.md'],
  contracts: ['README.md', 'dbus', 'gsettings', 'wayland', 'extensions'],
}

export function resolveSpecDir(override) {
  const fromEnv = override || process.env.HELIX_SPEC_DIR
  if (fromEnv) return path.resolve(ROOT, fromEnv)
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  return path.resolve(ROOT, pkg.helix?.specDir ?? '../helix-desktop-spec')
}

function git(specDir, ...args) {
  try {
    return execFileSync('git', ['-C', specDir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  }
  catch {
    return ''
  }
}

/** Revision and browse URL of the spec checkout, for "view source" links. */
export function specInfo(specDir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  let repoUrl = pkg.helix?.specRepo ?? ''
  if (!repoUrl) {
    const remote = git(specDir, 'remote', 'get-url', 'origin')
    const m = remote.match(/github\.com[:/](.+?)(?:\.git)?$/)
    if (m) repoUrl = `https://github.com/${m[1]}`
  }
  return {
    repoUrl,
    branch: git(specDir, 'rev-parse', '--abbrev-ref', 'HEAD') || 'main',
    commit: git(specDir, 'rev-parse', '--short', 'HEAD'),
    date: git(specDir, 'log', '-1', '--format=%cI'),
  }
}

// ---------------------------------------------------------------------------
// Walk the spec

function walk(dir, rel = '') {
  const out = []
  for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const r = rel ? `${rel}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...walk(dir, r))
    else if (/\.(md|xml)$/.test(entry.name)) out.push(r)
  }
  return out
}

/** Spec-relative "page id" (dir/stem) for a source file; READMEs are dir indexes. */
function pageId(rel) {
  const dir = path.posix.dirname(rel)
  const stem = path.posix.basename(rel).replace(/\.(md|xml)$/, '')
  const base = stem === 'README' ? '' : stem
  return [dir === '.' ? '' : dir, base].filter(Boolean).join('/')
}

function urlFor(id) {
  if (!id) return DOCS_PREFIX
  // Nuxt Content lowercases paths; keep the URL in sync with that.
  return `${DOCS_PREFIX}/${id}`.toLowerCase()
}

/** Output path (with ordering prefixes) for a page id. */
function outPath(id) {
  const parts = id ? id.split('/') : []
  const outParts = []
  let parent = ''
  parts.forEach((part, i) => {
    const isLast = i === parts.length - 1
    const order = ORDER[parent]
    // A leaf file in the ORDER table is listed with its .md name.
    const key = isLast ? [part, `${part}.md`] : [part]
    const idx = order ? order.findIndex(o => key.includes(o)) : -1
    outParts.push(idx >= 0 ? `${idx}.${part}` : part)
    parent = parent ? `${parent}/${part}` : part
  })
  // A page id that is a directory in the spec becomes that directory's index.
  return outParts
}

// ---------------------------------------------------------------------------
// Markdown helpers

function splitH1(md) {
  const lines = md.split('\n')
  const i = lines.findIndex(l => l.trim() !== '')
  if (i >= 0 && /^#\s+/.test(lines[i])) {
    return { title: lines[i].replace(/^#\s+/, '').trim(), body: lines.slice(i + 1).join('\n') }
  }
  return { title: '', body: md }
}

function plain(text) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function firstParagraph(body) {
  let inFence = false
  const para = []
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      if (para.length) break
      continue
    }
    if (inFence) continue
    if (line.trim() === '') {
      if (para.length) break
      continue
    }
    if (/^\s*(#|\||[-*+]\s|>|\d+\.\s|<)/.test(line)) {
      if (para.length) break
      continue
    }
    para.push(line.trim())
  }
  const text = plain(para.join(' '))
  return text.length > 220 ? `${text.slice(0, 217).replace(/\s+\S*$/, '')}…` : text
}

/** Applies fn to every line that is outside a fenced code block. */
function mapOutsideFences(md, fn) {
  let fence = null
  return md.split('\n').map((line) => {
    const m = line.match(/^\s*(```+|~~~+)/)
    if (m) {
      if (!fence) fence = m[1][0]
      else if (m[1][0] === fence) fence = null
      return line
    }
    return fence ? line : fn(line)
  }).join('\n')
}

// ---------------------------------------------------------------------------
// D-Bus introspection XML -> Markdown

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  isArray: name => ['interface', 'method', 'signal', 'property', 'arg', 'annotation', 'node'].includes(name),
})

function annotationNotes(annotations = []) {
  const notes = []
  for (const a of annotations) {
    if (a.name === 'org.freedesktop.DBus.Deprecated' && a.value === 'true') notes.push('**Deprecated.**')
    else if (a.name === 'org.freedesktop.DBus.Method.NoReply' && a.value === 'true') notes.push('No reply (fire and forget).')
    else if (a.name === 'org.freedesktop.DBus.Property.EmitsChangedSignal') notes.push(`Emits changed signal: \`${a.value}\`.`)
    else if (a.name?.startsWith('org.qtproject')) continue
    else if (a.name) notes.push(`\`${a.name}\` = \`${a.value}\``)
  }
  return notes
}

function argList(args, withDirection) {
  return args
    .map(a => `${withDirection && a.direction === 'out' ? 'out ' : ''}${a.type} ${a.name ?? '_'}`)
    .join(', ')
}

function methodSignature(m) {
  const args = m.arg ?? []
  const ins = args.filter(a => a.direction !== 'out')
  const outs = args.filter(a => a.direction === 'out')
  let sig = `${m.name}(${argList(ins)})`
  if (outs.length) sig += ` → (${argList(outs)})`
  return sig
}

function xmlToMarkdown(xml, level = 2) {
  const h = n => '#'.repeat(level + n)
  const doc = parser.parse(xml)
  const nodes = doc.node ?? []
  const interfaces = nodes.flatMap(n => n.interface ?? [])
  const parts = []
  for (const iface of interfaces) {
    parts.push(`${h(0)} \`${iface.name}\``)
    const notes = annotationNotes(iface.annotation)
    if (notes.length) parts.push(notes.join(' '))

    const methods = iface.method ?? []
    const properties = iface.property ?? []
    const signals = iface.signal ?? []
    const summary = [
      methods.length && `${methods.length} method${methods.length === 1 ? '' : 's'}`,
      properties.length && `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`,
      signals.length && `${signals.length} signal${signals.length === 1 ? '' : 's'}`,
    ].filter(Boolean)
    if (summary.length) parts.push(`*${summary.join(' · ')}*`)

    if (methods.length) {
      parts.push(`${h(1)} Methods`)
      for (const m of methods) {
        parts.push(`${h(2)} \`${m.name}\``)
        parts.push('```text\n' + methodSignature(m) + '\n```')
        const n = annotationNotes(m.annotation)
        if (n.length) parts.push(n.join(' '))
      }
    }
    if (properties.length) {
      parts.push(`${h(1)} Properties`)
      const notes = properties.map(p => annotationNotes(p.annotation).join(' '))
      const withNotes = notes.some(Boolean)
      const rows = properties.map((p, i) =>
        `| \`${p.name}\` | \`${p.type}\` | ${p.access} |${withNotes ? ` ${notes[i]} |` : ''}`)
      parts.push([
        `| Name | Type | Access |${withNotes ? ' Notes |' : ''}`,
        `|---|---|---|${withNotes ? '---|' : ''}`,
        ...rows,
      ].join('\n'))
    }
    if (signals.length) {
      parts.push(`${h(1)} Signals`)
      for (const s of signals) {
        parts.push(`${h(2)} \`${s.name}\``)
        parts.push('```text\n' + `${s.name}(${argList(s.arg ?? [])})` + '\n```')
        const n = annotationNotes(s.annotation)
        if (n.length) parts.push(n.join(' '))
      }
    }
  }
  return { interfaces: interfaces.map(i => i.name), markdown: parts.join('\n\n') }
}

// ---------------------------------------------------------------------------
// Sync

function frontmatter(data) {
  const lines = ['---']
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === '') continue
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      lines.push(`${k}:`)
      for (const [k2, v2] of Object.entries(v)) lines.push(`  ${k2}: ${JSON.stringify(v2)}`)
    }
    else {
      lines.push(`${k}: ${JSON.stringify(v)}`)
    }
  }
  lines.push('---', '')
  return lines.join('\n')
}

function kindOf(id) {
  if (id.startsWith('contracts/dbus/')) return 'dbus'
  if (id.startsWith('contracts/extensions/')) return 'extensions'
  if (id.startsWith('contracts/gsettings/')) return 'gsettings'
  if (id.startsWith('contracts/wayland')) return 'wayland'
  if (id.startsWith('proposals/')) return 'proposal'
  return 'spec'
}

export function syncSpec({ specDir = resolveSpecDir(), outDir = OUT_DIR, quiet = false } = {}) {
  if (!fs.existsSync(specDir)) {
    throw new Error(`[helix-spec] spec directory not found: ${specDir} (set "helix.specDir" in package.json or HELIX_SPEC_DIR)`)
  }
  const files = walk(specDir)
  const fileSet = new Set(files)

  // Group source files into pages: X.md + X.xml share one page.
  const pages = new Map()
  for (const rel of files) {
    const id = pageId(rel)
    if (!pages.has(id)) pages.set(id, { id, md: null, xml: null })
    pages.get(id)[rel.endsWith('.xml') ? 'xml' : 'md'] = rel
  }
  // Directories that hold pages but have no README still need a nav group.
  const byBasename = new Map()
  for (const rel of files) {
    const b = path.posix.basename(rel)
    byBasename.set(b, byBasename.has(b) ? null : rel) // null = ambiguous
  }

  /** Resolves a reference to a spec file (as written in fromRel) to a docs URL. */
  function resolveRef(ref, fromRel) {
    const [target, hash] = ref.split('#')
    if (!/\.(md|xml)$/.test(target)) return null
    const fromDir = path.posix.dirname(fromRel)
    const candidates = [
      path.posix.normalize(path.posix.join(fromDir, target)),
      path.posix.normalize(target.replace(/^\.?\//, '')),
    ]
    let hit = candidates.find(c => fileSet.has(c))
    if (!hit && !target.includes('/')) hit = byBasename.get(target) ?? undefined
    if (!hit) return null
    return urlFor(pageId(hit)) + (hash ? `#${hash}` : '')
  }

  function rewriteLinks(md, fromRel) {
    return mapOutsideFences(md, line => line
      // [text](file.md#x)
      .replace(/\]\(([^)\s]+\.(?:md|xml)(?:#[^)\s]*)?)\)/g, (all, ref) => {
        if (/^[a-z]+:/i.test(ref)) return all
        const url = resolveRef(ref, fromRel)
        return url ? `](${url})` : all
      })
      // `file.md` that is not already link text
      .replace(/(?<!\[)`([\w./-]+\.(?:md|xml))`(?!\]\()/g, (all, ref) => {
        const url = resolveRef(ref, fromRel)
        return url ? `[\`${ref}\`](${url})` : all
      }))
  }

  const written = new Set()
  function emit(relOut, content) {
    const abs = path.join(outDir, relOut)
    written.add(abs)
    if (fs.existsSync(abs) && fs.readFileSync(abs, 'utf8') === content) return
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content)
  }

  const dirIds = new Set()
  for (const id of pages.keys()) {
    const parts = id.split('/')
    for (let i = 1; i < parts.length; i++) dirIds.add(parts.slice(0, i).join('/'))
  }

  for (const page of pages.values()) {
    const sources = [page.md, page.xml].filter(Boolean)
    let title = ''
    let body = ''
    let navTitle

    if (page.md) {
      const split = splitH1(fs.readFileSync(path.join(specDir, page.md), 'utf8'))
      title = plain(split.title)
      body = rewriteLinks(split.body.trim(), page.md)
    }
    if (page.xml) {
      const raw = fs.readFileSync(path.join(specDir, page.xml), 'utf8')
      const ref = xmlToMarkdown(raw, page.md ? 3 : 2)
      if (!title) title = ref.interfaces[0] ?? path.posix.basename(page.xml, '.xml')
      const section = [
        page.md ? '## Interface reference\n\nGenerated from the introspection XML.' : '',
        ref.markdown,
        `${page.md ? '###' : '##'} Introspection XML\n\n\`\`\`xml\n${raw.trim()}\n\`\`\``,
      ].filter(Boolean).join('\n\n')
      body = [body, section].filter(Boolean).join('\n\n')
    }

    const kind = kindOf(page.id)
    const stem = path.posix.basename(page.id)
    // Interface / schema pages are listed by their name in the sidebar.
    if (['dbus', 'extensions', 'gsettings'].includes(kind) && stem) navTitle = stem
    if (!title) title = stem || 'Helix'

    const isDirIndex = page.md && path.posix.basename(page.md) === 'README.md'
    const outParts = outPath(page.id)
    const relOut = isDirIndex || dirIds.has(page.id)
      ? path.posix.join(...outParts, 'index.md')
      : `${outParts.join('/')}.md`

    const fm = frontmatter({
      title,
      description: firstParagraph(body),
      navigation: navTitle ? { title: navTitle } : undefined,
      kind,
      sources,
    })
    emit(relOut, `${fm}${body}\n`)
  }

  // Remove files that no longer correspond to a spec page.
  const prune = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        prune(abs)
        if (fs.readdirSync(abs).length === 0) fs.rmdirSync(abs)
      }
      else if (!written.has(abs)) fs.rmSync(abs)
    }
  }
  prune(outDir)

  if (!quiet) console.log(`[helix-spec] ${pages.size} pages from ${path.relative(ROOT, specDir) || specDir} -> ${path.relative(ROOT, outDir)}/`)
  return { pages: pages.size, routes: [...pages.keys()].map(urlFor) }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncSpec({ specDir: resolveSpecDir(process.argv[2]) })
}
