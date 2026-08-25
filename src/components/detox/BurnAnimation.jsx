import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const PARTICLE_COUNT = 34

/**
 * Dissolve overlay: the words break into embers that drift upward and fade.
 * Purely visual — the text itself is already gone from state by the time
 * this plays.
 */
export function BurnAnimation({ active, text, onComplete }) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 30 + Math.random() * 55,
        size: 3 + Math.random() * 7,
        drift: (Math.random() - 0.5) * 90,
        rise: 110 + Math.random() * 190,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.1,
        hue: ['#E07A5F', '#EDA791', '#C6AC8F', '#A4C3B2'][i % 4],
      })),
    // Re-roll the particle field for each burn.
    [active], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const words = useMemo(() => (text || '').split(/(\s+)/).slice(0, 160), [text])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-3xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ghost of the text, disintegrating word by word */}
          <div className="absolute inset-0 p-6 sm:p-7">
            <p className="font-mono text-[14px] leading-[1.85] text-sage-100/80">
              {words.map((word, i) =>
                word.trim() === '' ? (
                  <span key={i}>{word}</span>
                ) : (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    animate={{
                      opacity: 0,
                      y: -18 - Math.random() * 26,
                      x: (Math.random() - 0.5) * 22,
                      filter: 'blur(7px)',
                      scale: 0.85,
                    }}
                    transition={{
                      duration: 0.9 + Math.random() * 0.5,
                      delay: Math.min(1.1, i * 0.012 + Math.random() * 0.18),
                      ease: 'easeOut',
                    }}
                  >
                    {word}
                  </motion.span>
                ),
              )}
            </p>
          </div>

          {/* Embers */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                background: p.hue,
                boxShadow: `0 0 ${p.size * 2.5}px ${p.hue}`,
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0.95, 0],
                scale: [0.4, 1.1, 0.2],
                y: -p.rise,
                x: p.drift,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
            />
          ))}

          {/* Warm glow rising from the base */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-terracotta/35 via-terracotta/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.1, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BurnAnimation
