<script setup lang="ts">
useSeoMeta({
  title: 'Helix',
  description: 'Helix is a GNOME-compatible desktop environment written in Rust. It runs your GNOME, GTK and libadwaita apps unmodified and keeps your GNOME settings, built from GNOME’s public contracts rather than its code.',
})

const { data: counts } = await useAsyncData('spec-counts', async () => {
  const kinds = ['dbus', 'gsettings', 'extensions'] as const
  const entries = await Promise.all(kinds.map(async kind =>
    [kind, await queryCollection('docs').where('kind', '=', kind).count()] as const))
  return Object.fromEntries(entries) as Record<typeof kinds[number], number>
})

const compat = [
  {
    icon: 'lucide:app-window',
    title: 'Your apps run unmodified',
    text: 'GTK 3, GTK 4 and libadwaita applications run as they are, on Wayland or on X11 through Xwayland. Chromium, Electron and Qt applications work too.',
  },
  {
    icon: 'lucide:sliders-horizontal',
    title: 'Your GNOME settings carry over',
    text: 'Helix reads and writes your settings through the system’s GSettings schemas: wallpaper, dark style, fonts, keyboard layouts, shortcuts and accessibility. Switch between GNOME and Helix and keep them all.',
  },
  {
    icon: 'lucide:plug-zap',
    title: 'GNOME tools keep working',
    text: 'GNOME Settings, command-line tools and sandboxed apps reach the same D-Bus interfaces and portal backends they expect: the session manager, display configuration, screenshots, screen casting, notifications and media controls.',
  },
]

const parts = [
  {
    icon: 'lucide:monitor',
    title: 'Compositor',
    text: 'A Smithay compositor on DRM/KMS with multi-monitor layout, fractional scaling, workspaces, Xwayland, idle monitoring and screen capture.',
  },
  {
    icon: 'lucide:layout-panel-top',
    title: 'Shell',
    text: 'Top panel, quick settings, notifications with a calendar and media controls, overview with dynamic workspaces, app grid and dock, app and window switchers, screenshots and screen recording.',
  },
  {
    icon: 'lucide:power',
    title: 'Session',
    text: 'GNOME’s session manager interface, with ordered startup through a systemd user target, autostart, inhibitors, and logout, restart and power off through logind.',
  },
  {
    icon: 'lucide:door-open',
    title: 'Portals',
    text: 'xdg-desktop-portal backends for settings, screenshots, screen casting, remote desktop, the clipboard, global shortcuts and more. Your accent colour and dark style reach sandboxed apps.',
  },
  {
    icon: 'lucide:lock-keyhole',
    title: 'Login and lock screen',
    text: 'An optional greetd login screen, so a Helix system needs neither GDM nor GNOME Shell, and a lock screen of its own with media controls and notification summaries.',
  },
  {
    icon: 'lucide:puzzle',
    title: 'Isolated extensions',
    text: 'Extensions are separate programs that talk to the shell over a versioned D-Bus API: panel items, quick settings, dock items, commands and menus. A crashing extension can’t take the desktop with it.',
  },
]

const apps = ['Files', 'Terminal', 'Text Editor', 'Settings', 'Web']

const a11y = [
  'Keyboard navigation through the panel, quick settings, notifications, menus and dialogs',
  'Screen-reader support through AT-SPI',
  'High contrast, reduced motion and Large Text',
  'On-screen keyboard and magnifier',
  'Follows your accent colour, in the shell and, through the Settings portal, in your apps',
]
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
                In daily use · targets GNOME 51
              </p>
              <h1 id="hero-title" class="title is-1">
                <span class="nowrap">A GNOME-compatible</span> desktop, <span class="gradient-text">written in&nbsp;Rust.</span>
              </h1>
              <p class="subtitle mt-5">
                Helix is an alternative desktop environment for Linux. It runs your
                GNOME, GTK and libadwaita apps unmodified, keeps your GNOME settings,
                and is built from GNOME’s public interfaces, not from its code.
              </p>
              <div class="buttons mt-6">
                <NuxtLink to="/#install" class="button is-primary is-medium">
                  <span class="icon"><Icon name="lucide:download" /></span>
                  <span>Install Helix</span>
                </NuxtLink>
                <NuxtLink to="/docs" class="button is-ghost-light is-medium">
                  <span class="icon"><Icon name="lucide:book-open" /></span>
                  <span>Read the docs</span>
                </NuxtLink>
                <a :href="links.desktop" class="button is-ghost-light is-medium" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="simple-icons:github" /></span>
                  <span>GitHub</span>
                </a>
              </div>
              <p class="hero-facts">
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>Full Wayland session on real hardware</span>
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>Clean-room, not a fork</span>
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>CC0, public domain</span>
              </p>
            </div>
            <div class="column is-5-desktop">
              <figure class="screen-frame">
                <img
                  src="/screenshots/notifications-calendar.webp"
                  width="780"
                  height="582"
                  alt="The Helix notification list beside a calendar: grouped chat notifications, a mail and a software update notice, today's events, a world clock and media controls."
                >
                <figcaption>Notifications, calendar, world clocks and media controls in the Helix shell.</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Compatibility ---------------------------------------------------- -->
    <section class="helix-section" aria-labelledby="compat-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            GNOME-compatible
          </p>
          <h2 id="compat-title" class="title">
            Bring your apps. Keep your settings.
          </h2>
          <p class="lead">
            Helix offers the same public contracts a GNOME session does, so the
            software you already use keeps working, and moving back and forth
            between GNOME and Helix costs you nothing.
          </p>
        </div>
        <div class="columns is-multiline">
          <div v-for="c in compat" :key="c.title" class="column is-4-desktop is-12-tablet">
            <div class="feature-card is-hoverable">
              <span class="feature-icon" aria-hidden="true"><Icon :name="c.icon" /></span>
              <h3>{{ c.title }}</h3>
              <p>{{ c.text }}</p>
            </div>
          </div>
        </div>
        <p class="mt-5">
          <NuxtLink to="/docs/gnome-compatibility" class="has-text-accent has-text-weight-semibold">
            See exactly what is supported, and what isn’t →
          </NuxtLink>
        </p>
      </div>
    </section>

    <!-- Contracts -------------------------------------------------------- -->
    <section class="helix-section is-tinted" aria-labelledby="contracts-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-8-desktop is-vcentered">
          <div class="column is-6-desktop">
            <p class="eyebrow">
              How it’s built
            </p>
            <h2 id="contracts-title" class="title is-size-2-desktop is-size-3-touch">
              Built on GNOME’s contracts, not its code
            </h2>
            <p class="mb-4">
              Helix is a clean-room implementation of the public contracts
              applications and tools depend on: D-Bus interfaces, GSettings
              schemas, xdg-desktop-portal and Wayland protocols. It is not a fork
              of GNOME Shell or Mutter, and it is written in Rust from the
              compositor up.
            </p>
            <p class="mb-4">
              Every contract is written down first, in an open specification.
              Where GNOME’s behaviour is undocumented, the spec records Helix’s
              own choice, so other implementations can follow it or differ
              knowingly. Helix is tested against those contracts.
            </p>
            <p>
              GTK, libadwaita and GObject are used as they are: Helix
              never reimplements the toolkit your apps are drawn with.
            </p>
          </div>
          <div class="column is-6-desktop">
            <div v-if="counts" class="stat-strip">
              <NuxtLink to="/docs/contracts/dbus">
                <strong>{{ counts.dbus }}</strong>
                <span>D-Bus interface pages</span>
              </NuxtLink>
              <NuxtLink to="/docs/contracts/gsettings">
                <strong>{{ counts.gsettings }}</strong>
                <span>GSettings schema pages</span>
              </NuxtLink>
              <NuxtLink to="/docs/contracts/extensions">
                <strong>{{ counts.extensions }}</strong>
                <span>Extension API pages</span>
              </NuxtLink>
            </div>
            <div class="pills mt-5">
              <NuxtLink to="/docs/contracts/dbus" class="pill">
                D-Bus interfaces
              </NuxtLink>
              <NuxtLink to="/docs/contracts/gsettings" class="pill">
                GSettings schemas
              </NuxtLink>
              <NuxtLink to="/docs/contracts/wayland" class="pill">
                Wayland protocols
              </NuxtLink>
              <NuxtLink to="/docs/contracts/dbus/org.freedesktop.impl.portal" class="pill">
                Portals
              </NuxtLink>
              <NuxtLink to="/docs/proposals" class="pill">
                Proposals
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The desktop ------------------------------------------------------ -->
    <section class="helix-section" aria-labelledby="desktop-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            Ready for daily use
          </p>
          <h2 id="desktop-title" class="title">
            A complete desktop, not a demo
          </h2>
          <p class="lead">
            Helix runs as a full Wayland session on real hardware and is used every
            day as a primary desktop. It installs from packages and appears as a
            <strong>Helix</strong> session at your login screen.
          </p>
        </div>
        <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop">
          <div class="grid">
            <div v-for="p in parts" :key="p.title" class="cell">
              <div class="feature-card is-hoverable">
                <span class="feature-icon" aria-hidden="true"><Icon :name="p.icon" /></span>
                <h3>{{ p.title }}</h3>
                <p>{{ p.text }}</p>
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
                alt="Helix quick settings: volume and brightness sliders, toggles for Wi-Fi, Bluetooth, airplane mode, night light, dark style and do not disturb, power modes, and lock, suspend, log out, restart and power off."
              >
              <figcaption>Quick settings, in a teal accent colour.</figcaption>
            </figure>
          </div>
          <div class="column is-8-desktop">
            <figure class="shot">
              <img
                src="/screenshots/login-screen.webp"
                width="1024"
                height="640"
                loading="lazy"
                alt="The Helix login screen: a clock and date, a user's initials and name, a password field, Restart and Power Off buttons, and a session menu set to Helix."
              >
              <figcaption>Helix’s own greetd login screen, here with a blue accent.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- Apps + accessibility --------------------------------------------- -->
    <section class="helix-section is-tinted" aria-labelledby="apps-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-6-desktop">
          <div class="column is-6-desktop">
            <div class="feature-card">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:layout-grid" /></span>
              <h2 id="apps-title" class="title is-4 mb-3">
                Apps of its own
              </h2>
              <p>
                <a :href="links.apps" target="_blank" rel="noopener" class="has-text-accent has-text-weight-semibold">helix-apps</a>
                is Helix’s own suite of core applications, written in Rust with
                GTK&nbsp;4 and libadwaita. Stock GNOME applications work just as well.
              </p>
              <div class="tags are-medium is-app-list mt-4">
                <span v-for="a in apps" :key="a" class="tag">{{ a }}</span>
                <span class="tag">and more</span>
              </div>
              <a :href="links.apps" class="card-more" target="_blank" rel="noopener">
                helix-apps on GitHub <Icon name="lucide:arrow-right" />
              </a>
            </div>
          </div>
          <div class="column is-6-desktop">
            <div class="feature-card">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:accessibility" /></span>
              <h2 class="title is-4 mb-3">
                Accessible, and yours
              </h2>
              <ul class="ticks">
                <li v-for="a in a11y" :key="a">
                  {{ a }}
                </li>
              </ul>
              <p class="is-size-7 has-text-weak mt-3">
                Some shell surfaces are still being brought to screen readers and
                Large Text; the gaps are tracked in the open.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Differences ------------------------------------------------------ -->
    <section class="helix-section" aria-labelledby="diff-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            Honest about the differences
          </p>
          <h2 id="diff-title" class="title">
            Compatible where it counts, different on purpose
          </h2>
          <p class="lead">
            Helix aims for compatibility wherever software depends on it, and makes
            its own choices everywhere else.
          </p>
        </div>
        <div class="columns is-variable is-6-desktop">
          <div class="column">
            <h3 class="title is-5">
              Where Helix differs
            </h3>
            <ul class="diff-list">
              <li>
                <span class="icon"><Icon name="lucide:palette" /></span>
                <span><strong>Its own design.</strong> The panel, quick settings, overview,
                  dialogs and lock screen are Helix’s own, with WCAG AA text contrast,
                  visible focus rings and reduced motion. Your apps still look like
                  GNOME apps, because GTK and libadwaita draw them.</span>
              </li>
              <li>
                <span class="icon"><Icon name="lucide:shield-check" /></span>
                <span><strong>Safer dialogs.</strong> Enter picks the safe choice
                  (Wait, Deny, Cancel), and keys pressed in the first 300&nbsp;ms after a
                  dialog appears are ignored.</span>
              </li>
              <li>
                <span class="icon"><Icon name="lucide:panel-bottom" /></span>
                <span><strong>A dock out of the box.</strong> It follows a subset of
                  Ubuntu’s Dash to Dock settings.</span>
              </li>
              <li>
                <span class="icon"><Icon name="lucide:life-buoy" /></span>
                <span><strong>A sturdier session.</strong> A crashed app can’t block
                  logout forever, and the session ends cleanly if a core service goes
                  away.</span>
              </li>
            </ul>
          </div>
          <div class="column">
            <h3 class="title is-5">
              What Helix doesn’t do
            </h3>
            <ul class="diff-list">
              <li class="is-no">
                <span class="icon"><Icon name="lucide:circle-x" /></span>
                <span><strong>GNOME Shell extensions.</strong> They patch GNOME Shell’s
                  internal, unstable APIs. Helix keeps their settings so tools don’t
                  break, and offers its own isolated extension system instead.</span>
              </li>
              <li class="is-no">
                <span class="icon"><Icon name="lucide:circle-x" /></span>
                <span><strong>A pixel-perfect GNOME Shell look.</strong> GNOME Shell’s
                  appearance isn’t a public contract, so copying it isn’t a goal.</span>
              </li>
              <li class="is-no">
                <span class="icon"><Icon name="lucide:circle-x" /></span>
                <span><strong>GDM.</strong> GDM’s login screen is GNOME Shell itself.
                  You can still pick Helix from GDM, or use Helix’s own login
                  screen.</span>
              </li>
            </ul>
            <NuxtLink to="/docs/gnome-compatibility" class="button is-primary is-outlined mt-4">
              <span>Read the compatibility summary</span>
              <span class="icon"><Icon name="lucide:arrow-right" /></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Install ---------------------------------------------------------- -->
    <section id="install" class="helix-section is-tinted" aria-labelledby="install-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            Get started
          </p>
          <h2 id="install-title" class="title">
            Install Helix
          </h2>
          <p class="lead">
            Every release ships packages for Debian and Ubuntu (.deb), Fedora
            (.rpm) and Arch Linux, for x86_64 and aarch64 (Arch: x86_64).
            Helix installs alongside your current desktop.
          </p>
        </div>
        <div class="columns is-variable is-8-desktop">
          <div class="column is-7-desktop" style="min-width: 0">
            <ol class="install-steps">
              <li>
                <h3>Install the packages</h3>
                <p>
                  Download <code>helix-desktop</code> and <code>helix-desktop-full</code>
                  from a release, and <code>helix-apps</code> from its own releases.
                  Install them together; the full package brings in Helix’s apps,
                  Xwayland, xdg-desktop-portal, the GNOME schemas, dconf and PipeWire.
                </p>
                <pre class="terminal" aria-label="Install command for Debian and Ubuntu"><span class="prompt">$ </span>sudo apt install ./helix-desktop_*.deb \
    ./helix-desktop-full_*.deb ./helix-apps_*.deb</pre>
              </li>
              <li>
                <h3>Log out and pick Helix</h3>
                <p>
                  Choose <strong>Helix</strong> from your login screen’s session menu
                  (GDM’s gear button, for example) and log in. Your GNOME settings
                  come with you. On NVIDIA, KMS must be on
                  (<code>nvidia-drm.modeset=1</code>).
                </p>
              </li>
              <li>
                <h3>Optional: Helix’s own login screen</h3>
                <p>
                  Install <code>helix-greeter</code> (it needs greetd; Debian and
                  Ubuntu for now) and switch display managers. Switch back the same way.
                </p>
                <pre class="terminal" aria-label="Commands to switch to the greetd login screen"><span class="prompt">$ </span>sudo systemctl disable gdm3
<span class="prompt">$ </span>sudo systemctl enable greetd
<span class="prompt">$ </span>sudo reboot</pre>
              </li>
            </ol>
          </div>
          <div class="column is-5-desktop">
            <div class="feature-card is-auto-height">
              <h3>Downloads and guides</h3>
              <p class="mb-4">
                Packages are published as GitHub releases with a
                <code>SHA256SUMS</code> file.
              </p>
              <div class="buttons">
                <a :href="links.desktopReleases" class="button is-primary is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:package" /></span>
                  <span>helix-desktop releases</span>
                </a>
                <a :href="links.appsReleases" class="button is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:layout-grid" /></span>
                  <span>helix-apps releases</span>
                </a>
                <a :href="`${links.desktop}#installing-and-using-helix`" class="button is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:file-text" /></span>
                  <span>Full install guide</span>
                </a>
              </div>
              <p class="is-size-7 has-text-weak">
                Known gaps are tracked as
                <a :href="links.desktopIssues" target="_blank" rel="noopener" class="has-text-accent">helix-desktop issues</a>
                labelled <code>gap</code> and <code>needs-hardware</code>.
              </p>
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
                Open from the spec up
              </h2>
              <p class="mb-5">
                Three repositories, all dedicated to the public domain. Read the
                specification, follow the work, or send a fix.
              </p>
              <NuxtLink to="/docs" class="button is-primary is-medium" style="background: linear-gradient(135deg, hsl(184, 75%, 38%), hsl(196, 80%, 38%)); border: none">
                <span>Read the docs</span>
                <span class="icon"><Icon name="lucide:arrow-right" /></span>
              </NuxtLink>
            </div>
            <div class="column is-7-desktop">
              <div class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-1-cols-desktop">
                <div class="grid">
                  <a
                    v-for="r in [
                      { name: 'helix-desktop', href: links.desktop, text: 'Compositor, shell, session, portals and login screen.' },
                      { name: 'helix-apps', href: links.apps, text: 'Files, Terminal, Text Editor, Settings, Web and more.' },
                      { name: 'helix-desktop-spec', href: links.spec, text: 'The living specification and contracts behind these docs.' },
                    ]"
                    :key="r.name"
                    :href="r.href"
                    target="_blank"
                    rel="noopener"
                    class="cell repo-card"
                  >
                    <span class="repo-name"><Icon name="simple-icons:github" />{{ r.name }}</span>
                    <p>{{ r.text }}</p>
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
