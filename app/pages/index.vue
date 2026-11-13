<script setup lang="ts">
useSeoMeta({
  title: 'Helix',
  description: 'Helix is a Rust desktop environment that speaks GNOME’s public contracts, so your GTK and libadwaita apps, settings and tools keep working.',
})

const { data: counts } = await useAsyncData('spec-counts', async () => {
  const kinds = ['dbus', 'gsettings', 'extensions'] as const
  const entries = await Promise.all(kinds.map(async kind =>
    [kind, await queryCollection('docs').where('kind', '=', kind).count()] as const))
  return Object.fromEntries(entries) as Record<typeof kinds[number], number>
})

const features = [
  {
    icon: 'i-lucide-plug-zap',
    title: 'Drop-in for GNOME',
    description: 'Implements the session and service D-Bus interfaces a GNOME session exposes — Shell, Mutter DisplayConfig, IdleMonitor, ScreenCast, SessionManager and the desktop portals.',
    to: '/docs/contracts/dbus',
  },
  {
    icon: 'i-lucide-sliders-horizontal',
    title: 'Your settings carry over',
    description: 'Reads the same GSettings schemas as GNOME 51, so GNOME Settings, gsettings and dconf keep working against Helix.',
    to: '/docs/contracts/gsettings',
  },
  {
    icon: 'i-lucide-app-window',
    title: 'Runs your apps unmodified',
    description: 'GTK and libadwaita applications run as they are. Helix does not fork or reimplement the toolkit.',
    to: '/docs/scope',
  },
  {
    icon: 'i-lucide-puzzle',
    title: 'Extensions that can’t break the desktop',
    description: 'Extensions run as their own processes and talk to the shell over a versioned D-Bus API. A crashing extension never takes the session with it.',
    to: '/docs/contracts/extensions',
  },
  {
    icon: 'i-lucide-cog',
    title: 'Written in Rust',
    description: 'Compositor, shell and session services are built in Rust as a clean-room implementation of public contracts, not a fork of GNOME source.',
    to: '/docs/components',
  },
  {
    icon: 'i-lucide-book-open-check',
    title: 'An open, living spec',
    description: 'Every interface Helix implements is written down, with its behavior and the gaps still to close. The specification is CC0.',
    to: '/docs',
  },
]
</script>

<template>
  <div>
    <UPageHero
      title="The GNOME desktop contract, rebuilt in Rust"
      description="Helix is a desktop environment that drops in where GNOME Shell and Mutter run today. It speaks GNOME’s public interfaces, so your apps, settings and tools keep working — and it is free to go further where they don’t reach."
      :links="[
        { label: 'Read the docs', to: '/docs', trailingIcon: 'i-lucide-arrow-right', size: 'xl' },
        { label: 'Browse contracts', to: '/docs/contracts', color: 'neutral', variant: 'subtle', icon: 'i-lucide-file-code', size: 'xl' },
      ]"
    >
      <template #headline>
        <UBadge label="Specification phase · targets GNOME 51" variant="subtle" size="lg" />
      </template>
    </UPageHero>

    <UPageSection v-if="counts" :ui="{ container: 'py-0 sm:py-0 lg:py-0' }">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-lg overflow-hidden ring ring-default bg-(--ui-border)">
        <NuxtLink
          v-for="stat in [
            { value: counts.dbus, label: 'D-Bus interfaces specified', to: '/docs/contracts/dbus' },
            { value: counts.gsettings, label: 'GSettings schema pages', to: '/docs/contracts/gsettings' },
            { value: counts.extensions, label: 'Extension API pages', to: '/docs/contracts/extensions' },
          ]"
          :key="stat.label"
          :to="stat.to"
          class="bg-default p-6 hover:bg-elevated/50 transition-colors"
        >
          <div class="text-3xl font-semibold text-highlighted tabular-nums">
            {{ stat.value }}
          </div>
          <div class="text-sm text-muted mt-1">
            {{ stat.label }}
          </div>
        </NuxtLink>
      </div>
    </UPageSection>

    <UPageSection
      title="Compatible where it counts"
      description="Helix targets the contracts applications and tools actually depend on, not GNOME’s internals."
    >
      <UPageGrid>
        <UPageCard
          v-for="feature in features"
          :key="feature.title"
          v-bind="feature"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="What’s out of scope"
      description="Being explicit about the boundary keeps the compatibility surface practical."
      orientation="horizontal"
      :features="[
        { icon: 'i-lucide-x', title: 'GNOME Shell extensions', description: 'They patch unstable Shell internals. Helix has its own isolated extension system instead.' },
        { icon: 'i-lucide-x', title: 'Pixel-perfect Shell visuals', description: 'Exact visual, animation and theming parity with GNOME Shell is not a goal.' },
        { icon: 'i-lucide-x', title: 'Reimplementing GTK', description: 'GTK, libadwaita and GObject are used as they are.' },
      ]"
    >
      <UPageCard variant="subtle" title="Read the scope" description="What “GNOME-compatible” means for Helix v0, and where it stops." to="/docs/scope" icon="i-lucide-target" />
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Dig into the specification"
        description="Interfaces, schemas, protocols and proposals — rendered straight from the canonical spec repository."
        variant="subtle"
        :links="[{ label: 'Open the docs', to: '/docs', trailingIcon: 'i-lucide-arrow-right' }, { label: 'Known gaps', to: '/docs/gaps', color: 'neutral', variant: 'outline' }]"
      />
    </UPageSection>
  </div>
</template>
