---
title: Helix 0.8 is out
date: 2026-11-21
description: The first public release of Helix, with packages for Ubuntu, Debian, Fedora and Arch Linux from Helix's own package repository, so updates arrive with the rest of your system.
author: The Helix Desktop Project
---

Helix 0.8.0 is the first public release of the desktop and its apps. You can
install it today on Ubuntu and Debian, Fedora and Arch Linux, on regular PCs
and on ARM computers (Arch: PCs only).

## Why 0.8

Helix has been developed in the open against a written
[specification](/docs) for a while, and it has grown well past what a "0.1"
would suggest: a Wayland compositor and shell, a suite of
[apps](https://github.com/helixdesktop/apps), the login screen, extensions,
Agent Access and translations into twelve languages. Numbering the first
release 0.8 says that honestly. It also leaves a short road to 1.0, which
we'll define in the open.

## Install it, and keep it up to date

Helix now has its own package repository at
[packages.dakr.io/helix](https://packages.dakr.io/helix/). Add it once, install
`helix-desktop-full`, and from then on Helix updates along with the rest of
your system. On Ubuntu or Debian:

```sh
sudo install -d -m 0755 /etc/apt/keyrings
curl -fsSL https://packages.dakr.io/key.asc | sudo tee /etc/apt/keyrings/omnirelease.asc >/dev/null
echo "deb [signed-by=/etc/apt/keyrings/omnirelease.asc] https://packages.dakr.io/helix/deb stable main" | sudo tee /etc/apt/sources.list.d/helix.list
sudo apt update
sudo apt install helix-desktop-full
```

The [install section](/#install) has the commands for Fedora (dnf) and Arch
Linux (pacman). Then log out, pick **Helix** at the login screen and log in.
GNOME stays installed, so you can switch back whenever you like. The packages
are also attached to the
[desktop](https://github.com/helixdesktop/desktop/releases) and
[apps](https://github.com/helixdesktop/apps/releases) releases on GitHub if
you'd rather install them by hand.

## What's in this release

Everything from [Introducing Helix](/news/introducing-helix), plus a round of
fixes from using Helix every day:

- **Apps that don't answer pings.** Some X11 apps (Zoom, for one) never
  answer the "are you still there?" check, so Helix kept offering to force
  them to quit. It now only warns about windows that have answered before.
- **Browsers and Electron apps** no longer freeze into a still picture when
  you bring back a window they had minimized themselves.
- **Dragging a maximized window** by its title bar keeps it under the
  pointer, on any monitor.
- **Nearly full-screen windows**, like Slack restoring its saved size, now
  open maximized, as they do in GNOME, instead of leaving a gap under the
  top bar.
- **Files** offers to delete permanently on drives that have no Trash, such
  as some NTFS and FAT drives.
- **Agent Access** recognises an agent by the command it was started with,
  so an agent that updates itself keeps the access you gave it.

## Tell us what breaks

Helix is young software, and a first release is where the real bug reports
start. If something doesn't work, please
[open an issue](https://github.com/helixdesktop/desktop/issues). If you
speak one of the twelve languages, reviewing a translation helps a lot too.
