import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Lightbulb, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'
import { cn } from '../../lib/utils'

/** Types text out character-by-character so generation feels considered. */
function useTypewriter(text, { speed = 12, enabled = true } = {}) {
  const [shown, setShown] = useState(enabled ? '' : text)
  const [done, setDone] = useState(!enabled)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      setShown(text)
      setDone(true)
      return undefined
    }
    setShown('')
    setDone(false)
    let i = 0
    const step = () => {
      // A few characters per tick keeps long scripts from dragging.
      i = Math.min(text.length, i + 2)
      setShown(text.slice(0, i))
      if (i >= text.length) {
        setDone(true)
        return
      }
      frameRef.current = window.setTimeout(step, speed)
    }
    frameRef.current = window.setTimeout(step, 220)
    return () => window.clearTimeout(frameRef.current)
  }, [text, speed, enabled])

  const skip = () => {
    window.clearTimeout(frameRef.current)
    setShown(text)
    setDone(true)
  }

  return { shown, done, skip }
}

export function ScriptResultCard({ result, onRegenerate, regenerating }) {
  const { toast } = useApp()
  const [copied, setCopied] = useState(false)
  const { shown, done, skip } = useTypewriter(result.script, { enabled: true })

  useEffect(() => setCopied(false), [result.id])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.script)
    } catch {
      // Clipboard API blocked (insecure context / permissions) — fall back.
      const area = document.createElement('textarea')
      area.value = result.script
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      try {
        document.execCommand('copy')
      } catch {
        toast('Could not copy — select the text manually.', 'release')
        document.body.removeChild(area)
        return
      }
      document.body.removeChild(area)
    }
    setCopied(true)
    toast('Copied. Send it when you are ready.', 'success')
    window.setTimeout(() => setCopied(false), 2400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Matched scenario chip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-500/12 px-3 py-1.5 text-[11.5px] font-medium text-sage-700 dark:text-sage-200">
          <span>{result.emoji}</span>
          {result.scenarioLabel}
        </span>
        {result.matchedFromCustom && (
          <span className="rounded-full bg-lavender/20 px-3 py-1.5 text-[11.5px] font-medium text-[#8a6f4e] dark:text-lavender">
            Matched from your description
          </span>
        )}
        {result.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-ink/[0.05] px-2.5 py-1.5 text-[11.5px] font-medium text-muted dark:bg-white/5"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-[13px] italic text-muted">{result.opener}</p>

      {/* The script callout */}
      <div
        onClick={!done ? skip : undefined}
        className={cn(
          'relative overflow-hidden rounded-2xl border-l-[3px] border-sage-500 bg-white/70 p-5 dark:bg-white/[0.05]',
          !done && 'cursor-pointer',
        )}
      >
        <p className="whitespace-pre-wrap text-[15.5px] leading-[1.75] tracking-[-0.005em]">
          {shown}
          {!done && (
            <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-blink bg-sage-500" />
          )}
        </p>
        {!done && (
          <span className="mt-3 block text-[11px] text-muted/70">Click to reveal it all</span>
        )}
      </div>

      {/* Why this works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0.35 }}
        transition={{ duration: 0.5 }}
        className="flex gap-3 rounded-2xl bg-moss/12 p-4 dark:bg-moss/[0.08]"
      >
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-moss/30 text-sage-700 dark:text-sage-200">
          <Lightbulb className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-700 dark:text-sage-300">
            Why this works
          </p>
          <p className="text-[13.5px] leading-relaxed text-muted">{result.why}</p>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={copy} icon={copied ? Check : Copy} variant={copied ? 'secondary' : 'primary'}>
          {copied ? 'Copied' : 'Copy to clipboard'}
        </Button>
        <Button onClick={onRegenerate} icon={RefreshCw} variant="outline" loading={regenerating}>
          Try another wording
        </Button>
      </div>
    </motion.div>
  )
}

export default ScriptResultCard
