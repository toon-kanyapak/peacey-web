/**
 * Heuristic CBT-style reframing engine.
 *
 * There is no model behind this — it reads the journal text for cognitive
 * distortion patterns (catastrophising, mind-reading, absolutes, self-blame),
 * blends that with the selected mood, and assembles a three-part response:
 * validate → reframe → one micro-action the user actually controls.
 */

export const MOODS = [
  {
    id: 'peaceful',
    label: 'Peaceful',
    emoji: '🌿',
    color: '#6B9080',
    ring: 'ring-sage-500/40',
    chip: 'bg-sage-500/12 text-sage-700 dark:text-sage-200',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    emoji: '⚡',
    color: '#C6AC8F',
    ring: 'ring-lavender/50',
    chip: 'bg-lavender/20 text-[#8a6f4e] dark:text-lavender',
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌧️',
    color: '#7C8FA6',
    ring: 'ring-slate-400/40',
    chip: 'bg-slate-400/15 text-slate-600 dark:text-slate-300',
  },
  {
    id: 'drained',
    label: 'Drained',
    emoji: '🪫',
    color: '#E07A5F',
    ring: 'ring-terracotta/40',
    chip: 'bg-terracotta/15 text-terracotta-dark dark:text-terracotta-light',
  },
  {
    id: 'grateful',
    label: 'Grateful',
    emoji: '✨',
    color: '#A4C3B2',
    ring: 'ring-moss/50',
    chip: 'bg-moss/25 text-sage-700 dark:text-sage-200',
  },
]

export const getMood = (id) => MOODS.find((m) => m.id === id) ?? MOODS[0]

/* ---------------------------------------------------------------- */
/* Distortion detection                                              */
/* ---------------------------------------------------------------- */

const PATTERNS = [
  {
    id: 'catastrophising',
    label: 'Catastrophising',
    test: /\b(disaster|ruin(ed)?|catastroph|worst|everything is falling|fall apart|end of|never recover|doomed|terrible)\b/i,
    reframe:
      'Your mind has jumped to the worst branch of a story that has not been written yet. The most likely outcome is almost always duller and more survivable than the one fear rehearses.',
  },
  {
    id: 'absolutes',
    label: 'All-or-nothing thinking',
    test: /\b(always|never|everyone|no one|nobody|every time|constantly|completely)\b/i,
    reframe:
      'Words like *always* and *never* are how stress compresses a handful of hard moments into a permanent rule. One difficult stretch is evidence about this week, not about who you are.',
  },
  {
    id: 'mind-reading',
    label: 'Mind-reading',
    test: /\b(they think|he thinks|she thinks|hates? me|judging|must think|probably thinks|annoyed with me|disappointed in me)\b/i,
    reframe:
      'You are holding a guess about someone else\'s inner world as though it were a fact. Their silence is far more likely to be about their own full week than about you.',
  },
  {
    id: 'self-blame',
    label: 'Harsh self-judgment',
    test: /\b(my fault|i(?:'m| am)? (?:so )?(?:stupid|useless|failure|lazy|worthless|pathetic|not good enough)|i should have|i can'?t do anything right|hate myself)\b/i,
    reframe:
      'You are speaking to yourself in a voice you would never use on a friend in the same position. Responsibility can be held without contempt — the first changes things, the second only costs you energy.',
  },
  {
    id: 'overload',
    label: 'Capacity overload',
    test: /\b(too much|so much to do|drowning|swamped|no time|can'?t keep up|burn(t|ed)? out|exhaust|overload|piling up|behind)\b/i,
    reframe:
      'This is not a character flaw showing up — it is a load problem. The volume in front of you would flatten anyone, and noticing that is the first honest step towards putting something down.',
  },
  {
    id: 'rejection',
    label: 'Fear of disappointing others',
    test: /\b(let (them|him|her|everyone) down|disappoint|guilt(y)?|selfish|bad (friend|person|daughter|son)|owe (them|him|her))\b/i,
    reframe:
      'Guilt is showing up here as a signal that you did something wrong, when it is really just the discomfort of choosing yourself for once. Discomfort and wrongdoing feel identical, and they are not the same thing.',
  },
  {
    id: 'future-fear',
    label: 'Future-tripping',
    test: /\b(what if|worried? about|anxious about|scared|afraid|dread|nervous|uncertain|unknown)\b/i,
    reframe:
      'Anxiety is your mind trying to pre-live a future it cannot control, and paying the emotional cost twice. You will meet that moment with the resources you have *then*, not the ones you are short of tonight.',
  },
  {
    id: 'conflict',
    label: 'Unresolved conflict',
    test: /\b(argu(ed|ment)|fight|yelled|shout|angry|furious|rage|betray|unfair|disrespect|rude|ignored)\b/i,
    reframe:
      'The heat you are feeling is information: something you value got stepped on. Anger points at the boundary that needs stating — it is not proof that you are the unreasonable one.',
  },
]

const MOOD_VALIDATION = {
  peaceful:
    'It is worth pausing on the fact that things feel steady right now. Calm is easy to walk past without noticing, and it deserves the same attention you give the hard days.',
  anxious:
    'Anxiety like this is genuinely exhausting — your body is running a full emergency response for a threat it cannot point to. That takes real energy, and it makes sense that you feel wrung out.',
  overwhelmed:
    'When this much arrives at once, the mind stops sorting and starts flooding. Feeling submerged is not a failure of coping — it is what happens when demand outruns capacity.',
  drained:
    'It is completely valid to feel drained when demands pile up without any time to recharge. Emptiness is not laziness — it is the honest reading on a battery that has been giving out more than it takes in.',
  grateful:
    'Gratitude and difficulty often sit in the same day, and holding both is a quiet skill. Letting the good part land fully is its own kind of rest.',
}

const MOOD_ACTIONS = {
  peaceful: [
    'Write down one thing that made today feel steady, so you can find it again on a harder day.',
    'Do the smallest pleasant thing available to you in the next ten minutes — and do it without multitasking.',
  ],
  anxious: [
    'Put both feet flat on the floor and name five things you can see. Anxiety loosens when the senses get something concrete to hold.',
    'Set a timer for four minutes and let yourself worry deliberately. When it rings, stand up and change rooms.',
  ],
  overwhelmed: [
    'Write the list down and cross off exactly one item you can delay by a week without consequence.',
    'Pick the single smallest task in front of you and finish just that one. Momentum is easier to find than motivation.',
  ],
  drained: [
    'Step away from your screen for three minutes, drink a full glass of water, and decline one non-essential thing today.',
    'Choose one obligation this week and downgrade it from "well" to "done". Nobody will notice but you.',
  ],
  grateful: [
    'Tell one person the specific thing you appreciated about them today — specificity is what makes it land.',
    'Save one sentence about today somewhere you will find it again in six months.',
  ],
}

const GENERIC_REFRAMES = [
  'This moment is a signal to slow down, not proof that you are falling behind.',
  'What you are carrying is heavy, and heavy is not the same as permanent. Load changes.',
  'You are judging the whole picture from inside the hardest hour of it, which is the worst possible vantage point for an accurate verdict.',
  'Nothing here requires you to have it figured out tonight. It only asks that you get through tonight.',
]

const hash = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

const pick = (list, seed) => list[seed % list.length]

/** Detects distortion patterns present in the text, most-specific first. */
export const detectPatterns = (text) => {
  const source = text || ''
  return PATTERNS.filter((p) => p.test.test(source))
}

/**
 * Simulated async AI reframing. Returns structured JSON:
 * { validation, reframedThought, microAction, patterns, ... }
 */
export async function simulateAiReframing(userJournal, mood = 'overwhelmed') {
  const delay = 800 + Math.random() * 700
  await new Promise((resolve) => setTimeout(resolve, delay))
  return buildReframe(userJournal, mood)
}

/** Synchronous core, exported so the Vent Box can reuse it. */
export function buildReframe(userJournal, mood = 'overwhelmed') {
  const text = (userJournal || '').trim()
  const seed = hash(text || mood)
  const found = detectPatterns(text)
  const moodMeta = getMood(mood)

  const validation = MOOD_VALIDATION[moodMeta.id] ?? MOOD_VALIDATION.overwhelmed

  const reframedThought =
    found.length > 0
      ? found
          .slice(0, 2)
          .map((p) => p.reframe)
          .join(' ')
      : pick(GENERIC_REFRAMES, seed)

  const microAction = pick(MOOD_ACTIONS[moodMeta.id] ?? MOOD_ACTIONS.overwhelmed, seed)

  return {
    validation,
    reframedThought,
    microAction,
    patterns: found.map((p) => ({ id: p.id, label: p.label })),
    mood: moodMeta.id,
    wordCount: text ? text.split(/\s+/).filter(Boolean).length : 0,
  }
}

/**
 * Vent-specific transformation: same engine, but framed as extracting a
 * usable takeaway from raw anger rather than gently reframing a worry.
 */
export async function transformVentToWisdom(ventText) {
  const delay = 900 + Math.random() * 600
  await new Promise((resolve) => setTimeout(resolve, delay))

  const found = detectPatterns(ventText)
  const seed = hash(ventText || 'vent')

  const NEEDS = [
    'to be taken seriously',
    'rest that you do not have to earn',
    'to stop being the one who absorbs everything',
    'a straight answer instead of a maybe',
    'space that nobody negotiates you out of',
    'to be treated with the care you keep extending to others',
  ]

  const KEEPS = [
    'The anger is accurate. It is pointing at a line that got crossed, and it deserves a sentence spoken out loud rather than a paragraph typed in private.',
    'What you wrote is not unreasonable — it is a person at their limit describing the limit. That is useful information about what has to change.',
    'Under the heat, there is a very clear request. Naming it plainly to the right person is the whole task.',
    'You are allowed to find this unfair. Deciding what you will do differently is a separate question from whether you are right — and you can be right and still choose peace.',
  ]

  return {
    heading: 'What was underneath that',
    unmetNeed: pick(NEEDS, seed),
    keep: pick(KEEPS, seed),
    release:
      found.length > 0
        ? found[0].reframe
        : 'The rest of it — the replaying, the imagined arguments, the rehearsed comebacks — is rent you are paying on a room you do not have to live in.',
    patterns: found.map((p) => ({ id: p.id, label: p.label })),
  }
}

export default simulateAiReframing
