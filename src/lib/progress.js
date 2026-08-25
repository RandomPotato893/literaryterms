const STORAGE_KEY = 'litmus-progress-v1'

export const emptyStats = () => ({
  // Kept for backwards compatibility with progress saved by Litmus v1.
  definitionCorrect: 0,
  definitionAttempts: 0,
  exampleCorrect: 0,
  exampleAttempts: 0,
  recognitionCorrect: 0,
  recognitionAttempts: 0,
  recognitionStreak: 0,
  typedCorrect: 0,
  typedAttempts: 0,
  typedStreak: 0,
  exampleStreak: 0,
  starred: false,
  lastSeen: null,
})

export function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function statsFor(progress, id) {
  const saved = progress[id] || {}
  const stats = { ...emptyStats(), ...saved }

  // v1 definition questions were all recognition-based. Carry that evidence
  // forward without pretending the learner has completed written recall.
  if (saved.recognitionAttempts == null) {
    stats.recognitionAttempts = saved.definitionAttempts || 0
    stats.recognitionCorrect = saved.definitionCorrect || 0
    stats.recognitionStreak = rate(stats.recognitionCorrect, stats.recognitionAttempts) >= 75
      ? Math.min(2, stats.recognitionCorrect)
      : 0
  }

  if (saved.exampleStreak == null && stats.exampleAttempts) {
    stats.exampleStreak = rate(stats.exampleCorrect, stats.exampleAttempts) >= 75
      ? Math.min(2, stats.exampleCorrect)
      : 0
  }

  return stats
}

function recordSkill(stats, skill, correct) {
  const next = { ...stats, lastSeen: new Date().toISOString() }

  if (skill === 'recognition') {
    next.definitionAttempts += 1
    next.recognitionAttempts += 1
    if (correct) {
      next.definitionCorrect += 1
      next.recognitionCorrect += 1
      next.recognitionStreak += 1
    } else {
      next.recognitionStreak = 0
    }
  } else if (skill === 'written') {
    next.typedAttempts += 1
    if (correct) {
      next.typedCorrect += 1
      next.typedStreak += 1
    } else {
      next.typedStreak = 0
    }
  } else {
    next.exampleAttempts += 1
    if (correct) {
      next.exampleCorrect += 1
      next.exampleStreak += 1
    } else {
      next.exampleStreak = 0
    }
  }

  return next
}

export function updateLearnAttempt(progress, id, skill, correct) {
  const current = statsFor(progress, id)
  return { ...progress, [id]: recordSkill(current, skill, correct) }
}

export function replaceLearnAttempt(progress, id, skill, beforeStats, correct) {
  return updateLearnAttempt({ ...progress, [id]: beforeStats }, id, skill, correct)
}

export function updateAttempt(progress, id, kind, correct) {
  return updateLearnAttempt(progress, id, kind === 'definition' ? 'recognition' : 'example', correct)
}

export function toggleStar(progress, id) {
  const current = statsFor(progress, id)
  return { ...progress, [id]: { ...current, starred: !current.starred } }
}

export function rate(correct, attempts) {
  return attempts ? Math.round((correct / attempts) * 100) : 0
}

export function getLearnStage(stats) {
  if (stats.recognitionStreak < 1) return 'recognition'
  if (stats.typedStreak < 1) return 'written'
  if (stats.exampleStreak < 1) return 'example'
  return 'mastered'
}

export function masteryPercent(stats) {
  const recognition = Math.min(stats.recognitionStreak, 1)
  const written = Math.min(stats.typedStreak, 1)
  const examples = Math.min(stats.exampleStreak, 1)
  return Math.round(recognition * 30 + written * 35 + examples * 35)
}

export function isMastered(stats) {
  return getLearnStage(stats) === 'mastered'
}

export function needsReview(stats) {
  if (stats.starred) return true
  if (isMastered(stats)) return false

  const skills = [
    [stats.recognitionCorrect, stats.recognitionAttempts, stats.recognitionStreak],
    [stats.typedCorrect, stats.typedAttempts, stats.typedStreak],
    [stats.exampleCorrect, stats.exampleAttempts, stats.exampleStreak],
  ]

  return skills.some(([correct, attempts, streak]) => (
    attempts > 0 && (correct / attempts < 0.8 || streak === 0)
  ))
}

export function summarizeProgress(terms, progress) {
  const stages = { recognition: 0, written: 0, example: 0, mastered: 0 }
  let seen = 0
  let recognitionCorrect = 0
  let recognitionAttempts = 0
  let typedCorrect = 0
  let typedAttempts = 0
  let exampleCorrect = 0
  let exampleAttempts = 0

  terms.forEach((term) => {
    const stats = statsFor(progress, term.id)
    const attempts = stats.recognitionAttempts + stats.typedAttempts + stats.exampleAttempts
    if (attempts > 0) seen += 1
    stages[getLearnStage(stats)] += 1
    recognitionCorrect += stats.recognitionCorrect
    recognitionAttempts += stats.recognitionAttempts
    typedCorrect += stats.typedCorrect
    typedAttempts += stats.typedAttempts
    exampleCorrect += stats.exampleCorrect
    exampleAttempts += stats.exampleAttempts
  })

  return {
    seen,
    mastered: stages.mastered,
    stages,
    recognitionRate: rate(recognitionCorrect, recognitionAttempts),
    typedRate: rate(typedCorrect, typedAttempts),
    exampleRate: rate(exampleCorrect, exampleAttempts),
    recognitionAttempts,
    typedAttempts,
    exampleAttempts,
  }
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
