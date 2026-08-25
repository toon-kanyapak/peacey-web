import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const AFFIRMATIONS = [
  "You don't have to attend every argument you're invited to.",
  'Rest is not a reward for finishing. It is part of how the work gets done.',
  '"No" is a complete sentence. Everything after it is optional.',
  'You are allowed to change your mind about what you agreed to.',
  'Someone else’s urgency is not automatically your emergency.',
  'You can be understanding and still be unavailable.',
  'The version of you that needs a break is still the real you.',
  'Peace is not something you earn. It is something you protect.',
  'You are not behind. You are on a different timeline.',
  'Being kind to yourself is not the same as letting yourself off the hook.',
]

const ROTATION_MS = 7000

export function HeaderAffirmation() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * AFFIRMATIONS.length))
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % AFFIRMATIONS.length),
      ROTATION_MS,
    )
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <div
      className="relative flex h-9 min-w-0 flex-1 items-center gap-2.5 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
      aria-label="Daily affirmation"
    >
      <Sparkles
        className="h-3.5 w-3.5 shrink-0 animate-floaty text-lavender"
        strokeWidth={2}
        aria-hidden
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="truncate text-[13px] font-medium italic tracking-[-0.01em] text-muted"
        >
          {AFFIRMATIONS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default HeaderAffirmation
