# Literary terms content verification

## Scope and method

All 261 passages in `examples-blind.json` were classified before `terms-draft.json` was opened. The resulting independent calls are preserved in `blind-review.json`; each record includes the opaque code, primary answer, plausible alternatives, and confidence.

After the blind file was saved, all 87 draft entries were checked field by field: definition, both spotting tips, confusion note, three passages, three explanations, difficulty labels, and source URLs. The verified examples are newly written for this project; no source wording or published literary passage was copied.

The blind comparison normalizes capitalization and removes explanatory parentheticals in display names (for example, `Dynamic Character (vs static)` is compared with `Dynamic Character`). On that basis:

- Exact primary-label agreement: **214 of 261 (81.99%)**
- Primary-label disagreement: **47 of 261 (18.01%)**
- Every one of the 47 disagreements was treated as evidence of possible ambiguity and its passage was replaced, even when the intended draft label was defensible as a broader category.
- A second pass over the 214 agreements identified additional weak, historically questionable, or multi-device passages. In total, **79 passage/explanation pairs across 53 terms** were replaced.

## Sources consulted

Each verified entry retains two source URLs. The working source set contains 174 citations (135 distinct URLs), with two distinct sources per term. The principal authorities used for cross-checking were:

- [Oregon State Guide to English Literary Terms](https://liberalarts.oregonstate.edu/wlf/oregon-state-guide-english-literary-terms), especially its treatments of allegory, characterization, conflict, figurative language, irony, metaphor, metonymy, mood and tone, motif, narrative structure, point of view, sound devices, symbolism, synecdoche, and theme.
- [Poetry Foundation glossary](https://www.poetryfoundation.org/education/glossary), especially blank verse, caesura, couplet, quatrain, stanza, lyric, sound devices, and figures of speech.
- [Silva Rhetoricae at Brigham Young University](https://rhetoric.byu.edu/), especially [chiasmus](https://rhetoric.byu.edu/Figures/C/chiasmus.htm), [antimetabole](https://rhetoric.byu.edu/Figures/A/antimetabole.htm), [anastrophe](https://rhetoric.byu.edu/Figures/A/anastrophe.htm), antithesis, anaphora/epistrophe, litotes, parallelism, and repetition.
- [Encyclopaedia Britannica literature and rhetoric references](https://www.britannica.com/art/literature), used as a second reference for genre, narrative, verse, and rhetorical terminology.
- Open Oregon educational texts, especially the fiction textbook material on character, plot, setting, theme, and narrative point of view, plus its concrete distinction among omniscient, limited, and objective narration.
- [Purdue OWL](https://owl.purdue.edu/), especially parallel structure, paraphrasing, literary analysis, argument, and style resources.
- The University of Texas at San Antonio open-textbook glossary was used as an additional cross-check for common classroom conventions.

## Conventions adopted where authorities overlap or differ

1. **Chiasmus and antimetabole:** Following Silva Rhetoricae, chiasmus reverses grammatical structure or corresponding ideas in an AB–BA design; antimetabole is the narrower construction that repeats the same words in reverse grammatical order. Some references use *chiasmus* as the umbrella for both, so the verified cards state the study-set distinction explicitly.
2. **Metonymy and synecdoche:** Synecdoche is treated as the part–whole subtype of metonymy. A literal inclusion relationship receives the narrower answer *Synecdoche*; other close associations receive *Metonymy*. The debatable “school for debate team” example was removed.
3. **Tone and mood:** Tone is an expressed attitude of speaker, narrator, character, or implied author toward a target. Mood is the atmosphere produced for readers. Tone examples now foreground evaluative diction; mood examples combine setting details without stating a speaker's attitude.
4. **Symbol, motif, and theme:** A symbol has a literal role plus contextual meaning; a motif is defined by recurrence; a theme is a work-level developed question or insight. Symbol examples no longer require recurrence, motif examples do, and theme examples are complete qualified ideas rather than topic words.
5. **Anastrophe and inversion:** The terms are genuine synonyms in some rhetorical references. For a usable two-card study distinction, *Anastrophe* is reserved here for deliberate fronting of a predicate, object, or complement, while *Inversion* is reserved for subject–verb or subject–auxiliary reversal. Both confusion notes disclose this operational convention.
6. **Irony:** Dramatic irony is the specific audience–character knowledge gap. The umbrella irony card uses verbal irony, situational irony, or combinations of subtypes; its hard dramatic-irony duplicate was removed.
7. **Point of view:** The general definition now includes first, second, and third person, plus limited, omniscient, and objective ranges of access. General-card examples compare or shift among stances; the omniscient and objective cards use only their narrower diagnostic evidence.
8. **Figurative language:** Because it is an umbrella, its examples combine several narrower devices. When one subtype dominates, the study tip directs learners to choose that subtype instead.
9. **Verse forms:** Blank verse requires a sustained base of unrhymed iambic pentameter; one isolated “approximately iambic” line is insufficient. A couplet is a two-line verse unit, a quatrain a four-line unit, and a stanza a visually grouped block of any line count. Caesura examples explicitly locate a pause inside a verse line; enjambment examples require syntax to continue across a line break.
10. **Sound devices:** Assonance is repeated vowel sound, consonance repeated consonant sound, internal rhyme repeats the stressed vowel and following sounds with at least one rhyme inside the line, onomatopoeia imitates a named sound, and euphony/cacophony describe the broader aggregate effect. Rewritten passages remove competing personification, mood, or exact-rhyme cues where they obscured the target.
11. **Character terms:** Flat/round concerns complexity; static/dynamic concerns change. Direct characterization states traits, while indirect characterization requires inference. The verified `Dynamic Character` and `Direct Characterization` examples now all demonstrate the named positive term, rather than using one of three slots to test its opposite.

## Substantive correction ledger

Unlisted terms were checked and retained because their definitions, guidance, distinctions, and all three examples remained accurate and sufficiently discriminating. Counts below refer to replaced passage/explanation pairs.

| Term | Substantive correction |
|---|---|
| Allegory | Replaced 1 miniature example with a work-spanning parallel system so it cannot be reduced to one symbol. |
| Allusion | Broadened “brief” to “often brief”; replaced 1 overly covert reference with an identifiable Lady Macbeth reference. |
| Ambiguity | Replaced 2 passages that depended on inferred emotion or personification with two explicitly supported alternative readings. |
| Anachronism | Replaced 2 historically unsafe word-use examples (`viral`, `muted`) with unambiguous technological and print-era mismatches. |
| Analogy | Replaced 1 simile-like sentence with a developed explanatory correspondence. |
| Anaphora | Replaced 1 personification-heavy passage while retaining repeated clause openings. |
| Anastrophe | Refined definition and confusion note to disclose the operational split from inversion; replaced 2 passages to use fronting without subject–verb reversal. |
| Anti-hero | Replaced 1 passage to establish that the morally compromised clerk is the central figure, not merely a changing minor character. |
| Antagonist | Replaced 1 general-conflict passage to identify a sustained opposing agent explicitly. |
| Aphorism | Replaced all 3 figurative examples with compact, broadly applicable statements that do not depend on metaphor. |
| Assonance | Replaced 1 mood-heavy passage with a controlled short-vowel pattern. |
| Blank Verse | Replaced all 3 under-evidenced or metrically uncertain examples with sustained unrhymed-iambic-pentameter evidence and an explicit allowance for variation. |
| Caesura | Replaced all 3 passages so each is explicitly one verse line with an internal punctuation or white-space pause. |
| Chiasmus | Replaced 1 syntax-heavy example with conceptual AB–BA order that does not repeat identical wording. |
| Cliché | Replaced 1 example whose strongest feature was hyperbole with an unmistakably stale stock phrase. |
| Climax | Replaced 2 conflict/paradox-like moments with accumulated pressure, an irreversible turn, and determined consequences. |
| Conflict | Replaced 1 nature-antagonist overlap with a clean internal struggle between incompatible desires. |
| Connotation | Replaced 1 recurring metaphor with a contrast between the associations of `uprising` and `riot`. |
| Consonance | Replaced 1 exact-rhyme example with matching final consonants and different stressed vowels. |
| Couplet | Replaced 1 unusually euphonic/personified pair with a straightforward two-line unit. |
| Denotation | Replaced 1 passage that explicitly tested connotation at the same time with an isolated literal seasonal referent. |
| Dynamic Character | Replaced the static-character slot with a lasting change in outlook and later conduct. |
| Direct Characterization | Replaced the confusion note with the direct/indirect distinction; replaced 2 indirect or mixed examples with traits explicitly stated by narration. |
| Elegy | Replaced 2 apostrophe/personification-heavy examples with poems defined by mourning and movement toward consolation. |
| Enjambment | Replaced 1 metaphor-heavy passage with a prepositional phrase that must cross the line break. |
| Epithet | Removed the inaccurate implication that an epithet must be regularly repeated; it may accompany or substitute for a name. |
| Epistrophe | Replaced 1 simultaneous-anaphora example with different openings and identical clause endings. |
| Euphony | Replaced 2 passages dominated by consonance or imagery with aggregate smooth-sound descriptions. |
| Figurative Language | Added a tip to prefer a narrower subtype when one dominates; replaced all 3 single-device examples with deliberate multi-device clusters. |
| Flat Character | Replaced the round-character slot and 1 suggestively complex minor character with portrayals limited to one function or trait. |
| Foreshadowing | Replaced 1 recurring-door motif with a single early clue that prepares a later revelation. |
| Hyperbole | Replaced 1 personification-dominant example with an unmistakably impossible measure of distance. |
| Internal Rhyme | Replaced 2 personification/assonance-heavy passages with full rhymes inside single lines. |
| Inversion | Refined definition and confusion note to the disclosed subject–verb convention; replaced 1 semantically ambiguous delayed subject. |
| Irony | Replaced the confusion note to distinguish the dedicated dramatic-irony card; replaced 1 duplicate dramatic example with combined verbal and situational irony. |
| Litotes | Replaced 1 generic understatement with the explicit negation-of-the-contrary form. |
| Lyric | Replaced 2 apostrophe/imagery-heavy examples with concentrated inward poems explicitly lacking narrative progression. |
| Metaphor | Replaced all 3 disputed passages to isolate implied, conventional extended, and mixed metaphor respectively, including a clearer contrast from conceit. |
| Metonymy | Replaced 1 passive “newsroom decided” example with an agentive associated-place substitution. |
| Mood | Replaced 1 euphony-dominant passage with a cluster of spatial and sensory details creating shelter and coziness. |
| Omniscient Point of View | Replaced 1 dramatic-irony-like audience secret with direct access to two minds. |
| Paradox | Replaced 1 situational-irony-like archive event with a defensible fidelity/accuracy contradiction. |
| Parallelism | Replaced 2 lexical-repetition/anaphora overlaps with matched grammatical structures using different wording. |
| Point of View | Expanded the definition to include omitted second person and third-person limited narration; replaced all 3 subtype duplicates with comparisons or shifts among stances. |
| Quatrain | Replaced 1 stanza-dominant description with exact four-line-unit evidence independent of meter or rhyme. |
| Repetition | Replaced 2 refrain/motif-like recurrences with lexical reuse lacking a fixed structural or symbolic role. |
| Satire | Replaced 1 merely ironic mishap with an invented institution whose absurd procedure targets bureaucratic self-defeat. |
| Stanza | Replaced 1 four-line-block example with five- and three-line groups so quatrain is not an equally strong answer. |
| Symbol | Replaced 1 recurrent-crack motif with a nonrecurring literal object carrying contextual meaning. |
| Synecdoche | Replaced the debatable institution-for-team example with an indisputable body-part-for-person substitution. |
| Tone | Replaced all 3 passages dominated by irony, personification, or euphemism with evaluative diction and syntax aimed at explicit targets. |
| Tragedy | Replaced 2 irony/abstract-dilemma passages with irreversible suffering, recognition, serious meaning, and central downfall. |
| Understatement | Replaced 1 euphemism-like label with direct minimization of degree and made the distinction explicit. |

Summary of non-example edits: **5 definitions**, **1 spotting-tip array**, and **4 confusion notes** changed. Every rewritten passage also received a new explanation tied to decisive evidence.

## Final validation

### Recall-format audit

After the initial content verification, the active question bank received a separate recall-format audit. Nine bundled class-list entries are now expanded into 23 subtype concepts for practice, producing **101 independently testable concepts** while preserving the original 87-entry Library. Definitions shown in questions are automatically checked so the full answer label cannot appear verbatim in the definition or passage.

The audit also rewrote or reformatted **82 passages across 40 base terms** that described what a poem, novel, narrator, or scene was doing instead of presenting analyzable text. Example Lab now exclusively asks students to move from a self-contained prose or verse excerpt to the literary device or concept. Verse lineation and stanza breaks are preserved on screen. An additional **69 subtype passages** cover the distinctions hidden inside bundled entries. Original text is used throughout rather than copied published excerpts.

`jq` structural validation passed for both JSON files.

- Terms: **87**
- Unique term IDs: **87**
- Unique display terms: **87**
- Examples: **261**
- Unique example texts: **261**
- Difficulty distribution: **87 easy, 87 medium, 87 hard**
- Examples per term: **3**, exactly one at each difficulty
- Source URLs: **174 total, 135 distinct**
- Minimum/maximum sources per term: **2 / 2**
- Blind-review records: **261**, with **261 unique codes**
- Required schema keys are present on every term and every blind-review record.
