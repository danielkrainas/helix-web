<script setup lang="ts">
const { public: { spec } } = useRuntimeConfig()
const specDate = spec.date ? new Date(spec.date).toISOString().slice(0, 10) : ''
</script>

<template>
  <footer class="footer helix-footer">
    <div class="container is-widescreen">
      <div class="columns is-multiline">
        <div class="column is-12-tablet is-6-desktop">
          <NuxtLink to="/" aria-label="Helix home">
            <AppLogo />
          </NuxtLink>
          <p class="mt-3" style="max-width: 26rem">
            A GNOME-compatible desktop environment, written in Rust. Code, apps
            and specification are dedicated to the public domain (CC0-1.0).
          </p>
          <p v-if="spec.commit" class="mt-3 is-size-7 has-text-weak">
            Docs built from spec
            <a
              v-if="spec.repoUrl"
              :href="`${spec.repoUrl}/commit/${spec.commit}`"
              target="_blank"
              rel="noopener"
              class="is-family-code"
            >{{ spec.commit }}</a>
            <span v-else class="is-family-code">{{ spec.commit }}</span>
            <template v-if="specDate">
              ({{ specDate }})
            </template>
          </p>
        </div>
        <nav class="column is-4-tablet is-2-desktop" aria-label="Documentation">
          <p class="footer-heading">
            Docs
          </p>
          <ul>
            <li><NuxtLink to="/docs">Introduction</NuxtLink></li>
            <li><NuxtLink to="/docs/scope">Scope</NuxtLink></li>
            <li><NuxtLink to="/docs/gnome-compatibility">GNOME compatibility</NuxtLink></li>
            <li><NuxtLink to="/docs/contracts">Contracts</NuxtLink></li>
          </ul>
        </nav>
        <nav class="column is-4-tablet is-2-desktop" aria-label="Source code">
          <p class="footer-heading">
            Source
          </p>
          <ul>
            <li><a :href="links.desktop" target="_blank" rel="noopener">helix-desktop</a></li>
            <li><a :href="links.apps" target="_blank" rel="noopener">helix-apps</a></li>
            <li><a :href="links.spec" target="_blank" rel="noopener">helix-desktop-spec</a></li>
            <li><a :href="links.web" target="_blank" rel="noopener">helix-web</a></li>
          </ul>
        </nav>
        <nav class="column is-4-tablet is-2-desktop" aria-label="Get Helix">
          <p class="footer-heading">
            Get Helix
          </p>
          <ul>
            <li><NuxtLink to="/#install">Install</NuxtLink></li>
            <li><a :href="links.desktopReleases" target="_blank" rel="noopener">Releases</a></li>
            <li><a :href="links.desktopIssues" target="_blank" rel="noopener">Issues</a></li>
          </ul>
        </nav>
      </div>
      <p class="legal">
        GNOME is a trademark of the GNOME Foundation. Helix is an independent
        project; it is not affiliated with or endorsed by the GNOME Foundation.
      </p>
    </div>
  </footer>
</template>
