/**
 * Mock boundary-script library + heuristic matcher.
 *
 * Each scenario carries three tonal variants and a short "why this works"
 * rationale drawn from assertiveness-training language (DEAR MAN / "no" as a
 * complete sentence / broken-record technique).
 */

export const TONES = [
  {
    id: 'gentle',
    label: 'Gentle & Diplomatic',
    hint: 'Soft, empathetic, keeps the door open',
    emoji: '🌿',
  },
  {
    id: 'firm',
    label: 'Firm & Clear',
    hint: 'Direct, professional, unambiguous',
    emoji: '🪨',
  },
  {
    id: 'minimal',
    label: 'One-Liner Minimalist',
    hint: 'Short, low-effort, no over-explaining',
    emoji: '✂️',
  },
]

export const SCENARIOS = [
  {
    id: 'after-hours',
    label: 'Colleague contacting after work hours',
    emoji: '🌙',
    keywords: [
      'work', 'colleague', 'boss', 'manager', 'slack', 'email', 'after hours',
      'weekend', 'overtime', 'late', 'office', 'team', 'deadline', 'client',
    ],
    scripts: {
      gentle: `Hi {name} — thanks for thinking of me on this. I've stepped away from work for the evening, so I won't be able to look properly until tomorrow morning. I'll pick it up first thing and get you an answer by midday.

If it's genuinely urgent tonight, {escalation} is the fastest route.`,
      firm: `Hi {name}, I don't check messages outside working hours. I'll respond when I'm back online at {start_time}.

For anything time-critical overnight, please use the on-call process — that's what it's there for.`,
      minimal: `I'm offline for the evening — I'll get to this first thing tomorrow.`,
    },
    why: 'It answers the request without answering it *now*. Naming a specific return time replaces vague guilt with a concrete commitment, so the other person gets certainty instead of an argument — and you keep your evening.',
    tags: ['Work', 'Time'],
  },
  {
    id: 'emotional-labour',
    label: 'Friend demanding too much emotional energy',
    emoji: '💬',
    keywords: [
      'friend', 'vent', 'drain', 'emotional', 'support', 'always', 'listen',
      'therapist', 'crisis', 'exhausting', 'constant', 'dumping', 'heavy',
    ],
    scripts: {
      gentle: `I care about you and I want to be here for this — I'm just running on empty myself right now, and I don't think I'd be much use to you tonight.

Can we pick this up {when}? I'd rather give you my full attention than half of it.`,
      firm: `I'm not in a place to take this on right now. I care about you, and I'm also at my limit this week.

I think this deserves more support than I can give — talking it through with a therapist would serve you better than I can.`,
      minimal: `I don't have the capacity for this tonight. Can we talk {when}?`,
    },
    why: 'It separates *caring about someone* from *being endlessly available to them* — two things people often collapse into one. Offering a real alternative time keeps it a boundary rather than a rejection, so the relationship survives the "no".',
    tags: ['Friendship', 'Energy'],
  },
  {
    id: 'intrusive-family',
    label: 'Family asking intrusive personal questions',
    emoji: '🏠',
    keywords: [
      'family', 'mum', 'mom', 'dad', 'parent', 'relative', 'aunt', 'uncle',
      'personal', 'private', 'marriage', 'kids', 'baby', 'salary', 'weight',
      'dating', 'single', 'holiday', 'dinner', 'nosy', 'intrusive',
    ],
    scripts: {
      gentle: `That's something I'm keeping to myself for now — I hope you understand. I promise you'll hear about it if there's ever news worth sharing.

Anyway, tell me about {deflection} — I've been wanting to hear how that's going.`,
      firm: `That's not something I'm discussing. I know it comes from a good place, and I'd still rather not go into it.

Let's talk about something else.`,
      minimal: `I'd rather not get into that one. How's {deflection}?`,
    },
    why: '"I\'d rather not" is a complete answer — it needs no justification, and adding one invites negotiation. Pivoting to a genuine question immediately afterwards gives the conversation somewhere warm to go, so the refusal never becomes the topic.',
    tags: ['Family', 'Privacy'],
  },
  {
    id: 'expensive-plans',
    label: 'Declining an expensive social gathering',
    emoji: '💸',
    keywords: [
      'money', 'expensive', 'cost', 'afford', 'budget', 'dinner', 'trip',
      'wedding', 'party', 'invite', 'bill', 'split', 'holiday', 'birthday',
      'brunch', 'saving',
    ],
    scripts: {
      gentle: `That sounds lovely and I'm genuinely sorry to miss it — it isn't in my budget this month. I'm being strict with myself about {reason} at the moment.

Count me in for something low-key soon, though — I'd love to see you.`,
      firm: `That one's outside my budget, so I'll sit this out. No need to talk me round — I've already made the call.

Send photos, and let's do something cheaper in a few weeks.`,
      minimal: `Not in the budget this month — have a great time, and let's catch up after.`,
    },
    why: 'Naming money plainly ends the negotiation, because there is nothing to argue with; vague excuses invite people to solve them for you. Proposing a cheaper alternative signals the *event* was the problem, not them.',
    tags: ['Money', 'Social'],
  },
  {
    id: 'extra-work',
    label: 'Being handed work that is not yours',
    emoji: '📥',
    keywords: [
      'favour', 'favor', 'extra', 'task', 'cover', 'help', 'volunteer',
      'scope', 'plate', 'workload', 'capacity', 'shift', 'project', 'assign',
    ],
    scripts: {
      gentle: `I'd like to help, and I want to be honest about my capacity — I'm at the edge of it with {current_priority} this week.

If this takes priority, I'm happy to pick it up as long as we push something else back. Which would you like me to move?`,
      firm: `I can't take this on alongside {current_priority}. Something would have to come off my plate for this to get done well.

Let me know which you'd like me to deprioritise and I'll adjust.`,
      minimal: `My plate's full this week — I can pick it up next week if that works.`,
    },
    why: 'It converts "no" into a trade-off, which is much harder to overrule than a refusal — you are not blocking the work, you are asking who prioritises it. Handing the decision back puts the cost where it belongs.',
    tags: ['Work', 'Capacity'],
  },
  {
    id: 'need-space',
    label: 'Asking for space without a fight',
    emoji: '🕊️',
    keywords: [
      'space', 'partner', 'argument', 'fight', 'alone', 'overwhelmed',
      'breathe', 'pause', 'cool off', 'upset', 'angry', 'relationship',
    ],
    scripts: {
      gentle: `I'm not walking away from this — I just can't have the conversation well while I'm this wound up. Give me {duration} to settle, and I'll come back to you properly.

I'd rather pause than say something I don't mean.`,
      firm: `I need {duration} on my own before we continue. I'm not shutting you out — I'm making sure this conversation goes somewhere useful.

We'll pick it up after that.`,
      minimal: `I need {duration} to cool off. I'll come back to this — I promise.`,
    },
    why: 'The pause is only heard as abandonment when there is no return time attached to it. Naming the duration *and* the reason turns a withdrawal into a scheduled repair, which is what makes the other person able to let go of it.',
    tags: ['Relationships', 'Conflict'],
  },
]

/** Placeholder defaults so a generated script never contains raw {tokens}. */
const FILLERS = {
  name: 'there',
  escalation: 'the on-call channel',
  start_time: '9am',
  when: 'later this week',
  deflection: 'what you have been up to',
  reason: 'saving',
  current_priority: 'my current deadline',
  duration: 'twenty minutes',
}

export const fillPlaceholders = (text) =>
  text.replace(/\{(\w+)\}/g, (match, key) => FILLERS[key] ?? match)

/**
 * Heuristic "understanding" of free-text input: scores each scenario by how
 * many of its keywords appear, and falls back to the most universal script.
 */
export const matchScenario = (text) => {
  const normalized = (text || '').toLowerCase()
  if (!normalized.trim()) return { scenario: SCENARIOS[0], confidence: 0 }

  let best = null
  let bestScore = 0

  for (const scenario of SCENARIOS) {
    let score = 0
    for (const keyword of scenario.keywords) {
      if (normalized.includes(keyword)) score += keyword.includes(' ') ? 2 : 1
    }
    if (score > bestScore) {
      bestScore = score
      best = scenario
    }
  }

  if (!best) return { scenario: SCENARIOS[1], confidence: 0 }
  return {
    scenario: best,
    confidence: Math.min(1, bestScore / 4),
  }
}

const OPENERS = {
  gentle: ['Here is one way to say it, softly:', 'You could put it like this:'],
  firm: ['Clear and unapologetic:', 'Straight to the point:'],
  minimal: ['Short version:', 'The whole message:'],
}

const pick = (list, seed) => list[seed % list.length]

/**
 * Simulated async "AI" boundary-script generation.
 * Latency is deliberate — instant output would break the sense of being heard.
 */
export async function generateBoundaryScript({ scenarioId, customText, tone }) {
  const delay = 900 + Math.random() * 700
  await new Promise((resolve) => setTimeout(resolve, delay))

  const hasCustom = Boolean(customText && customText.trim().length > 8)
  const matched = hasCustom ? matchScenario(customText) : null
  const scenario = hasCustom
    ? matched.scenario
    : SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]

  const script = fillPlaceholders(scenario.scripts[tone] ?? scenario.scripts.gentle)
  const seed = (customText || scenario.id).length

  return {
    id: `${Date.now()}`,
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    emoji: scenario.emoji,
    tone,
    opener: pick(OPENERS[tone] ?? OPENERS.gentle, seed),
    script,
    why: scenario.why,
    tags: scenario.tags,
    matchedFromCustom: hasCustom,
    confidence: matched ? matched.confidence : 1,
  }
}
