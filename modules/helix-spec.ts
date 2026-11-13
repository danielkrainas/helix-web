// Keeps .spec/ (the /docs content source) in sync with the canonical spec
// repository. Runs once at startup; in dev it also watches the spec checkout
// and re-syncs on change, which Nuxt Content then hot-reloads.
import fs from 'node:fs'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { resolveSpecDir, specInfo, syncSpec } from '../scripts/sync-spec.mjs'

export default defineNuxtModule({
  meta: { name: 'helix-spec' },
  setup(_options, nuxt) {
    const logger = useLogger('helix-spec')
    const specDir: string = resolveSpecDir()
    const { routes } = syncSpec({ specDir }) as { routes: string[] }

    // Prerender every docs page explicitly: the crawler only sees links that
    // are rendered, and collapsed sidebar groups don't render theirs.
    nuxt.hook('nitro:config', (config) => {
      config.prerender ??= {}
      config.prerender.routes = [...(config.prerender.routes ?? []), ...routes]
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
