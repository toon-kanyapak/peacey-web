import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/** Frosted-glass surface used for every module panel. */
export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'haven-surface rounded-3xl shadow-soft',
        hover && 'transition-shadow duration-500 ease-calm hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SectionHeader({ eyebrow, title, description, icon: Icon, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-2.5 flex items-center gap-2">
            {Icon && (
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-sage-500/12 text-sage-600 dark:text-sage-300">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-600 dark:text-sage-300">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[32px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/** Fades a section in as it enters the viewport. */
export function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Card
