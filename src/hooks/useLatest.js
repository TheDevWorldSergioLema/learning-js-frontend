import { useEffect, useRef } from 'react'

/** Ref always holding the latest value, to read it from effects without re-running them. */
export function useLatest(value) {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  })

  return ref
}
