<script setup lang="ts">
useSeoMeta({
  title: 'Helix',
  description: 'Helix is a free, GNOME-compatible desktop for Linux. Your apps keep working, your settings come with you, and you can switch back to GNOME from the login screen any time.',
})

const benefits = [
  {
    icon: 'lucide:app-window',
    title: 'Your apps just work',
    text: 'GNOME apps, web browsers like Chrome and Chromium, Electron and Qt apps and older X11 programs all run as they are. Nothing to reinstall.',
  },
  {
    icon: 'lucide:sliders-horizontal',
    title: 'Your settings come with you',
    text: 'Your wallpaper, dark style, fonts, keyboard layouts, shortcuts and accessibility settings are shared with GNOME, so Helix feels like your computer from the first login.',
  },
  {
    icon: 'lucide:undo-2',
    title: 'Switch back any time',
    text: 'Helix installs next to GNOME rather than replacing it. Pick whichever desktop you want each time you log in, and change your mind whenever you like.',
  },
]

const tour = [
  {
    icon: 'lucide:layout-panel-top',
    title: 'Top bar and quick settings',
    text: 'Volume, brightness, Wi-Fi, Bluetooth, power modes, night light and dark style, one click away.',
  },
  {
    icon: 'lucide:bell',
    title: 'Notifications and calendar',
    text: 'Your notifications next to a calendar with your events, world clocks, the weather and controls for whatever is playing.',
  },
  {
    icon: 'lucide:layers',
    title: 'Overview and workspaces',
    text: 'See all your open windows at a glance and spread your work across workspaces that appear as you need them.',
  },
  {
    icon: 'lucide:layout-grid',
    title: 'App grid and dock',
    text: 'Find every app in the grid, sort them into folders, and pin favourites to a dock that’s there from the start.',
  },
  {
    icon: 'lucide:camera',
    title: 'Screenshots and recording',
    text: 'Take a screenshot or record a video of your screen, built right in.',
  },
  {
    icon: 'lucide:lock-keyhole',
    title: 'Lock and login screens',
    text: 'A lock screen with media controls and notification summaries, and, if you want it, Helix’s own login screen.',
  },
]

const apps = ['Files', 'Terminal', 'Text Editor', 'Settings', 'Web']

const a11y = [
  'Full keyboard control of the top bar, quick settings, notifications, menus and dialogs',
  'Screen reader support',
  'High contrast, larger text and reduced motion',
  'An on-screen keyboard and a magnifier',
  'Follows your accent colour and dark style, on the desktop and in your apps',
]

const installCommand = 'sudo apt install ./helix-desktop_*.deb ./helix-desktop-full_*.deb ./helix-apps_*.deb'
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
                In everyday use as a main desktop
              </p>
              <h1 id="hero-title" class="title is-1">
                A fresh desktop for Linux, <span class="gradient-text">with everything you already&nbsp;use.</span>
              </h1>
              <p class="subtitle mt-5">
                Helix is a GNOME-compatible alternative desktop: your apps work as
                they are, your settings come with you, and you can switch back from
                the login screen any time.
              </p>
              <div class="buttons mt-6">
                <NuxtLink to="/#install" class="button is-primary is-medium">
                  <span class="icon"><Icon name="lucide:download" /></span>
                  <span>Install Helix</span>
                </NuxtLink>
                <NuxtLink to="/#tour" class="button is-ghost-light is-medium">
                  <span class="icon"><Icon name="lucide:sparkles" /></span>
                  <span>See what’s included</span>
                </NuxtLink>
              </div>
              <p class="hero-facts">
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>Installs next to GNOME</span>
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>Keeps your apps and settings</span>
                <span><span class="icon"><Icon name="lucide:circle-check" /></span>Free and open (CC0)</span>
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
                <figcaption>Notifications, your calendar, world clocks and media controls, side by side.</figcaption>
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
            GNOME-compatible
          </p>
          <h2 id="why-title" class="title">
            Try something new without starting over
          </h2>
          <p class="lead">
            “GNOME-compatible” means Helix works with the same apps and settings
            as the GNOME desktop that Ubuntu and many other Linux systems use. It
            looks and feels like its own desktop, but your computer stays yours.
          </p>
        </div>
        <div class="columns is-multiline">
          <div v-for="b in benefits" :key="b.title" class="column is-4-desktop is-12-tablet">
            <div class="feature-card is-hoverable">
              <span class="feature-icon" aria-hidden="true"><Icon :name="b.icon" /></span>
              <h3>{{ b.title }}</h3>
              <p>{{ b.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Install ---------------------------------------------------------- -->
    <section id="install" class="helix-section is-tinted" aria-labelledby="install-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            Get Helix
          </p>
          <h2 id="install-title" class="title">
            Install Helix in three steps
          </h2>
          <p class="lead">
            Helix has ready-made packages for Ubuntu and Debian, and also for
            Fedora (.rpm) and Arch Linux, for regular PCs and for ARM computers
            (Arch: PCs only). It sits next to your current desktop and doesn’t replace it.
          </p>
        </div>
        <div class="columns is-variable is-8-desktop">
          <div class="column is-7-desktop" style="min-width: 0">
            <ol class="install-steps">
              <li>
                <h3>Download</h3>
                <p>
                  From the latest releases, download three packages:
                  <strong>helix-desktop</strong> and <strong>helix-desktop-full</strong>,
                  then <strong>helix-apps</strong>, which has releases of its own.
                </p>
                <div class="buttons mt-3">
                  <a :href="links.desktopReleases" class="button is-primary" target="_blank" rel="noopener">
                    <span class="icon"><Icon name="lucide:package" /></span>
                    <span>Helix desktop</span>
                  </a>
                  <a :href="links.appsReleases" class="button" target="_blank" rel="noopener">
                    <span class="icon"><Icon name="lucide:layout-grid" /></span>
                    <span>Helix apps</span>
                  </a>
                </div>
              </li>
              <li>
                <h3>Install</h3>
                <p>
                  Open a terminal in the folder you saved them to (usually
                  Downloads) and install all three together. On Ubuntu or Debian:
                </p>
                <div class="command-box">
                  <div class="command-bar">
                    <span>Ubuntu and Debian</span>
                    <button type="button" class="copy-button" @click="copyCommand">
                      <span class="icon"><Icon :name="copied ? 'lucide:check' : 'lucide:copy'" /></span>
                      <span>{{ copied ? 'Copied' : 'Copy' }}</span>
                    </button>
                  </div>
                  <pre class="terminal" aria-label="Install command for Ubuntu and Debian"><span class="prompt">$ </span>sudo apt install ./helix-desktop_*.deb \
    ./helix-desktop-full_*.deb ./helix-apps_*.deb</pre>
                  <span class="is-sr-only" aria-live="polite">{{ copied ? 'Command copied' : '' }}</span>
                </div>
                <p class="is-size-7 has-text-weak mt-2">
                  On Fedora or Arch, install the same three packages with your
                  package manager; the
                  <a :href="`${links.desktop}#installing-and-using-helix`" target="_blank" rel="noopener" class="has-text-accent">full install guide</a>
                  has the details.
                </p>
              </li>
              <li>
                <h3>Log out and pick Helix</h3>
                <p>
                  At the login screen, choose <strong>Helix</strong> from the session
                  menu (on Ubuntu, it’s the gear button that appears after you pick
                  your name) and log in.
                </p>
              </li>
            </ol>

            <div class="reassure">
              <span class="icon"><Icon name="lucide:undo-2" /></span>
              <p>
                <strong>Your GNOME session stays installed.</strong> To switch back,
                log out and pick it again at the login screen. Your settings are
                shared, so nothing gets lost either way.
              </p>
            </div>

            <details class="install-extra">
              <summary>For enthusiasts: use Helix’s own login screen</summary>
              <p>
                Optional, and for Ubuntu and Debian only for now. Install
                <code>helix-greeter</code> (it brings in greetd), then switch login
                screens and restart:
              </p>
              <pre class="terminal" aria-label="Commands to switch to the Helix login screen"><span class="prompt">$ </span>sudo systemctl disable gdm3
<span class="prompt">$ </span>sudo systemctl enable greetd
<span class="prompt">$ </span>sudo reboot</pre>
              <p class="mt-3">
                Switch back the same way, the other way round. If the login screen
                doesn’t appear, press Ctrl+Alt+F3 for a text login.
              </p>
            </details>
          </div>
          <div class="column is-5-desktop">
            <div class="feature-card is-auto-height">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:cpu" /></span>
              <h3>Have an NVIDIA graphics card?</h3>
              <p>
                Helix needs the NVIDIA driver’s modesetting option turned on
                (<code>nvidia-drm.modeset=1</code>). You only need to set it once.
              </p>
            </div>
            <div class="feature-card is-auto-height mt-5">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:life-buoy" /></span>
              <h3>Need a hand?</h3>
              <p class="mb-4">
                The full guide covers every step, and you can ask a question or
                report a problem on GitHub.
              </p>
              <div class="buttons">
                <a :href="`${links.desktop}#installing-and-using-helix`" class="button is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:file-text" /></span>
                  <span>Full install guide</span>
                </a>
                <a :href="links.desktopIssues" class="button is-fullwidth" target="_blank" rel="noopener">
                  <span class="icon"><Icon name="lucide:message-circle" /></span>
                  <span>Ask or report a problem</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tour ------------------------------------------------------------- -->
    <section id="tour" class="helix-section" aria-labelledby="tour-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            What’s included
          </p>
          <h2 id="tour-title" class="title">
            A complete desktop for every day
          </h2>
          <p class="lead">
            Helix isn’t a demo. It’s a full desktop that people use every day,
            with everything you’d expect to find.
          </p>
        </div>
        <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop">
          <div class="grid">
            <div v-for="t in tour" :key="t.title" class="cell">
              <div class="feature-card is-hoverable">
                <span class="feature-icon" aria-hidden="true"><Icon :name="t.icon" /></span>
                <h3>{{ t.title }}</h3>
                <p>{{ t.text }}</p>
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
              <figcaption>Helix’s own login screen, here with a blue accent.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- Apps + accessibility --------------------------------------------- -->
    <section id="apps" class="helix-section is-tinted" aria-labelledby="apps-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-6-desktop">
          <div class="column is-6-desktop">
            <div class="feature-card">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:layout-grid" /></span>
              <h2 id="apps-title" class="title is-4 mb-3">
                Comes with its own apps
              </h2>
              <p>
                Helix installs with a set of everyday apps made for it: a file
                manager, a terminal, a text editor, settings, a web browser and
                more. The GNOME apps you already have work just as well.
              </p>
              <div class="tags are-medium is-app-list mt-4">
                <span v-for="a in apps" :key="a" class="tag">{{ a }}</span>
                <span class="tag">and more</span>
              </div>
              <a :href="links.apps" class="card-more" target="_blank" rel="noopener">
                Meet the Helix apps <Icon name="lucide:arrow-right" />
              </a>
            </div>
          </div>
          <div class="column is-6-desktop">
            <div class="feature-card">
              <span class="feature-icon" aria-hidden="true"><Icon name="lucide:accessibility" /></span>
              <h2 class="title is-4 mb-3">
                Accessible, and made to fit you
              </h2>
              <p>Helix is built to be usable by everyone, the way you like it.</p>
              <ul class="ticks">
                <li v-for="a in a11y" :key="a">
                  {{ a }}
                </li>
              </ul>
              <p class="is-size-7 has-text-weak mt-3">
                A few parts of the desktop don’t work with screen readers or larger
                text yet. We track those openly and are working through them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Differences ------------------------------------------------------ -->
    <section id="differences" class="helix-section" aria-labelledby="diff-title">
      <div class="container is-widescreen">
        <div class="section-head">
          <p class="eyebrow">
            Before you switch
          </p>
          <h2 id="diff-title" class="title">
            Familiar where it matters, thoughtful in the details
          </h2>
          <p class="lead">
            Trying Helix doesn’t lock you in: GNOME stays on your computer and you
            can move between the two from the login screen. Here’s what to expect.
          </p>
        </div>
        <div class="columns is-variable is-6-desktop">
          <div class="column">
            <h3 class="title is-5">
              Thoughtful touches
            </h3>
            <ul class="diff-list">
              <li>
                <span class="icon"><Icon name="lucide:shield-check" /></span>
                <span><strong>Safe choices by default.</strong> When a dialog pops
                  up, pressing Enter picks the safe option, like Cancel or Deny, and
                  keys pressed the instant it appears are ignored, so you can’t
                  approve something by accident.</span>
              </li>
              <li>
                <span class="icon"><Icon name="lucide:puzzle" /></span>
                <span><strong>Extensions can’t crash your desktop.</strong> Each
                  extension runs on its own, so a broken one can’t take the rest of
                  the desktop down with it.</span>
              </li>
              <li>
                <span class="icon"><Icon name="lucide:power" /></span>
                <span><strong>Logging out just works.</strong> An app that has
                  crashed can’t hold up logging out forever.</span>
              </li>
              <li>
                <span class="icon"><Icon name="lucide:palette" /></span>
                <span><strong>A look of its own.</strong> The top bar, overview and
                  lock screen are Helix’s own design, with easy-to-read text and visible
                  keyboard focus. Your apps look just as they do now.</span>
              </li>
            </ul>
          </div>
          <div class="column">
            <h3 class="title is-5">
              Good to know
            </h3>
            <ul class="diff-list">
              <li class="is-note">
                <span class="icon"><Icon name="lucide:info" /></span>
                <span><strong>GNOME Shell extensions don’t run.</strong> Helix has
                  its own extensions instead. Your GNOME extensions stay installed
                  for when you go back to GNOME.</span>
              </li>
              <li class="is-note">
                <span class="icon"><Icon name="lucide:info" /></span>
                <span><strong>It doesn’t look exactly like GNOME.</strong> Helix
                  works with GNOME’s apps and settings, but it isn’t a copy of
                  GNOME’s desktop.</span>
              </li>
              <li class="is-note">
                <span class="icon"><Icon name="lucide:info" /></span>
                <span><strong>It’s young software.</strong> The desktop itself is
                  in English only for now, and some hardware, like touchscreens
                  and drawing tablets, hasn’t been tried on real devices yet.</span>
              </li>
            </ul>
            <NuxtLink to="/docs/gnome-compatibility" class="button is-primary is-outlined mt-4">
              <span>See what works and what doesn’t</span>
              <span class="icon"><Icon name="lucide:arrow-right" /></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works ----------------------------------------------------- -->
    <section id="how-it-works" class="helix-section is-tinted" aria-labelledby="how-title">
      <div class="container is-widescreen">
        <div class="columns is-variable is-8-desktop is-vcentered">
          <div class="column is-7-desktop">
            <p class="eyebrow">
              For the technically curious
            </p>
            <h2 id="how-title" class="title is-size-3-desktop is-size-4-touch">
              How Helix works
            </h2>
            <p>
              Helix is an independent desktop, built in Rust for reliability. It
              isn’t a fork of GNOME: it speaks the same public interfaces that
              GNOME’s apps and tools rely on, and every one of them is written down
              in an open specification. The docs tell the whole story.
            </p>
          </div>
          <div class="column is-5-desktop">
            <div class="pills">
              <NuxtLink to="/docs" class="pill">
                Read the docs
              </NuxtLink>
              <NuxtLink to="/docs/gnome-compatibility" class="pill">
                GNOME compatibility
              </NuxtLink>
              <NuxtLink to="/docs/scope" class="pill">
                Scope
              </NuxtLink>
              <NuxtLink to="/docs/contracts" class="pill">
                Interfaces and contracts
              </NuxtLink>
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
                Free and open, for everyone
              </h2>
              <p class="mb-5">
                Helix, its apps and its specification are dedicated to the public
                domain (CC0): free to use, share and change, with no strings
                attached. Follow along, report a problem or help out.
              </p>
              <NuxtLink to="/#install" class="button is-primary is-medium" style="background: linear-gradient(135deg, hsl(184, 75%, 38%), hsl(196, 80%, 38%)); border: none">
                <span class="icon"><Icon name="lucide:download" /></span>
                <span>Install Helix</span>
              </NuxtLink>
            </div>
            <div class="column is-7-desktop">
              <div class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-1-cols-desktop">
                <div class="grid">
                  <a
                    v-for="r in [
                      { name: 'helix-desktop', href: links.desktop, text: 'The desktop itself, and its login screen.' },
                      { name: 'helix-apps', href: links.apps, text: 'Files, Terminal, Text Editor, Settings, Web and more.' },
                      { name: 'helix-desktop-spec', href: links.spec, text: 'The open specification behind the docs.' },
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
