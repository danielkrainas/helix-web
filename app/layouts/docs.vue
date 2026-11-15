<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[] | undefined>>('navigation')
const docsTree = computed(() => docsNavigation(navigation?.value))

// Pages without children go in the first ("Specification") block; groups
// with children each get a menu label of their own.
const topPages = computed(() => docsTree.value.filter(i => !i.children?.length))
const groups = computed(() => docsTree.value.filter(i => i.children?.length))

const route = useRoute()
const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })
</script>

<template>
  <div class="container is-widescreen docs-shell px-4">
    <div class="columns is-variable is-6-widescreen">
      <div class="column is-3-desktop is-one-fifth-fullhd">
        <button
          type="button"
          class="button docs-mobile-toggle is-hidden-desktop"
          :aria-expanded="menuOpen"
          aria-controls="docs-sidebar"
          @click="menuOpen = !menuOpen"
        >
          <span class="icon-text">
            <span class="icon"><Icon name="lucide:book-open" /></span>
            <span>Documentation menu</span>
          </span>
          <span class="icon toggle-chevron" :class="{ 'is-open': menuOpen }"><Icon name="lucide:chevron-down" /></span>
        </button>
        <aside
          id="docs-sidebar"
          class="menu docs-sidebar"
          :class="{ 'is-hidden-touch': !menuOpen }"
          aria-label="Documentation"
        >
          <p class="menu-label">
            Specification
          </p>
          <DocsNavList :items="topPages" />
          <template v-for="group in groups" :key="group.path">
            <p class="menu-label mt-4">
              {{ group.title }}
            </p>
            <DocsNavList :items="group.children!" :depth="1" />
          </template>
        </aside>
      </div>
      <div class="column" style="min-width: 0">
        <slot />
      </div>
    </div>
  </div>
</template>
