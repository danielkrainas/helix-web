<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <span class="helix-logo">
    <img src="/favicon.svg" alt="" width="32" height="32">
    <span>{{ t('site.name') }}</span>
  </span>
</template>
