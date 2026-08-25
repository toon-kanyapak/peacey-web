import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { History, NotebookPen, Save, Sparkles } from 'lucide-react'
import { simulateAiReframing } from '../../services/reframingEngine'
import { useApp } from '../../context/AppContext'
import Card, { SectionHeader } from '../ui/Card'
import Button from '../ui/Button'
import MoodSelector from './MoodSelector'
import ReframeCard from './ReframeCard'
import HistoryDrawer from './HistoryDrawer'

const PROMPTS = [
  'What is occupying your mind right now?',
  'What has been sitting on your chest today?',
  'What would you say if nobody was going to react to it?',
  'What are you carrying that is not actually yours?',
]

/** A soft, on-brand confetti burst — sage leaves rather than a party popper. */
const celebrate = () => {
  confetti({
    particleCount: 42,
    spread: 62,
    startVelocity: 26,
    gravity: 0.7,
    scalar: 0.85,
    ticks: 160,
    origin: { y: 0.7 },
    colors: ['#6B9080', '#A4C3B2', '#C6AC8F', '#DDEAE3'],
    disableForReducedMotion: true,
  })
}

export function DailyCheckIn({ seedText, onSeedConsumed }) {
  const { addEntry, entries, toast } = useApp()
  const [mood, setMood] = useState('overwhelmed')
  const [journal, setJournal] = useState('')
  const [reframe, setReframe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const textareaRef = useRef(null)

  // Text handed over from the Vent Box lands here, ready to reframe.
  useEffect(() => {
    if (!seedText) return
    setJournal(seedText)
    setReframe(null)
    setSaved(false)
    textareaRef.current?.focus()
    onSeedConsumed?.()
  }, [seedText, onSeedConsumed])

  const run = async () => {
    if (!journal.trim()) {
      toast('Write a line or two first — even a messy one.', 'calm')
      textareaRef.current?.focus()
      return
    }
    setLoading(true)
    setReframe(null)
    setSaved(false)
    const result = await simulateAiReframing(journal, mood)
    setReframe(result)
    setLoading(false)
  }

  const save = () => {
    if (!reframe || saved) return
    addEntry({
      mood,
      journal: journal.trim(),
      validation: reframe.validation,
      reframedThought: reframe.reframedThought,
      microAction: reframe.microAction,
      patterns: reframe.patterns,
    })
    setSaved(true)
    celebrate()
    toast('Saved to your check-ins. 🌿', 'success')
  }

  const startFresh = () => {
    setJournal('')
    setReframe(null)
    setSaved(false)
    textareaRef.current?.focus()
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Module 02"
        icon={NotebookPen}
        title="Daily check-in"
        description="Name the feeling, empty your head onto the page, and get it handed back to you in a shape you can actually carry."
        action={
          <Button variant="outline" icon={History} onClick={() => setHistoryOpen(true)}>
            History
            {entries.length > 0 && (
              <span className="ml-0.5 rounded-full bg-sage-500/15 px-2 py-0.5 font-mono text-[11px] tabular-nums text-sage-700 dark:text-sage-200">
                {entries.length}
              </span>
            )}
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Card className="p-5 sm:p-6">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            How are you arriving today?
          </p>
          <MoodSelector value={mood} onChange={setMood} />

          <label
            htmlFor="journal"
            className="mb-3 mt-6 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
          >
            {prompt}
          </label>
          <textarea
            id="journal"
            ref={textareaRef}
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            rows={7}
            placeholder="No structure needed. Half-sentences are fine — this is just for getting it out of your head."
            className="haven-input resize-none leading-[1.75]"
          />
          <div className="mt-1.5 flex items-center justify-between px-1">
            <span className="text-[11.5px] text-muted">Stays in this browser, always</span>
            <span className="font-mono text-[11px] tabular-nums text-muted/70">
              {journal.trim() ? journal.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={run} loading={loading} icon={Sparkles} size="lg" className="flex-1">
              {loading ? 'Sitting with it…' : 'Reframe my perspective'}
            </Button>
            {(journal || reframe) && (
              <Button variant="quiet" size="lg" onClick={startFresh}>
                Clear
              </Button>
            )}
          </div>
        </Card>

        <Card className="flex flex-col p-5 sm:p-6">
          {/* Enter-only, for the same reason as the Boundary Coach panel. */}
          <>
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-1 flex-col items-center justify-center gap-5 py-16"
              >
                <span className="h-14 w-14 animate-pulse-soft rounded-full bg-gradient-to-br from-moss to-sage-500/60" />
                <p className="text-[13.5px] text-muted">Reading it back to you gently…</p>
              </motion.div>
            ) : reframe ? (
              <div key="result" className="flex flex-1 flex-col">
                <ReframeCard reframe={reframe} saved={saved} />
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button onClick={save} icon={Save} disabled={saved} variant={saved ? 'secondary' : 'primary'}>
                    {saved ? 'Saved to history' : 'Save this check-in'}
                  </Button>
                  <Button variant="outline" onClick={run} loading={loading}>
                    Reframe again
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-1 flex-col items-center justify-center gap-4 py-14 text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sage-500/10 text-sage-500">
                  <NotebookPen className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <div className="max-w-[19rem]">
                  <p className="text-[15px] font-medium">Three steps, no advice-giving</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                    You will get your feeling validated, the thought turned over into something
                    calmer, and exactly one small action that is actually within your control.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        </Card>
      </div>

      <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  )
}

export default DailyCheckIn
