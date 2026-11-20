<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-navigation', () => queryCollectionNavigation('docs'))

provide('navigation', navigation)

const { t } = useI18n()
useLocaleHtmlAttrs()

useSeoMeta({
  titleTemplate: title => (title && title !== t('site.name') ? t('site.titleTemplate', { title }) : t('site.defaultTitle')),
  ogSiteName: () => t('site.name'),
})

// The news feed, for feed readers that look for it on any page.
useHead(() => ({
  link: [{ rel: 'alternate', type: 'application/atom+xml', href: '/feed.xml', title: t('news.feedTitle') }],
}))
</script>

<template>
  <a class="skip-link" href="#main">{{ t('site.skipToContent') }}</a>
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
