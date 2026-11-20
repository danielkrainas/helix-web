<script setup lang="ts">
const { t } = useI18n()
const { public: { spec } } = useRuntimeConfig()
const specDate = spec.date ? new Date(spec.date).toISOString().slice(0, 10) : ''
</script>

<template>
  <footer class="footer helix-footer">
    <div class="container is-widescreen">
      <div class="columns is-multiline">
        <div class="column is-12-tablet is-6-desktop">
          <NuxtLinkLocale to="/" :aria-label="t('header.home')">
            <AppLogo />
          </NuxtLinkLocale>
          <p class="mt-3" style="max-width: 26rem">
            {{ t('footer.about') }}
          </p>
          <i18n-t
            v-if="spec.commit"
            :keypath="specDate ? 'footer.specBuiltOn' : 'footer.specBuilt'"
            tag="p"
            class="mt-3 is-size-7 has-text-weak"
          >
            <template #commit>
              <a
                v-if="spec.repoUrl"
                :href="`${spec.repoUrl}/commit/${spec.commit}`"
                target="_blank"
                rel="noopener"
                class="is-family-code"
              >{{ spec.commit }}</a>
              <span v-else class="is-family-code">{{ spec.commit }}</span>
            </template>
            <template #date>
              {{ specDate }}
            </template>
          </i18n-t>
        </div>
        <nav class="column is-4-tablet is-2-desktop" :aria-label="t('footer.docs.label')">
          <p class="footer-heading">
            {{ t('footer.docs.heading') }}
          </p>
          <ul>
            <li><NuxtLinkLocale to="/docs">{{ t('footer.docs.introduction') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/docs/scope">{{ t('footer.docs.scope') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/docs/gnome-compatibility">{{ t('footer.docs.compatibility') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/docs/contracts">{{ t('footer.docs.contracts') }}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/agents">{{ t('footer.docs.agentAccess') }}</NuxtLinkLocale></li>
          </ul>
        </nav>
        <nav class="column is-4-tablet is-2-desktop" :aria-label="t('footer.source.label')">
          <p class="footer-heading">
            {{ t('footer.source.heading') }}
          </p>
          <ul>
            <li v-for="r in repos" :key="r.name">
              <a :href="r.href" target="_blank" rel="noopener">{{ r.name }}</a>
            </li>
          </ul>
        </nav>
        <nav class="column is-4-tablet is-2-desktop" :aria-label="t('footer.get.label')">
          <p class="footer-heading">
            {{ t('footer.get.heading') }}
          </p>
          <ul>
            <li><NuxtLinkLocale to="/#install">{{ t('footer.get.install') }}</NuxtLinkLocale></li>
            <li><a :href="links.desktopReleases" target="_blank" rel="noopener">{{ t('footer.get.releases') }}</a></li>
            <li><a :href="links.desktopIssues" target="_blank" rel="noopener">{{ t('footer.get.issues') }}</a></li>
            <li><NuxtLinkLocale to="/news">{{ t('footer.get.news') }}</NuxtLinkLocale></li>
            <li><a href="/feed.xml">{{ t('footer.get.feed') }}</a></li>
          </ul>
        </nav>
      </div>
      <p class="legal">
        {{ t('footer.legal') }}
      </p>
    </div>
  </footer>
</template>
