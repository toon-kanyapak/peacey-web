import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { History, Trash2, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getMood } from '../../services/reframingEngine'
import { formatTimestamp, formatRelativeTime, cn } from '../../lib/utils'

export function HistoryDrawer({ open, onClose }) {
  const { entries, removeEntry, clearEntries } = useApp()

  // Escape closes; body scroll locks while the panel is open.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-sm dark:bg-black/50"
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label="Check-in history"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="haven-surface fixed inset-y-0 right-0 z-[61] flex w-full max-w-[27rem] flex-col border-y-0 border-r-0 shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-emerald-900/5 px-5 py-4 dark:border-white/10">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-sage-500/12 text-sage-600 dark:text-sage-300">
                <History className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Your check-ins</h3>
                <p className="text-[12px] text-muted">
                  {entries.length === 0
                    ? 'Nothing saved yet'
                    : `${entries.length} saved in this browser`}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close history"
                className="grid h-8 w-8 place-items-center rounded-xl text-muted transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {entries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="text-3xl">🌱</span>
                  <p className="text-[14px] font-medium">No check-ins yet</p>
                  <p className="text-[13px] leading-relaxed text-muted">
                    Reframed thoughts you save will collect here, so you can look back and see what
                    was actually worrying you last week.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  <AnimatePresence initial={false}>
                    {entries.map((entry) => {
                      const mood = getMood(entry.mood)
                      return (
                        <motion.li
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0, marginBottom: -10 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="group rounded-2xl border border-emerald-900/5 bg-white/55 p-4 dark:border-white/8 dark:bg-white/[0.03]"
                        >
                          <div className="mb-2.5 flex items-center gap-2">
                            <span
                              className={cn(
                                'rounded-full px-2.5 py-1 text-[11px] font-medium',
                                mood.chip,
                              )}
                            >
                              {mood.emoji} {mood.label}
                            </span>
                            {entry.source === 'vent' && (
                              <span className="rounded-full bg-terracotta/12 px-2.5 py-1 text-[11px] font-medium text-terracotta-dark dark:text-terracotta-light">
                                From a vent
                              </span>
                            )}
                            <span
                              className="ml-auto text-[11px] text-muted"
                              title={formatTimestamp(entry.createdAt)}
                            >
                              {formatRelativeTime(entry.createdAt)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeEntry(entry.id)}
                              aria-label="Delete this check-in"
                              className="grid h-6 w-6 place-items-center rounded-lg text-muted/60 opacity-0 transition-all hover:bg-terracotta/10 hover:text-terracotta focus-visible:opacity-100 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                            </button>
                          </div>

                          {entry.journal && (
                            <p className="mb-2.5 line-clamp-3 border-l-2 border-sage-500/25 pl-3 text-[13px] italic leading-relaxed text-muted">
                              {entry.journal}
                            </p>
                          )}
                          <p className="text-[13.5px] leading-relaxed">{entry.reframedThought}</p>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                            <span className="font-medium text-sage-600 dark:text-sage-300">
                              Next:
                            </span>{' '}
                            {entry.microAction}
                          </p>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {entries.length > 0 && (
              <div className="border-t border-emerald-900/5 px-5 py-3.5 dark:border-white/10">
                <button
                  type="button"
                  onClick={clearEntries}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-muted transition-colors hover:text-terracotta"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Clear all history
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default HistoryDrawer
