<script setup lang="ts">
const route = useRoute()
const path = useBasePath()
const { t } = useI18n()
const menuOpen = ref(false)
const searchOpen = useState('search-open', () => false)
const { scheme, toggle } = useColorScheme()

const themeLabel = computed(() => t(scheme.value === 'dark' ? 'header.theme.toLight' : 'header.theme.toDark'))

watch(() => route.fullPath, () => { menuOpen.value = false })

const items = computed(() => {
  const p = path.value
  return [
    { label: t('header.nav.features'), to: '/#tour', active: false },
    { label: t('header.nav.install'), to: '/#install', active: false },
    { label: t('header.nav.compatibility'), to: '/docs/gnome-compatibility', active: p.startsWith('/docs/gnome-compatibility') },
    { label: t('header.nav.docs'), to: '/docs', active: p.startsWith('/docs') && !p.startsWith('/docs/gnome-compatibility') },
  ]
})
</script>

<template>
  <header>
    <nav class="navbar is-fixed-top helix-navbar" :aria-label="t('header.navLabel')">
      <div class="container is-widescreen">
        <div class="navbar-brand">
          <NuxtLinkLocale to="/" class="navbar-item" :aria-label="t('header.home')">
            <AppLogo />
          </NuxtLinkLocale>
          <button
            type="button"
            class="navbar-burger"
            :class="{ 'is-active': menuOpen }"
            :aria-expanded="menuOpen"
            aria-controls="main-menu"
            :aria-label="t('header.menu')"
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
            <NuxtLinkLocale
              v-for="item in items"
              :key="item.to"
              :to="item.to"
              class="navbar-item"
              :class="{ 'is-active-route': item.active }"
              :aria-current="item.active ? 'page' : undefined"
            >
              {{ item.label }}
            </NuxtLinkLocale>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <button type="button" class="button search-button" :aria-label="t('header.search.label')" @click="searchOpen = true">
                <span class="icon"><Icon name="lucide:search" /></span>
                <span>{{ t('header.search.button') }}</span>
                <kbd aria-hidden="true">{{ t('header.search.shortcut') }}</kbd>
              </button>
            </div>
            <LanguagePicker />
            <div class="navbar-item">
              <div class="buttons">
                <button
                  type="button"
                  class="button is-ghost"
                  :aria-label="themeLabel"
                  :title="themeLabel"
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
                  :aria-label="t('header.github')"
                  :title="t('header.github')"
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
