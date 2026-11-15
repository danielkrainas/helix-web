# helix-web

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

## Docs come from the spec

Everything under `/docs` is built from the canonical specification repository,
[`helix-desktop-spec`](https://github.com/danielkrainas/helix-desktop-spec). The
path to that checkout is set in `package.json`:

```json
"helix": { "specDir": "../helix-desktop-spec" }
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

## Docker

The site is static: `Dockerfile` generates it and serves `.output/public`
with nginx (unprivileged, port 8080; `docker/nginx.conf` adds gzip,
long-lived caching for `/_nuxt/` assets, security headers, real 404s and a
`/healthz` endpoint).

```bash
docker build -t helix-web .                      # clones helix-desktop-spec from GitHub
docker build --build-context spec=../helix-desktop-spec -t helix-web .   # use a local spec checkout
docker run --rm -p 8080:8080 helix-web           # http://localhost:8080
```

Build arguments: `SPEC_REF` (branch or tag of the spec, default `main`),
`SPEC_REPO`, `NODE_IMAGE` and `NGINX_IMAGE`.

## Layout

```
app/
  app.vue                 header, footer, search
  assets/scss/main.scss   Bulma configuration and the site's styles
  components/             header, footer, logo, docs search, sidebar menu
  components/content/     prose overrides for docs Markdown (tables)
  composables/            light/dark toggle
  pages/index.vue         landing page
  pages/docs/[...slug].vue docs page renderer (header, prose, on-page nav)
  layouts/docs.vue        sidebar navigation
  utils/docs-nav.ts       navigation tree clean-up
  utils/links.ts          repository and release links
public/screenshots/       shell screenshots used on the landing page
content.config.ts         the `docs` collection (source: .spec/)
modules/helix-spec.ts     sync + watch + prerender routes
scripts/sync-spec.mjs     spec -> .spec/ transform
```
