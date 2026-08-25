import { createContext, useContext, useMemo } from 'react'
import { useWebAudio } from '../hooks/useWebAudio'
import { playChime } from '../components/ambient/soundGenerators'

const HavenAudioContext = createContext(null)

export function AudioProvider({ children }) {
  const audio = useWebAudio()

  const value = useMemo(
    () => ({
      ...audio,
      /** Soft bell for breathing phase changes — no-op until audio is unlocked. */
      chime: (opts) => {
        const ctx = audio.getContext()
        if (ctx) playChime(ctx, opts)
      },
    }),
    [audio],
  )

  return <HavenAudioContext.Provider value={value}>{children}</HavenAudioContext.Provider>
}

export function useAudio() {
  const ctx = useContext(HavenAudioContext)
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>')
  return ctx
}

export default HavenAudioContext
