import type { LocaleObject } from '@nuxtjs/i18n'

/**
 * The site's languages. To add one, create `i18n/locales/<code>.json` (copy
 * `en.json` and translate the values) and add a line below. See
 * "Translations" in the README.
 *
 * - `code` is the URL prefix (`/es/`, `/zh-cn/`); English, the default, has
 *   none and stays at the root.
 * - `language` is the BCP 47 tag used for `<html lang>` and `hreflang`.
 * - `name` is the language's own name, shown in the language picker.
 *
 * The language picker and the `hreflang` alternates appear by themselves
 * once there is more than one entry.
 */
export const defaultLocale = 'en'

export const locales: LocaleObject[] = [
  { code: 'en', language: 'en', name: 'English', dir: 'ltr', file: 'en.json' },
]
