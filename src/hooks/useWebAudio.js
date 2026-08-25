import { useCallback, useEffect, useRef, useState } from 'react'
import { getSoundscape } from '../components/ambient/soundGenerators'

const FADE = 0.6 // seconds — every gain change is eased, never abrupt

/**
 * Owns a single AudioContext and one active procedural soundscape voice.
 * The context is created lazily on the first user gesture, which is what
 * browser autoplay policies require.
 */
export function useWebAudio() {
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const voiceRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [preset, setPreset] = useState('classic')
  const [volume, setVolume] = useState(0.5)
  const [isReady, setIsReady] = useState(false)

  // Mirrored so play() can read the current volume without re-creating itself.
  const volumeRef = useRef(volume)
  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (!Ctor) return null
      const ctx = new Ctor()
      const master = ctx.createGain()
      master.gain.value = 0
      master.connect(ctx.destination)
      ctxRef.current = ctx
      masterRef.current = master
      setIsReady(true)
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const teardownVoice = useCallback(() => {
    const voice = voiceRef.current
    if (!voice) return
    voiceRef.current = null
    try {
      voice.stop()
    } catch {
      /* already stopped */
    }
    try {
      voice.output.disconnect()
    } catch {
      /* already disconnected */
    }
  }, [])

  const buildVoice = useCallback((ctx, presetId) => {
    const scape = getSoundscape(presetId)
    const voice = scape.build(ctx)
    const trim = ctx.createGain()
    trim.gain.value = scape.gain
    voice.output.connect(trim)
    trim.connect(masterRef.current)
    voice.start()
    return {
      stop: voice.stop,
      output: trim,
    }
  }, [])

  const fadeMaster = useCallback((target, duration = FADE) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(target, now + duration)
  }, [])

  const play = useCallback(() => {
    const ctx = ensureContext()
    if (!ctx) return
    if (!voiceRef.current) voiceRef.current = buildVoice(ctx, preset)
    fadeMaster(volumeRef.current)
    setIsPlaying(true)
  }, [buildVoice, ensureContext, fadeMaster, preset])

  const pause = useCallback(() => {
    fadeMaster(0, 0.5)
    setIsPlaying(false)
    const ctx = ctxRef.current
    if (!ctx) return
    // Let the fade finish before releasing the oscillators.
    window.setTimeout(() => {
      if (!voiceRef.current) return
      teardownVoice()
    }, 620)
  }, [fadeMaster, teardownVoice])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  /** Cross-fade into a different soundscape without a click or gap. */
  const selectPreset = useCallback(
    (nextPreset) => {
      setPreset(nextPreset)
      if (!isPlaying) return
      const ctx = ctxRef.current
      if (!ctx) return
      fadeMaster(0, 0.35)
      window.setTimeout(() => {
        teardownVoice()
        voiceRef.current = buildVoice(ctx, nextPreset)
        fadeMaster(volumeRef.current, 0.7)
      }, 380)
    },
    [buildVoice, fadeMaster, isPlaying, teardownVoice],
  )

  const changeVolume = useCallback(
    (next) => {
      setVolume(next)
      if (isPlaying) fadeMaster(next, 0.12)
    },
    [fadeMaster, isPlaying],
  )

  /** Shared context for one-shot sounds (breathing chimes). */
  const getContext = useCallback(() => ctxRef.current, [])

  useEffect(
    () => () => {
      teardownVoice()
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close().catch(() => {})
      }
    },
    [teardownVoice],
  )

  return {
    isPlaying,
    isReady,
    preset,
    volume,
    play,
    pause,
    toggle,
    selectPreset,
    setVolume: changeVolume,
    ensureContext,
    getContext,
  }
}

export default useWebAudio
