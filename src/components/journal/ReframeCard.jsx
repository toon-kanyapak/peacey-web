import { motion } from 'framer-motion'
import { CircleCheck, Footprints, HeartHandshake, RefreshCcwDot } from 'lucide-react'
import { getMood } from '../../services/reframingEngine'
import { cn } from '../../lib/utils'

const BLOCKS = [
  {
    key: 'validation',
    label: 'Acknowledge & validate',
    icon: HeartHandshake,
    accent: 'bg-moss/15 text-sage-700 dark:text-sage-200',
    dot: 'bg-moss/35',
  },
  {
    key: 'reframedThought',
    label: 'A calmer way to hold it',
    icon: RefreshCcwDot,
    accent: 'bg-sage-500/10 text-sage-700 dark:text-sage-200',
    dot: 'bg-sage-500/25',
  },
  {
    key: 'microAction',
    label: 'One small thing you control',
    icon: Footprints,
    accent: 'bg-lavender/15 text-[#8a6f4e] dark:text-lavender',
    dot: 'bg-lavender/35',
  },
]

export function ReframeCard({ reframe, saved }) {
  const mood = getMood(reframe.mood)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3.5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full px-3 py-1.5 text-[11.5px] font-medium', mood.chip)}>
          {mood.emoji} {mood.label}
        </span>
        {reframe.patterns.map((p) => (
          <span
            key={p.id}
            title="A thinking pattern detected in what you wrote"
            className="rounded-full bg-ink/[0.05] px-2.5 py-1.5 text-[11.5px] font-medium text-muted dark:bg-white/5"
          >
            {p.label}
          </span>
        ))}
        {saved && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] font-medium text-sage-600 dark:text-sage-300">
            <CircleCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
            Saved
          </span>
        )}
      </div>

      {BLOCKS.map((block, i) => {
        const Icon = block.icon
        return (
          <motion.div
            key={block.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-3.5 rounded-2xl bg-white/60 p-4 dark:bg-white/[0.04]"
          >
            <span className={cn('absolute inset-y-4 left-0 w-[3px] rounded-full', block.dot)} />
            <span className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl', block.accent)}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                {i + 1} — {block.label}
              </p>
              <p className="text-[14.5px] leading-[1.7] tracking-[-0.005em]">{reframe[block.key]}</p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default ReframeCard
