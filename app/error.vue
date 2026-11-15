<script setup lang="ts">
import type { NuxtError } from '#app'

// Replaces app.vue when a page is missing or fails: the static 404.html
// renders this in the visitor's language, with the site's header and footer.
const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
useLocaleHtmlAttrs()

const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => t(notFound.value ? 'error.notFound.title' : 'error.other.title'))
const text = computed(() => t(notFound.value ? 'error.notFound.text' : 'error.other.text'))

useSeoMeta({
  title: () => title.value,
  titleTemplate: value => t('site.titleTemplate', { title: value }),
  robots: 'noindex',
})
</script>

<template>
  <a class="skip-link" href="#main">{{ t('site.skipToContent') }}</a>
  <AppHeader />
  <main id="main" tabindex="-1">
    <section class="helix-section">
      <div class="container is-widescreen has-text-centered">
        <p class="eyebrow">
          {{ error.statusCode }}
        </p>
        <h1 class="title is-2">
          {{ title }}
        </h1>
        <p class="lead mb-5">
          {{ text }}
        </p>
        <NuxtLinkLocale to="/" class="button is-primary">
          <span class="icon"><Icon name="lucide:house" /></span>
          <span>{{ t('error.home') }}</span>
        </NuxtLinkLocale>
      </div>
    </section>
  </main>
  <AppFooter />
  <ClientOnly>
    <AppSearch />
  </ClientOnly>
</template>
