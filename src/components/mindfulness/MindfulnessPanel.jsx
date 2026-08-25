import { useState } from 'react'
import { Wind } from 'lucide-react'
import Card, { SectionHeader } from '../ui/Card'
import BreathingBubble from './BreathingBubble'
import GroundingExercise from './GroundingExercise'

export function MindfulnessPanel() {
  const [technique, setTechnique] = useState('box')

  return (
    <div>
      <SectionHeader
        eyebrow="Module 04"
        icon={Wind}
        title="Breathe & come back"
        description="A longer exhale is the fastest signal your body understands. Pick a rhythm, follow the circle, and let the counting be someone else's job."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card className="p-6 sm:p-8">
          <BreathingBubble techniqueId={technique} onTechniqueChange={setTechnique} />
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-sage-600 dark:text-sage-300">
              Sensory grounding
            </p>
            <h3 className="mt-1.5 text-[19px] font-semibold tracking-[-0.02em]">5-4-3-2-1</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              When your mind is somewhere it cannot fix, this walks it back into the room one sense
              at a time. Work down the list slowly — the pace is the point.
            </p>
          </div>
          <GroundingExercise />
        </Card>
      </div>
    </div>
  )
}

export default MindfulnessPanel
