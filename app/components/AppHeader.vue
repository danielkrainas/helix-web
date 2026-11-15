<script setup lang="ts">
const route = useRoute()
const menuOpen = ref(false)
const searchOpen = useState('search-open', () => false)
const { scheme, toggle } = useColorScheme()

watch(() => route.fullPath, () => { menuOpen.value = false })

const items = computed(() => {
  const p = route.path
  return [
    { label: 'Docs', to: '/docs', active: p.startsWith('/docs') && !p.startsWith('/docs/contracts') && !p.startsWith('/docs/gnome-compatibility') },
    { label: 'Compatibility', to: '/docs/gnome-compatibility', active: p.startsWith('/docs/gnome-compatibility') },
    { label: 'Contracts', to: '/docs/contracts', active: p.startsWith('/docs/contracts') },
    { label: 'Install', to: '/#install', active: false },
  ]
})
</script>

<template>
  <header>
    <nav class="navbar is-fixed-top helix-navbar" aria-label="Main navigation">
      <div class="container is-widescreen">
        <div class="navbar-brand">
          <NuxtLink to="/" class="navbar-item" aria-label="Helix home">
            <AppLogo />
          </NuxtLink>
          <button
            type="button"
            class="navbar-burger"
            :class="{ 'is-active': menuOpen }"
            :aria-expanded="menuOpen"
            aria-controls="main-menu"
            aria-label="Menu"
            @click="menuOpen = !menuOpen"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <div id="main-menu" class="navbar-menu" :class="{ 'is-active': menuOpen }">
          <div class="navbar-start">
            <NuxtLink
              v-for="item in items"
              :key="item.to"
              :to="item.to"
              class="navbar-item"
              :class="{ 'is-active-route': item.active }"
              :aria-current="item.active ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLink>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <button type="button" class="button search-button" aria-label="Search the docs" @click="searchOpen = true">
                <span class="icon"><Icon name="lucide:search" /></span>
                <span>Search docs</span>
                <kbd aria-hidden="true">Ctrl K</kbd>
              </button>
            </div>
            <div class="navbar-item">
              <div class="buttons">
                <button
                  type="button"
                  class="button is-ghost"
                  :aria-label="scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                  :title="scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                  @click="toggle"
                >
                  <span class="icon">
                    <Icon v-show="scheme === 'dark'" name="lucide:sun" />
                    <Icon v-show="scheme !== 'dark'" name="lucide:moon" />
                  </span>
                </button>
                <a
                  class="button is-ghost"
                  :href="links.desktop"
                  target="_blank"
                  rel="noopener"
                  aria-label="Helix on GitHub"
                  title="Helix on GitHub"
                >
                  <span class="icon"><Icon name="simple-icons:github" /></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
