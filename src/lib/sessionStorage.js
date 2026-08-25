const LEARN_SESSION_KEY = 'litmus-learn-session-v1'
const LAST_VIEW_KEY = 'litmus-last-view-v1'
const SESSION_VERSION = 1
const restorablePhases = new Set(['study', 'paused', 'complete'])

function storageAvailable() {
  return typeof localStorage !== 'undefined'
}

function validLearnSession(saved) {
  if (!saved || saved.version !== SESSION_VERSION || !restorablePhases.has(saved.phase)) return false
  const { round } = saved
  if (!round || !Array.isArray(round.questions) || !round.questions.length) return false
  if (!Array.isArray(round.completedIds) || !Array.isArray(round.results)) return false
  if (!Array.isArray(round.enabledFormats) || !round.enabledFormats.length) return false

  const questionIds = new Set(round.questions.map((question) => question?.id).filter(Boolean))
  if (questionIds.size !== round.questions.length || !questionIds.has(round.question?.id)) return false
  if (round.completedIds.some((id) => !questionIds.has(id))) return false
  return true
}

export function loadLearnSession() {
  if (!storageAvailable()) return null
  try {
    const saved = JSON.parse(localStorage.getItem(LEARN_SESSION_KEY))
    if (!validLearnSession(saved)) {
      if (saved) localStorage.removeItem(LEARN_SESSION_KEY)
      return null
    }
    return saved
  } catch {
    localStorage.removeItem(LEARN_SESSION_KEY)
    return null
  }
}

export function saveLearnSession(session) {
  if (!storageAvailable()) return false
  try {
    localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify({
      ...session,
      version: SESSION_VERSION,
      savedAt: new Date().toISOString(),
    }))
    return true
  } catch {
    return false
  }
}

export function clearLearnSession() {
  if (!storageAvailable()) return
  localStorage.removeItem(LEARN_SESSION_KEY)
}

export function loadLastView(validViews) {
  if (!storageAvailable()) return 'home'
  const saved = localStorage.getItem(LAST_VIEW_KEY)
  return validViews.includes(saved) ? saved : 'home'
}

export function saveLastView(view) {
  if (!storageAvailable()) return
  localStorage.setItem(LAST_VIEW_KEY, view)
}
