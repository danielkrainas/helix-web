export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  // Order matters: helix-spec must generate .spec/ before Nuxt Content scans it,
  // and Nuxt UI must come before Nuxt Content to provide the prose components.
  modules: ['./modules/helix-spec', '@nuxt/ui', '@nuxt/content'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  runtimeConfig: {
    public: {
      // Filled in by modules/helix-spec.ts
      spec: { repoUrl: '', branch: 'main', commit: '', date: '' },
    },
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: ['xml', 'bash', 'ini', 'json', 'rust', 'toml', 'yaml', 'c', 'python', 'javascript'],
        },
      },
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
})
