import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useAudio } from '../../context/AudioContext'
import { cn } from '../../lib/utils'

export const TECHNIQUES = [
  {
    id: 'box',
    label: 'Box Breathing',
    rhythm: '4 · 4 · 4 · 4',
    description: 'Steadies a racing mind. Used by people who need to think clearly under pressure.',
    phases: [
      { key: 'inhale', label: 'Inhale', seconds: 4 },
      { key: 'hold', label: 'Hold', seconds: 4 },
      { key: 'exhale', label: 'Exhale', seconds: 4 },
      { key: 'holdOut', label: 'Hold', seconds: 4 },
    ],
  },
  {
    id: '478',
    label: '4-7-8 Relaxing Breath',
    rhythm: '4 · 7 · 8',
    description: 'The long exhale is the active ingredient — it is what tips you toward sleep.',
    phases: [
      { key: 'inhale', label: 'Inhale', seconds: 4 },
      { key: 'hold', label: 'Hold', seconds: 7 },
      { key: 'exhale', label: 'Exhale', seconds: 8 },
    ],
  },
  {
    id: 'coherence',
    label: 'Coherence Breathing',
    rhythm: '5.5 · 5.5',
    description: 'An even, unhurried wave that settles heart-rate variability into balance.',
    phases: [
      { key: 'inhale', label: 'Inhale', seconds: 5.5 },
      { key: 'exhale', label: 'Exhale', seconds: 5.5 },
    ],
  },
]

const PHASE_COPY = {
  inhale: 'Breathe in through your nose',
  hold: 'Hold it gently — no strain',
  exhale: 'Let it go slowly through your mouth',
  holdOut: 'Stay empty for a moment',
}

const SCALE = { inhale: 1, hold: 1, exhale: 0.58, holdOut: 0.58 }
const CHIME_TONE = { inhale: 528, hold: 396, exhale: 432, holdOut: 396 }

export function BreathingBubble({ techniqueId = 'box', onTechniqueChange, compact = false }) {
  const technique = useMemo(
    () => TECHNIQUES.find((t) => t.id === techniqueId) ?? TECHNIQUES[0],
    [techniqueId],
  )

  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remaining, setRemaining] = useState(technique.phases[0].seconds)
  const [cycles, setCycles] = useState(0)

  const { chime, ensureContext } = useAudio()
  const phase = technique.phases[phaseIndex]

  // The countdown lives in refs so a 100ms tick never depends on a re-render
  // landing first; state is only the render mirror of them.
  const phaseRef = useRef(0)
  const remainingRef = useRef(technique.phases[0].seconds)

  const reset = useCallback(() => {
    phaseRef.current = 0
    remainingRef.current = technique.phases[0].seconds
    setRunning(false)
    setPhaseIndex(0)
    setRemaining(technique.phases[0].seconds)
    setCycles(0)
  }, [technique])

  // Switching technique mid-session restarts cleanly.
  useEffect(() => {
    phaseRef.current = 0
    remainingRef.current = technique.phases[0].seconds
    setRunning(false)
    setPhaseIndex(0)
    setRemaining(technique.phases[0].seconds)
    setCycles(0)
  }, [technique])

  useEffect(() => {
    if (!running) return undefined

    // Wall-clock based: a throttled interval (backgrounded tab, low-power mode)
    // then still advances by real elapsed time instead of running slow.
    let phaseEnds = Date.now() + remainingRef.current * 1000

    const id = window.setInterval(() => {
      const left = (phaseEnds - Date.now()) / 1000

      if (left > 0.05) {
        remainingRef.current = left
        setRemaining(left)
        return
      }

      // Catch up across however many phases elapsed while we were throttled.
      let idx = phaseRef.current
      let overshoot = -left
      let completedCycles = 0
      let nextPhase

      do {
        idx = (idx + 1) % technique.phases.length
        if (idx === 0) completedCycles += 1
        nextPhase = technique.phases[idx]
        overshoot -= nextPhase.seconds
      } while (overshoot > 0)

      const remainingInPhase = -overshoot
      phaseRef.current = idx
      remainingRef.current = remainingInPhase
      phaseEnds = Date.now() + remainingInPhase * 1000

      setPhaseIndex(idx)
      setRemaining(remainingInPhase)
      if (completedCycles) setCycles((c) => c + completedCycles)
      chime({ frequency: CHIME_TONE[nextPhase.key] ?? 528, volume: 0.07 })
    }, 100)

    return () => window.clearInterval(id)
  }, [running, technique, chime])

  const start = () => {
    ensureContext() // unlock audio on the same gesture
    setRunning(true)
  }

  const total = phase.seconds
  const progress = 1 - remaining / total

  return (
    <div className="flex flex-col items-center">
      {/* Technique selector */}
      {!compact && (
        <div className="mb-9 grid w-full gap-2 sm:grid-cols-3">
          {TECHNIQUES.map((t) => {
            const active = t.id === technique.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTechniqueChange?.(t.id)}
                className={cn(
                  'group rounded-2xl border p-4 text-left transition-all duration-400 ease-calm',
                  active
                    ? 'border-sage-500/35 bg-sage-500/10 shadow-soft'
                    : 'border-emerald-900/5 bg-white/45 hover:border-sage-500/25 hover:bg-white/70 dark:border-white/8 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]',
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      'text-[14px] font-semibold tracking-[-0.01em]',
                      active && 'text-sage-700 dark:text-sage-100',
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
                    {t.rhythm}
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{t.description}</p>
              </button>
            )
          })}
        </div>
      )}

      {/* The bubble */}
      <div className="relative grid aspect-square w-full max-w-[19rem] place-items-center">
        {/* Ambient halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-moss/40 via-sage-400/25 to-lavender/25 blur-2xl"
          animate={
            running
              ? { scale: SCALE[phase.key] * 1.05, opacity: 0.9 }
              : { scale: 0.85, opacity: 0.45 }
          }
          transition={{ duration: running ? phase.seconds : 1.2, ease: 'easeInOut' }}
        />

        {/* Expanding orb */}
        <motion.div
          className="absolute inset-[8%] rounded-full bg-gradient-to-br from-white/85 to-moss/60 shadow-glow dark:from-sage-700/70 dark:to-sage-900/80"
          animate={running ? { scale: SCALE[phase.key] } : { scale: 0.62 }}
          transition={{ duration: running ? phase.seconds : 1.1, ease: 'easeInOut' }}
        />

        {/* Progress ring */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-sage-500/12"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#6B9080"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={2 * Math.PI * 46 * (1 - (running ? progress : 0))}
            className="transition-[stroke-dashoffset] duration-100 ease-linear"
            opacity={running ? 0.85 : 0}
          />
        </svg>

        {/* Centre text */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Keyed remount, enter-only: the phase word is the whole point of
              this module, so it must never wait on an exit animation. */}
          <motion.span
            key={running ? phase.key + phaseIndex : 'idle'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-[26px] font-semibold tracking-[-0.02em] text-ink dark:text-sage-50"
          >
            {running ? phase.label : 'Ready'}
          </motion.span>
          <span className="mt-1 font-mono text-[13px] tabular-nums text-sage-700/70 dark:text-sage-200/70">
            {running ? `${Math.ceil(remaining)}s` : technique.rhythm}
          </span>
        </div>
      </div>

      {/* Prompt line */}
      <div className="mt-6 h-6 text-center">
        <motion.p
          key={running ? phase.key : 'idle-copy'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-[14px] leading-relaxed text-muted"
        >
          {running ? PHASE_COPY[phase.key] : 'Find a comfortable seat. Start when you are ready.'}
        </motion.p>
      </div>

      {/* Controls */}
      <div className="mt-7 flex items-center gap-2.5">
        <motion.button
          type="button"
          onClick={() => (running ? setRunning(false) : start())}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 rounded-2xl bg-sage-500 px-6 py-3.5 text-[15px] font-medium text-white shadow-soft transition-colors duration-300 hover:bg-sage-600"
        >
          {running ? (
            <Pause className="h-4 w-4" strokeWidth={2.2} fill="currentColor" />
          ) : (
            <Play className="h-4 w-4" strokeWidth={2.2} fill="currentColor" />
          )}
          {running ? 'Pause' : cycles > 0 ? 'Resume' : 'Begin'}
        </motion.button>

        <button
          type="button"
          onClick={reset}
          aria-label="Reset session"
          className="grid h-[46px] w-[46px] place-items-center rounded-2xl bg-ink/5 text-mist transition-colors duration-300 hover:bg-ink/10 dark:bg-white/5 dark:text-sage-200/70 dark:hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>

      <p className="mt-5 text-[12.5px] text-muted">
        <span className="font-mono tabular-nums">{cycles}</span> cycle{cycles === 1 ? '' : 's'}{' '}
        completed
        {cycles >= 4 && <span className="ml-1.5">— that is a real dose. Well done. 🌿</span>}
      </p>
    </div>
  )
}

export default BreathingBubble
