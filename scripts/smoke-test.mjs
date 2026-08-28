import { readFileSync } from 'node:fs'
import {
  buildCompleteLearnQuestions,
  buildExampleQuestions,
  buildLearnQuestion,
  buildLearnQuestionForFormat,
  buildQuizConcepts,
  buildTestQuestions,
  countCompleteLearnQuestions,
  gradeWrittenDefinition,
  gradeWrittenTerm,
  learnQuestionFormats,
} from '../src/lib/quiz.js'
import {
  getLearnStage,
  isMastered,
  loadProgress,
  needsReview,
  replaceLearnAttempt,
  saveProgress,
  statsFor,
  summarizeProgress,
  updateLearnAttempt,
} from '../src/lib/progress.js'
import { eligibleLearnQuestions, learnFormatOrder } from '../src/lib/learn.js'
import {
  clearLearnSession,
  loadGreekModePreference,
  loadLastView,
  loadLearnSession,
  saveGreekModePreference,
  saveLastView,
  saveLearnSession,
} from '../src/lib/sessionStorage.js'
import { filterGreekModeTerms, greekModeTermIds, learnTermPool } from '../src/data/greekMode.js'

const terms = JSON.parse(readFileSync(new URL('../src/data/terms.json', import.meta.url), 'utf8'))
const errors = []

function checkQuestions(label, questions) {
  questions.forEach((question) => {
    if (!question.id || !question.termId || !question.prompt) errors.push(`${label}: incomplete question.`)
    if (!Array.isArray(question.choices) || question.choices.length < 2 || question.choices.length > 4) {
      errors.push(`${label}: ${question.id} has ${question.choices?.length ?? 0} choices.`)
    }
    if (!question.choices?.some((choice) => choice.id === question.answerId)) {
      errors.push(`${label}: ${question.id} does not contain its answer.`)
    }
    if (new Set(question.choices?.map((choice) => choice.id)).size !== question.choices?.length) {
      errors.push(`${label}: ${question.id} has duplicate choice IDs.`)
    }
  })
}

for (const term of terms) {
  checkQuestions(`example/${term.id}`, buildExampleQuestions([term], 1, terms))
  checkQuestions(`test/${term.id}`, buildTestQuestions([term], 1, terms))
  checkQuestions(`learn-recognition/${term.id}`, [buildLearnQuestion(term, 'recognition', terms)])
  checkQuestions(`learn-example/${term.id}`, [buildLearnQuestion(term, 'example', terms)])

  const written = buildLearnQuestion(term, 'written', terms, 0, 'definition')
  const typedTerm = buildLearnQuestion(term, 'written', terms, 0, 'term')
  const firstConcept = buildQuizConcepts([term])[0]
  if (written.skill !== 'written' || written.expected !== firstConcept.definition || written.writtenKind !== 'definition' || written.choices) {
    errors.push(`learn-written/${term.id}: invalid written-recall question.`)
  }
  if (typedTerm.skill !== 'written' || typedTerm.expected !== firstConcept.term || typedTerm.passage !== firstConcept.definition || typedTerm.writtenKind !== 'term') {
    errors.push(`learn-typed-term/${term.id}: invalid typed-term question.`)
  }
}

const quizConcepts = buildQuizConcepts(terms)
if (quizConcepts.length !== 101) {
  errors.push(`Expected 101 independently testable concepts; found ${quizConcepts.length}.`)
}

for (const concept of quizConcepts) {
  const normalizedLabel = concept.term.toLowerCase().replace(/\([^)]*\)/g, '').trim()
  if (concept.definition.toLowerCase().includes(normalizedLabel)) {
    errors.push(`${concept.id}: answer label appears verbatim in its definition.`)
  }
  if (!Array.isArray(concept.examples) || concept.examples.length !== 3) {
    errors.push(`${concept.id}: needs three passage-identification examples.`)
  }
  for (const example of concept.examples || []) {
    if (example.text.toLowerCase().includes(normalizedLabel)) {
      errors.push(`${concept.id}: answer label appears verbatim in an example passage.`)
    }
  }
}

const expectedLearnFormats = {
  'multiple-choice-term': { skill: 'recognition', writtenKind: undefined },
  'free-response-term': { skill: 'written', writtenKind: 'term' },
  'free-response-definition': { skill: 'written', writtenKind: 'definition' },
  example: { skill: 'example', writtenKind: undefined },
}
for (const format of learnQuestionFormats) {
  const question = buildLearnQuestionForFormat(terms[0], format.id, terms)
  const expected = expectedLearnFormats[format.id]
  if (!expected || question.format !== format.id || question.skill !== expected.skill || question.writtenKind !== expected.writtenKind) {
    errors.push(`Learn format ${format.id} did not generate the expected question type.`)
  }
}
try {
  buildLearnQuestionForFormat(terms[0], 'not-a-format', terms)
  errors.push('An unknown Learn question format did not fail safely.')
} catch {
  // Expected: session controls should never be able to request an unknown format.
}

const exampleFormatSample = buildExampleQuestions(terms, 30, terms)
if (exampleFormatSample.some((question) => question.kind !== 'exampleToTerm' || !question.passage)) {
  errors.push('The example-question generator produced something other than passage-to-term identification.')
}

const duplicateExamples = terms
  .flatMap((term) => term.examples.map((example) => example.text.trim().toLowerCase()))
  .filter((text, index, all) => all.indexOf(text) !== index)

if (duplicateExamples.length) errors.push(`Found ${duplicateExamples.length} duplicate example passage(s).`)

let adaptiveProgress = {}
const adaptiveId = terms[0].id
adaptiveProgress = updateLearnAttempt(adaptiveProgress, adaptiveId, 'recognition', true)
if (getLearnStage(statsFor(adaptiveProgress, adaptiveId)) !== 'written') {
  errors.push('One correct recognition answer did not enqueue written recall.')
}
adaptiveProgress = updateLearnAttempt(adaptiveProgress, adaptiveId, 'written', false)
if (getLearnStage(statsFor(adaptiveProgress, adaptiveId)) !== 'written') {
  errors.push('A missed written answer did not remain in the written queue.')
}
adaptiveProgress = updateLearnAttempt(adaptiveProgress, adaptiveId, 'written', true)
if (getLearnStage(statsFor(adaptiveProgress, adaptiveId)) !== 'example') {
  errors.push('One correct written answer did not enqueue example practice.')
}
adaptiveProgress = updateLearnAttempt(adaptiveProgress, adaptiveId, 'example', true)
if (!isMastered(statsFor(adaptiveProgress, adaptiveId))) {
  errors.push('One correct example answer did not complete the term pipeline.')
}
adaptiveProgress = updateLearnAttempt(adaptiveProgress, adaptiveId, 'example', false)
if (getLearnStage(statsFor(adaptiveProgress, adaptiveId)) !== 'example') {
  errors.push('A missed retention example did not return the term to application practice.')
}
if (!needsReview(statsFor(adaptiveProgress, adaptiveId))) {
  errors.push('A newly weakened skill was not added to review.')
}

let overrideProgress = updateLearnAttempt({}, adaptiveId, 'recognition', true)
const beforeIncorrectWritten = statsFor(overrideProgress, adaptiveId)
overrideProgress = updateLearnAttempt(overrideProgress, adaptiveId, 'written', false)
overrideProgress = replaceLearnAttempt(
  overrideProgress,
  adaptiveId,
  'written',
  beforeIncorrectWritten,
  true,
)
const overrideStats = statsFor(overrideProgress, adaptiveId)
if (overrideStats.typedAttempts !== 1 || overrideStats.typedCorrect !== 1 || getLearnStage(overrideStats) !== 'example') {
  errors.push('Manual written-answer override did not replace the incorrect attempt with a correct one.')
}

const exactGrade = gradeWrittenDefinition(terms[0].definition, terms[0].definition)
const incompleteGrade = gradeWrittenDefinition('something in literature', terms[0].definition)
if (!exactGrade.accepted || incompleteGrade.accepted) {
  errors.push('Written-definition grading thresholds are not behaving as expected.')
}

const dramaticIrony = terms.find((term) => term.id === 'dramatic-irony')
const reversedDramaticIrony = gradeWrittenDefinition(
  'Dramatic irony is when the character knows what will happen before the audience does.',
  dramaticIrony.definition,
)
if (reversedDramaticIrony.accepted) {
  errors.push('A reversed dramatic-irony definition was automatically accepted.')
}

const exactTerm = gradeWrittenTerm('dramatic irony', dramaticIrony.term)
const typoTerm = gradeWrittenTerm('dramatic irnoy', dramaticIrony.term)
const vagueTerm = gradeWrittenTerm('irony', dramaticIrony.term)
if (!exactTerm.accepted || !typoTerm.accepted || vagueTerm.accepted) {
  errors.push('Typed-term automatic grading is not handling exact, typo, and overly broad answers correctly.')
}

const enabledFormatIds = learnQuestionFormats.map((format) => format.id)
const completeLearnQuestions = buildCompleteLearnQuestions(terms, enabledFormatIds)
const expectedFormatCounts = {
  'multiple-choice-term': 101,
  'free-response-term': 101,
  'free-response-definition': 101,
  example: 101,
}

if (countCompleteLearnQuestions(terms, enabledFormatIds) !== 404 || completeLearnQuestions.length !== 404) {
  errors.push(`A fully enabled Learn session should contain 404 questions; found ${completeLearnQuestions.length}.`)
}
if (new Set(completeLearnQuestions.map((question) => question.id)).size !== completeLearnQuestions.length) {
  errors.push('The complete Learn session contains duplicate question IDs.')
}
for (const [format, expectedCount] of Object.entries(expectedFormatCounts)) {
  const actualCount = completeLearnQuestions.filter((question) => question.format === format).length
  if (actualCount !== expectedCount) {
    errors.push(`Learn format ${format} should contain ${expectedCount} questions; found ${actualCount}.`)
  }
}
if (countCompleteLearnQuestions(terms, ['example']) !== 101) {
  errors.push('An examples-only Learn session should contain one question per testable concept.')
}
if (countCompleteLearnQuestions(terms, []) !== 0 || buildCompleteLearnQuestions(terms, []).length !== 0) {
  errors.push('A Learn session with no enabled formats should contain no questions.')
}

const uniqueGreekModeIds = new Set(greekModeTermIds)
const termIds = new Set(terms.map((term) => term.id))
if (uniqueGreekModeIds.size !== greekModeTermIds.length) {
  errors.push('Greek mode contains duplicate term IDs.')
}
for (const id of greekModeTermIds) {
  if (!termIds.has(id)) errors.push(`Greek mode includes unknown term ID: ${id}.`)
}
const greekTerms = filterGreekModeTerms(terms)
const greekConcepts = buildQuizConcepts(greekTerms)
const greekLearnQuestions = buildCompleteLearnQuestions(greekTerms, enabledFormatIds)
if (learnTermPool(terms, false).length !== terms.length) {
  errors.push('The full Learn bank should be unchanged when Greek mode is off.')
}
if (greekTerms.length !== greekModeTermIds.length || greekTerms.length >= terms.length) {
  errors.push(`Greek mode should contain a strict subset of terms; found ${greekTerms.length} of ${terms.length}.`)
}
if (countCompleteLearnQuestions(greekTerms, enabledFormatIds) !== greekConcepts.length * enabledFormatIds.length) {
  errors.push('Greek-mode Learn question counts do not match the filtered concept bank.')
}
if (greekLearnQuestions.some((question) => !uniqueGreekModeIds.has(question.termId))) {
  errors.push('A Greek-mode Learn session included a term outside the Greek-mode bank.')
}
if (greekLearnQuestions.filter((question) => question.format === 'example').length !== greekConcepts.length) {
  errors.push('Greek mode did not include one example question per remaining concept.')
}
for (const term of greekTerms) {
  checkQuestions(`greek-mode/${term.id}`, [buildLearnQuestion(term, 'recognition', greekTerms)])
}

const stagedQuestions = buildCompleteLearnQuestions(
  terms.slice(0, 3),
  ['free-response-definition', 'example'],
)
const initiallyEligible = eligibleLearnQuestions(stagedQuestions)
if (initiallyEligible.some((question) => question.format !== 'free-response-definition')) {
  errors.push('Learn unlocked an example before its prerequisite definition was completed.')
}
const completedDefinition = initiallyEligible[0]
const afterDefinition = eligibleLearnQuestions(stagedQuestions, [completedDefinition.id])
const unlockedForConcept = afterDefinition.find((question) => question.conceptId === completedDefinition.conceptId)
if (unlockedForConcept?.format !== 'example') {
  errors.push('Completing a definition did not unlock that concept’s example question.')
}
const afterIncorrectAttempt = eligibleLearnQuestions(stagedQuestions)
if (!afterIncorrectAttempt.some((question) => question.id === completedDefinition.id)) {
  errors.push('An incorrectly answered Learn question was removed from the pending queue.')
}
if (learnFormatOrder.join('|') !== 'multiple-choice-term|free-response-term|free-response-definition|example') {
  errors.push('Learn prerequisite formats are not in the expected progression order.')
}

const conceptById = new Map(quizConcepts.map((concept) => [concept.id, concept]))
const exampleQuestions = completeLearnQuestions.filter((question) => question.format === 'example')
if (new Set(exampleQuestions.map((question) => question.answerId)).size !== quizConcepts.length) {
  errors.push('The Examples format did not include every testable concept exactly once.')
}
for (const question of exampleQuestions) {
  const validPassages = conceptById.get(question.answerId)?.examples.map((example) => example.text) || []
  if (!validPassages.includes(question.passage)) {
    errors.push(`The Examples question for ${question.answerId} did not use one of that concept's passages.`)
  }
}

const maximumTest = buildTestQuestions(terms, 600, terms)
checkQuestions('test/600', maximumTest)
if (maximumTest.length !== 600 || new Set(maximumTest.map((question) => question.id)).size !== 600) {
  errors.push(`A maximum-length test should contain 600 distinct question instances; found ${maximumTest.length}.`)
}

const storageData = new Map()
globalThis.localStorage = {
  getItem: (key) => storageData.get(key) ?? null,
  setItem: (key, value) => storageData.set(key, String(value)),
  removeItem: (key) => storageData.delete(key),
}
const persistedFixture = {
  phase: 'paused',
  round: {
    progress: {},
    enabledFormats: ['free-response-definition', 'example'],
    questions: stagedQuestions,
    question: stagedQuestions[0],
    completedIds: [stagedQuestions[1].id],
    results: [],
  },
  ui: {
    selected: null,
    writtenAnswer: 'A saved partial response',
    writtenReview: null,
    answered: null,
  },
}
if (!saveLearnSession(persistedFixture)) errors.push('A valid Learn session could not be saved.')
const restoredFixture = loadLearnSession()
if (
  restoredFixture?.round.question.id !== persistedFixture.round.question.id
  || restoredFixture?.round.completedIds[0] !== persistedFixture.round.completedIds[0]
  || restoredFixture?.ui.writtenAnswer !== persistedFixture.ui.writtenAnswer
) {
  errors.push('The saved Learn session did not restore its queue, counter, and answer state.')
}
saveLastView('learn')
if (loadLastView(['home', 'learn']) !== 'learn' || loadLastView(['home']) !== 'home') {
  errors.push('The current app view did not persist safely across reloads.')
}
clearLearnSession()
if (loadLearnSession() !== null) errors.push('Explicitly clearing a Learn session did not remove it.')
saveGreekModePreference(true)
if (!loadGreekModePreference()) errors.push('Greek mode preference did not persist as on.')
saveGreekModePreference(false)
if (loadGreekModePreference()) errors.push('Greek mode preference did not persist as off.')

const PROGRESS_KEY = 'litmus-progress-v1'
const frozenTermIds = [
  'allegory', 'allusion', 'ambiguity', 'anachronism', 'analogy', 'anaphora', 'anastrophe',
  'anecdote', 'antimetabole', 'antithesis', 'anti-hero', 'antagonist', 'aphorism', 'apostrophe',
  'assonance', 'blank-verse', 'cacophony', 'caesura', 'catharsis', 'chiasmus', 'cliche', 'climax',
  'comic-relief', 'conceit', 'conflict-external-vs-internal', 'connotation', 'consonance', 'couplet',
  'denotation', 'deus-ex-machina', 'dramatic-irony', 'dynamic-character-vs-static',
  'direct-characterization-vs-indirect', 'elegy', 'enjambment', 'epiphany', 'epithet', 'epistrophe',
  'euphemism', 'euphony', 'falling-action', 'figurative-language', 'flat-character-vs-round',
  'flashback', 'foil', 'foreshadowing', 'hyperbole', 'imagery', 'internal-rhyme', 'inversion',
  'irony-verbal-situational-dramatic', 'juxtaposition', 'litotes', 'lyric-poem',
  'metaphor-implied-extended-dead-mixed', 'metonymy', 'mood', 'motif', 'motivation-of-a-character',
  'objective-point-of-view', 'omniscient-point-of-view', 'onomatopoeia', 'oxymoron', 'paradox',
  'parallelism', 'paraphrase', 'personification', 'plot-exposition-rising-action-climax-resolution-denouement',
  'point-of-view-1st-3rd-omniscient-objective', 'pun', 'quatrain', 'refrain', 'repetition',
  'rhetorical-question', 'satire', 'setting-time-place-situation', 'simile', 'soliloquy', 'stanza',
  'stream-of-consciousness', 'symbol', 'synecdoche', 'syntax', 'theme', 'tone', 'tragedy', 'understatement',
]
if (terms.map((term) => term.id).join('|') !== frozenTermIds.join('|')) {
  errors.push('Term ids changed. That would orphan client-side Learn progress keyed by those ids.')
}
if (greekModeTermIds.some((id) => !frozenTermIds.includes(id))) {
  errors.push('Greek mode contains a term id that is not in the saved-progress key set.')
}

function masteredRecord(lastSeen) {
  return {
    definitionCorrect: 2,
    definitionAttempts: 2,
    recognitionCorrect: 2,
    recognitionAttempts: 2,
    recognitionStreak: 1,
    typedCorrect: 1,
    typedAttempts: 1,
    typedStreak: 1,
    exampleCorrect: 1,
    exampleAttempts: 1,
    exampleStreak: 1,
    starred: false,
    lastSeen,
  }
}

const returningUserProgress = {
  simile: masteredRecord('2026-06-01T12:00:00.000Z'),
  theme: masteredRecord('2026-06-02T12:00:00.000Z'),
  allegory: {
    definitionCorrect: 1,
    definitionAttempts: 2,
    recognitionCorrect: 1,
    recognitionAttempts: 2,
    recognitionStreak: 0,
    typedCorrect: 0,
    typedAttempts: 1,
    typedStreak: 0,
    exampleCorrect: 0,
    exampleAttempts: 0,
    exampleStreak: 0,
    starred: true,
    lastSeen: '2026-06-03T12:00:00.000Z',
  },
  flashback: {
    definitionCorrect: 4,
    definitionAttempts: 4,
    exampleCorrect: 2,
    exampleAttempts: 2,
    starred: false,
    lastSeen: '2026-05-01T00:00:00.000Z',
  },
}

const progressSnapshot = JSON.stringify(returningUserProgress)
storageData.set(PROGRESS_KEY, progressSnapshot)
storageData.set('litmus-learn-session-v1', JSON.stringify({
  version: 1,
  phase: 'paused',
  round: {
    progress: returningUserProgress,
    enabledFormats: ['multiple-choice-term', 'example'],
    questions: stagedQuestions,
    question: stagedQuestions[0],
    completedIds: [stagedQuestions[1].id],
    results: [],
  },
  ui: persistedFixture.ui,
}))

const loadedReturningProgress = loadProgress()
if (JSON.stringify(loadedReturningProgress) !== progressSnapshot) {
  errors.push('Loading progress rewrote a returning user’s saved stats.')
}

const restoredLegacySession = loadLearnSession()
if (!restoredLegacySession) {
  errors.push('A pre-Greek-mode in-progress Learn session was discarded.')
} else if (restoredLegacySession.round.greekMode) {
  errors.push('Restoring a legacy Learn session injected Greek mode onto it.')
}
if (storageData.get(PROGRESS_KEY) !== progressSnapshot) {
  errors.push('Restoring a Learn session mutated litmus-progress-v1.')
}

saveGreekModePreference(true)
if (storageData.get(PROGRESS_KEY) !== progressSnapshot) {
  errors.push('Turning on Greek mode mutated saved Learn progress.')
}
if (!storageData.get('litmus-learn-session-v1')) {
  errors.push('Turning on Greek mode deleted an in-progress Learn session.')
}

const fullSummaryBefore = summarizeProgress(terms, returningUserProgress)
const fullSummaryAfter = summarizeProgress(terms, loadProgress())
if (JSON.stringify(fullSummaryBefore) !== JSON.stringify(fullSummaryAfter)) {
  errors.push('Greek mode changed mastery totals for the full 87-term bank.')
}
if (fullSummaryBefore.mastered !== 2 || fullSummaryBefore.seen !== 4) {
  errors.push(`Unexpected baseline mastery for the compatibility fixture: seen ${fullSummaryBefore.seen}, mastered ${fullSummaryBefore.mastered}.`)
}

const v1Flashback = statsFor(returningUserProgress, 'flashback')
if (getLearnStage(v1Flashback) !== 'written') {
  errors.push('v1 progress without recognition fields is no longer mapped the same way.')
}
if (v1Flashback.recognitionAttempts !== 4 || v1Flashback.recognitionCorrect !== 4 || v1Flashback.exampleStreak !== 2) {
  errors.push('v1 flashback stats were not carried forward with the original recognition and example evidence.')
}

const afterOneAnswer = updateLearnAttempt(loadedReturningProgress, 'allegory', 'recognition', true)
if (JSON.stringify(afterOneAnswer.simile) !== JSON.stringify(loadedReturningProgress.simile)) {
  errors.push('Recording a Learn answer mutated another term’s saved stats.')
}
if (JSON.stringify(afterOneAnswer.flashback) !== JSON.stringify(loadedReturningProgress.flashback)) {
  errors.push('Recording a Learn answer rewrote an untouched v1 term.')
}
if (JSON.stringify(Object.keys(afterOneAnswer).sort()) !== JSON.stringify(Object.keys(loadedReturningProgress).sort())) {
  errors.push('Recording a Learn answer added or removed progress keys.')
}

saveProgress(loadedReturningProgress)
if (storageData.get(PROGRESS_KEY) !== progressSnapshot) {
  errors.push('Re-saving unmodified progress changed the stored JSON for a returning user.')
}

const poolOff = learnTermPool(terms, false)
const poolOn = learnTermPool(terms, true)
if (poolOff !== terms || poolOff.length !== 87) {
  errors.push('Greek mode off no longer uses the complete 87-term bank.')
}
if (summarizeProgress(poolOff, loadedReturningProgress).mastered !== fullSummaryBefore.mastered) {
  errors.push('The unfiltered Learn bank no longer reports the same mastered count.')
}
if (summarizeProgress(poolOn, loadedReturningProgress).mastered !== 0) {
  errors.push('Greek-mode display stats unexpectedly counted elementary mastered terms.')
}

delete globalThis.localStorage

const answerPositions = new Set(
  Array.from({ length: 24 }, () => {
    const question = buildLearnQuestion(terms[0], 'recognition', terms)
    return question.choices.findIndex((choice) => choice.id === question.answerId)
  }),
)
const examplePassages = new Set(
  Array.from({ length: 24 }, () => buildLearnQuestion(terms[0], 'example', terms).passage),
)
const writtenKinds = new Set(
  Array.from({ length: 24 }, () => buildLearnQuestion(terms[0], 'written', terms).writtenKind),
)
if (answerPositions.size < 2) errors.push('Learn answers stayed in one multiple-choice position.')
if (examplePassages.size < 2) errors.push('Learn repeated only one example passage for a term.')
if (writtenKinds.size < 2) errors.push('Learn did not mix typed-term and written-definition recall.')

if (errors.length) {
  console.error(`Smoke tests failed with ${errors.length} issue(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log('Quiz generation, prerequisite Learn progression, session persistence, written grading, test length, and answer integrity checks passed.')
