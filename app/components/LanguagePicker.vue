<script setup lang="ts">
// Lists every language with a link to the current page in it. Rendered only
// when the site has more than one language, so it appears by itself once a
// second locale is added to i18n/locales.ts. A <details> menu works without
// JavaScript; links are real hrefs, so crawlers and nginx see every page.
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const menu = ref<HTMLDetailsElement | null>(null)

const current = computed(() => locales.value.find(l => l.code === locale.value))
const options = computed(() => locales.value.map(l => ({
  code: l.code,
  name: l.name ?? l.code,
  language: l.language ?? l.code,
  to: switchLocalePath(l.code) || '/',
  active: l.code === locale.value,
})))

watch(() => route.fullPath, () => { menu.value?.removeAttribute('open') })
</script>

<template>
  <div v-if="locales.length > 1" class="navbar-item language-picker">
    <details ref="menu">
      <summary class="button is-ghost" :aria-label="t('languagePicker.current', { language: current?.name ?? locale })">
        <span class="icon"><Icon name="lucide:languages" /></span>
        <span>{{ current?.name ?? locale }}</span>
      </summary>
      <ul class="box language-menu" :aria-label="t('languagePicker.label')">
        <li v-for="o in options" :key="o.code">
          <NuxtLink
            :to="o.to"
            :lang="o.language"
            :hreflang="o.language"
            :class="{ 'is-active': o.active }"
            :aria-current="o.active ? 'true' : undefined"
          >
            {{ o.name }}
          </NuxtLink>
        </li>
      </ul>
    </details>
  </div>
</template>
