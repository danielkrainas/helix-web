<script setup lang="ts">
// A terminal snippet: one shell prompt per command. Commands are not
// translated; the accessible label is.
defineProps<{ commands: string[], label: string }>()
</script>

<template>
  <pre class="terminal" :aria-label="label"><template v-for="(cmd, i) in commands" :key="i"><span class="prompt">$ </span>{{ cmd }}{{ i < commands.length - 1 ? '\n' : '' }}</template></pre>
</template>
