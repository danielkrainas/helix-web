// Keeps .spec/ (the /docs content source) in sync with the canonical spec
// repository. Runs once at startup; in dev it also watches the spec checkout
// and re-syncs on change, which Nuxt Content then hot-reloads.
import fs from 'node:fs'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { resolveSpecDir, specInfo, syncSpec } from '../scripts/sync-spec.mjs'
import { defaultLocale, locales } from '../i18n/locales'

export default defineNuxtModule({
  meta: { name: 'helix-spec' },
  setup(_options, nuxt) {
    const logger = useLogger('helix-spec')
    const specDir: string = resolveSpecDir()
    const { routes } = syncSpec({ specDir }) as { routes: string[] }

    // Prerender every docs page explicitly: the crawler only sees links that
    // are rendered, and collapsed sidebar groups don't render theirs (nor
    // does it follow paths that look like files, such as /docs/…/org.gnome.x).
    // Translated sites show the same English docs under their prefix.
    const prefixes = ['', ...locales.filter(l => l.code !== defaultLocale).map(l => `/${l.code}`)]
    nuxt.hook('nitro:config', (config) => {
      config.prerender ??= {}
      config.prerender.routes = [
        ...(config.prerender.routes ?? []),
        ...prefixes.flatMap(prefix => routes.map(route => prefix + route)),
      ]
    })

    nuxt.options.runtimeConfig.public.spec = specInfo(specDir)

    if (nuxt.options.dev) {
      let timer: ReturnType<typeof setTimeout> | undefined
      const watcher = fs.watch(specDir, { recursive: true }, (_event, file) => {
        if (!file || file.startsWith('.git') || !/\.(md|xml)$/.test(file)) return
        clearTimeout(timer)
        timer = setTimeout(() => {
          try {
            syncSpec({ specDir, quiet: true })
            logger.info(`spec changed (${file}), docs re-synced`)
          }
          catch (e) {
            logger.error(e)
          }
        }, 150)
      })
      nuxt.hook('close', () => watcher.close())
    }
  },
})
