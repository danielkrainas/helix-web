<script setup lang="ts">
// A small docs search: loads the section index on first open and matches
// every word of the query against section titles and text.
const open = useState('search-open', () => false)
const router = useRouter()
const query = ref('')
const selected = ref(0)
const input = ref<HTMLInputElement | null>(null)
let returnFocus: HTMLElement | null = null

type Section = { id: string, title: string, titles: string[], content: string }
const sections = ref<Section[] | null>(null)

async function load() {
  if (sections.value) return
  sections.value = await queryCollectionSearchSections('docs') as Section[]
}

const results = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length || !sections.value) return []
  const scored: { s: Section, score: number }[] = []
  for (const s of sections.value) {
    const title = s.title.toLowerCase()
    const hay = `${title} ${s.titles.join(' ').toLowerCase()} ${s.content.toLowerCase()}`
    if (!words.every(w => hay.includes(w))) continue
    const score = words.reduce((n, w) => n + (title.includes(w) ? 3 : 0) + (title.startsWith(w) ? 2 : 0), 0)
    scored.push({ s, score })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 30).map(x => x.s)
})

watch(query, () => { selected.value = 0 })

watch(open, async (isOpen) => {
  if (isOpen) {
    returnFocus = document.activeElement as HTMLElement | null
    load()
    await nextTick()
    input.value?.focus()
  }
  else {
    returnFocus?.focus()
  }
})

function go(s?: Section) {
  if (!s) return
  open.value = false
  query.value = ''
  router.push(s.id)
}

function onKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
  else if (open.value && e.key === 'Escape') {
    open.value = false
  }
}

function onInputKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selected.value = Math.min(selected.value + 1, results.value.length - 1)
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selected.value = Math.max(selected.value - 1, 0)
  }
  else if (e.key === 'Enter') {
    go(results.value[selected.value])
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="modal search-modal"
    :class="{ 'is-active': open }"
    role="dialog"
    aria-modal="true"
    aria-label="Search the docs"
  >
    <div class="modal-background" @click="open = false" />
    <div v-if="open" class="modal-content">
      <div class="modal-box">
        <div class="search-input-wrap">
          <p class="control has-icons-left">
            <input
              ref="input"
              v-model="query"
              class="input is-medium"
              type="search"
              placeholder="Search interfaces, schemas, pages…"
              aria-label="Search query"
              aria-controls="search-results"
              autocomplete="off"
              @keydown="onInputKey"
            >
            <span class="icon is-left"><Icon name="lucide:search" /></span>
          </p>
        </div>
        <div id="search-results" class="search-results" role="listbox" aria-label="Results">
          <p v-if="!sections" class="p-3 has-text-weak">
            Loading…
          </p>
          <p v-else-if="query && !results.length" class="p-3 has-text-weak">
            No results for “{{ query }}”.
          </p>
          <p v-else-if="!query" class="p-3 has-text-weak">
            Type to search the specification. ↑ ↓ to move, Enter to open, Esc to close.
          </p>
          <NuxtLink
            v-for="(r, i) in results"
            :key="r.id"
            :to="r.id"
            role="option"
            :aria-selected="i === selected"
            :class="{ 'is-selected': i === selected }"
            @click.prevent="go(r)"
          >
            <strong>{{ r.title }}</strong>
            <small v-if="r.titles.length">{{ r.titles.join(' › ') }}</small>
          </NuxtLink>
        </div>
      </div>
    </div>
    <button type="button" class="modal-close is-large" aria-label="Close search" @click="open = false" />
  </div>
</template>
