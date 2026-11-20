import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Generated from the helixdesktop/spec checkout by modules/helix-spec.ts
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
    // News posts: Markdown files in content/news/, one per post, written in
    // English. The file name is the URL (content/news/hello.md -> /news/hello).
    // See "News" in the README.
    news: defineCollection({
      type: 'page',
      source: {
        cwd: resolve(__dirname, 'content/news'),
        include: '*.md',
        prefix: '/news',
      },
      schema: z.object({
        // title and description are the page fields every page has.
        date: z.date(),
        author: z.string().optional(),
        // Drafts are left out of the list, the feed and the generated site.
        draft: z.boolean().default(false),
      }),
    }),
  },
})
