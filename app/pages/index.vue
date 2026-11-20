<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('site.name'),
  description: () => t('home.description'),
})

// Message keys, so the lists keep their order and icons in one place.
const benefits = [
  { icon: 'lucide:app-window', title: 'home.why.apps.title', text: 'home.why.apps.text' },
  { icon: 'lucide:sliders-horizontal', title: 'home.why.settings.title', text: 'home.why.settings.text' },
  { icon: 'lucide:undo-2', title: 'home.why.switchBack.title', text: 'home.why.switchBack.text' },
]

const tour = [
  { icon: 'lucide:layout-panel-top', title: 'home.tour.topBar.title', text: 'home.tour.topBar.text' },
  { icon: 'lucide:bell', title: 'home.tour.notifications.title', text: 'home.tour.notifications.text' },
  { icon: 'lucide:layers', title: 'home.tour.overview.title', text: 'home.tour.overview.text' },
  { icon: 'lucide:layout-grid', title: 'home.tour.appGrid.title', text: 'home.tour.appGrid.text' },
  { icon: 'lucide:camera', title: 'home.tour.screenshots.title', text: 'home.tour.screenshots.text' },
  { icon: 'lucide:lock-keyhole', title: 'home.tour.lock.title', text: 'home.tour.lock.text' },
  { icon: 'lucide:folder-open', title: 'home.tour.fileChooser.title', text: 'home.tour.fileChooser.text' },
  { icon: 'lucide:languages', title: 'home.tour.languages.title', text: 'home.tour.languages.text' },
  { icon: 'lucide:puzzle', title: 'home.tour.extensions.title', text: 'home.tour.extensions.text' },
]

const agentPoints = [
  { icon: 'lucide:layers-3', title: 'home.agents.levels.title', text: 'home.agents.levels.text' },
  { icon: 'lucide:octagon-x', title: 'home.agents.indicator.title', text: 'home.agents.indicator.text' },
  { icon: 'lucide:shield-off', title: 'home.agents.never.title', text: 'home.agents.never.text' },
  { icon: 'lucide:scroll-text', title: 'home.agents.log.title', text: 'home.agents.log.text' },
]

const apps = [
  'home.apps.names.files',
  'home.apps.names.terminal',
  'home.apps.names.textEditor',
  'home.apps.names.settings',
  'home.apps.names.web',
]

const a11y = [
  'home.access.keyboard',
  'home.access.screenReader',
  'home.access.contrast',
  'home.access.keyboardAndZoom',
  'home.access.accent',
]

const touches = [
  { icon: 'lucide:shield-check', title: 'home.differences.safeChoices.title', text: 'home.differences.safeChoices.text' },
  { icon: 'lucide:puzzle', title: 'home.differences.extensions.title', text: 'home.differences.extensions.text' },
  { icon: 'lucide:power', title: 'home.differences.logout.title', text: 'home.differences.logout.text' },
  { icon: 'lucide:lock', title: 'home.differences.hardened.title', text: 'home.differences.hardened.text' },
  { icon: 'lucide:palette', title: 'home.differences.look.title', text: 'home.differences.look.text' },
]

const notes = [
  { title: 'home.differences.shellExtensions.title', text: 'home.differences.shellExtensions.text' },
  { title: 'home.differences.notACopy.title', text: 'home.differences.notACopy.text' },
  { title: 'home.differences.young.title', text: 'home.differences.young.text' },
]

const repoCards = [
  { ...repos.desktop, text: 'home.source.desktop' },
  { ...repos.apps, text: 'home.source.apps' },
  { ...repos.spec, text: 'home.source.spec' },
]

// Package and option names, and the commands in the terminal snippets, are
// the same in every language, so they live here rather than in the messages.
const packages = { desktop: 'helix-desktop', full: 'helix-desktop-full', apps: 'helix-apps', greeter: 'helix-greeter' }
const nvidiaOption = 'nvidia-drm.modeset=1'
const installCommand = 'sudo apt install ./helix-desktop_*.deb ./helix-desktop-full_*.deb ./helix-apps_*.deb'
const installLines = ['sudo apt install ./helix-desktop_*.deb \\\n    ./helix-desktop-full_*.deb ./helix-apps_*.deb']
const greeterOnLines = ['sudo systemctl disable gdm.service', 'sudo systemctl enable --force greetd.service', 'sudo reboot']
// A short Agent Access session (helix-agent, contracts/agent-access/cli.md).
const agentCommand = 'helix-agent'
const agentLogCommand = 'helix-agent log'
const agentLines = [
  'helix-agent request --level desktop',
  'helix-agent files search invoice --since yesterday',
  'helix-agent confirm "Open yesterday’s invoice?"',
  'helix-agent open ~/Documents/invoice-0412.pdf',
]
const greeterOffLines = ['sudo systemctl disable greetd.service', 'sudo systemctl enable --force gdm.service', 'sudo reboot']

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(installCommand)
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 2000)
  }
  catch {
    // Clipboard unavailable (e.g. insecure context): the command stays selectable.
  }
}
</script>

<template>
  <div>
    <!-- Hero ------------------------------------------------------------- -->
    <section class="hero helix-hero" aria-labelledby="hero-title">
      <div class="hero-body">
        <div class="container is-widescreen">
          <div class="columns is-vcentered is-variable is-8-desktop">
            <div class="column is-7-desktop">
              <p class="hero-tag">
                <span class="dot" aria-hidden="true" />
                {{ t('home.hero.tag') }}
              </p>
              <i18n-t id="hero-title" keypath="home.hero.title" tag="h1" class="title is-1">
                <template #highlight>
                  <span class="gradient-text">{{ t('home.hero.titleHighlight') }}</span>
                </template>
              </i18n-t>
              <p class="subtitle mt-5">
                {{ t('home.hero.subtitle') }}
              </p>
              <div class="buttons mt-6">
                <NuxtLinkLocale to="/#install" class="button is-primary is-medium">
                  <span class="icon"><Icon name="lucide:download" /></span>
                  <span>{{ t('home.hero.install') }}</span>
                </NuxtLinkLocale>
                <NuxtLinkLocale to="/#tour" class="button is-ghost-light is-medium">
                  <span class="icon"><Icon name="lucide:sparkles" /></span>
                  <span>{{ t('home.hero.tour') }}</span>
                </NuxtLinkLocale>
              </div>
              <p class="hero-facts">
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>{{ t('home.hero.facts.nextToGnome') }}</span>
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>{{ t('home.hero.facts.keepsSettings') }}</span>
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>{{ t('home.hero.facts.free') }}</span>
              </p>
              <NuxtLinkLocale to="/agents" class="hero-note">
                <span class="icon"><Icon name="lucide:bot" /></span>
                <span>{{ t('home.hero.agents') }} <strong>{{ t('home.hero.agentsLink') }}</strong></span>
                <span class="icon"><Icon name="lucide:arrow-right" /></span>
              </NuxtLinkLocale>
            </div>
            <div class="column is-5-desktop">
              <figure class="screen-frame">
                <img
                  src="/screenshots/notifications-calendar.webp"
                  width="780"
                  height="582"
                  :alt="t('home.hero.imageAlt')"
                >
                <figcaption>{{ t('home.hero.imageCaption') }}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Helix -------------------------------------------------------- -->
    <section id="why" class="helix-section" aria-labelledby="why-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('home.why.eyebrow') }}
          </p>
          <h2 id="why-title" class="title">
            {{ t('home.why.title') }}
          </h2>
          <p class="lead">
            {{ t('home.why.lead') }}
          </p>
        </div>
        <div class="columns is-multiline">
          <div v-for="b in benefits" :key="b.title" class="column is-4-desktop is-12-tablet">
            <div class="feature-card is-hoverable">
              <span class="feature-icon" aria-hidden="true"><Icon :name="b.icon" /></span>
              <h3>{{ t(b.title) }}</h3>
              <p>{{ t(b.text) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agent Access ----------------------------------------------------- -->
    <section id="agents" class="helix-section is-tinted" aria-labelledby="agents-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('home.agents.eyebrow') }}
          </p>
          <h2 id="agents-title" class="title">
            {{ t('home.agents.title') }}
          </h2>
          <i18n-t keypath="home.agents.lead" tag="p" class="lead">
            <template #command>
              <code>{{ agentCommand }}</code>
            </template>
          </i18n-t>
        </div>
        <div class="columns is-variable is-8-desktop">
          <div class="column is-7-desktop">
            <ul class="diff-list">
              <li v-for="p in agentPoints" :key="p.title">
                <span class="icon"><Icon :name="p.icon" /></span>
                <span>
                  <strong>{{ t(p.title) }}</strong>&#32;<i18n-t :keypath="p.text" tag="span">
                    <template #command>
                      <code>{{ agentLogCommand }}</code>
                    </template>
                  </i18n-t>
                </span>
              </li>
            </ul>
          </div>
          <div class="column is-5-desktop" style="min-width: 0">
            <p class="is-size-7 has-text-weak">
              {{ t('home.agents.terminalCaption') }}
            </p>
            <TerminalCommands :commands="agentLines" :label="t('home.agents.terminalLabel')" />
            <div class="buttons mt-5">
              <NuxtLinkLocale to="/agents" class="button is-primary">
                <span>{{ t('home.agents.learnMore') }}</span>
                <span class="icon"><Icon name="lucide:arrow-right" /></span>
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs/contracts/agent-access" class="button is-primary is-outlined">
                <span class="icon"><Icon name="lucide:file-text" /></span>
                <span>{{ t('home.agents.contract') }}</span>
              </NuxtLinkLocale>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Install ---------------------------------------------------------- -->
    <section id="install" class="helix-section" aria-labelledby="install-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('home.install.eyebrow') }}
          </p>
          <h2 id="install-title" class="title">
            {{ t('home.install.title') }}
          </h2>
          <p class="lead">
            {{ t('home.install.lead') }}
          </p>
        </div>
        <div class="columns is-variable is-8-desktop">
          <div class="column is-7-desktop" style="min-width: 0">
            <ol class="install-steps">
              <li>
                <h3>{{ t('home.install.download.title') }}</h3>
                <i18n-t keypath="home.install.download.text" tag="p">
                  <template #desktop>
                    <strong>{{ packages.desktop }}</strong>
                  </template>
                  <template #full>
                    <strong>{{ packages.full }}</strong>
                  </template>
                  <template #apps>
                    <strong>{{ packages.apps }}</strong>
                  </template>
                </i18n-t>
                <div class="buttons mt-3">
                  <a :href="links.desktopReleases" class="button is-primary" target="_blank" rel="noopener">
                    <span class="icon"><Icon name="lucide:package" /></span>
                    <span>{{ t('home.install.download.desktopButton') }}</span>
                  </a>
                  <a :href="links.appsReleases" class="button" target="_blank" rel="noopener">
                    <span class="icon"><Icon name="lucide:layout-grid" /></span>
                    <span>{{ t('home.install.download.appsButton') }}</span>
                  </a>
                </div>
              </li>
              <li>
                <h3>{{ t('home.install.install.title') }}</h3>
                <p>
                  {{ t('home.install.install.text') }}
                </p>
                <div class="command-box">
                  <div class="command-bar">
                    <span>{{ t('home.install.install.commandTitle') }}</span>
                    <button type="button" class="copy-button" @click="copyCommand">
                      <span class="icon"><Icon :name="copied ? 'lucide:check' : 'lucide:copy'" /></span>
                      <span>{{ t(copied ? 'home.install.install.copied' : 'home.install.install.copy') }}</span>
                    </button>
                  </div>
                  <TerminalCommands :commands="installLines" :label="t('home.install.install.commandLabel')" />
                  <span class="is-sr-only" aria-live="polite">{{ copied ? t('home.install.install.copiedAnnouncement') : '' }}</span>
                </div>
                <i18n-t keypath="home.install.install.otherDistros" tag="p" class="is-size-7 has-text-weak mt-2">
                  <template #guide>
                    <a :href="`${links.desktop}#installing-and-using-helix`" target="_blank" rel="noopener" class="has-text-accent">{{ t('home.install.install.guideLink') }}</a>
                  </template>
                </i18n-t>
              </li>
              <li>
                <h3>{{ t('home.install.login.title') }}</h3>
                <i18n-t keypath="home.install.login.text" tag="p">
                  <template #helix>
                    <strong>{{ t('site.name') }}</strong>
                  </template>
                </i18n-t>
              </li>
            </ol>

            <div class="reassure">
              <span class="icon"><Icon name="lucide:undo-2" /></span>
              <p>
                <strong>{{ t('home.install.reassure.lead') }}</strong> {{ t('home.install.reassure.text') }}
              </p>
            </div>

            <details class="install-extra">
              <summary>{{ t('home.install.greeter.summary') }}</summary>
              <i18n-t keypath="home.install.greeter.intro" tag="p">
                <template #package>
                  <code>{{ packages.greeter }}</code>
                </template>
              </i18n-t>
              <TerminalCommands :commands="greeterOnLines" :label="t('home.install.greeter.switchLabel')" />
              <p class="mt-3">
                {{ t('home.install.greeter.back') }}
              </p>
              <TerminalCommands :commands="greeterOffLines" :label="t('home.install.greeter.backLabel')" />
              <p class="mt-3">
                {{ t('home.install.greeter.settings') }}
              </p>
            </details>
          </div>
          <div class="column is-5-desktop">
            <div class="feature-card is-auto-height">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:cpu" /></span>
              <h3>{{ t('home.install.nvidia.title') }}</h3>
              <i18n-t keypath="home.install.nvidia.text" tag="p">
                <template #option>
                  <code>{{ nvidiaOption }}</code>
                </template>
              </i18n-t>
            </div>
            <div class="feature-card is-auto-height mt-5">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:life-buoy" /></span>
              <h3>{{ t('home.install.help.title') }}</h3>
              <p class="mb-4">
                {{ t('home.install.help.text') }}
              </p>
              <div class="buttons">
                <a :href="`${links.desktop}#installing-and-using-helix`" class="button is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:file-text" /></span>
                  <span>{{ t('home.install.help.guide') }}</span>
                </a>
                <a :href="links.desktopIssues" class="button is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:message-circle" /></span>
                  <span>{{ t('home.install.help.ask') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tour ------------------------------------------------------------- -->
    <section id="tour" class="helix-section is-tinted" aria-labelledby="tour-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('home.tour.eyebrow') }}
          </p>
          <h2 id="tour-title" class="title">
            {{ t('home.tour.title') }}
          </h2>
          <p class="lead">
            {{ t('home.tour.lead') }}
          </p>
        </div>
        <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop">
          <div class="grid">
            <div v-for="item in tour" :key="item.title" class="cell">
              <div class="feature-card is-hoverable">
                <span class="feature-icon" aria-hidden="true"><Icon :name="item.icon" /></span>
                <h3>{{ t(item.title) }}</h3>
                <p>{{ t(item.text) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-variable is-6-desktop is-vcentered mt-6">
          <div class="column is-4-desktop">
            <figure class="shot">
              <img
                src="/screenshots/quick-settings.webp"
                width="480"
                height="500"
                loading="lazy"
                :alt="t('home.tour.quickSettingsAlt')"
              >
              <figcaption>{{ t('home.tour.quickSettingsCaption') }}</figcaption>
            </figure>
          </div>
          <div class="column is-8-desktop">
            <figure class="shot">
              <img
                src="/screenshots/login-screen.webp"
                width="1024"
                height="640"
                loading="lazy"
                :alt="t('home.tour.loginAlt')"
              >
              <figcaption>{{ t('home.tour.loginCaption') }}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- Apps + accessibility --------------------------------------------- -->
    <section id="apps" class="helix-section" aria-labelledby="apps-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-6-desktop">
          <div class="column is-6-desktop">
            <div class="feature-card">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:layout-grid" /></span>
              <h2 id="apps-title" class="title is-4 mb-3">
                {{ t('home.apps.title') }}
              </h2>
              <p>
                {{ t('home.apps.text') }}
              </p>
              <div class="tags are-medium is-app-list mt-4">
                <span v-for="a in apps" :key="a" class="tag">{{ t(a) }}</span>
                <span class="tag">{{ t('home.apps.more') }}</span>
              </div>
              <a :href="links.apps" class="card-more" target="_blank" rel="noopener">
                {{ t('home.apps.link') }} <Icon name="lucide:arrow-right" />
              </a>
            </div>
          </div>
          <div class="column is-6-desktop">
            <div class="feature-card">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:accessibility" /></span>
              <h2 class="title is-4 mb-3">
                {{ t('home.access.title') }}
              </h2>
              <p>{{ t('home.access.intro') }}</p>
              <ul class="ticks">
                <li v-for="a in a11y" :key="a">
                  {{ t(a) }}
                </li>
              </ul>
              <p class="is-size-7 has-text-weak mt-3">
                {{ t('home.access.note') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Differences ------------------------------------------------------ -->
    <section id="differences" class="helix-section is-tinted" aria-labelledby="diff-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('home.differences.eyebrow') }}
          </p>
          <h2 id="diff-title" class="title">
            {{ t('home.differences.title') }}
          </h2>
          <p class="lead">
            {{ t('home.differences.lead') }}
          </p>
        </div>
        <div class="columns is-variable is-6-desktop">
          <div class="column">
            <h3 class="title is-5">
              {{ t('home.differences.touchesTitle') }}
            </h3>
            <ul class="diff-list">
              <li v-for="item in touches" :key="item.title">
                <span class="icon"><Icon :name="item.icon" /></span>
                <span><strong>{{ t(item.title) }}</strong> {{ t(item.text) }}</span>
              </li>
            </ul>
          </div>
          <div class="column">
            <h3 class="title is-5">
              {{ t('home.differences.notesTitle') }}
            </h3>
            <ul class="diff-list">
              <li v-for="item in notes" :key="item.title" class="is-note">
                <span class="icon"><Icon name="lucide:info" /></span>
                <span><strong>{{ t(item.title) }}</strong> {{ t(item.text) }}</span>
              </li>
            </ul>
            <NuxtLinkLocale to="/docs/gnome-compatibility" class="button is-primary is-outlined mt-4">
              <span>{{ t('home.differences.link') }}</span>
              <span class="icon"><Icon name="lucide:arrow-right" /></span>
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works ----------------------------------------------------- -->
    <section id="how-it-works" class="helix-section" aria-labelledby="how-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-8-desktop is-vcentered">
          <div class="column is-7-desktop">
            <p class="eyebrow">
              {{ t('home.how.eyebrow') }}
            </p>
            <h2 id="how-title" class="title is-size-3-desktop is-size-4-touch">
              {{ t('home.how.title') }}
            </h2>
            <p>
              {{ t('home.how.text') }}
            </p>
          </div>
          <div class="column is-5-desktop">
            <div class="pills">
              <NuxtLinkLocale to="/docs" class="pill">
                {{ t('home.how.docs') }}
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs/gnome-compatibility" class="pill">
                {{ t('home.how.compatibility') }}
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs/scope" class="pill">
                {{ t('home.how.scope') }}
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs/contracts" class="pill">
                {{ t('home.how.contracts') }}
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs/contracts/agent-access" class="pill">
                {{ t('home.how.agents') }}
              </NuxtLinkLocale>
              <NuxtLinkLocale to="/docs/contracts/extensions" class="pill">
                {{ t('home.how.extensions') }}
              </NuxtLinkLocale>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Repositories ----------------------------------------------------- -->
    <section class="helix-section" aria-labelledby="source-title">
      <div class="container is-widescreen">
        <div class="cta-band">
          <div class="columns is-vcentered is-variable is-6-desktop">
            <div class="column is-5-desktop">
              <h2 id="source-title" class="title is-3">
                {{ t('home.source.title') }}
              </h2>
              <p class="mb-5">
                {{ t('home.source.text') }}
              </p>
              <NuxtLinkLocale to="/#install" class="button is-primary is-medium" style="background: linear-gradient(135deg, hsl(234, 52%, 44%), hsl(246, 56%, 44%)); border: none">
                <span class="icon"><Icon name="lucide:download" /></span>
                <span>{{ t('home.source.install') }}</span>
              </NuxtLinkLocale>
            </div>
            <div class="column is-7-desktop">
              <div class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-1-cols-desktop">
                <div class="grid">
                  <a
                    v-for="r in repoCards"
                    :key="r.name"
                    :href="r.href"
                    target="_blank"
                    rel="noopener"
                    class="cell repo-card"
                  >
                    <span class="repo-name"><Icon name="simple-icons:github" />{{ r.name }}</span>
                    <p>{{ t(r.text) }}</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
