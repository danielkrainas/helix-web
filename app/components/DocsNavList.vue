<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

// One level of the docs sidebar (a Bulma menu-list). Groups are <details>
// so they work without JavaScript; a group opens when it holds the current
// page, and top-level groups start open.
const props = defineProps<{ items: ContentNavigationItem[], depth?: number }>()
const basePath = useBasePath()
const current = computed(() => basePath.value.replace(/\/$/, '') || '/')

function contains(item: ContentNavigationItem): boolean {
  return item.path === current.value || !!item.children?.some(contains)
}
function isOpen(item: ContentNavigationItem) {
  return (props.depth ?? 0) === 0 || contains(item)
}
</script>

<template>
  <ul class="menu-list">
    <li v-for="item in items" :key="item.path + (item.children ? '/' : '')">
      <details v-if="item.children?.length" :open="isOpen(item)">
        <summary>
          <span>{{ item.title }}</span>
          <span class="icon is-small chevron"><Icon name="lucide:chevron-right" /></span>
        </summary>
        <DocsNavList :items="item.children" :depth="(depth ?? 0) + 1" />
      </details>
      <NuxtLinkLocale
        v-else
        :to="item.path"
        :class="{ 'is-active': item.path === current }"
        :aria-current="item.path === current ? 'page' : undefined"
      >
        {{ item.title }}
      </NuxtLinkLocale>
    </li>
  </ul>
</template>
