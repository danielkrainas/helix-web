# helix-web

Landing page and documentation site for **Helix**, a Rust desktop environment
built on GNOME's public contracts. Built with [Nuxt 4](https://nuxt.com),
[Nuxt Content](https://content.nuxt.com) and [Nuxt UI](https://ui.nuxt.com).

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

Override it with `HELIX_SPEC_DIR=/path/to/spec pnpm dev`.

`scripts/sync-spec.mjs` turns the spec into `.spec/` (git-ignored), which Nuxt
Content reads as the `docs` collection. It:

- copies every Markdown file and adds frontmatter (title, description, the
  source files it came from);
- merges each D-Bus introspection XML file into its companion `.md` page (or a
  page of its own) as a formatted reference of methods, properties and signals,
  plus the raw XML;
- rewrites links and `` `file.md` `` / `` `file.xml` `` references so they
  point at the matching docs page;
- orders the top-level sections (Introduction, Scope, Components, Contracts,
  Proposals, Gaps).

The local module `modules/helix-spec.ts` runs the sync when Nuxt starts and,
in `pnpm dev`, watches the spec checkout and re-syncs on change, so edits to
the spec show up in the browser live. It also registers every docs route for
prerendering. To run the sync on its own: `pnpm sync-spec`.

Each docs page links back to its source files in the spec repository, and the
footer shows the spec commit the site was built from.

## Layout

```
app/
  app.vue                 header, footer, search
  pages/index.vue         landing page
  pages/docs/[...slug].vue docs page renderer
  layouts/docs.vue        sidebar navigation
  utils/docs-nav.ts       navigation tree clean-up
content.config.ts         the `docs` collection (source: .spec/)
modules/helix-spec.ts     sync + watch + prerender routes
scripts/sync-spec.mjs     spec -> .spec/ transform
```
