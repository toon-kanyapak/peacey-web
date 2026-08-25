import { AnimatePresence, motion } from 'framer-motion'
import { Check, Leaf, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

const TONES = {
  calm: { icon: Leaf, accent: 'text-sage-600 dark:text-sage-300', ring: 'ring-sage-500/20' },
  success: { icon: Check, accent: 'text-sage-600 dark:text-sage-300', ring: 'ring-sage-500/25' },
  release: { icon: Leaf, accent: 'text-terracotta', ring: 'ring-terracotta/25' },
}

export function ToastViewport() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2.5 px-4 sm:bottom-7">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const tone = TONES[toast.tone] ?? TONES.calm
          const Icon = tone.icon
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={cn(
                'pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-2xl px-4 py-3',
                'haven-surface shadow-lift ring-1',
                tone.ring,
              )}
            >
              <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sage-500/10', tone.accent)}>
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <p className="text-[14px] font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="ml-1 rounded-lg p-1 text-muted transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastViewport
