<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-navigation', () => queryCollectionNavigation('docs'))

provide('navigation', navigation)

useSeoMeta({
  titleTemplate: title => (title && title !== 'Helix' ? `${title} · Helix` : 'Helix — a GNOME-compatible desktop, written in Rust'),
  ogSiteName: 'Helix',
})
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppHeader />
  <main id="main" tabindex="-1">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
  <AppFooter />
  <ClientOnly>
    <AppSearch />
  </ClientOnly>
</template>
