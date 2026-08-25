import { motion } from 'framer-motion'
import { MOODS } from '../../services/reframingEngine'
import { cn } from '../../lib/utils'

export function MoodSelector({ value, onChange }) {
  return (
    <div
      className="grid grid-cols-5 gap-1.5 sm:gap-2"
      role="radiogroup"
      aria-label="How are you feeling?"
    >
      {MOODS.map((mood) => {
        const active = mood.id === value
        return (
          <motion.button
            key={mood.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(mood.id)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border px-1 py-3.5 transition-colors duration-400 ease-calm sm:py-4',
              active
                ? 'border-sage-500/35 bg-sage-500/10 shadow-soft'
                : 'border-emerald-900/5 bg-white/40 hover:bg-white/70 dark:border-white/8 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]',
            )}
          >
            <motion.span
              className="text-[22px] leading-none sm:text-[26px]"
              animate={
                active
                  ? { scale: [1, 1.18, 1], rotate: [0, -6, 6, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {mood.emoji}
            </motion.span>
            <span
              className={cn(
                'text-[11.5px] font-medium tracking-[-0.01em] sm:text-[12.5px]',
                active ? 'text-sage-700 dark:text-sage-100' : 'text-muted',
              )}
            >
              {mood.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default MoodSelector
