/** External links used across the site. */
export const links = {
  desktop: 'https://github.com/danielkrainas/helix-desktop',
  desktopReleases: 'https://github.com/danielkrainas/helix-desktop/releases',
  desktopIssues: 'https://github.com/danielkrainas/helix-desktop/issues',
  apps: 'https://github.com/danielkrainas/helix-apps',
  appsReleases: 'https://github.com/danielkrainas/helix-apps/releases',
  spec: 'https://github.com/danielkrainas/helix-desktop-spec',
  web: 'https://github.com/danielkrainas/helix-web',
} as const

/** The project's repositories; their names are identifiers, not translated. */
export const repos = {
  desktop: { name: 'helix-desktop', href: links.desktop },
  apps: { name: 'helix-apps', href: links.apps },
  spec: { name: 'helix-desktop-spec', href: links.spec },
  web: { name: 'helix-web', href: links.web },
} as const
