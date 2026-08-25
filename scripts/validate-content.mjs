import { readFileSync } from 'node:fs'

const expectedTerms = [
  'Allegory', 'Allusion', 'Ambiguity', 'Anachronism', 'Analogy', 'Anaphora',
  'Anastrophe', 'Anecdote', 'Antimetabole', 'Antithesis', 'Anti-hero', 'Antagonist',
  'Aphorism', 'Apostrophe', 'Assonance', 'Blank Verse', 'Cacophony', 'Caesura',
  'Catharsis', 'Chiasmus', 'Cliché', 'Climax', 'Comic Relief', 'Conceit', 'Conflict (external vs. internal)',
  'Connotation', 'Consonance', 'Couplet', 'Denotation', 'Deus Ex Machina',
  'Dramatic Irony', 'Dynamic Character (vs static)', 'Direct Characterization (vs indirect)', 'Elegy',
  'Enjambment', 'Epiphany', 'Epithet', 'Epistrophe', 'Euphemism', 'Euphony',
  'Falling Action', 'Figurative Language', 'Flat Character (vs round)', 'Flashback', 'Foil',
  'Foreshadowing', 'Hyperbole', 'Imagery', 'Internal Rhyme', 'Inversion', 'Irony (verbal, situational, dramatic)',
  'Juxtaposition', 'Litotes', 'Lyric (poem)', 'Metaphor (implied, extended, dead, mixed)', 'Metonymy', 'Mood', 'Motif',
  'Motivation (of a character)', 'Objective Point Of View', 'Omniscient Point Of View', 'Onomatopoeia',
  'Oxymoron', 'Paradox', 'Parallelism', 'Paraphrase', 'Personification', 'Plot (exposition, rising action, climax, resolution / denouement)',
  'Point of View (1st person, 3rd person, omniscient, objective)', 'Pun', 'Quatrain', 'Refrain', 'Repetition', 'Rhetorical Question',
  'Satire', 'Setting (time, place, situation)', 'Simile', 'Soliloquy', 'Stanza', 'Stream Of Consciousness',
  'Symbol', 'Synecdoche', 'Syntax', 'Theme', 'Tone', 'Tragedy', 'Understatement',
]

const terms = JSON.parse(readFileSync(new URL('../src/data/terms.json', import.meta.url), 'utf8'))
const errors = []

if (!Array.isArray(terms)) errors.push('Dataset must be an array.')
if (terms.length !== expectedTerms.length) errors.push(`Expected ${expectedTerms.length} terms; found ${terms.length}.`)

const ids = new Set()
const names = new Set()

for (const [index, term] of terms.entries()) {
  const label = term?.term || `entry ${index + 1}`
  if (!term?.id || typeof term.id !== 'string') errors.push(`${label}: missing id.`)
  if (ids.has(term?.id)) errors.push(`${label}: duplicate id '${term.id}'.`)
  ids.add(term?.id)
  names.add(term?.term)

  for (const field of ['term', 'category', 'definition', 'confusedWith']) {
    if (typeof term?.[field] !== 'string') errors.push(`${label}: ${field} must be a string.`)
  }
  if (!Array.isArray(term?.spottingTips) || term.spottingTips.length < 2) {
    errors.push(`${label}: needs at least two spotting tips.`)
  }
  if (!Array.isArray(term?.examples) || term.examples.length !== 3) {
    errors.push(`${label}: needs exactly three examples.`)
  } else {
    term.examples.forEach((example, exampleIndex) => {
      if (!example.text || !example.explanation) errors.push(`${label}: example ${exampleIndex + 1} is incomplete.`)
      if (!['easy', 'medium', 'hard'].includes(example.difficulty)) errors.push(`${label}: example ${exampleIndex + 1} has invalid difficulty.`)
    })
  }
  if (!Array.isArray(term?.sourceUrls) || term.sourceUrls.length < 2) {
    errors.push(`${label}: needs at least two independent reference URLs.`)
  }
}

for (const expected of expectedTerms) {
  if (!names.has(expected)) errors.push(`Missing expected term: ${expected}.`)
}

for (const actual of names) {
  if (!expectedTerms.includes(actual)) errors.push(`Unexpected term name: ${actual}.`)
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

const examples = terms.reduce((total, term) => total + term.examples.length, 0)
console.log(`Validated ${terms.length} terms, ${examples} original examples, and ${new Set(terms.flatMap((term) => term.sourceUrls)).size} reference sources.`)
