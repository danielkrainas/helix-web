<script setup lang="ts">
const { public: { spec } } = useRuntimeConfig()
const specDate = spec.date ? new Date(spec.date).toISOString().slice(0, 10) : ''
</script>

<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Helix · specification licensed CC0-1.0
      </p>
    </template>
    <template #right>
      <p v-if="spec.commit" class="text-sm text-muted">
        Docs built from spec
        <ULink
          v-if="spec.repoUrl"
          :to="`${spec.repoUrl}/commit/${spec.commit}`"
          target="_blank"
          class="font-mono"
        >{{ spec.commit }}</ULink>
        <span v-else class="font-mono">{{ spec.commit }}</span>
        <template v-if="specDate">
          ({{ specDate }})
        </template>
      </p>
    </template>
  </UFooter>
</template>
