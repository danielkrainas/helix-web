<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const route = useRoute()
const { public: { spec } } = useRuntimeConfig()

const path = computed(() => route.path.replace(/\/$/, '') || '/docs')

const { data: page } = await useAsyncData(`docs:${path.value}`, () =>
  queryCollection('docs').path(path.value).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`docs-surround:${path.value}`, () =>
  queryCollectionItemSurroundings('docs', path.value, { fields: ['description'] }))

const kindTag: Record<string, string> = {
  dbus: 'D-Bus interface',
  gsettings: 'GSettings',
  wayland: 'Wayland',
  extensions: 'Extensions API',
  proposal: 'Proposal',
}

const sourceLinks = computed(() => (page.value?.sources ?? []).map(file => ({
  label: file.split('/').pop()!,
  icon: file.endsWith('.xml') ? 'lucide:file-code' : 'lucide:file-text',
  href: spec.repoUrl ? `${spec.repoUrl}/blob/${spec.branch}/${file}` : undefined,
})))

type TocLink = { id: string, text: string, depth: number, children?: TocLink[] }
const toc = computed(() => {
  const out: TocLink[] = []
  const walk = (links: TocLink[] = []) => links.forEach((l) => {
    out.push(l)
    walk(l.children)
  })
  walk(page.value?.body?.toc?.links as TocLink[] | undefined)
  return out
})

// Breadcrumb from the URL: /docs/contracts/dbus/x -> Docs › contracts › dbus
const crumbs = computed(() => {
  const parts = path.value.split('/').filter(Boolean).slice(1, -1)
  return parts.map((p, i) => ({ label: p, to: `/docs/${parts.slice(0, i + 1).join('/')}` }))
})

// Highlight the heading currently in view in the on-page nav.
const activeId = ref('')
let observer: IntersectionObserver | undefined
function observe() {
  observer?.disconnect()
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting)
    if (visible.length) activeId.value = visible[0]!.target.id
  }, { rootMargin: '-80px 0px -70% 0px' })
  toc.value.forEach((l) => {
    const el = document.getElementById(l.id)
    if (el) observer!.observe(el)
  })
}
onMounted(() => nextTick(observe))
watch(toc, () => nextTick(observe))
onBeforeUnmount(() => observer?.disconnect())

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
})
</script>

<template>
  <div v-if="page" class="columns is-variable is-6-widescreen">
    <article class="column" style="min-width: 0">
      <header class="docs-header">
        <nav v-if="crumbs.length" class="breadcrumb mb-3" aria-label="Breadcrumb">
          <ul>
            <li><NuxtLink to="/docs">Docs</NuxtLink></li>
            <li v-for="c in crumbs" :key="c.to">
              <NuxtLink :to="c.to">{{ c.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
        <span v-if="page.kind && kindTag[page.kind]" class="tag is-primary is-light mb-3">{{ kindTag[page.kind] }}</span>
        <h1 class="title is-2">
          {{ page.title }}
        </h1>
      </header>

      <ContentRenderer v-if="page.body" :value="page" class="content prose-helix" />

      <nav v-if="surround?.some(Boolean)" class="docs-surround columns is-mobile is-multiline" aria-label="Previous and next page">
        <div class="column is-12-mobile is-6-tablet">
          <NuxtLink v-if="surround[0]" :to="surround[0].path" class="feature-card">
            <small>← Previous</small>
            <strong>{{ surround[0].title }}</strong>
          </NuxtLink>
        </div>
        <div class="column is-12-mobile is-6-tablet has-text-right">
          <NuxtLink v-if="surround[1]" :to="surround[1].path" class="feature-card">
            <small>Next →</small>
            <strong>{{ surround[1].title }}</strong>
          </NuxtLink>
        </div>
      </nav>
    </article>

    <aside v-if="toc.length || sourceLinks.length" class="column is-narrow is-hidden-touch" style="width: 16rem">
      <div class="docs-toc">
        <template v-if="toc.length">
          <p class="toc-title">
            On this page
          </p>
          <nav aria-label="On this page">
            <a
              v-for="l in toc"
              :key="l.id"
              :href="`#${l.id}`"
              :class="[`depth-${l.depth}`, { 'is-active': activeId === l.id }]"
            >{{ l.text }}</a>
          </nav>
        </template>
        <div v-if="sourceLinks.length" class="source-links">
          <p class="toc-title">
            Spec source
          </p>
          <a v-for="s in sourceLinks" :key="s.label" :href="s.href" target="_blank" rel="noopener">
            <Icon :name="s.icon" />{{ s.label }}
          </a>
        </div>
      </div>
    </aside>
  </div>
</template>
