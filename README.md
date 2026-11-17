<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/helixdesktop/.github/main/brand/helix-logo-vertical-dark.svg">
    <img src="https://raw.githubusercontent.com/helixdesktop/.github/main/brand/helix-logo-vertical.svg" alt="Helix" width="140">
  </picture>
</p>

# web

Landing page and documentation site for **Helix**, a GNOME-compatible desktop
environment written in Rust and built on GNOME's public contracts.

Stack:

- [Nuxt 4](https://nuxt.com), generated as a static site;
- [Nuxt Content](https://content.nuxt.com) for `/docs` (Markdown rendered with
  MDC; code highlighted by Shiki with light and dark themes);
- [Bulma 1](https://bulma.io), compiled from Sass in
  `app/assets/scss/main.scss` and themed through Bulma's CSS variables (Helix's
  teal/blue palette, Inter, Sora and JetBrains Mono from Google Fonts);
- [Nuxt Icon](https://github.com/nuxt/icon) with the Lucide and Simple Icons
  Iconify sets, bundled at build time and rendered as inline SVG.

All user-visible text lives in message files under `i18n/` ([@nuxtjs/i18n](https://i18n.nuxtjs.org)),
so the site can be translated; see [Translations](#translations).

Light and dark mode follow `prefers-color-scheme`; the toggle in the header
stores an explicit choice in `localStorage` and applies it as `data-theme` on
`<html>`.

## Setup

Requires Node.js ≥ 22.5 and pnpm (via corepack: `corepack enable`).

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm generate   # static site in .output/public
pnpm build      # server build in .output
```

### Checks

Run before committing (the Docker build runs them too):

```bash
pnpm check-i18n   # no hard-coded text in components; every message key exists in English
```

## Docs come from the spec

Everything under `/docs` is built from the canonical specification repository,
[`helixdesktop/spec`](https://github.com/helixdesktop/spec), read from a
sibling checkout: `../spec`, or `../helix-desktop-spec` (its former name). To
use another path, set it in `package.json`:

```json
"helix": { "specDir": "../my-spec-checkout" }
```

Override it with `HELIX_SPEC_DIR=/path/to/spec pnpm dev` (needed in a git
worktree, where the relative path doesn't reach the spec checkout).

`scripts/sync-spec.mjs` turns the spec into `.spec/` (git-ignored), which Nuxt
Content reads as the `docs` collection. It:

- copies every Markdown file and adds frontmatter (title, description, the
  source files it came from);
- merges each D-Bus introspection XML file into its companion `.md` page (or a
  page of its own) as a formatted reference of methods, properties and signals,
  plus the raw XML;
- rewrites links and `` `file.md` `` / `` `file.xml` `` references so they
  point at the matching docs page;
- orders the top-level sections (Introduction, Scope, GNOME compatibility,
  Components, Contracts, Proposals).

The local module `modules/helix-spec.ts` runs the sync when Nuxt starts and,
in `pnpm dev`, watches the spec checkout and re-syncs on change, so edits to
the spec show up in the browser live. It also registers every docs route for
prerendering. To run the sync on its own: `pnpm sync-spec`.

Each docs page links back to its source files in the spec repository, and the
footer shows the spec commit the site was built from.

## Translations

The site's text — navigation, footer, landing page, install instructions,
button and accessibility labels, alt text, page titles and descriptions, the
404 page and the docs page chrome — comes from message files, one per
language, in `i18n/locales/`. English (`en.json`) is the source and the only
language so far; the planned languages are tracked in
[issue #1](https://github.com/helixdesktop/web/issues/1).

- English stays at the root URLs (`/`, `/docs/…`). Every other language gets
  a prefix: `/es/`, `/zh-cn/docs/…` (strategy `prefix_except_default`).
- `<html lang>` follows the page's language. Once there are two or more
  languages, every page also gets `hreflang` alternates (plus `x-default`)
  and the header shows a language picker; with English alone neither is
  rendered. The alternates are absolute URLs on `https://helixdesktop.org`;
  set `HELIX_SITE_URL` at build time to build for another origin.
- A message missing from a translation falls back to English, never to its
  key. The browser's language is never used to redirect.

### Adding a language

1. Copy `i18n/locales/en.json` to `i18n/locales/<code>.json` (lower-case
   code, which is also the URL prefix: `es`, `pt-br`, `zh-cn`) and translate
   the values. Keep the keys and the `{placeholders}` as they are; text
   between placeholders may be reordered freely. Leave out a message to fall
   back to English. Set `_meta`:

   ```json
   "_meta": {
     "language": "Español",
     "status": "machine",
     "lastTranslator": "machine translation, unreviewed"
   }
   ```

2. Add one line to `i18n/locales.ts`:

   ```ts
   { code: 'es', language: 'es', name: 'Español', dir: 'ltr', file: 'es.json' },
   ```

   `language` is the BCP 47 tag for `lang`/`hreflang` (`pt-BR`, `zh-CN`) and
   `name` is the language's own name, as shown in the picker.

3. Run `pnpm check-i18n` and `pnpm generate`, and look at the pages at phone
   width (long words in German and Russian, CJK line breaking).

Messages use [vue-i18n syntax](https://vue-i18n.intlify.dev/guide/essentials/syntax):
`{name}` placeholders, `{'@'}` for a literal `@`, and plural forms separated
by `|`, chosen by the language's CLDR plural rules when the count is passed
(`t('key', { n }, n)`). Write the forms in CLDR order, keeping only the
language's categories: `one | other` (English, German, …), `one | few | many`
(Russian, Ukrainian, Polish), a single form (Chinese, Japanese, Korean); see
`i18n/i18n.config.ts`.
Where a sentence contains a link or formatted text, the message has a
placeholder for it (rendered with `<i18n-t>`), so translators can move it.
Package names, commands and repository names are not translated and live in
the components.

### Machine translations and review

Machine translations are acceptable for a language's first version: they are
shipped without waiting for review, marked `"status": "machine"` and
`"lastTranslator": "machine translation, unreviewed"` in the file's `_meta`
and listed below, so native speakers know where help is wanted. Corrections
are welcome as issues or pull requests. When a fluent speaker has reviewed a
whole file, set `"status": "reviewed"`, put their name in `lastTranslator`
and update the table.

| Language | File | Status |
|---|---|---|
| English | `en.json` | source |

### Documentation stays English

Everything under `/docs` is generated from the English specification and is
not translated. Translated sites still link to the docs under their prefix
(`/es/docs/…`) so the site chrome stays in the reader's language; those pages
show the English content with a short notice (`docs.englishOnly`) linking to
the English page.

### Writing components

Never put user-visible text in a component: add a key to `en.json` (grouped
by page or section, e.g. `home.install.title`) and use `t('home.install.title')`
in templates and scripts (or `<i18n-t>` for text with markup). Internal links
use `<NuxtLinkLocale>` so they keep the current language. `pnpm check-i18n`
fails on text nodes, labels such as `aria-label`, `alt`, `title` and
`placeholder`, prose-like strings in scripts, and keys missing from
`en.json`; a line that really must stay as it is can be marked with an
`i18n-ignore` comment.

## Docker

The site is static: `Dockerfile` generates it and serves `.output/public`
with nginx (unprivileged, port 8080; `docker/nginx.conf` adds gzip,
long-lived caching for `/_nuxt/` assets, security headers, real 404s and a
`/healthz` endpoint).

```bash
docker build -t helix-web .                      # clones helixdesktop/spec from GitHub
docker build --build-context spec=../spec -t helix-web .   # use a local spec checkout
docker run --rm -p 8080:8080 helix-web           # http://localhost:8080
```

Build arguments: `SPEC_REF` (branch or tag of the spec, default `main`),
`SPEC_REPO`, `NODE_IMAGE` and `NGINX_IMAGE`.

## Kubernetes

`charts/helix-web` is a Helm chart that runs the Docker image above: a
Deployment (two replicas by default, spread across nodes, rolling updates
with no downtime), a Service on port 80, and optionally an Ingress or a
Gateway API HTTPRoute, a HorizontalPodAutoscaler and a NetworkPolicy. The pods
run as nginx's unprivileged user with a read-only root filesystem (only `/tmp`
is writable), no service account token, and `/healthz` for the probes.

```bash
helm install helix-web charts/helix-web \
  --namespace helix-web --create-namespace \
  --set image.tag=0.1.0 \
  --set ingress.enabled=true --set ingress.className=nginx \
  --set 'ingress.tls[0].secretName=helixdesktop-org-tls' \
  --set 'ingress.tls[0].hosts[0]=helixdesktop.org'
helm test helix-web --namespace helix-web
```

The image defaults to `ghcr.io/helixdesktop/web` with the chart's
`appVersion` as the tag; build and push it with the `docker build` above (or
set `image.repository`, `image.tag` or `image.digest`). For a Gateway, set
`httpRoute.enabled=true` and `httpRoute.parentRefs`. With `replicaCount: 1`,
turn off `podDisruptionBudget` so node drains aren't blocked. Every option is
documented in `charts/helix-web/values.yaml`. Check changes with
`helm lint --strict charts/helix-web`.

## Layout

```
app/
  app.vue                 header, footer, search
  assets/scss/main.scss   Bulma configuration and the site's styles
  components/             header, footer, logo, docs search, sidebar menu
  components/content/     prose overrides for docs Markdown (tables)
  components/LanguagePicker.vue  shown once there are two or more languages
  composables/            light/dark toggle, locale <html> attributes
  error.vue               404 and error page
  pages/index.vue         landing page
  pages/docs/[...slug].vue docs page renderer (header, prose, on-page nav)
  layouts/docs.vue        sidebar navigation
  utils/docs-nav.ts       navigation tree clean-up
  utils/links.ts          repository and release links
public/screenshots/       shell screenshots used on the landing page
i18n/locales.ts           the site's languages
i18n/locales/en.json      English messages (the source for translations)
i18n/i18n.config.ts       vue-i18n options (English fallback)
content.config.ts         the `docs` collection (source: .spec/)
modules/helix-spec.ts     sync + watch + prerender routes
scripts/sync-spec.mjs     spec -> .spec/ transform
scripts/check-i18n.mjs    hard-coded text and message key check
charts/helix-web/         Helm chart for Kubernetes deployments
```
