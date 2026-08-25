import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useState backed by localStorage. Fails silently (private mode, quota, SSR)
 * so a blocked storage API never takes the whole app down.
 */
export function useLocalStorage(key, initialValue) {
  const readInitial = () => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initialValue : JSON.parse(raw)
    } catch {
      return initialValue
    }
  }

  const [value, setValue] = useState(readInitial)
  const keyRef = useRef(key)
  keyRef.current = key

  useEffect(() => {
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value))
    } catch {
      /* storage unavailable — keep working in memory */
    }
  }, [value])

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(keyRef.current)
    } catch {
      /* ignore */
    }
    setValue(initialValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [value, setValue, remove]
}

export default useLocalStorage
