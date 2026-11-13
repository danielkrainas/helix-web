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

const kindBadge: Record<string, string> = {
  dbus: 'D-Bus interface',
  gsettings: 'GSettings',
  wayland: 'Wayland',
  extensions: 'Extensions API',
  proposal: 'Proposal',
}

const sourceLinks = computed(() => (page.value?.sources ?? []).map(file => ({
  label: file.split('/').pop()!,
  icon: file.endsWith('.xml') ? 'i-lucide-file-code' : 'i-lucide-file-text',
  to: spec.repoUrl ? `${spec.repoUrl}/blob/${spec.branch}/${file}` : undefined,
  target: '_blank',
})))

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :ui="{ title: '[overflow-wrap:anywhere]' }">
      <template v-if="page.kind && kindBadge[page.kind]" #headline>
        <UBadge :label="kindBadge[page.kind]" variant="subtle" />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" class="prose-helix" />

      <USeparator v-if="surround?.length" />
      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length || sourceLinks.length" #right>
      <UContentToc :links="page.body?.toc?.links" title="On this page" highlight>
        <template v-if="sourceLinks.length" #bottom>
          <div class="hidden lg:block space-y-4">
            <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />
            <UPageLinks title="Spec source" :links="sourceLinks" />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
