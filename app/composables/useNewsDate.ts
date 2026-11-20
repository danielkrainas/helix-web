/**
 * Formats a news post's date in the reader's language ("20 November 2026",
 * "20. November 2026" …). Dates are calendar days, so they are formatted in
 * UTC: the day written in the post is the day shown, wherever it is read.
 */
export function useNewsDate() {
  const { locale, locales } = useI18n()
  const language = computed(() => locales.value.find(l => l.code === locale.value)?.language ?? locale.value)

  function formatDate(date: string | Date | undefined) {
    if (!date) return ''
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat(language.value, { dateStyle: 'long', timeZone: 'UTC' }).format(d)
  }

  return { formatDate }
}
