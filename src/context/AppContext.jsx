import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppStateContext = createContext(null)

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('haven:theme', prefersDark() ? 'dark' : 'light')
  const [entries, setEntries] = useLocalStorage('haven:entries', [])
  const [streak, setStreak] = useLocalStorage('haven:streak', { count: 0, lastDay: null })
  const [toasts, setToasts] = useState([])
  const [groundingOpen, setGroundingOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#121614' : '#F8FAF8')
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [setTheme],
  )

  const toast = useCallback((message, tone = 'calm') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const dismissToast = useCallback(
    (id) => setToasts((current) => current.filter((t) => t.id !== id)),
    [],
  )

  const markCheckIn = useCallback(() => {
    const today = new Date().toDateString()
    setStreak((prev) => {
      if (prev.lastDay === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const count = prev.lastDay === yesterday ? prev.count + 1 : 1
      return { count, lastDay: today }
    })
  }, [setStreak])

  const addEntry = useCallback(
    (entry) => {
      const record = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        ...entry,
      }
      setEntries((current) => [record, ...current].slice(0, 60))
      markCheckIn()
      return record
    },
    [markCheckIn, setEntries],
  )

  const removeEntry = useCallback(
    (id) => setEntries((current) => current.filter((e) => e.id !== id)),
    [setEntries],
  )

  const clearEntries = useCallback(() => setEntries([]), [setEntries])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      entries,
      addEntry,
      removeEntry,
      clearEntries,
      streak,
      toasts,
      toast,
      dismissToast,
      groundingOpen,
      setGroundingOpen,
    }),
    [
      theme,
      toggleTheme,
      entries,
      addEntry,
      removeEntry,
      clearEntries,
      streak,
      toasts,
      toast,
      dismissToast,
      groundingOpen,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export default AppStateContext
