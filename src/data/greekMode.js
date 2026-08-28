// Greek mode keeps the Learn bank on difficult Greek vocabulary and on
// concepts that are complex words or not elementary. Everyday story-structure
// labels, early figures of speech, and middle-school character/plot terms stay out.
// This is a session filter only. Progress is keyed by term id in
// localStorage (`litmus-progress-v1`); ids here must stay a subset of the
// existing library ids and must never rename or delete a saved stats record.
export const greekModeTermIds = [
  'allegory',
  'ambiguity',
  'anachronism',
  'anaphora',
  'anastrophe',
  'antimetabole',
  'antithesis',
  'anti-hero',
  'aphorism',
  'apostrophe',
  'assonance',
  'blank-verse',
  'cacophony',
  'caesura',
  'catharsis',
  'chiasmus',
  'conceit',
  'connotation',
  'consonance',
  'denotation',
  'deus-ex-machina',
  'elegy',
  'enjambment',
  'epiphany',
  'epithet',
  'epistrophe',
  'euphemism',
  'euphony',
  'foil',
  'hyperbole',
  'internal-rhyme',
  'inversion',
  'juxtaposition',
  'litotes',
  'metaphor-implied-extended-dead-mixed',
  'metonymy',
  'motif',
  'objective-point-of-view',
  'omniscient-point-of-view',
  'onomatopoeia',
  'oxymoron',
  'paradox',
  'parallelism',
  'satire',
  'soliloquy',
  'stream-of-consciousness',
  'synecdoche',
  'syntax',
  'tragedy',
  'understatement',
]

const greekModeTermIdSet = new Set(greekModeTermIds)

export function isGreekModeTerm(term) {
  const id = typeof term === 'string' ? term : term?.id
  return greekModeTermIdSet.has(id)
}

export function filterGreekModeTerms(terms) {
  return terms.filter(isGreekModeTerm)
}

export function learnTermPool(terms, greekMode) {
  return greekMode ? filterGreekModeTerms(terms) : terms
}
