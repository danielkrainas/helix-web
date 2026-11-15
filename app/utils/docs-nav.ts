import type { ContentNavigationItem } from '@nuxt/content'

/**
 * Turns the raw content navigation into the docs sidebar tree:
 * - drops the "/docs" wrapper node
 * - a directory whose only page is its README becomes a plain link
 * - otherwise the README page is listed first as "Overview"
 */
export function docsNavigation(navigation: ContentNavigationItem[] | null | undefined): ContentNavigationItem[] {
  const root = navigation?.find(i => i.path === '/docs')
  if (!root) return []

  const fix = (item: ContentNavigationItem): ContentNavigationItem => {
    if (!item.children?.length) return item
    const children = item.children.map(fix)
    const index = children.find(c => c.path === item.path && !c.children?.length)
    if (index && children.length === 1) return { ...item, children: undefined, page: undefined }
    return {
      ...item,
      children: children.map(c => (c === index ? { ...c, title: 'Overview', exact: true } : c)),
    }
  }

  return (root.children ?? []).map(fix).map(item =>
    item.path === '/docs' ? { ...item, title: 'Introduction', exact: true } : item)
}
