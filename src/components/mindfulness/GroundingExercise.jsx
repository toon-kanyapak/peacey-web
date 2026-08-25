import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Ear, Eye, Hand, RotateCcw, Utensils, Wind } from 'lucide-react'
import { cn } from '../../lib/utils'

const STEPS = [
  {
    id: 'see',
    count: 5,
    sense: 'you can see',
    icon: Eye,
    hint: 'Let your eyes land on ordinary things — a door handle, a crack in the paint, the colour of your sleeve.',
    placeholder: ['Something on the wall', 'A colour nearby', 'Something small', 'Something far away', 'Something you never notice'],
  },
  {
    id: 'touch',
    count: 4,
    sense: 'you can feel',
    icon: Hand,
    hint: 'Press your feet into the floor. Notice temperature, texture, weight.',
    placeholder: ['The floor under you', 'Fabric on your skin', 'The air temperature', 'Something with texture'],
  },
  {
    id: 'hear',
    count: 3,
    sense: 'you can hear',
    icon: Ear,
    hint: 'Listen past the obvious sound — there is usually something underneath it.',
    placeholder: ['The nearest sound', 'A distant sound', 'The quietest sound'],
  },
  {
    id: 'smell',
    count: 2,
    sense: 'you can smell',
    icon: Wind,
    hint: 'If nothing is obvious, name two smells you like. That counts.',
    placeholder: ['Something in the room', 'A smell you like'],
  },
  {
    id: 'taste',
    count: 1,
    sense: 'you can taste',
    icon: Utensils,
    hint: 'Even just the taste of your own mouth, or the last thing you drank.',
    placeholder: ['Anything at all'],
  },
]

export function GroundingExercise({ dense = false }) {
  const [open, setOpen] = useState('see')
  const [checked, setChecked] = useState({})

  const totalItems = useMemo(() => STEPS.reduce((sum, s) => sum + s.count, 0), [])
  const doneCount = Object.values(checked).filter(Boolean).length
  const complete = doneCount === totalItems

  const toggle = (stepId, index) => {
    const key = `${stepId}-${index}`
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const stepDone = (step) =>
    Array.from({ length: step.count }).every((_, i) => checked[`${step.id}-${i}`])

  return (
    <div>
      {/* Progress */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sage-500/12">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-moss to-sage-500"
            animate={{ width: `${(doneCount / totalItems) * 100}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
          />
        </div>
        <span className="shrink-0 font-mono text-[12px] tabular-nums text-muted">
          {doneCount}/{totalItems}
        </span>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={() => setChecked({})}
            aria-label="Reset checklist"
            className="grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div className={cn('flex flex-col gap-2', dense && 'gap-1.5')}>
        {STEPS.map((step) => {
          const Icon = step.icon
          const isOpen = open === step.id
          const finished = stepDone(step)

          return (
            <div
              key={step.id}
              className={cn(
                'overflow-hidden rounded-2xl border transition-colors duration-400 ease-calm',
                isOpen
                  ? 'border-sage-500/25 bg-white/60 dark:bg-white/[0.05]'
                  : 'border-emerald-900/5 bg-white/35 dark:border-white/8 dark:bg-white/[0.02]',
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : step.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors duration-400',
                    finished
                      ? 'bg-sage-500 text-white'
                      : 'bg-sage-500/10 text-sage-600 dark:text-sage-300',
                  )}
                >
                  {finished ? (
                    <Check className="h-4 w-4" strokeWidth={2.6} />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium tracking-[-0.01em]">
                    <span className="font-mono text-sage-600 dark:text-sage-300">{step.count}</span>{' '}
                    things {step.sense}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted transition-transform duration-400 ease-calm',
                    isOpen && 'rotate-180',
                  )}
                  strokeWidth={2.2}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-4 pb-4">
                      <p className="mb-3 text-[12.5px] leading-relaxed text-muted">{step.hint}</p>
                      <div className="flex flex-col gap-1.5">
                        {Array.from({ length: step.count }).map((_, i) => {
                          const key = `${step.id}-${i}`
                          const isChecked = Boolean(checked[key])
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => toggle(step.id, i)}
                              aria-pressed={isChecked}
                              className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] transition-all duration-300 ease-calm',
                                isChecked
                                  ? 'bg-sage-500/10 text-muted line-through decoration-sage-500/40'
                                  : 'bg-ink/[0.03] hover:bg-ink/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]',
                              )}
                            >
                              <span
                                className={cn(
                                  'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border-2 transition-colors duration-300',
                                  isChecked
                                    ? 'border-sage-500 bg-sage-500 text-white'
                                    : 'border-sage-500/30',
                                )}
                              >
                                {isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
                              </span>
                              {step.placeholder[i]}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {complete && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-2xl bg-moss/20 px-4 py-3.5 text-center text-[13.5px] leading-relaxed text-sage-700 dark:text-sage-100"
          >
            You are here, in this room, in this body. 🌿 Whatever your mind was doing a minute ago,
            it was not happening right now.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GroundingExercise
