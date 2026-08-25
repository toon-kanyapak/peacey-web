/**
 * Procedural ambient soundscapes built entirely with the native Web Audio API.
 * Zero external assets — every texture is synthesised from noise buffers,
 * filters and slow LFOs so the app works fully offline.
 *
 * Every generator returns a "voice": { nodes, output, start(), stop() }
 * The caller connects `output` to a master gain and calls start()/stop().
 */

const NOISE_SECONDS = 3

/** Flat-spectrum white noise buffer (base material for everything else). */
export const createWhiteNoiseBuffer = (ctx) => {
  const length = ctx.sampleRate * NOISE_SECONDS
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

/** Brown (red) noise — deep, ocean-like rumble. */
export const createBrownNoiseBuffer = (ctx) => {
  const length = ctx.sampleRate * NOISE_SECONDS
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let lastOut = 0.0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    data[i] = (lastOut + 0.02 * white) / 1.02
    lastOut = data[i]
    data[i] *= 3.5 // gain compensation
  }
  return buffer
}

/** Pink noise (Paul Kellet's economy filter) — soft, rain-like hiss. */
export const createPinkNoiseBuffer = (ctx) => {
  const length = ctx.sampleRate * NOISE_SECONDS
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    b6 = white * 0.115926
  }
  return buffer
}

/** Convenience: a looping buffer source ready to start. */
const loopingSource = (ctx, buffer) => {
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  return src
}

/**
 * A slow sine LFO modulating a target AudioParam — this is what makes the
 * textures feel like they are breathing rather than sitting flat.
 */
const slowLfo = (ctx, { rate, depth, offset = 0, target }) => {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = rate
  const gain = ctx.createGain()
  gain.gain.value = depth
  osc.connect(gain)
  if (target) {
    target.value = offset
    gain.connect(target)
  }
  return { osc, gain }
}

/* ------------------------------------------------------------------ */
/* Soundscape recipes                                                  */
/* ------------------------------------------------------------------ */

/** Gentle Rain — band-limited pink noise with a shimmering top layer. */
const gentleRain = (ctx) => {
  const src = loopingSource(ctx, createPinkNoiseBuffer(ctx))

  const body = ctx.createBiquadFilter()
  body.type = 'bandpass'
  body.frequency.value = 1000
  body.Q.value = 0.6

  const airSrc = loopingSource(ctx, createWhiteNoiseBuffer(ctx))
  const air = ctx.createBiquadFilter()
  air.type = 'highpass'
  air.frequency.value = 4200
  const airGain = ctx.createGain()
  airGain.gain.value = 0.06

  const out = ctx.createGain()
  out.gain.value = 0.9

  src.connect(body).connect(out)
  airSrc.connect(air).connect(airGain).connect(out)

  // Rain intensity gently swells and recedes.
  const lfo = slowLfo(ctx, { rate: 0.05, depth: 380, offset: 1000, target: body.frequency })

  return {
    output: out,
    start: () => { src.start(); airSrc.start(); lfo.osc.start() },
    stop: () => { src.stop(); airSrc.stop(); lfo.osc.stop() },
  }
}

/** Ocean Brown Noise — brown noise swelling like slow surf. */
const oceanBrownNoise = (ctx) => {
  const src = loopingSource(ctx, createBrownNoiseBuffer(ctx))

  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 620
  tone.Q.value = 0.4

  const swell = ctx.createGain()
  swell.gain.value = 0.5

  const out = ctx.createGain()
  out.gain.value = 1

  src.connect(tone).connect(swell).connect(out)

  // ~11s wave period.
  const waves = slowLfo(ctx, { rate: 0.09, depth: 0.32, offset: 0.55, target: swell.gain })
  const brightness = slowLfo(ctx, { rate: 0.045, depth: 180, offset: 620, target: tone.frequency })

  return {
    output: out,
    start: () => { src.start(); waves.osc.start(); brightness.osc.start() },
    stop: () => { src.stop(); waves.osc.stop(); brightness.osc.stop() },
  }
}

/** Forest Wind — filtered white noise drifting through imaginary leaves. */
const forestWind = (ctx) => {
  const src = loopingSource(ctx, createWhiteNoiseBuffer(ctx))

  const gust = ctx.createBiquadFilter()
  gust.type = 'bandpass'
  gust.frequency.value = 520
  gust.Q.value = 1.6

  const leaves = loopingSource(ctx, createPinkNoiseBuffer(ctx))
  const leafFilter = ctx.createBiquadFilter()
  leafFilter.type = 'highpass'
  leafFilter.frequency.value = 2600
  const leafGain = ctx.createGain()
  leafGain.gain.value = 0.05

  const breath = ctx.createGain()
  breath.gain.value = 0.6

  const out = ctx.createGain()
  out.gain.value = 1

  src.connect(gust).connect(breath).connect(out)
  leaves.connect(leafFilter).connect(leafGain).connect(out)

  const sweep = slowLfo(ctx, { rate: 0.07, depth: 340, offset: 560, target: gust.frequency })
  const gusting = slowLfo(ctx, { rate: 0.033, depth: 0.3, offset: 0.55, target: breath.gain })
  const rustle = slowLfo(ctx, { rate: 0.12, depth: 0.035, offset: 0.05, target: leafGain.gain })

  return {
    output: out,
    start: () => {
      src.start(); leaves.start()
      sweep.osc.start(); gusting.osc.start(); rustle.osc.start()
    },
    stop: () => {
      src.stop(); leaves.stop()
      sweep.osc.stop(); gusting.osc.stop(); rustle.osc.stop()
    },
  }
}

/**
 * Soft Hum — a warm drone with a gentle 6 Hz binaural offset between ears,
 * layered over a whisper of noise so it never feels sterile.
 */
const softHum = (ctx) => {
  const baseFreq = 136.1 // "Om" / C#, a classic meditation tone
  const beat = 6 // theta-range binaural offset

  const merger = ctx.createChannelMerger(2)

  const left = ctx.createOscillator()
  left.type = 'sine'
  left.frequency.value = baseFreq

  const right = ctx.createOscillator()
  right.type = 'sine'
  right.frequency.value = baseFreq + beat

  const leftGain = ctx.createGain()
  const rightGain = ctx.createGain()
  leftGain.gain.value = 0.5
  rightGain.gain.value = 0.5

  left.connect(leftGain).connect(merger, 0, 0)
  right.connect(rightGain).connect(merger, 0, 1)

  // A fifth above, quietly, for warmth.
  const fifth = ctx.createOscillator()
  fifth.type = 'sine'
  fifth.frequency.value = baseFreq * 1.5
  const fifthGain = ctx.createGain()
  fifthGain.gain.value = 0.08

  // Whisper bed so the drone sits in a space.
  const bed = loopingSource(ctx, createBrownNoiseBuffer(ctx))
  const bedFilter = ctx.createBiquadFilter()
  bedFilter.type = 'lowpass'
  bedFilter.frequency.value = 320
  const bedGain = ctx.createGain()
  bedGain.gain.value = 0.12

  const warmth = ctx.createBiquadFilter()
  warmth.type = 'lowpass'
  warmth.frequency.value = 900

  const out = ctx.createGain()
  out.gain.value = 0.85

  merger.connect(warmth).connect(out)
  fifth.connect(fifthGain).connect(out)
  bed.connect(bedFilter).connect(bedGain).connect(out)

  const drift = slowLfo(ctx, { rate: 0.04, depth: 0.16, offset: 0.7, target: out.gain })

  return {
    output: out,
    start: () => { left.start(); right.start(); fifth.start(); bed.start(); drift.osc.start() },
    stop: () => { left.stop(); right.stop(); fifth.stop(); bed.stop(); drift.osc.stop() },
  }
}

/* ------------------------------------------------------------------ */

export const SOUNDSCAPES = [
  {
    id: 'rain',
    label: 'Gentle Rain',
    description: 'Soft pink-noise rainfall on a quiet window',
    emoji: '🌧️',
    gain: 0.34,
    build: gentleRain,
  },
  {
    id: 'ocean',
    label: 'Ocean Brown Noise',
    description: 'Deep, slow surf rolling in and out',
    emoji: '🌊',
    gain: 0.4,
    build: oceanBrownNoise,
  },
  {
    id: 'forest',
    label: 'Forest Wind',
    description: 'Wind drifting through distant leaves',
    emoji: '🌲',
    gain: 0.32,
    build: forestWind,
  },
  {
    id: 'hum',
    label: 'Soft Hum',
    description: 'A warm 136 Hz drone with a 6 Hz binaural pulse',
    emoji: '🔆',
    gain: 0.26,
    build: softHum,
  },
]

export const getSoundscape = (id) =>
  SOUNDSCAPES.find((s) => s.id === id) ?? SOUNDSCAPES[0]

/**
 * A short, soft bell used to mark breathing phase changes.
 * Self-contained: creates, plays and disposes its own nodes.
 */
export const playChime = (ctx, { frequency = 528, volume = 0.09 } = {}) => {
  if (!ctx || ctx.state === 'closed') return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = frequency

  const partial = ctx.createOscillator()
  partial.type = 'sine'
  partial.frequency.value = frequency * 2.01

  const partialGain = ctx.createGain()
  partialGain.gain.value = 0.25

  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, now)
  env.gain.exponentialRampToValueAtTime(volume, now + 0.02)
  env.gain.exponentialRampToValueAtTime(0.0001, now + 1.6)

  osc.connect(env)
  partial.connect(partialGain).connect(env)
  env.connect(ctx.destination)

  osc.start(now)
  partial.start(now)
  osc.stop(now + 1.7)
  partial.stop(now + 1.7)
  osc.onended = () => {
    try {
      env.disconnect()
      partialGain.disconnect()
    } catch {
      /* already torn down */
    }
  }
}
