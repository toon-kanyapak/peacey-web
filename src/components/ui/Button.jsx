import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const VARIANTS = {
  primary:
    'bg-sage-500 text-white shadow-soft hover:bg-sage-600 hover:shadow-lift disabled:hover:bg-sage-500',
  secondary:
    'bg-moss/25 text-sage-700 dark:text-sage-100 dark:bg-moss/15 hover:bg-moss/40 dark:hover:bg-moss/25',
  ghost:
    'bg-transparent text-mist dark:text-sage-200/80 hover:bg-sage-500/10 dark:hover:bg-white/5',
  outline:
    'bg-white/50 dark:bg-white/[0.04] text-ink dark:text-sage-50 border border-emerald-900/8 dark:border-white/10 hover:border-sage-500/40 hover:bg-white/80 dark:hover:bg-white/[0.08]',
  release: 'bg-terracotta text-white shadow-soft hover:bg-terracotta-dark hover:shadow-lift',
  quiet:
    'bg-ink/5 dark:bg-white/5 text-mist dark:text-sage-200/70 hover:bg-ink/10 dark:hover:bg-white/10',
}

const SIZES = {
  sm: 'text-[13px] px-3.5 py-2 gap-1.5 rounded-xl',
  md: 'text-sm px-5 py-2.5 gap-2 rounded-2xl',
  lg: 'text-[15px] px-6 py-3.5 gap-2.5 rounded-2xl',
}

// Defined once at module scope — creating these inside render would remount
// the element (and lose focus / animation state) on every pass.
const TAGS = { button: motion.button, a: motion.a }

export function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled,
  ...props
}) {
  const Tag = TAGS[as] ?? motion.button
  const inert = disabled || loading

  return (
    <Tag
      whileHover={inert ? undefined : { y: -1 }}
      whileTap={inert ? undefined : { scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      disabled={as === 'button' ? inert : undefined}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium tracking-[-0.01em]',
        'transition-colors duration-300 ease-calm',
        'disabled:cursor-not-allowed disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className="h-[1.05em] w-[1.05em] shrink-0" strokeWidth={2} />
      )}
      {children}
      {IconRight && !loading && (
        <IconRight className="h-[1.05em] w-[1.05em] shrink-0" strokeWidth={2} />
      )}
    </Tag>
  )
}

export default Button
