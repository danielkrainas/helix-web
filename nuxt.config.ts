import { defaultLocale, locales } from './i18n/locales'

// Inline, render-blocking: applies a stored light/dark choice before first
// paint. Without a stored choice the page follows prefers-color-scheme
// (Bulma's system theme), so this only ever sets an explicit override.
const themeScript = `try{var t=localStorage.getItem('helix-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  // Order matters: helix-spec must generate .spec/ before Nuxt Content scans it.
  modules: ['./modules/helix-spec', './modules/news', '@nuxt/icon', '@nuxt/content', '@nuxtjs/i18n'],

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      // `lang` is the fallback for pages rendered without the app (the SPA
      // 404.html); app.vue sets it from the current locale everywhere else.
      htmlAttrs: { lang: 'en', class: 'has-navbar-fixed-top' },
      meta: [
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#17194f' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
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

  // Languages: see i18n/locales.ts and "Translations" in the README. English
  // stays at the root URLs; other languages get a prefix (/es/, /zh-cn/ …).
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale,
    locales,
    vueI18n: './i18n.config.ts',
    // The site's origin, needed for the absolute URLs of hreflang alternates
    // once there is more than one language.
    baseUrl: process.env.HELIX_SITE_URL ?? 'https://helixdesktop.org',
    // The browser's language may be suggested, never forced: no redirects.
    detectBrowserLanguage: false,
  },

  runtimeConfig: {
    public: {
      // Filled in by modules/helix-spec.ts
      spec: { repoUrl: '', branch: 'main', commit: '', date: '' },
      // The site's origin, for the absolute links of the news feed.
      siteUrl: process.env.HELIX_SITE_URL ?? 'https://helixdesktop.org',
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
