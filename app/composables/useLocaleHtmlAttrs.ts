/**
 * Sets `<html lang dir>` from the current locale and, once the site has more
 * than one language, the `hreflang` alternate links (plus `x-default`) for
 * every page. Used by app.vue and error.vue, which replaces it on errors.
 */
export function useLocaleHtmlAttrs() {
  const { locale, locales } = useI18n()
  const current = computed(() => locales.value.find(l => l.code === locale.value))

  useHead({
    htmlAttrs: {
      lang: () => current.value?.language ?? locale.value,
      dir: () => current.value?.dir ?? 'ltr',
    },
  })

  // With a single language there is nothing to point at, so no alternates.
  if (locales.value.length > 1) {
    const head = useLocaleHead({ dir: false, lang: false, seo: true })
    useHead(() => ({ link: head.value.link, meta: head.value.meta }))
  }
}
