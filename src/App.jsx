import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, MessagesSquare, NotebookPen, Wind } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import { AudioProvider } from './context/AudioContext'
import Navbar, { PrivacyBadge } from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ToastViewport from './components/ui/Toast'
import BoundaryCoach from './components/boundary/BoundaryCoach'
import DailyCheckIn from './components/journal/DailyCheckIn'
import VentBox from './components/detox/VentBox'
import MindfulnessPanel from './components/mindfulness/MindfulnessPanel'
import GroundingModal from './components/mindfulness/GroundingModal'
import { Reveal } from './components/ui/Card'

const TABS = [
  { id: 'boundary', label: 'Boundary Coach', icon: MessagesSquare },
  { id: 'checkin', label: 'Daily Check-in', icon: NotebookPen },
  { id: 'vent', label: 'Vent Box', icon: Flame },
  { id: 'breathe', label: 'Breathe', icon: Wind },
]

/** Soft, slow-moving colour fields behind everything. */
function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -left-[15%] -top-[20%] h-[46rem] w-[46rem] animate-drift-slow rounded-full bg-moss/25 blur-[110px] dark:bg-sage-600/12" />
      <div
        className="absolute -right-[18%] top-[22%] h-[40rem] w-[40rem] animate-drift-slow rounded-full bg-lavender/20 blur-[120px] dark:bg-lavender/8"
        style={{ animationDelay: '-9s' }}
      />
      <div
        className="absolute bottom-[-18%] left-[24%] h-[34rem] w-[34rem] animate-drift-slow rounded-full bg-sage-300/20 blur-[110px] dark:bg-sage-500/10"
        style={{ animationDelay: '-17s' }}
      />
    </div>
  )
}

function Hero({ onTabChange }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-4 pt-12 sm:px-6 sm:pt-16" id="top">
      <Reveal>
        <PrivacyBadge />
        <h1 className="mt-5 max-w-3xl text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[54px]">
          A quieter place to
          <br className="hidden sm:block" />{' '}
          <span className="bg-gradient-to-r from-sage-500 via-sage-400 to-lavender bg-clip-text text-transparent">
            put things down.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted sm:text-[17px]">
          Haven helps you say the hard no, soften the thought that keeps circling, breathe slower
          than your day wants you to, and let go of what you never needed to keep.
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onTabChange('checkin')}
            className="rounded-2xl bg-sage-500 px-6 py-3.5 text-[15px] font-medium text-white shadow-soft transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-sage-600 hover:shadow-lift"
          >
            Start a check-in
          </button>
          <button
            type="button"
            onClick={() => onTabChange('breathe')}
            className="rounded-2xl border border-emerald-900/8 bg-white/60 px-6 py-3.5 text-[15px] font-medium transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:border-sage-500/30 hover:bg-white/85 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.09]"
          >
            Just breathe for a minute
          </button>
        </div>
      </Reveal>
    </section>
  )
}

const TAB_IDS = TABS.map((t) => t.id)
const tabFromHash = () => {
  const id = window.location.hash.replace('#', '')
  return TAB_IDS.includes(id) ? id : 'boundary'
}

function HavenApp() {
  const [tab, setTab] = useState(tabFromHash)
  const [seedText, setSeedText] = useState(null)
  const { groundingOpen, setGroundingOpen } = useApp()

  const goToTab = useCallback((next) => {
    setTab(next)
    window.history.replaceState(null, '', `#${next}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Keeps back/forward and pasted links pointing at the right module.
  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Vent Box → Check-in handoff.
  const sendToJournal = useCallback(
    (text) => {
      setSeedText(text)
      goToTab('checkin')
    },
    [goToTab],
  )

  return (
    <div className="relative min-h-dvh">
      <AmbientBackdrop />

      <Navbar
        tabs={TABS}
        activeTab={tab}
        onTabChange={goToTab}
        onGrounding={() => setGroundingOpen(true)}
      />

      <Hero onTabChange={goToTab} />

      <main className="mx-auto max-w-6xl px-5 pb-4 pt-8 sm:px-6">
        {/* Keyed remount + enter-only animation. Deliberately not
            <AnimatePresence mode="wait">: that would gate the new module on
            the old one finishing its exit, so content would stall whenever
            animations cannot run (backgrounded tab, throttled frames). */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === 'boundary' && <BoundaryCoach />}
          {tab === 'checkin' && (
            <DailyCheckIn seedText={seedText} onSeedConsumed={() => setSeedText(null)} />
          )}
          {tab === 'vent' && <VentBox onSendToJournal={sendToJournal} />}
          {tab === 'breathe' && <MindfulnessPanel />}
        </motion.div>
      </main>

      <Footer />

      <GroundingModal open={groundingOpen} onClose={() => setGroundingOpen(false)} />
      <ToastViewport />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AudioProvider>
        <HavenApp />
      </AudioProvider>
    </AppProvider>
  )
}
