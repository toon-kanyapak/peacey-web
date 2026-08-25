import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Flame, Lock, Sparkles, Wind } from 'lucide-react'
import { transformVentToWisdom } from '../../services/reframingEngine'
import { useApp } from '../../context/AppContext'
import { SectionHeader } from '../ui/Card'
import Button from '../ui/Button'
import BurnAnimation from './BurnAnimation'
import { cn } from '../../lib/utils'

const AFTERGLOW = [
  "It's out of your system. Take a deep breath.",
  'Gone. Nothing was written down, and nothing is coming back.',
  'That was heavy. You are not carrying it anymore.',
]

export function VentBox({ onSendToJournal }) {
  const { toast } = useApp()
  const [text, setText] = useState('')
  const [burning, setBurning] = useState(false)
  const [burnedText, setBurnedText] = useState('')
  const [afterglow, setAfterglow] = useState(null)
  const [wisdom, setWisdom] = useState(null)
  const [transforming, setTransforming] = useState(false)
  const textareaRef = useRef(null)
  const timersRef = useRef([])

  // Clear pending timers if the component unmounts mid-burn.
  useEffect(
    () => () => timersRef.current.forEach((t) => window.clearTimeout(t)),
    [],
  )

  const burn = () => {
    if (!text.trim()) {
      toast('Nothing to burn yet — let it out first.', 'calm')
      textareaRef.current?.focus()
      return
    }
    // The text leaves state immediately; the animation only plays a ghost of it.
    setBurnedText(text)
    setText('')
    setWisdom(null)
    setBurning(true)

    timersRef.current.push(
      window.setTimeout(() => {
        setBurning(false)
        setBurnedText('')
        setAfterglow(AFTERGLOW[Math.floor(Math.random() * AFTERGLOW.length)])
      }, 2300),
    )
    timersRef.current.push(window.setTimeout(() => setAfterglow(null), 8000))
  }

  const transform = async () => {
    if (!text.trim()) {
      toast('Write it out first, then we can find what is underneath.', 'calm')
      textareaRef.current?.focus()
      return
    }
    setTransforming(true)
    setWisdom(null)
    const result = await transformVentToWisdom(text)
    setWisdom(result)
    setTransforming(false)
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Module 03"
        icon={Flame}
        title="Burn after writing"
        description="Say the unfiltered version. Nothing here is saved, synced, or read back to you — unless you ask it to be."
      />

      {/* Dark focus-mode card */}
      <div className="relative overflow-hidden rounded-3xl border border-sage-900/40 bg-[#171E1A] shadow-lift dark:border-white/[0.06]">
        {/* Slow drifting atmosphere */}
        <div
          className="pointer-events-none absolute -inset-[30%] animate-drift-slow opacity-45"
          style={{
            background:
              'radial-gradient(45% 40% at 25% 30%, rgba(107,144,128,0.32), transparent 70%), radial-gradient(40% 35% at 78% 70%, rgba(224,122,95,0.22), transparent 70%)',
          }}
          aria-hidden
        />

        <div className="relative p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11.5px] font-medium text-sage-200/80">
              <Lock className="h-3.5 w-3.5" strokeWidth={2.2} />
              Never stored, never sent
            </span>
            <span className="text-[11.5px] text-sage-200/45">
              No autosave. Closing this tab erases it too.
            </span>
          </div>

          <div className="relative">
            <BurnAnimation active={burning} text={burnedText} />

            <AnimatePresence mode="wait">
              {afterglow ? (
                <motion.div
                  key="afterglow"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[15rem] flex-col items-center justify-center gap-5 text-center"
                >
                  <span className="grid h-16 w-16 animate-pulse-soft place-items-center rounded-full bg-sage-500/15 text-sage-300">
                    <Wind className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <p className="max-w-sm text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-sage-50">
                    {afterglow}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAfterglow(null)
                      textareaRef.current?.focus()
                    }}
                    className="text-[13px] font-medium text-sage-300/70 underline-offset-4 transition-colors hover:text-sage-200 hover:underline"
                  >
                    Write something else
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: burning ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <label htmlFor="vent" className="sr-only">
                    Vent freely
                  </label>
                  <textarea
                    id="vent"
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={9}
                    spellCheck={false}
                    placeholder={
                      'Type the version you would never send.\n\nNo punctuation, no fairness, no editing yourself. Nobody is reading this — not even the app.'
                    }
                    className={cn(
                      'w-full resize-none rounded-2xl border border-white/[0.07] bg-black/25 p-5',
                      'font-mono text-[14px] leading-[1.85] text-sage-50 outline-none',
                      'placeholder:text-sage-200/25 transition-all duration-400 ease-calm',
                      'focus:border-terracotta/35 focus:bg-black/35 focus:ring-4 focus:ring-terracotta/10',
                    )}
                  />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-[11.5px] text-sage-200/35">
                      {text.trim() ? `${text.trim().split(/\s+/).length} words, going nowhere` : ' '}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!afterglow && (
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button
                variant="release"
                size="lg"
                icon={Flame}
                onClick={burn}
                disabled={burning}
                className="flex-1"
              >
                Burn &amp; let it go
              </Button>
              <Button
                size="lg"
                icon={Sparkles}
                variant="secondary"
                onClick={transform}
                loading={transforming}
                disabled={burning}
                className="flex-1 !bg-white/[0.07] !text-sage-100 hover:!bg-white/[0.12]"
              >
                {transforming ? 'Looking underneath…' : 'Transform to wisdom'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Wisdom output */}
      <AnimatePresence>
        {wisdom && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="haven-surface mt-4 rounded-3xl p-5 shadow-soft sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lavender/20 px-3 py-1.5 text-[11.5px] font-medium text-[#8a6f4e] dark:text-lavender">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                {wisdom.heading}
              </span>
              {wisdom.patterns.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full bg-ink/[0.05] px-2.5 py-1.5 text-[11.5px] font-medium text-muted dark:bg-white/5"
                >
                  {p.label}
                </span>
              ))}
            </div>

            <p className="text-[16px] leading-relaxed tracking-[-0.01em]">
              What you actually needed here was{' '}
              <span className="font-semibold text-sage-700 dark:text-sage-200">
                {wisdom.unmetNeed}
              </span>
              .
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-moss/12 p-4 dark:bg-moss/[0.08]">
                <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-sage-700 dark:text-sage-300">
                  Worth keeping
                </p>
                <p className="text-[13.5px] leading-relaxed">{wisdom.keep}</p>
              </div>
              <div className="rounded-2xl bg-terracotta/10 p-4">
                <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-terracotta-dark dark:text-terracotta-light">
                  Safe to put down
                </p>
                <p className="text-[13.5px] leading-relaxed">{wisdom.release}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                icon={ArrowRight}
                onClick={() => {
                  onSendToJournal?.(text)
                  toast('Moved to your check-in — reframe it there.', 'success')
                }}
              >
                Take this to my check-in
              </Button>
              <Button variant="release" icon={Flame} onClick={burn}>
                Now burn the original
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VentBox
