<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[] | undefined>>('navigation')
const { public: { spec } } = useRuntimeConfig()

const items = computed(() => [
  { label: 'Docs', to: '/docs', active: route.path.startsWith('/docs') && !route.path.startsWith('/docs/contracts') },
  { label: 'Contracts', to: '/docs/contracts', active: route.path.startsWith('/docs/contracts') },
  { label: 'Gaps', to: '/docs/gaps' },
])

// The docs nav tree for the mobile menu: drop the "/docs" wrapper.
const docsTree = computed(() => docsNavigation(navigation?.value))
</script>

<template>
  <UHeader :ui="{ center: 'flex-1' }">
    <template #left>
      <NuxtLink to="/" aria-label="Helix home">
        <AppLogo />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UContentSearchButton class="hidden lg:inline-flex" :collapsed="false" />
      <UContentSearchButton class="lg:hidden" />
      <UColorModeButton />
      <UButton
        v-if="spec.repoUrl"
        :to="spec.repoUrl"
        target="_blank"
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        aria-label="Specification on GitHub"
      />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5 mb-4" />
      <USeparator class="mb-4" />
      <UContentNavigation :navigation="docsTree" :default-open="true" highlight />
    </template>
  </UHeader>
</template>
