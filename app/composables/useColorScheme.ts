export type Scheme = 'light' | 'dark'

const STORAGE_KEY = 'helix-theme'

/**
 * The effective colour scheme. Follows prefers-color-scheme until the user
 * picks one with the toggle; the choice is stored and applied as data-theme
 * on <html> (an inline head script in nuxt.config.ts re-applies it before
 * first paint).
 */
export function useColorScheme() {
  const scheme = useState<Scheme>('color-scheme', () => 'light')

  function current(): Scheme {
    const explicit = document.documentElement.getAttribute('data-theme')
    if (explicit === 'light' || explicit === 'dark') return explicit
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function set(value: Scheme) {
    scheme.value = value
    document.documentElement.setAttribute('data-theme', value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    }
    catch {
      // Storage can be unavailable (private windows); the choice then lasts for this page only.
    }
  }

  onMounted(() => {
    scheme.value = current()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!document.documentElement.hasAttribute('data-theme')) scheme.value = current()
    }
    mq.addEventListener('change', onChange)
    onBeforeUnmount(() => mq.removeEventListener('change', onChange))
  })

  return { scheme, toggle: () => set(scheme.value === 'dark' ? 'light' : 'dark') }
}
