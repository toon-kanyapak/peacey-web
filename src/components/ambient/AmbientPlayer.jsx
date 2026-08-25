import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '../../context/AudioContext'
import { SOUNDSCAPES, getSoundscape } from './soundGenerators'
import { cn } from '../../lib/utils'

/**
 * Three bars that dance while audio is playing. Deliberately a CSS animation:
 * a looping framer-motion animation inside an <AnimatePresence> subtree stops
 * that subtree from ever completing its exit.
 */
function SoundBars({ active }) {
  return (
    <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'w-[2.5px] rounded-full bg-current transition-[height] duration-300',
            active && 'animate-sound-bar',
          )}
          style={{ height: '30%', animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  )
}

export function AmbientPlayer({ compact = false }) {
  const { isPlaying, toggle, preset, selectPreset, volume, setVolume } = useAudio()
  const [open, setOpen] = useState(false)
  const current = getSoundscape(preset)

  return (
    <div className="relative flex items-center gap-1.5">
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.92 }}
        aria-label={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
        aria-pressed={isPlaying}
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl transition-colors duration-300 ease-calm',
          isPlaying
            ? 'bg-sage-500 text-white shadow-soft'
            : 'bg-sage-500/10 text-sage-600 hover:bg-sage-500/20 dark:text-sage-300',
        )}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" strokeWidth={2.2} fill="currentColor" />
        ) : (
          <Play className="h-4 w-4 translate-x-[1px]" strokeWidth={2.2} fill="currentColor" />
        )}
      </motion.button>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Choose ambient soundscape"
        className={cn(
          'flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] font-medium',
          'text-mist transition-colors duration-300 hover:bg-sage-500/10 dark:text-sage-200/80',
          compact && 'px-2',
        )}
      >
        <span className={cn('text-sage-600 dark:text-sage-300')}>
          <SoundBars active={isPlaying} />
        </span>
        {!compact && <span className="hidden max-w-[9rem] truncate lg:inline">{current.label}</span>}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')}
          strokeWidth={2.2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="haven-surface absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[19rem] rounded-2xl p-2.5 shadow-lift"
            >
              <p className="px-2.5 pb-2 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
                Ambient soundscape
              </p>

              <div className="flex flex-col gap-0.5">
                {SOUNDSCAPES.map((scape) => {
                  const active = scape.id === preset
                  return (
                    <button
                      key={scape.id}
                      type="button"
                      onClick={() => selectPreset(scape.id)}
                      className={cn(
                        'flex items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors duration-200',
                        active
                          ? 'bg-sage-500/12'
                          : 'hover:bg-ink/[0.04] dark:hover:bg-white/[0.05]',
                      )}
                    >
                      <span className="mt-[1px] text-base leading-none">{scape.emoji}</span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-[13.5px] font-medium leading-snug',
                            active && 'text-sage-700 dark:text-sage-200',
                          )}
                        >
                          {scape.label}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">
                          {scape.description}
                        </span>
                      </span>
                      {active && isPlaying && (
                        <span className="mt-1 text-sage-600 dark:text-sage-300">
                          <SoundBars active />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-2 flex items-center gap-3 border-t border-emerald-900/5 px-2.5 pb-1 pt-3 dark:border-white/10">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
                ) : (
                  <Volume2 className="h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
                )}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="Ambient volume"
                  className="haven-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sage-500/15 accent-sage-500"
                  style={{
                    background: `linear-gradient(to right, #6B9080 ${volume * 100}%, rgba(107,144,128,0.15) ${volume * 100}%)`,
                  }}
                />
                <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted">
                  {Math.round(volume * 100)}
                </span>
              </div>

              <p className="px-2.5 pb-1 pt-2 text-[10.5px] leading-relaxed text-muted/80">
                Generated live in your browser with the Web Audio API — no files, no network.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AmbientPlayer
