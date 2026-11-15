// Inline, render-blocking: applies a stored light/dark choice before first
// paint. Without a stored choice the page follows prefers-color-scheme
// (Bulma's system theme), so this only ever sets an explicit override.
const themeScript = `try{var t=localStorage.getItem('helix-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  // Order matters: helix-spec must generate .spec/ before Nuxt Content scans it.
  modules: ['./modules/helix-spec', '@nuxt/icon', '@nuxt/content'],

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'en', class: 'has-navbar-fixed-top' },
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#0b3b4a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Sora:wght@500;600;700&display=swap',
        },
      ],
      script: [{ innerHTML: themeScript, tagPosition: 'head' }],
    },
  },

  // Icons are rendered as inline SVG and bundled at build time, so the static
  // site never fetches them at runtime.
  icon: {
    mode: 'svg',
    provider: 'none',
    serverBundle: { collections: ['lucide', 'simple-icons'] },
    clientBundle: { scan: true, sizeLimitKb: 256 },
    fallbackToApi: false,
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

  vite: {
    css: {
      // Bulma 1.0.4 still uses Sass syntax newer Sass versions deprecate.
      preprocessorOptions: { scss: { quietDeps: true } },
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
})
