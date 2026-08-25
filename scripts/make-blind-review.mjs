import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

const draft = JSON.parse(readFileSync(new URL('../content/terms-draft.json', import.meta.url), 'utf8'))
const blind = draft
  .flatMap((term) => term.examples.map((example) => ({
    code: createHash('sha256').update(`${term.id}:${example.text}`).digest('hex').slice(0, 10),
    text: example.text,
    difficulty: example.difficulty,
  })))
  .sort((a, b) => a.code.localeCompare(b.code))

writeFileSync(
  new URL('../content/examples-blind.json', import.meta.url),
  `${JSON.stringify(blind, null, 2)}\n`,
)

console.log(`Created a label-free review packet with ${blind.length} examples.`)
