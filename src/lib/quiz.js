import { quizVariantsForTerm } from '../data/quizVariants.js'

export function shuffle(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapWith]] = [copy[swapWith], copy[index]]
  }
  return copy
}

export const learnQuestionFormats = [
  {
    id: 'multiple-choice-term',
    label: 'Multiple-choice terms',
    shortLabel: 'Multiple choice',
    description: 'Read a definition and choose the matching literary term.',
  },
  {
    id: 'free-response-term',
    label: 'Free-response terms',
    shortLabel: 'Type the term',
    description: 'Read a definition and type the literary term from memory.',
  },
  {
    id: 'free-response-definition',
    label: 'Free-response definitions',
    shortLabel: 'Write the definition',
    description: 'See a literary term and explain its meaning in your own words.',
  },
  {
    id: 'example',
    label: 'Examples',
    shortLabel: 'Passage example',
    description: 'Read a short passage and identify the device or concept being used.',
  },
]

export function buildLearnQuestionForFormat(term, format, terms, attemptIndex = 0, exampleIndex = null) {
  let question
  if (format === 'multiple-choice-term') {
    question = buildLearnQuestion(term, 'recognition', terms, attemptIndex, null, exampleIndex)
  } else if (format === 'free-response-term') {
    question = buildLearnQuestion(term, 'written', terms, attemptIndex, 'term', exampleIndex)
  } else if (format === 'free-response-definition') {
    question = buildLearnQuestion(term, 'written', terms, attemptIndex, 'definition', exampleIndex)
  } else if (format === 'example') {
    question = buildLearnQuestion(term, 'example', terms, attemptIndex, null, exampleIndex)
  } else {
    throw new Error(`Unknown Learn question format: ${format}`)
  }

  return { ...question, format }
}

export function countCompleteLearnQuestions(terms, enabledFormats) {
  const concepts = buildQuizConcepts(terms)
  return concepts.length * enabledFormats.length
}

export function buildCompleteLearnQuestions(terms, enabledFormats) {
  const concepts = buildQuizConcepts(terms)
  const questions = []

  for (const format of enabledFormats) {
    concepts.forEach((concept, conceptIndex) => {
      questions.push({
        ...buildLearnQuestionForFormat(concept, format, terms, conceptIndex),
        id: `complete-${format}-${concept.id}`,
      })
    })
  }

  return shuffle(questions)
}

// Some entries in the teacher's list are umbrella terms while others are their
// subtypes. Putting both in one multiple-choice question can create two valid
// answers, so these families are kept apart when distractors are selected.
const overlapPairs = [
  ...[
    'metaphor-implied-extended-dead-mixed', 'simile', 'personification', 'metonymy',
    'synecdoche', 'hyperbole', 'litotes', 'understatement', 'oxymoron', 'paradox',
    'euphemism', 'pun',
  ].map((id) => ['figurative-language', id]),
  ['point-of-view-1st-3rd-omniscient-objective', 'objective-point-of-view'],
  ['point-of-view-1st-3rd-omniscient-objective', 'omniscient-point-of-view'],
  ['irony-verbal-situational-dramatic', 'dramatic-irony'],
  ['plot-exposition-rising-action-climax-resolution-denouement', 'climax'],
  ['plot-exposition-rising-action-climax-resolution-denouement', 'falling-action'],
  ['stanza', 'quatrain'],
  ['stanza', 'couplet'],
  ['metaphor-implied-extended-dead-mixed', 'conceit'],
  ['understatement', 'litotes'],
  ['repetition', 'anaphora'],
  ['repetition', 'epistrophe'],
  ['repetition', 'refrain'],
  ['repetition', 'antimetabole'],
]

function directlyOverlaps(first, second) {
  const firstId = first.parentId || first.id
  const secondId = second.parentId || second.id
  if (firstId === secondId) return false
  return overlapPairs.some((pair) => pair.includes(firstId) && pair.includes(secondId))
}

function relatedDistractors(term, terms, count = 3) {
  const confusion = (term.confusedWith || '').toLowerCase()
  const scored = terms
    .filter((candidate) => candidate.id !== term.id && !directlyOverlaps(term, candidate))
    .map((candidate) => {
      let score = Math.random()
      if (candidate.category === term.category) score += 3
      if (
        confusion.includes(candidate.term.toLowerCase()) ||
        (candidate.confusedWith || '').toLowerCase().includes(term.term.toLowerCase())
      ) {
        score += 5
      }
      return { candidate, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, count).map(({ candidate }) => candidate)
}

function conceptsForTerm(term) {
  if (term.parentId) return [term]
  const variants = quizVariantsForTerm(term)
  if (!variants.length) return [{ ...term, parentId: term.id }]

  return variants.map((variant) => ({
    ...term,
    ...variant,
    id: `${term.id}--${variant.id}`,
    parentId: term.id,
  }))
}

export function buildQuizConcepts(terms) {
  return terms.flatMap(conceptsForTerm)
}

function conceptForTerm(term, preferredIndex = 0) {
  const concepts = conceptsForTerm(term)
  return concepts[preferredIndex % concepts.length]
}

function exampleFor(term, preferredIndex) {
  return term.examples[preferredIndex % term.examples.length]
}

export function buildLearnQuestion(term, skill, terms, attemptIndex = 0, writtenKind = null, exampleIndex = null) {
  const activeSkill = skill === 'mastered' ? 'example' : skill
  const target = conceptForTerm(term, attemptIndex)
  const concepts = buildQuizConcepts(terms)

  if (activeSkill === 'written') {
    const recallKind = writtenKind || (Math.random() < 0.55 ? 'term' : 'definition')
    if (recallKind === 'term') {
      return {
        id: `learn-written-term-${target.id}-${attemptIndex}`,
        skill: 'written',
        writtenKind: 'term',
        termId: target.parentId,
        conceptId: target.id,
        prompt: 'Type the literary term that matches this definition.',
        passage: target.definition,
        expected: target.term,
        definition: target.definition,
        spottingTips: target.spottingTips,
        confusedWith: target.confusedWith,
      }
    }

    return {
      id: `learn-written-definition-${target.id}-${attemptIndex}`,
      skill: 'written',
      writtenKind: 'definition',
      termId: target.parentId,
      conceptId: target.id,
      prompt: `Define ${target.term} in your own words.`,
      expected: target.definition,
      spottingTips: target.spottingTips,
      confusedWith: target.confusedWith,
    }
  }

  const choices = shuffle([target, ...relatedDistractors(target, concepts)]).map((choice) => ({
    id: choice.id,
    text: choice.term,
  }))

  if (activeSkill === 'example') {
    const selectedExampleIndex = Number.isInteger(exampleIndex)
      ? exampleIndex
      : Math.floor(Math.random() * target.examples.length)
    const example = exampleFor(target, selectedExampleIndex)
    return {
      id: `learn-example-${target.id}-${attemptIndex}-${selectedExampleIndex}`,
      skill: 'example',
      termId: target.parentId,
      conceptId: target.id,
      prompt: 'Which literary device or concept is used most clearly in this passage?',
      passage: example.text,
      choices,
      answerId: target.id,
      explanation: example.explanation,
      definition: target.definition,
      confusedWith: target.confusedWith,
    }
  }

  return {
    id: `learn-recognition-${target.id}-${attemptIndex}`,
    skill: 'recognition',
    termId: target.parentId,
    conceptId: target.id,
    prompt: 'Which term matches this definition?',
    passage: target.definition,
    choices,
    answerId: target.id,
    explanation: target.spottingTips.join(' '),
    definition: target.definition,
    confusedWith: target.confusedWith,
  }
}

const gradingStopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'by', 'can', 'for',
  'from', 'has', 'have', 'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
  'the', 'their', 'this', 'through', 'to', 'used', 'uses', 'using', 'when', 'where',
  'which', 'who', 'with',
])

function gradeToken(word) {
  const clean = word.toLowerCase().replace(/[^a-z0-9'-]/g, '')
  if (clean.length > 6 && clean.endsWith('ing')) return clean.slice(0, -3)
  if (clean.length > 5 && clean.endsWith('ed')) return clean.slice(0, -2)
  if (clean.length > 5 && clean.endsWith('es')) return clean.slice(0, -2)
  if (clean.length > 4 && clean.endsWith('s')) return clean.slice(0, -1)
  return clean
}

function contentTokens(text) {
  return [...new Set(
    text
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9']+/g, ' ')
      .split(/\s+/)
      .map(gradeToken)
      .filter((token) => token.length > 2 && !gradingStopWords.has(token)),
  )]
}

export function gradeWrittenDefinition(answer, expected) {
  const answerTokens = new Set(contentTokens(answer))
  const expectedTokens = contentTokens(expected)
  const matched = expectedTokens.filter((token) => answerTokens.has(token)).length
  const coverage = expectedTokens.length ? matched / expectedTokens.length : 0
  const normalizedAnswer = answer.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const normalizedExpected = expected.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const exact = normalizedAnswer === normalizedExpected

  return {
    accepted: exact || coverage >= 0.72,
    close: !exact && coverage >= 0.45,
    coverage: Math.round(coverage * 100),
    matched,
    possible: expectedTokens.length,
  }
}

function normalizeTermAnswer(text) {
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^the (literary )?term (is|would be)\s+/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function editDistance(first, second) {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index)
  for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
    const current = [firstIndex]
    for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
      const substitution = previous[secondIndex - 1] + (first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1)
      current[secondIndex] = Math.min(
        current[secondIndex - 1] + 1,
        previous[secondIndex] + 1,
        substitution,
      )
    }
    previous.splice(0, previous.length, ...current)
  }
  return previous[second.length]
}

export function gradeWrittenTerm(answer, expected) {
  const normalizedAnswer = normalizeTermAnswer(answer)
  const normalizedExpected = normalizeTermAnswer(expected)
  const aliases = new Set([normalizedExpected])
  if (normalizedExpected === 'point of view') aliases.add('pov')

  const compactAnswer = normalizedAnswer.replace(/\s/g, '')
  const distances = [...aliases].map((alias) => editDistance(compactAnswer, alias.replace(/\s/g, '')))
  const distance = Math.min(...distances)
  const expectedLength = Math.max(...[...aliases].map((alias) => alias.replace(/\s/g, '').length))
  const tolerance = expectedLength >= 12 ? 2 : expectedLength >= 6 ? 1 : 0

  return {
    accepted: aliases.has(normalizedAnswer) || distance <= tolerance,
    close: distance <= tolerance + 2,
    distance,
    normalizedAnswer,
  }
}

export function buildExampleQuestions(terms, count, distractorTerms = terms) {
  const targets = buildQuizConcepts(terms)
  const distractorConcepts = buildQuizConcepts(distractorTerms)

  return shuffle(targets)
    .slice(0, Math.min(count, targets.length))
    .map((term, index) => {
      const example = exampleFor(term, Math.floor(Math.random() * term.examples.length))
      const choices = shuffle([term, ...relatedDistractors(term, distractorConcepts)]).map((choice) => ({
        id: choice.id,
        text: choice.term,
      }))

      return {
        id: `example-term-${term.id}-${index}`,
        kind: 'exampleToTerm',
        termId: term.parentId,
        prompt: 'Which literary device or concept is used most clearly in this passage?',
        passage: example.text,
        choices,
        answerId: term.id,
        explanation: example.explanation,
        definition: term.definition,
        confusedWith: term.confusedWith,
      }
    })
}

export function buildTestQuestions(terms, count, distractorTerms = terms) {
  const targets = buildQuizConcepts(terms)
  const distractorConcepts = buildQuizConcepts(distractorTerms)
  const requestedCount = Math.max(0, Math.floor(Number(count) || 0))
  if (!targets.length || !requestedCount) return []

  const templates = targets.flatMap((term) => [
    { term, kind: 'definition' },
    ...term.examples.map((example, exampleIndex) => ({ term, kind: 'example', example, exampleIndex })),
  ])
  const selectedTemplates = []

  while (selectedTemplates.length < requestedCount) {
    const remaining = requestedCount - selectedTemplates.length
    selectedTemplates.push(...shuffle(templates).slice(0, remaining))
  }

  return selectedTemplates.map(({ term, kind, example, exampleIndex }, index) => {
    const distractors = relatedDistractors(term, distractorConcepts)
    const choices = shuffle([term, ...distractors]).map((choice) => ({
      id: choice.id,
      text: choice.term,
    }))

    if (kind === 'definition') {
      return {
        id: `definition-${term.id}-${index}`,
        kind,
        termId: term.parentId,
        prompt: 'Which term matches this definition?',
        passage: term.definition,
        choices,
        answerId: term.id,
        explanation: term.spottingTips.join(' '),
      }
    }

    return {
      id: `test-example-${term.id}-${exampleIndex}-${index}`,
      kind,
      termId: term.parentId,
      prompt: 'Which literary device or concept is used most clearly in this passage?',
      passage: example.text,
      choices,
      answerId: term.id,
      explanation: example.explanation,
    }
  })
}
