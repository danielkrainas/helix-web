<script setup lang="ts">
// Agent Access: what it is and how the user stays in control. Every claim
// here follows helixdesktop/spec contracts/agent-access/ (README.md, cli.md)
// and the org.helixdesktop.agent-access settings.
const { t } = useI18n()

useSeoMeta({
  title: () => t('agents.meta.title'),
  description: () => t('agents.meta.description'),
  ogTitle: () => t('agents.meta.title'),
  ogDescription: () => t('agents.meta.description'),
})

const principles = [
  { icon: 'lucide:shield-check', title: 'agents.principles.shell.title', text: 'agents.principles.shell.text' },
  { icon: 'lucide:user-check', title: 'agents.principles.consent.title', text: 'agents.principles.consent.text' },
  { icon: 'lucide:power-off', title: 'agents.principles.off.title', text: 'agents.principles.off.text' },
  { icon: 'lucide:ban', title: 'agents.principles.noSelfGrant.title', text: 'agents.principles.noSelfGrant.text' },
]

// The four values of `access-level`, in order; each includes the ones before.
const levels = [
  { icon: 'lucide:eye', value: 'read-only', name: 'agents.levels.readOnly.name', text: 'agents.levels.readOnly.text' },
  { icon: 'lucide:layout-panel-top', value: 'desktop', name: 'agents.levels.desktop.name', text: 'agents.levels.desktop.text' },
  { icon: 'lucide:app-window', value: 'apps', name: 'agents.levels.apps.name', text: 'agents.levels.apps.text' },
  { icon: 'lucide:mouse-pointer-click', value: 'screen-and-input', name: 'agents.levels.screen.name', text: 'agents.levels.screen.text' },
]

// The switches of org.helixdesktop.agent-access and their defaults.
const switches = [
  { key: 'notifications', on: false, name: 'agents.levels.notifications.name', text: 'agents.levels.notifications.text' },
  { key: 'clipboard', on: false, name: 'agents.levels.clipboard.name', text: 'agents.levels.clipboard.text' },
  { key: 'read-text-fields', on: false, name: 'agents.levels.textFields.name', text: 'agents.levels.textFields.text' },
  { key: 'confirm-sensitive', on: true, name: 'agents.levels.confirm.name', text: 'agents.levels.confirm.text' },
  { key: 'allow-remote', on: false, name: 'agents.levels.remote.name', text: 'agents.levels.remote.text' },
]

const watchItems = [
  { icon: 'lucide:bot', title: 'agents.watch.indicator.title', text: 'agents.watch.indicator.text' },
  { icon: 'lucide:octagon-x', title: 'agents.watch.stop.title', text: 'agents.watch.stop.text' },
  { icon: 'lucide:hand', title: 'agents.watch.hardStop.title', text: 'agents.watch.hardStop.text' },
  { icon: 'lucide:lock-keyhole', title: 'agents.watch.locked.title', text: 'agents.watch.locked.text' },
]

const never = [
  'agents.never.lockScreen',
  'agents.never.passwords',
  'agents.never.prompts',
  'agents.never.settings',
  'agents.never.excluded',
  'agents.never.screenshots',
]

const limits = [
  { title: 'agents.limits.isolation.title', text: 'agents.limits.isolation.text' },
  { title: 'agents.limits.sensitive.title', text: 'agents.limits.sensitive.text' },
  { title: 'agents.limits.x11.title', text: 'agents.limits.x11.text' },
]

const docLinks = [
  { to: '/docs/contracts/agent-access', icon: 'lucide:file-text', label: 'agents.docs.contract', code: 'contracts/agent-access' },
  { to: '/docs/contracts/agent-access/cli', icon: 'lucide:square-terminal', label: 'agents.docs.cli', code: 'helix-agent(1)' },
  { to: '/docs/contracts/agent-access/org.helixdesktop.agent1', icon: 'lucide:file-code', label: 'agents.docs.interface', code: 'org.helixdesktop.Agent1' },
  { to: '/docs/contracts/gsettings/org.helixdesktop.agent-access', icon: 'lucide:settings', label: 'agents.docs.settings', code: 'org.helixdesktop.agent-access' },
]

// Commands, environment variables and CLI output are the same in every
// language. The session uses only commands from contracts/agent-access/cli.md.
const command = 'helix-agent'
const logCommand = 'helix-agent log'
const nameVariable = 'HELIX_AGENT_NAME'
const sessionLines = [
  'export HELIX_AGENT_NAME="Release helper"',
  'helix-agent status',
  'helix-agent request --level read-only',
  'helix-agent windows --app org.gnome.TextEditor',
  'helix-agent files recent --limit 5',
  'helix-agent ask "Which branch should I build?" --choice main --choice next',
  'helix-agent remind add +30m "Check the release build"',
  'helix-agent log --since today',
]
const refusalCommand = 'helix-agent --json windows'
const refusalOutput = '{"error": {"code": "access-off", "exit-code": 10, "message": "Agent access is turned off (Settings › Privacy & Security › Agent Access)", "dbus-error": "org.helixdesktop.Agent1.Error.AccessOff"}}'
</script>

<template>
  <div>
    <!-- Header --------------------------------------------------------- -->
    <section class="hero helix-hero is-page-hero" aria-labelledby="agents-title">
      <div class="hero-body">
        <div class="container is-widescreen">
          <p class="hero-tag">
            <span class="icon"><Icon name="lucide:bot" /></span>
            {{ t('agents.hero.tag') }}
          </p>
          <i18n-t id="agents-title" keypath="agents.hero.title" tag="h1" class="title is-1">
            <template #highlight>
              <span class="gradient-text">{{ t('agents.hero.titleHighlight') }}</span>
            </template>
          </i18n-t>
          <i18n-t keypath="agents.hero.subtitle" tag="p" class="subtitle mt-5">
            <template #command>
              <code>{{ command }}</code>
            </template>
          </i18n-t>
          <div class="buttons mt-6">
            <NuxtLinkLocale to="/docs/contracts/agent-access" class="button is-primary is-medium">
              <span class="icon"><Icon name="lucide:file-text" /></span>
              <span>{{ t('agents.hero.docs') }}</span>
            </NuxtLinkLocale>
            <NuxtLinkLocale to="/docs/contracts/agent-access/cli" class="button is-ghost-light is-medium">
              <span class="icon"><Icon name="lucide:square-terminal" /></span>
              <span>{{ t('agents.hero.cli') }}</span>
            </NuxtLinkLocale>
          </div>
          <i18n-t keypath="agents.hero.offNote" tag="p" class="hero-facts">
            <template #path>
              <strong>{{ t('agents.settingsPath') }}</strong>
            </template>
          </i18n-t>
        </div>
      </div>
    </section>

    <!-- Principles ----------------------------------------------------- -->
    <section class="helix-section" aria-labelledby="principles-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('agents.principles.eyebrow') }}
          </p>
          <h2 id="principles-title" class="title">
            {{ t('agents.principles.title') }}
          </h2>
        </div>
        <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-2-cols-desktop">
          <div class="grid">
            <div v-for="p in principles" :key="p.title" class="cell">
              <div class="feature-card">
                <span class="feature-icon" aria-hidden="true"><Icon :name="p.icon" /></span>
                <h3>{{ t(p.title) }}</h3>
                <i18n-t :keypath="p.text" tag="p">
                  <template #command>
                    <code>{{ command }}</code>
                  </template>
                </i18n-t>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Levels and switches -------------------------------------------- -->
    <section class="helix-section is-tinted" aria-labelledby="levels-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('agents.levels.eyebrow') }}
          </p>
          <h2 id="levels-title" class="title">
            {{ t('agents.levels.title') }}
          </h2>
          <p class="lead">
            {{ t('agents.levels.lead') }}
          </p>
        </div>
        <ol class="level-ladder">
          <li v-for="(l, i) in levels" :key="l.value">
            <span class="level-step" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3>
                <span class="icon"><Icon :name="l.icon" /></span>
                {{ t(l.name) }}
                <code class="level-value">{{ l.value }}</code>
              </h3>
              <p>{{ t(l.text) }}</p>
            </div>
          </li>
        </ol>

        <h3 class="title is-5 mt-6">
          {{ t('agents.levels.switchesTitle') }}
        </h3>
        <ul class="diff-list switch-list">
          <li v-for="s in switches" :key="s.key">
            <span class="icon"><Icon :name="s.on ? 'lucide:toggle-right' : 'lucide:toggle-left'" /></span>
            <span>
              <strong>{{ t(s.name) }}</strong>
              <span class="tag is-rounded ml-1" :class="s.on ? 'is-primary is-light' : ''">{{ t(s.on ? 'agents.levels.on' : 'agents.levels.off') }}</span>
              <br>
              {{ t(s.text) }}
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Visible and stoppable ------------------------------------------ -->
    <section class="helix-section" aria-labelledby="watch-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            {{ t('agents.watch.eyebrow') }}
          </p>
          <h2 id="watch-title" class="title">
            {{ t('agents.watch.title') }}
          </h2>
        </div>
        <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-4-cols-desktop">
          <div class="grid">
            <div v-for="w in watchItems" :key="w.title" class="cell">
              <div class="feature-card">
                <span class="feature-icon" aria-hidden="true"><Icon :name="w.icon" /></span>
                <h3>{{ t(w.title) }}</h3>
                <p>{{ t(w.text) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Never exposed, Settings, log ----------------------------------- -->
    <section class="helix-section is-tinted" aria-labelledby="never-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-8-desktop">
          <div class="column is-6-desktop">
            <p class="eyebrow">
              {{ t('agents.never.eyebrow') }}
            </p>
            <h2 id="never-title" class="title is-3">
              {{ t('agents.never.title') }}
            </h2>
            <p class="mb-3">
              {{ t('agents.never.lead') }}
            </p>
            <ul class="diff-list">
              <li v-for="n in never" :key="n" class="is-no">
                <span class="icon"><Icon name="lucide:circle-off" /></span>
                <span>{{ t(n) }}</span>
              </li>
            </ul>
          </div>
          <div class="column is-6-desktop">
            <div class="feature-card is-auto-height">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:settings" /></span>
              <p class="eyebrow mb-1">
                {{ t('agents.settings.eyebrow') }}
              </p>
              <h2 class="title is-4 mb-3">
                {{ t('agents.settings.title') }}
              </h2>
              <i18n-t keypath="agents.settings.text" tag="p">
                <template #path>
                  <strong>{{ t('agents.settingsPath') }}</strong>
                </template>
              </i18n-t>
            </div>
            <div class="feature-card is-auto-height mt-5">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:scroll-text" /></span>
              <p class="eyebrow mb-1">
                {{ t('agents.log.eyebrow') }}
              </p>
              <h2 class="title is-4 mb-3">
                {{ t('agents.log.title') }}
              </h2>
              <i18n-t keypath="agents.log.text" tag="p">
                <template #command>
                  <code>{{ logCommand }}</code>
                </template>
              </i18n-t>
              <p class="mt-3">
                {{ t('agents.log.private') }}
              </p>
              <p class="mt-3">
                {{ t('agents.log.retention') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The CLI ---------------------------------------------------------- -->
    <section class="helix-section" aria-labelledby="cli-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-8-desktop">
          <div class="column is-5-desktop">
            <p class="eyebrow">
              {{ t('agents.cli.eyebrow') }}
            </p>
            <h2 id="cli-title" class="title is-3">
              {{ t('agents.cli.title') }}
            </h2>
            <i18n-t keypath="agents.cli.lead" tag="p">
              <template #command>
                <code>{{ command }}</code>
              </template>
            </i18n-t>
            <i18n-t keypath="agents.cli.name" tag="p" class="mt-3">
              <template #variable>
                <code>{{ nameVariable }}</code>
              </template>
            </i18n-t>
          </div>
          <div class="column is-7-desktop" style="min-width: 0">
            <TerminalCommands :commands="sessionLines" :label="t('agents.cli.exampleLabel')" />
            <p class="mt-4">
              {{ t('agents.cli.refusal') }}
            </p>
            <pre class="terminal is-wrapped" :aria-label="t('agents.cli.refusalLabel')"><span class="prompt">$ </span>{{ refusalCommand }}
{{ refusalOutput }}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Limits ----------------------------------------------------------- -->
    <section class="helix-section is-tinted" aria-labelledby="limits-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-8-desktop">
          <div class="column is-6-desktop">
            <p class="eyebrow">
              {{ t('agents.limits.eyebrow') }}
            </p>
            <h2 id="limits-title" class="title is-3">
              {{ t('agents.limits.title') }}
            </h2>
            <ul class="diff-list">
              <li v-for="l in limits" :key="l.title" class="is-note">
                <span class="icon"><Icon name="lucide:info" /></span>
                <span><strong>{{ t(l.title) }}</strong> {{ t(l.text) }}</span>
              </li>
            </ul>
          </div>
          <div class="column is-6-desktop">
            <h2 class="title is-4">
              {{ t('agents.docs.title') }}
            </h2>
            <p class="mb-4">
              {{ t('agents.docs.lead') }}
            </p>
            <div class="doc-links">
              <NuxtLinkLocale v-for="d in docLinks" :key="d.to" :to="d.to" class="doc-link">
                <span class="icon"><Icon :name="d.icon" /></span>
                <span>
                  <strong>{{ t(d.label) }}</strong>
                  <code>{{ d.code }}</code>
                </span>
                <span class="icon"><Icon name="lucide:arrow-right" /></span>
              </NuxtLinkLocale>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
