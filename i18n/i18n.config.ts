import { locales } from './locales'

// Plural messages ("one | other") list their forms in CLDR order, keeping
// only the categories the language has: English and German `one | other`,
// Russian, Ukrainian and Polish `one | few | many`, Japanese, Chinese and
// Korean a single form. A category beyond the last form written (such as
// Russian `other`, used only for fractions) takes the last form.
const cldrOrder: Intl.LDMLPluralRule[] = ['zero', 'one', 'two', 'few', 'many', 'other']

function pluralRule(language: string) {
  const rules = new Intl.PluralRules(language)
  const categories = rules.resolvedOptions().pluralCategories
  const forms = cldrOrder.filter(c => categories.includes(c))
  return (choice: number, choicesLength: number) =>
    Math.max(0, Math.min(forms.indexOf(rules.select(Math.abs(choice))), choicesLength - 1))
}

// vue-i18n options. Languages, routing and message files are configured in
// i18n/locales.ts and nuxt.config.ts.
export default defineI18nConfig(() => ({
  // A message missing from a translation falls back to English, never to
  // its key; `pnpm check-i18n` makes sure every key used exists in English.
  fallbackLocale: 'en',
  // Untranslated messages are expected while a language is in progress.
  missingWarn: false,
  fallbackWarn: false,
  pluralRules: Object.fromEntries(locales.map(l => [l.code, pluralRule(l.language ?? l.code)])),
}))
