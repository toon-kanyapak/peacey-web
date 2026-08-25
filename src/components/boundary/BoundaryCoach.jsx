import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessagesSquare, Sparkles } from 'lucide-react'
import { SCENARIOS, TONES, generateBoundaryScript } from '../../services/boundaryScenarios'
import Card, { SectionHeader } from '../ui/Card'
import Button from '../ui/Button'
import ScriptResultCard from './ScriptResultCard'
import { cn } from '../../lib/utils'

const MAX_CHARS = 500

function ThinkingState() {
  const lines = [
    'Reading the situation…',
    'Choosing words that hold the line…',
    'Softening the edges…',
  ]
  return (
    <div className="flex flex-col gap-3 py-2">
      {lines.map((line, i) => (
        <div
          key={line}
          style={{ animationDelay: `${i * 0.45}s` }}
          className="flex animate-think-pulse items-center gap-2.5 text-[13.5px] text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
          {line}
        </div>
      ))}
      <div className="mt-2 flex flex-col gap-2.5">
        {[100, 88, 94, 60].map((w, i) => (
          <div
            key={i}
            style={{ width: `${w}%` }}
            className="h-3 rounded-full bg-gradient-to-r from-sage-500/10 via-sage-500/20 to-sage-500/10 bg-[length:200%_100%] animate-shimmer"
          />
        ))}
      </div>
    </div>
  )
}

export function BoundaryCoach() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id)
  const [customText, setCustomText] = useState('')
  const [tone, setTone] = useState('gentle')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const usingCustom = customText.trim().length > 8

  const generate = async () => {
    setLoading(true)
    setResult(null)
    const script = await generateBoundaryScript({ scenarioId, customText, tone })
    setResult(script)
    setLoading(false)
  }

  const regenerate = async () => {
    setLoading(true)
    const next = await generateBoundaryScript({ scenarioId, customText, tone })
    setResult({ ...next, id: `${Date.now()}` })
    setLoading(false)
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Module 01"
        icon={MessagesSquare}
        title="Boundary Coach"
        description="Tell it what you are dreading saying. It will hand you the words — firm enough to hold, kind enough to send."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: inputs */}
        <Card className="p-5 sm:p-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            What is the situation?
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {SCENARIOS.map((s) => {
              const active = !usingCustom && s.id === scenarioId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setScenarioId(s.id)
                    setCustomText('')
                  }}
                  className={cn(
                    'flex items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-400 ease-calm',
                    active
                      ? 'border-sage-500/35 bg-sage-500/10 shadow-soft'
                      : 'border-emerald-900/5 bg-white/40 hover:border-sage-500/20 hover:bg-white/70 dark:border-white/8 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]',
                    usingCustom && 'opacity-50',
                  )}
                >
                  <span className="text-base leading-none">{s.emoji}</span>
                  <span
                    className={cn(
                      'text-[13.5px] font-medium leading-snug tracking-[-0.01em]',
                      active && 'text-sage-700 dark:text-sage-100',
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-emerald-900/5 dark:bg-white/8" />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              or
            </span>
            <span className="h-px flex-1 bg-emerald-900/5 dark:bg-white/8" />
          </div>

          <label htmlFor="boundary-custom" className="sr-only">
            Describe your exact situation
          </label>
          <textarea
            id="boundary-custom"
            value={customText}
            maxLength={MAX_CHARS}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            placeholder="Or describe your exact situation… e.g. “My manager keeps messaging me on Sunday nights about Monday deadlines.”"
            className="haven-input resize-none"
          />
          <div className="mt-1.5 flex items-center justify-between px-1">
            <span className="text-[11.5px] text-muted">
              {usingCustom ? 'Using your description' : 'Optional — presets work fine too'}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-muted/70">
              {customText.length}/{MAX_CHARS}
            </span>
          </div>

          <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            How should it sound?
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TONES.map((t) => {
              const active = t.id === tone
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={cn(
                    'rounded-2xl border p-3.5 text-left transition-all duration-400 ease-calm',
                    active
                      ? 'border-sage-500/35 bg-sage-500/10 shadow-soft'
                      : 'border-emerald-900/5 bg-white/40 hover:border-sage-500/20 hover:bg-white/70 dark:border-white/8 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]',
                  )}
                >
                  <span className="mb-1 block text-base leading-none">{t.emoji}</span>
                  <span
                    className={cn(
                      'block text-[13px] font-medium leading-snug tracking-[-0.01em]',
                      active && 'text-sage-700 dark:text-sage-100',
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="mt-1 block text-[11.5px] leading-snug text-muted">{t.hint}</span>
                </button>
              )
            })}
          </div>

          <Button
            onClick={generate}
            loading={loading}
            icon={Sparkles}
            size="lg"
            className="mt-6 w-full"
          >
            {loading ? 'Finding the words…' : 'Write my boundary'}
          </Button>
        </Card>

        {/* Right: output */}
        <Card className="flex flex-col p-5 sm:p-6">
          {/* Enter-only: the panel must never depend on an exit animation
              completing before the next state can render. */}
          <>
            {loading && !result ? (
              <div key="loading">
                <ThinkingState />
              </div>
            ) : result ? (
              <ScriptResultCard
                key={result.id}
                result={result}
                onRegenerate={regenerate}
                regenerating={loading}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-1 flex-col items-center justify-center gap-4 py-14 text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sage-500/10 text-sage-500">
                  <MessagesSquare className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <div className="max-w-[19rem]">
                  <p className="text-[15px] font-medium">Your script will appear here</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                    Pick a situation and a tone, and you will get something you can send as-is —
                    plus the reason it lands.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        </Card>
      </div>
    </div>
  )
}

export default BoundaryCoach
