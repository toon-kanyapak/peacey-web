import { motion } from 'framer-motion'
import { Moon, ShieldCheck, Sun, Wind } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AmbientPlayer from '../ambient/AmbientPlayer'
import HeaderAffirmation from './HeaderAffirmation'
import { cn } from '../../lib/utils'

export function BrandMark({ className }) {
  return (
    <span
      className={cn(
        'relative grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-soft',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
        <path
          d="M12 21c0-5.5 3.2-9.8 8-11-.4 6.4-3.6 10.2-8 11Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M12 21C12 14.4 8.2 10 4 9c.3 6.6 3.6 10.9 8 12Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
        <path d="M12 21v-6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-lavender ring-2 ring-canvas-light dark:ring-canvas-dark" />
    </span>
  )
}

export function Navbar({ tabs, activeTab, onTabChange, onGrounding }) {
  const { theme, toggleTheme, streak } = useApp()

  return (
    <header className="sticky top-0 z-50">
      <div className="haven-surface border-x-0 border-t-0 shadow-[0_1px_0_0_rgba(20,61,45,0.04)]">
        {/* Row 1 — brand, affirmation, controls */}
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <BrandMark />
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-semibold tracking-[-0.02em]">Haven</span>
              {/* Tagline only where there is room for it. */}
              <span className="mt-1 hidden text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted sm:block">
                Protect your peace
              </span>
            </span>
          </a>

          <div className="mx-1 hidden h-8 w-px bg-emerald-900/5 dark:bg-white/10 md:block" />

          <div className="hidden min-w-0 flex-1 md:flex">
            <HeaderAffirmation />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {streak.count > 0 && (
              <span
                className="mr-1 hidden items-center gap-1.5 rounded-full bg-moss/20 px-3 py-1.5 text-[12px] font-medium text-sage-700 dark:text-sage-200 sm:flex"
                title="Consecutive days you have checked in"
              >
                🌱 {streak.count} day{streak.count > 1 ? 's' : ''}
              </span>
            )}

            <AmbientPlayer />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-9 w-9 place-items-center rounded-xl text-mist transition-colors duration-300 hover:bg-sage-500/10 dark:text-sage-200/80"
            >
              {theme === 'dark' ? (
                <Sun className="h-[17px] w-[17px]" strokeWidth={2} />
              ) : (
                <Moon className="h-[17px] w-[17px]" strokeWidth={2} />
              )}
            </button>

            <motion.button
              type="button"
              onClick={onGrounding}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="ml-0.5 flex items-center gap-2 rounded-2xl bg-sage-500 px-3 py-2.5 text-[13px] font-medium text-white shadow-soft transition-colors duration-300 hover:bg-sage-600 sm:px-4"
            >
              <Wind className="h-4 w-4" strokeWidth={2.2} />
              <span className="hidden sm:inline">Instant Grounding</span>
            </motion.button>
          </div>
        </div>

        {/* Row 2 — module tabs */}
        <nav className="mx-auto max-w-6xl px-2 pb-2 sm:px-4" aria-label="Modules">
          <div className="haven-scroll-fade flex gap-1 overflow-x-auto pb-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative shrink-0 rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-300',
                    active
                      ? 'text-sage-700 dark:text-sage-100'
                      : 'text-muted hover:text-ink dark:hover:text-sage-100',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-xl bg-sage-500/12"
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Mobile affirmation strip */}
      <div className="haven-surface border-x-0 border-t-0 px-4 py-2 md:hidden">
        <HeaderAffirmation />
      </div>
    </header>
  )
}

export function PrivacyBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-500/10 px-3 py-1.5 text-[11.5px] font-medium text-sage-700 dark:text-sage-200">
      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
      Everything stays in this browser
    </span>
  )
}

export default Navbar
