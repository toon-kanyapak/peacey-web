import { Heart, ShieldCheck } from 'lucide-react'
import { BrandMark } from './Navbar'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-emerald-900/5 py-12 dark:border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8 rounded-xl" />
            <span className="text-[16px] font-semibold tracking-[-0.02em]">Haven</span>
          </div>
          <p className="mt-3.5 text-[13.5px] leading-relaxed text-muted">
            A quiet corner for setting boundaries, softening hard thoughts, breathing slower, and
            putting things down. Built as a demo — every response is generated locally by simple
            heuristics, not a model.
          </p>
        </div>

        <div className="grid gap-6 text-[13px] sm:grid-cols-2">
          <div>
            <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
              Your privacy
            </p>
            <p className="flex items-start gap-2 leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" strokeWidth={2} />
              No account, no server, no analytics. Check-ins live in this browser&rsquo;s
              localStorage; vents are never stored at all.
            </p>
          </div>
          <div>
            <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
              If things feel heavy
            </p>
            <p className="leading-relaxed text-muted">
              Haven is a self-care companion, not therapy or crisis support. If you are struggling,
              please reach out to a professional or a local crisis line.
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 flex max-w-6xl items-center gap-1.5 px-5 text-[12px] text-muted/70 sm:px-6">
        Made with <Heart className="h-3.5 w-3.5 text-terracotta" strokeWidth={2.2} /> for anyone
        learning to say no.
      </p>
    </footer>
  )
}

export default Footer
