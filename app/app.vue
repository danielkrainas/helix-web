<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('docs-search', () => queryCollectionSearchSections('docs'), { server: false })

provide('navigation', navigation)

useSeoMeta({
  titleTemplate: title => (title && title !== 'Helix' ? `${title} · Helix` : 'Helix — a Rust desktop for GNOME apps'),
  ogSiteName: 'Helix',
})
</script>

<template>
  <UApp>
    <AppHeader />
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
