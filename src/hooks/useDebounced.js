import { useEffect, useState } from 'react'

/**
 * `value` once it stopped changing for `delay` ms. When `key` changes, the new value is returned at once.
 * `flush` makes the current value the debounced one without waiting.
 */
export function useDebounced(value, delay, key) {
  const [state, setState] = useState({ key, value })

  if (state.key !== key) setState({ key, value })

  useEffect(() => {
    const timer = setTimeout(() => setState((s) => (s.value === value ? s : { key, value })), delay)
    return () => clearTimeout(timer)
  }, [key, value, delay])

  const flush = () => setState({ key, value })

  return [state.key === key ? state.value : value, flush]
}
