/** External links used across the site. */
export const links = {
  desktop: 'https://github.com/helixdesktop/desktop',
  desktopReleases: 'https://github.com/helixdesktop/desktop/releases',
  desktopIssues: 'https://github.com/helixdesktop/desktop/issues',
  apps: 'https://github.com/helixdesktop/apps',
  appsReleases: 'https://github.com/helixdesktop/apps/releases',
  spec: 'https://github.com/helixdesktop/spec',
  web: 'https://github.com/helixdesktop/web',
} as const

/** The project's repositories; their names are identifiers, not translated. */
export const repos = {
  desktop: { name: 'desktop', href: links.desktop },
  apps: { name: 'apps', href: links.apps },
  spec: { name: 'spec', href: links.spec },
  web: { name: 'web', href: links.web },
} as const
