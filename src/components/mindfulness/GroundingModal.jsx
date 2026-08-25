import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import BreathingBubble from './BreathingBubble'
import GroundingExercise from './GroundingExercise'
import { cn } from '../../lib/utils'

const VIEWS = [
  { id: 'breathe', label: 'Breathe' },
  { id: 'ground', label: '5-4-3-2-1' },
]

/** The "Instant Grounding" emergency panel from the top bar. */
export function GroundingModal({ open, onClose }) {
  const [view, setView] = useState('breathe')
  const [technique, setTechnique] = useState('478')

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
        <div className="fixed inset-0 z-[65] grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/35 backdrop-blur-md dark:bg-black/60"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Instant grounding"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="haven-surface relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-4xl p-5 shadow-lift sm:p-7"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-sage-600 dark:text-sage-300">
                  Instant grounding
                </p>
                <h2 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.02em]">
                  You are okay. Let&rsquo;s slow this down.
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-muted transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>

            <div className="mb-6 flex gap-1 rounded-2xl bg-ink/[0.04] p-1 dark:bg-white/5">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={cn(
                    'relative flex-1 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-300',
                    view === v.id ? 'text-sage-700 dark:text-sage-100' : 'text-muted',
                  )}
                >
                  {view === v.id && (
                    <motion.span
                      layoutId="grounding-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-xl bg-white/80 shadow-soft dark:bg-white/10"
                    />
                  )}
                  <span className="relative">{v.label}</span>
                </button>
              ))}
            </div>

            {view === 'breathe' ? (
              <>
                <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                  {[
                    { id: '478', label: '4-7-8' },
                    { id: 'box', label: 'Box 4·4·4·4' },
                    { id: 'coherence', label: 'Coherence' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTechnique(t.id)}
                      className={cn(
                        'rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors duration-300',
                        technique === t.id
                          ? 'bg-sage-500/15 text-sage-700 dark:text-sage-100'
                          : 'text-muted hover:bg-ink/5 dark:hover:bg-white/5',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <BreathingBubble techniqueId={technique} compact />
              </>
            ) : (
              <GroundingExercise dense />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default GroundingModal
