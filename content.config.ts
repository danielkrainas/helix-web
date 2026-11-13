import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Generated from the helix-desktop-spec checkout by modules/helix-spec.ts
    // (see scripts/sync-spec.mjs). Do not edit .spec/ by hand.
    docs: defineCollection({
      type: 'page',
      source: {
        cwd: resolve(__dirname, '.spec'),
        include: '**/*.md',
        prefix: '/docs',
      },
      schema: z.object({
        kind: z.string().optional(),
        sources: z.array(z.string()).optional(),
      }),
    }),
  },
})
