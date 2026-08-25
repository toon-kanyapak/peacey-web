# Haven — Protect Your Peace

A calming, 100% client-side mental wellness companion: set boundaries, reframe
intrusive thoughts, breathe, and let go of what you never needed to keep.

No backend, no accounts, no network calls. Every "AI" response is generated
locally by heuristics, and every sound is synthesised in the browser.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Modules

| Tab | What it does |
| --- | --- |
| **Boundary Coach** (`#boundary`) | Six preset situations (or your own description) × three tones → a ready-to-send script plus a *why this works* rationale. |
| **Daily Check-in** (`#checkin`) | Mood picker + journal → a three-part CBT response (validate → reframe → one micro-action), saved to `localStorage` with a history drawer and check-in streak. |
| **Vent Box** (`#vent`) | Write the unfiltered version. *Burn & let it go* wipes it with a particle dissolve and never persists a character; *Transform to wisdom* extracts the unmet need underneath. |
| **Breathe** (`#breathe`) | Box / 4-7-8 / Coherence breathing with a synchronised bubble and chimes, plus a 5-4-3-2-1 sensory grounding checklist. |

Tabs are deep-linkable via the URL hash. "Instant Grounding" in the top bar
opens the emergency breathing/grounding modal from anywhere.

## How the fake AI works

`src/services/reframingEngine.js` scans the journal text for cognitive
distortion patterns (catastrophising, absolutes, mind-reading, self-blame,
capacity overload, guilt, future-tripping, conflict), blends the matches with
the selected mood, and assembles the three blocks. `boundaryScenarios.js` scores
free text against per-scenario keyword sets to pick a script, then fills its
`{placeholders}`. Both simulate 800–1500 ms of latency.

## Audio

`src/components/ambient/soundGenerators.js` builds white/pink/brown noise
buffers and shapes them with filters and slow LFOs into five soundscapes. Three
are pure texture — Ocean Brown Noise, Forest Wind, and Soft Hum (a 136 Hz drone
with a 6 Hz binaural offset). Two are played rather than filtered:

- **Classic Strings** (the default) — a slow canon in D. Each bar lays a bowed
  chord (detuned saw pairs under a slowly opening lowpass) under a five-note
  piano line, over the eight-chord ground bass most of the calm classical
  repertoire is built on.
- **Gentle Rain** — a darker, quieter rain bed with an unhurried piano over it,
  drawing from an F pentatonic scale so no two notes can clash, every 4–8
  seconds.

Both pitched voices share three helpers in the same file: `pianoNote` (sine
partials with per-partial decay under a lowpass that closes as the note rings
out), `stringChord`, and `noteScheduler`, whose `tick(at)` returns the seconds
to wait before the next call — so a generator can play in strict time or
loosely. Reverb is a `ConvolverNode` over a procedurally generated impulse
response, so there is still no audio file anywhere in the project.

The `AudioContext` is created lazily on the first user gesture, as autoplay
policies require, and all gain changes are ramped.

## Two conventions worth knowing

1. **Infinite animations are CSS, not framer-motion.** Looping indicators use
   Tailwind keyframes (`animate-pulse-soft`, `animate-blink`, `animate-sound-bar`).
2. **Primary content is never gated on an exit animation.** Panels that swap
   content use a keyed remount with an enter-only animation instead of
   `<AnimatePresence mode="wait">`, so content still renders when frames are
   throttled. `AnimatePresence` is reserved for overlays (modals, drawer,
   toasts, the burn effect) where a stalled exit is harmless.

## Deploying to GitHub Pages

Push to `main` and `.github/workflows/deploy.yml` builds and publishes `dist/`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub
Actions**. The site then lands at `https://<user>.github.io/<repo>/`.

The only thing that needs care is the **base path**. Project sites are served
from a subdirectory, so a build made for `/` requests `/assets/...` and every
file 404s against a blank page. The workflow avoids this by passing the repo
name through `VITE_BASE`, which `vite.config.js` reads — so a rename or a fork
keeps working with no edits.

To reproduce a Pages build locally:

```bash
VITE_BASE=/peacey-web/ npm run build
npx serve dist          # then open the site at the root of that server
```

If you move to a **user/org page** (`<user>.github.io`) or a **custom domain**,
the site is served from `/` instead — drop the `VITE_BASE` line from the
workflow, and add a `public/CNAME` file containing the domain for the latter.

Two things that are already handled: `public/.nojekyll` stops GitHub running the
output through Jekyll, and because navigation uses the URL hash rather than
history paths, deep links like `/#breathe` resolve without needing a `404.html`
SPA fallback.

## Privacy

Check-ins live in this browser's `localStorage` under `haven:*`. Vent text is
never written to storage at all. There is no analytics and no server.

Haven is a demo and a self-care aid — not therapy or crisis support.
