// Registers the news pages and the Atom feed for prerendering, so `pnpm
// generate` writes every post even if nothing links to it yet. Posts are
// the Markdown files in content/news/; drafts (`draft: true` in the
// frontmatter) are skipped. Translated sites show the same English posts
// under their prefix.
import fs from 'node:fs'
import path from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { defaultLocale, locales } from '../i18n/locales'

export default defineNuxtModule({
  meta: { name: 'helix-news' },
  setup(_options, nuxt) {
    const dir = path.join(nuxt.options.rootDir, 'content', 'news')
    const posts = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter(f => f.endsWith('.md')).filter((f) => {
          const front = fs.readFileSync(path.join(dir, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
          return !/^draft:\s*true\s*$/m.test(front?.[1] ?? '')
        })
      : []
    // Nuxt Content lowercases paths; keep the routes in step with that.
    const routes = ['/news', ...posts.map(f => `/news/${f.replace(/\.md$/, '').toLowerCase()}`)]
    const prefixes = ['', ...locales.filter(l => l.code !== defaultLocale).map(l => `/${l.code}`)]

    nuxt.hook('nitro:config', (config) => {
      config.prerender ??= {}
      config.prerender.routes = [
        ...(config.prerender.routes ?? []),
        ...prefixes.flatMap(prefix => routes.map(route => prefix + route)),
        '/feed.xml',
      ]
    })
  },
})
