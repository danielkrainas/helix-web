<script setup lang="ts">
import { defaultLocale } from '~~/i18n/locales'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const { t, locale } = useI18n()
const { public: { spec } } = useRuntimeConfig()

// The docs come from the spec and exist in English only, so the content path
// is built from the slug and is the same under every locale prefix.
const path = computed(() => {
  const slug = route.params.slug
  const parts = (Array.isArray(slug) ? slug : [slug]).filter(Boolean)
  return ['/docs', ...parts].join('/')
})

const { data: page } = await useAsyncData(`docs:${path.value}`, () =>
  queryCollection('docs').path(path.value).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: t('docs.notFound'), fatal: true })
}

const { data: surround } = await useAsyncData(`docs-surround:${path.value}`, () =>
  queryCollectionItemSurroundings('docs', path.value, { fields: ['description'] }))

const kindTag: Record<string, string> = {
  dbus: 'docs.kind.dbus',
  gsettings: 'docs.kind.gsettings',
  wayland: 'docs.kind.wayland',
  extensions: 'docs.kind.extensions',
  proposal: 'docs.kind.proposal',
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
        <nav v-if="crumbs.length" class="breadcrumb mb-3" :aria-label="t('docs.breadcrumbLabel')">
          <ul>
            <li><NuxtLinkLocale to="/docs">{{ t('docs.breadcrumbRoot') }}</NuxtLinkLocale></li>
            <li v-for="c in crumbs" :key="c.to">
              <NuxtLinkLocale :to="c.to">{{ c.label }}</NuxtLinkLocale>
            </li>
          </ul>
        </nav>
        <span v-if="page.kind && kindTag[page.kind]" class="tag is-primary is-light mb-3">{{ t(kindTag[page.kind]!) }}</span>
        <h1 class="title is-2">
          {{ page.title }}
        </h1>
        <!-- Shown on translated pages only: the docs themselves stay English. -->
        <i18n-t
          v-if="locale !== defaultLocale"
          keypath="docs.englishOnly"
          tag="p"
          class="notification is-info is-light"
        >
          <template #link>
            <NuxtLink :to="path" :hreflang="defaultLocale" class="has-text-weight-semibold">{{ t('docs.englishOnlyLink') }}</NuxtLink>
          </template>
        </i18n-t>
      </header>

      <ContentRenderer v-if="page.body" :value="page" class="content prose-helix" />

      <nav v-if="surround?.some(Boolean)" class="docs-surround columns is-mobile is-multiline" :aria-label="t('docs.surroundLabel')">
        <div class="column is-12-mobile is-6-tablet">
          <NuxtLinkLocale v-if="surround[0]" :to="surround[0].path" class="feature-card">
            <small>{{ t('docs.previous') }}</small>
            <strong>{{ surround[0].title }}</strong>
          </NuxtLinkLocale>
        </div>
        <div class="column is-12-mobile is-6-tablet has-text-right">
          <NuxtLinkLocale v-if="surround[1]" :to="surround[1].path" class="feature-card">
            <small>{{ t('docs.next') }}</small>
            <strong>{{ surround[1].title }}</strong>
          </NuxtLinkLocale>
        </div>
      </nav>
    </article>

    <aside v-if="toc.length || sourceLinks.length" class="column is-narrow is-hidden-touch" style="width: 16rem">
      <div class="docs-toc">
        <template v-if="toc.length">
          <p class="toc-title">
            {{ t('docs.onThisPage') }}
          </p>
          <nav :aria-label="t('docs.onThisPage')">
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
            {{ t('docs.specSource') }}
          </p>
          <a v-for="s in sourceLinks" :key="s.label" :href="s.href" target="_blank" rel="noopener">
            <Icon :name="s.icon" />{{ s.label }}
          </a>
        </div>
      </div>
    </aside>
  </div>
</template>
