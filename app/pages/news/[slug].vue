<script setup lang="ts">
import { defaultLocale } from '~~/i18n/locales'

const route = useRoute()
const { t, locale } = useI18n()
const { formatDate } = useNewsDate()

// Posts are English only, so the content path is the same under every
// locale prefix: /es/news/x shows /news/x.
const path = computed(() => `/news/${route.params.slug}`)

const { data: post } = await useAsyncData(`news:${path.value}`, () =>
  queryCollection('news').path(path.value).first())
// Drafts are viewable in `pnpm dev` only.
if (!post.value || (post.value.draft && !import.meta.dev)) {
  throw createError({ statusCode: 404, statusMessage: t('news.notFound'), fatal: true })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogType: 'article',
  articlePublishedTime: String(post.value.date).slice(0, 10),
})
</script>

<template>
  <section v-if="post" class="helix-section">
    <article class="news-article">
      <header class="news-header">
        <p class="eyebrow">
          <NuxtLinkLocale to="/news">
            {{ t('news.eyebrow') }}
          </NuxtLinkLocale>
        </p>
        <h1 class="title">
          {{ post.title }}
        </h1>
        <p class="news-meta">
          <time :datetime="String(post.date).slice(0, 10)">{{ formatDate(post.date) }}</time>
          <template v-if="post.author">
            · {{ t('news.byline', { author: post.author }) }}
          </template>
        </p>
        <p v-if="locale !== defaultLocale" class="notification is-info is-light mt-4">
          {{ t('news.englishOnly') }}
        </p>
      </header>

      <ContentRenderer v-if="post.body" :value="post" class="content prose-helix" lang="en" />

      <footer class="news-footer">
        <NuxtLinkLocale to="/news" class="button">
          <span class="icon"><Icon name="lucide:arrow-left" /></span>
          <span>{{ t('news.back') }}</span>
        </NuxtLinkLocale>
        <a href="/feed.xml" class="feed-link ml-4">
          <Icon name="lucide:rss" />
          <span>{{ t('news.feed') }}</span>
        </a>
      </footer>
    </article>
  </section>
</template>
