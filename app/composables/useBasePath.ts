import { defaultLocale } from '~~/i18n/locales'

/**
 * The current route's path without its locale prefix (`/es/docs/scope` ->
 * `/docs/scope`), for comparing against unlocalized paths such as the docs
 * navigation, which comes from the (English-only) spec.
 */
export function useBasePath() {
  const route = useRoute()
  const { locale } = useI18n()
  return computed(() => {
    if (locale.value === defaultLocale) return route.path
    const prefix = `/${locale.value}`
    return route.path === prefix || route.path.startsWith(`${prefix}/`)
      ? route.path.slice(prefix.length) || '/'
      : route.path
  })
}
