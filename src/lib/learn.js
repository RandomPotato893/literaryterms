export function learnAttempts(stats) {
  return stats.recognitionAttempts + stats.typedAttempts + stats.exampleAttempts
}

export const learnFormatOrder = [
  'multiple-choice-term',
  'free-response-term',
  'free-response-definition',
  'example',
]

export function eligibleLearnQuestions(questions, completedIds = []) {
  const completed = new Set(completedIds)
  const byConcept = new Map()

  for (const question of questions) {
    if (completed.has(question.id)) continue
    const conceptQuestions = byConcept.get(question.conceptId) || []
    conceptQuestions.push(question)
    byConcept.set(question.conceptId, conceptQuestions)
  }

  return [...byConcept.values()].map((conceptQuestions) => (
    conceptQuestions.sort(
      (first, second) => learnFormatOrder.indexOf(first.format) - learnFormatOrder.indexOf(second.format),
    )[0]
  ))
}

export function pickNextLearnQuestion(questions, completedIds = [], previousQuestion = null, random = Math.random) {
  const eligible = eligibleLearnQuestions(questions, completedIds)
  if (!eligible.length) return null

  let candidates = previousQuestion
    ? eligible.filter((question) => question.id !== previousQuestion.id)
    : eligible
  if (!candidates.length) candidates = eligible

  if (previousQuestion) {
    const otherConcepts = candidates.filter((question) => question.conceptId !== previousQuestion.conceptId)
    if (otherConcepts.length) candidates = otherConcepts
  }

  return candidates[Math.floor(random() * candidates.length)]
}
