<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[] | undefined>>('navigation')
const docsTree = computed(() => docsNavigation(navigation?.value))
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            :navigation="docsTree"
            :default-open="true"
            highlight
            :ui="{ linkTitle: 'whitespace-normal! overflow-visible! text-start [overflow-wrap:anywhere]' }"
          />
        </UPageAside>
      </template>
      <slot />
    </UPage>
  </UContainer>
</template>
