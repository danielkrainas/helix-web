<!-- Links in docs Markdown: site-internal ones keep the reader's language prefix. -->
<script setup lang="ts">
const props = defineProps({
  href: { type: String, default: '' },
  target: { type: String, default: undefined, required: false },
})
const localePath = useLocalePath()
const to = computed(() => (props.href.startsWith('/') && !props.href.startsWith('//') ? localePath(props.href) : props.href))
</script>

<template>
  <NuxtLink :href="to" :target="target">
    <slot />
  </NuxtLink>
</template>
