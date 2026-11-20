<script setup lang="ts">
import { defaultLocale } from '~~/i18n/locales'

const { t, locale } = useI18n()
const { formatDate } = useNewsDate()

useSeoMeta({
  title: () => t('news.meta.title'),
  description: () => t('news.meta.description'),
  ogTitle: () => t('news.meta.title'),
  ogDescription: () => t('news.meta.description'),
})

// Posts are English only and the same under every locale prefix.
const { data: posts } = await useAsyncData('news-list', () =>
  queryCollection('news')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'author')
    .all())
</script>

<template>
  <section class="helix-section" aria-labelledby="news-title">
    <div class="container is-widescreen">
      <div class="section-head">
        <p class="eyebrow">
          {{ t('news.eyebrow') }}
        </p>
        <h1 id="news-title" class="title">
          {{ t('news.title') }}
        </h1>
        <p class="lead">
          {{ t('news.lead') }}
        </p>
        <a href="/feed.xml" class="feed-link mt-2">
          <Icon name="lucide:rss" />
          <span>{{ t('news.feed') }}</span>
        </a>
        <p v-if="locale !== defaultLocale" class="notification is-info is-light mt-4">
          {{ t('news.englishOnly') }}
        </p>
      </div>

      <div v-if="posts?.length" class="news-list">
        <NuxtLinkLocale v-for="post in posts" :key="post.path" :to="post.path" class="news-card">
          <p class="news-meta">
            <time :datetime="String(post.date).slice(0, 10)">{{ formatDate(post.date) }}</time>
          </p>
          <h2>{{ post.title }}</h2>
          <p>{{ post.description }}</p>
          <span class="card-more">{{ t('news.readMore') }} <Icon name="lucide:arrow-right" /></span>
        </NuxtLinkLocale>
      </div>
      <p v-else>
        {{ t('news.empty') }}
      </p>
    </div>
  </section>
</template>
