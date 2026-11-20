---
title: Introducing Helix
date: 2026-11-20
description: Helix is a GNOME-compatible Wayland desktop written in Rust. Your apps and settings keep working, GNOME stays installed, and AI agents get a way to help that you control.
author: The Helix Desktop Project
---

Helix is a desktop environment for Linux, written in Rust. It is
**GNOME-compatible**: it speaks the same public interfaces that GNOME's apps,
tools and settings rely on, so the software you already use keeps working.
It is not a fork of GNOME and doesn't look exactly like it; the top bar,
overview, dock, lock screen and the rest are Helix's own design.

## What you get

- **A full Wayland desktop.** A compositor built on Smithay, a shell with
  quick settings, notifications and a calendar, an overview with workspaces,
  an app grid and a dock, screenshots and screen recording, an on-screen
  keyboard and a magnifier.
- **Your apps and settings, as they are.** GNOME and GTK apps, browsers,
  Electron and Qt apps and X11 programs run unchanged. Your wallpaper, fonts,
  keyboard layouts, shortcuts and accessibility settings are shared with GNOME.
- **No lock-in.** Helix installs next to GNOME. Pick either one at the login
  screen, and switch back whenever you like. If you want, Helix also has
  its own login screen, with its options in Settings.
- **Its own apps.** Files, Terminal, Text Editor, Settings, Web and more,
  made for Helix, live in [helixdesktop/apps](https://github.com/helixdesktop/apps).
- **Twelve languages.** The desktop is translated into Spanish, French,
  German, Brazilian Portuguese, Russian, Simplified Chinese, Japanese,
  Italian, Polish, Dutch, Korean and Ukrainian. These are machine
  translations that still need review by native speakers.

## Agents, with you in control

Helix has first-class support for AI agents and command-line tools through
**Agent Access**. With the `helix-agent` command, an agent can list your
windows, search recent files, ask you a question, open a document or, at the
highest level, read the screen and type for you.

It is off until you turn it on in Settings › Privacy & Security › Agent
Access, and the desktop enforces it, not the agent. You choose the highest
level any agent may have, and approve each agent in a prompt that only you
can answer. While an agent is active, the top bar shows it, with a Stop
button, and touching the keyboard or pointer stops an agent's input at once.
The lock screen, password fields, system prompts and Settings are never
exposed, and you can exclude any app. Every request is recorded in an
activity log you can read in Settings.

[How Agent Access works](/agents)

## Open, all the way down

Everything Helix implements is written down first in an open
[specification](/docs): which interfaces it serves, which settings it reads,
and where it deliberately differs from GNOME
([GNOME compatibility](/docs/gnome-compatibility)). The desktop, its apps and
the specification are dedicated to the public domain under **CC0**.

## Try it, and help

The [install section](/#install) and the
[guide in the desktop repository](https://github.com/helixdesktop/desktop#installing-and-using-helix)
cover Ubuntu and Debian, Fedora and Arch Linux, and building from source.
Helix is young software: touchscreens and drawing tablets, for example,
haven't been tried on real devices yet.

You can help by trying it and
[reporting what doesn't work](https://github.com/helixdesktop/desktop/issues),
by reviewing a translation in your language, or by reading the
[specification](https://github.com/helixdesktop/spec) and telling us where it
is unclear.
