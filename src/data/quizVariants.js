// The supplied class list combines several families into single entries. In a
// quiz, however, showing the family label beside a definition of every subtype
// gives the answer away and tests less than the class material requires. These
// variants let practice ask about each distinction separately while the Library
// still mirrors the original 87-item list.
const quizVariants = {
  'conflict-external-vs-internal': [
    {
      id: 'external-conflict',
      term: 'External Conflict',
      definition: 'A struggle between a character and an outside person, group, institution, force of nature, or technology.',
      spottingTips: ['Identify the character’s goal, then find the outside force obstructing it.', 'The obstacle exists beyond the character’s competing thoughts or feelings.'],
      confusedWith: 'Internal Conflict: competing desires, fears, beliefs, or duties operate within one character.',
      examples: [
        { text: 'Rae shoved the evidence into her coat. At every exit, the censor’s guards checked another reporter’s papers.', explanation: 'Rae’s goal is blocked by an outside institution and its agents.', difficulty: 'easy' },
        { text: 'By noon the river had swallowed the lower trail, but Dev kept climbing toward the stranded cabin.', explanation: 'The rising river is a force of nature obstructing Dev’s rescue attempt.', difficulty: 'medium' },
        { text: '“Print one accusation,” the minister warned, “and your presses become state property.” Mara reached for the publish switch.', explanation: 'A government official and institution directly oppose Mara’s goal of publishing.', difficulty: 'hard' },
      ],
    },
    {
      id: 'internal-conflict',
      term: 'Internal Conflict',
      definition: 'A struggle within one character among incompatible desires, beliefs, fears, values, or duties.',
      spottingTips: ['Look for a choice in which the character sincerely wants incompatible outcomes.', 'The decisive opposition occurs inside the character, even if an outside event triggers it.'],
      confusedWith: 'External Conflict: a person or outside force directly obstructs the character’s goal.',
      examples: [
        { text: 'Rae wanted to expose the theft. She also wanted to protect the brother who had committed it.', explanation: 'Two incompatible desires contend within Rae.', difficulty: 'easy' },
        { text: 'If I speak, I betray the woman who raised me; if I stay silent, I become part of her lie.', explanation: 'The speaker is divided between loyalty and moral responsibility.', difficulty: 'medium' },
        { text: 'Oren held the long-sought letter over the flame. The truth might clear his father—or destroy the hope that had carried him this far.', explanation: 'Oren’s need for truth conflicts with his need to preserve hope.', difficulty: 'hard' },
      ],
    },
  ],
  'dynamic-character-vs-static': [
    {
      id: 'dynamic-character',
      term: 'Dynamic Character',
      definition: 'A character who undergoes a meaningful, lasting change in outlook, values, or behavior through the events of a story.',
      spottingTips: ['Compare the character’s choices near the beginning and end.', 'Look for a change deeper than mood, clothing, location, or new information alone.'],
      confusedWith: 'Static Character: remains fundamentally unchanged despite what happens.',
      examples: [
        { text: 'Jo once refused every favor. After neighbors carried her through the flood, she opened the town’s first mutual-aid pantry.', explanation: 'Experience produces a lasting change from isolation to reciprocal care.', difficulty: 'easy' },
        { text: '“My staff failed me,” the mayor said in spring. By winter she faced the cameras alone: “The policy was mine. The repair must be mine too.”', explanation: 'The mayor changes from deflecting blame to accepting responsibility.', difficulty: 'medium' },
        { text: 'Inez still disliked crowds. Yet when the council outlawed the march, she was first to stand and defend the strangers’ right to gather.', explanation: 'Her personality remains recognizable, but her values now lead to meaningfully different action.', difficulty: 'hard' },
      ],
    },
    {
      id: 'static-character',
      term: 'Static Character',
      definition: 'A character who remains fundamentally unchanged in outlook, values, or typical behavior despite the story’s events.',
      spottingTips: ['Compare the character before and after major pressures or revelations.', 'A lack of deep change is different from having only one trait.'],
      confusedWith: 'Flat Character: lacks complexity; an unchanging character may still be psychologically round.',
      examples: [
        { text: 'Before the voyage, Hale trusted rules above people. After the mutiny, the wreck, and his rescue, he rebuilt the same rigid chain of command.', explanation: 'Severe events do not alter Hale’s governing belief or behavior.', difficulty: 'easy' },
        { text: 'Mira grieved, doubted herself, and nearly resigned, but at the final hearing she again chose evidence over popularity, just as she had on page one.', explanation: 'Her emotions fluctuate while her core principle stays stable.', difficulty: 'medium' },
        { text: '“Mercy invites disorder,” the judge said before condemning a stranger. Years later, when his own son stood accused, he repeated the sentence word for word.', explanation: 'Even personal stakes fail to change the judge’s central outlook.', difficulty: 'hard' },
      ],
    },
  ],
  'direct-characterization-vs-indirect': [
    {
      id: 'direct-characterization',
      term: 'Direct Characterization',
      definition: 'A method in which narration explicitly states a character’s traits, motives, or qualities.',
      spottingTips: ['Look for the narrator plainly naming what a character is like.', 'Readers do not have to infer the stated quality from behavior or speech.'],
      confusedWith: 'Indirect Characterization: readers infer qualities from actions, words, thoughts, appearance, or others’ reactions.',
      examples: [
        { text: 'Mr. Vale was patient with beginners and suspicious of praise.', explanation: 'The narration directly names two of Mr. Vale’s traits.', difficulty: 'easy' },
        { text: 'Generous even when generosity cost him, Mr. Vale never regretted giving away the winter stores.', explanation: 'The narrator explicitly labels him generous.', difficulty: 'medium' },
        { text: 'Others mistook Suri’s silence for fear, but she was deliberate, patient, and unusually brave.', explanation: 'The narration corrects others and states Suri’s qualities outright.', difficulty: 'hard' },
      ],
    },
    {
      id: 'indirect-characterization',
      term: 'Indirect Characterization',
      definition: 'A method that lets readers infer a character’s qualities from actions, speech, thoughts, appearance, or other characters’ responses.',
      spottingTips: ['Name the trait that the concrete evidence suggests but does not state.', 'Look for revealing choices, habits, dialogue, or reactions.'],
      confusedWith: 'Direct Characterization: narration explicitly tells readers the quality.',
      examples: [
        { text: 'Mr. Vale knelt beside the new student’s desk and explained the same step a fourth time without looking at the clock.', explanation: 'His patient action lets readers infer the trait without naming it.', difficulty: 'easy' },
        { text: '“Keep the larger half,” Suri said, sliding the bread across the table before anyone noticed her own empty plate.', explanation: 'Speech and action imply generosity without an explicit label.', difficulty: 'medium' },
        { text: 'At each compliment, Ivo changed the subject. He kept every rejection letter in a locked drawer and every award in an unmarked box.', explanation: 'The pattern invites an inference about discomfort, humility, or insecurity rather than directly stating a trait.', difficulty: 'hard' },
      ],
    },
  ],
  'flat-character-vs-round': [
    {
      id: 'flat-character',
      term: 'Flat Character',
      definition: 'A character built around one or a few clear traits, with little complexity beyond a limited role or function.',
      spottingTips: ['Ask whether one trait or function nearly exhausts the portrayal.', 'Frequency of appearance does not by itself create complexity.'],
      confusedWith: 'Static Character: does not change; a character can be complex yet static, or simple yet dynamic.',
      examples: [
        { text: 'Whenever the hero entered the shop, the clerk complained about money, counted the coins twice, and vanished from the scene.', explanation: 'One repeated trait and function exhaust the clerk’s portrayal.', difficulty: 'easy' },
        { text: 'Coach Brill appeared only to shout about discipline: at practice, at dinner, even during the evacuation.', explanation: 'The coach is limited to one exaggerated quality across appearances.', difficulty: 'medium' },
        { text: '“Victory!” the messenger cried with his usual grin. Three winters later he announced the capital’s fall with the same grin, then skipped away to deliver the next piece of news.', explanation: 'Repeated appearances add no layer beyond his single function and unchanging cheerfulness.', difficulty: 'hard' },
      ],
    },
    {
      id: 'round-character',
      term: 'Round Character',
      definition: 'A character portrayed with layered, sometimes conflicting traits, motives, and responses that create a complex sense of personhood.',
      spottingTips: ['Look for credible tensions among the character’s values, desires, and behavior.', 'Complexity—not whether the character changes—is the decisive feature.'],
      confusedWith: 'Dynamic Character: changes meaningfully; a complex character may remain fundamentally unchanged.',
      examples: [
        { text: 'Lena bullied every rival at work, cared tenderly for her ill father, feared being ordinary, and quietly paid a competitor’s rent.', explanation: 'Her conflicting conduct and motives create a layered portrayal.', difficulty: 'easy' },
        { text: 'The captain loved ceremony but hated authority, forgave personal insults but nursed political grudges, and could explain every contradiction without resolving it.', explanation: 'Several believable tensions give the captain psychological complexity.', difficulty: 'medium' },
        { text: 'Mara exposed the bribe from principle, enjoyed the praise more than she admitted, and regretted the innocent clerk harmed by a choice she would still make again.', explanation: 'Mixed motives and unresolved moral tension make Mara more than a single trait.', difficulty: 'hard' },
      ],
    },
  ],
  'irony-verbal-situational-dramatic': [
    {
      id: 'verbal-irony',
      term: 'Verbal Irony',
      definition: 'A deliberate gap between what a speaker says and what the speaker actually means, often expressing criticism through apparent praise.',
      spottingTips: ['Use context to compare the literal statement with the intended attitude.', 'The speaker must mean something importantly different from the words’ surface meaning.'],
      confusedWith: 'Sarcasm: a mocking or cutting tone that often uses this device, but the two are not identical.',
      examples: [
        { text: 'As hail shattered the greenhouse roof, the gardener said, “Perfect weather for seedlings.”', explanation: 'The literal praise communicates the opposite judgment.', difficulty: 'easy' },
        { text: '“Another masterpiece of planning,” Jo said when the bus arrived three minutes after the ferry departed.', explanation: 'Context shows that “masterpiece” condemns the planning rather than praising it.', difficulty: 'medium' },
        { text: 'Surveying the ankle-deep water in the records room, the chief murmured, “Exactly the dryness we ordered.”', explanation: 'The chief’s stated approval conveys criticism through contradiction with the scene.', difficulty: 'hard' },
      ],
    },
    {
      id: 'situational-irony',
      term: 'Situational Irony',
      definition: 'An outcome that meaningfully reverses or contradicts what the situation reasonably led readers or characters to expect.',
      spottingTips: ['State the reasonable expectation, then the consequential reversal.', 'Mere bad luck or coincidence is not enough; the outcome should expose a pointed mismatch.'],
      confusedWith: 'Dramatic Irony: the audience knows something a character does not; Verbal Irony: a speaker means something different from the literal words.',
      examples: [
        { text: 'A locksmith installed ten new locks, then trapped herself outside because every key remained on the kitchen table.', explanation: 'The security expert’s effort to prevent exclusion causes her own exclusion.', difficulty: 'easy' },
        { text: 'The town cut down its last shade trees to build a monument honoring the founders’ love of nature.', explanation: 'The tribute destroys the very thing it claims to honor.', difficulty: 'medium' },
        { text: 'To stop students from wasting time, the school introduced an hourly form on which they had to document every minute they wasted.', explanation: 'The supposed solution reproduces and intensifies the targeted problem.', difficulty: 'hard' },
      ],
    },
  ],
  'metaphor-implied-extended-dead-mixed': [
    {
      id: 'implied-metaphor',
      term: 'Implied Metaphor',
      definition: 'A nonliteral comparison that transfers qualities or actions from an unnamed source rather than explicitly identifying both sides.',
      spottingTips: ['Infer the missing comparison source from the borrowed action or quality.', 'Unlike a simile, the comparison has no “like” or “as” signal.'],
      confusedWith: 'Explicit Metaphor: directly names both subjects in the identification.',
      examples: [
        { text: 'The prosecutor stalked the contradiction, sprang at it, and pinned it before the witness could answer.', explanation: 'Predatory actions imply an animal comparison without naming the animal.', difficulty: 'easy' },
        { text: 'At the first objection, the senator bristled and showed his teeth.', explanation: 'Animal defenses are transferred to the senator while the source animal remains unnamed.', difficulty: 'medium' },
        { text: 'Her questions circled the alibi, sniffed at its weakest edge, then tore it open.', explanation: 'The questions behave like hunting animals, but that comparison source is only implied.', difficulty: 'hard' },
      ],
    },
    {
      id: 'extended-metaphor',
      term: 'Extended Metaphor',
      definition: 'A nonliteral comparison sustained through multiple linked images, correspondences, or lines in a passage.',
      spottingTips: ['Track several details belonging to the same comparison system.', 'The comparison develops rather than appearing in only one phrase.'],
      confusedWith: 'Conceit: a particularly elaborate, surprising, or intellectually demanding sustained comparison.',
      examples: [
        { text: 'Our office is a tired machine. The interns catch between its gears, old rules slip from their belts, and every manager claims someone else holds the wrench.', explanation: 'Several linked mechanical details sustain one comparison.', difficulty: 'easy' },
        { text: 'Grief moved into the spare room. It hung its coat behind the door, filled the drawers with silence, and each night asked whether it could stay.', explanation: 'One identification is developed through a series of connected household details.', difficulty: 'medium' },
        { text: 'She planted one rumor at breakfast. By noon it had rooted in every corridor; by dusk, its poisonous flowers leaned from a hundred mouths.', explanation: 'Plant imagery develops the same comparison across several stages.', difficulty: 'hard' },
      ],
    },
    {
      id: 'dead-metaphor',
      term: 'Dead Metaphor',
      definition: 'A once-figurative expression used so conventionally that its original comparison is rarely noticed and it may feel almost literal.',
      spottingTips: ['Ask whether ordinary speakers use the expression without picturing its original image.', 'Its familiarity, not simply its age, makes the figure feel inactive.'],
      confusedWith: 'Cliché: any overused expression or idea; this term specifically concerns a conventionalized comparison.',
      examples: [
        { text: 'At the foot of the stairs, leave the package beside the table leg.', explanation: '“Foot” and “leg” conventionally name positions or parts without strongly evoking a human-body comparison.', difficulty: 'easy' },
        { text: 'The deadline is approaching, so give me a rough draft by noon.', explanation: '“Approaching” and “rough” retain figurative histories that ordinary usage barely activates.', difficulty: 'medium' },
        { text: 'The committee will tackle the issue at the heart of the matter.', explanation: 'Both conventional comparisons are processed almost as ordinary literal phrasing.', difficulty: 'hard' },
      ],
    },
    {
      id: 'mixed-metaphor',
      term: 'Mixed Metaphor',
      definition: 'An expression that combines incompatible comparison systems, often producing an illogical or unintentionally comic image.',
      spottingTips: ['Identify each source image, then test whether they can coherently coexist.', 'A deliberate sequence of different images is not necessarily faulty unless the images collide.'],
      confusedWith: 'Extended Metaphor: develops one coherent comparison system through several details.',
      examples: [
        { text: 'Her argument took root, shifted into high gear, and finally sailed off course.', explanation: 'Plant, machine, and navigation systems collide in one description.', difficulty: 'easy' },
        { text: 'We’ll burn that bridge when the ball is in our court.', explanation: 'A future bridge-burning plan is illogically fused with a sports image.', difficulty: 'medium' },
        { text: 'The proposal is a seed we must hammer out before it gathers steam.', explanation: 'The proposal becomes, incompatibly, a plant, metalwork, and a steam engine.', difficulty: 'hard' },
      ],
    },
  ],
  'plot-exposition-rising-action-climax-resolution-denouement': [
    {
      id: 'exposition',
      term: 'Exposition',
      definition: 'The portion of a narrative that establishes the initial characters, setting, situation, and background needed to understand what follows.',
      spottingTips: ['Look for foundational information presented before the central complications build.', 'Background can be woven into action rather than delivered as an opening information block.'],
      confusedWith: 'Rising Action: complications intensify the central conflict after the initial situation is established.',
      examples: [
        { text: 'In Bellweather, every family owed the sea one day of labor each month. Mara, the lighthouse keeper’s youngest daughter, had never once been beyond the harbor wall.', explanation: 'The passage establishes place, social conditions, and a central character’s initial situation.', difficulty: 'easy' },
        { text: 'Before the bells failed, Tomas translated routine weather reports in the embassy basement and went home each night to his brother across the border.', explanation: 'Background details establish ordinary life and relationships before disruption.', difficulty: 'medium' },
        { text: 'The trial began on the city’s hottest morning. Judge Vale knew the accused only as case 814; the spectators knew her as the governor’s missing heir.', explanation: 'Setting, roles, and crucial background are efficiently introduced at the narrative’s outset.', difficulty: 'hard' },
      ],
    },
    {
      id: 'rising-action',
      term: 'Rising Action',
      definition: 'A sequence of complications and escalating choices that intensifies a narrative’s central conflict on the way to its decisive crisis.',
      spottingTips: ['Track how each development raises stakes or narrows options.', 'The decisive confrontation has not happened yet.'],
      confusedWith: 'Climax: the crisis or turning point that determines the central conflict’s outcome.',
      examples: [
        { text: 'First the well ran low. Then someone cut the northern pipe. When a child disappeared beside the locked reservoir, the two neighborhoods armed their gates.', explanation: 'Successive complications escalate conflict and stakes before a decisive confrontation.', difficulty: 'easy' },
        { text: 'Nia found one forged receipt, then a ledger of false names. Before she could copy it, her key stopped working and footsteps entered the archive.', explanation: 'Evidence, obstruction, and immediate danger build pressure toward a crisis.', difficulty: 'medium' },
        { text: 'Each compromise cost the candidate another ally; each refusal sent another secret to the press. On debate night, only her own signature remained undisclosed.', explanation: 'The narrowing choices and mounting consequences intensify the conflict without yet resolving it.', difficulty: 'hard' },
      ],
    },
    {
      id: 'resolution-denouement',
      term: 'Resolution / Denouement',
      definition: 'The closing portion of a narrative that settles major conflicts, completes consequences, and establishes the characters’ or world’s final state.',
      spottingTips: ['Look for the new normal after the central struggle and its immediate aftermath.', 'The passage supplies closure rather than merely lowering tension.'],
      confusedWith: 'Falling Action: earlier post-climax events that work through consequences toward closure.',
      examples: [
        { text: 'By spring the bridge had reopened. Lena kept one burned plank above her desk, and no gate divided the two towns again.', explanation: 'The major conflict is settled and a lasting final state is established.', difficulty: 'easy' },
        { text: 'Years later, children played in the courthouse that had once sentenced their parents. Mara passed it each morning without changing streets.', explanation: 'The passage closes both the public conflict and Mara’s personal relationship to it.', difficulty: 'medium' },
        { text: 'The crown remained empty. The council learned to vote without waiting for a royal bell, while the former queen sold pears under a name no history recorded.', explanation: 'Political and personal closing states provide final resolution.', difficulty: 'hard' },
      ],
    },
  ],
  'point-of-view-1st-3rd-omniscient-objective': [
    {
      id: 'first-person-point-of-view',
      term: 'First-Person Point of View',
      definition: 'A narrative stance in which a participating or observing speaker tells the story using “I” or “we,” with access limited by that speaker’s perspective.',
      spottingTips: ['Find a narrating “I” or “we,” not merely one inside dialogue.', 'Notice what the narrator personally knows, assumes, or withholds.'],
      confusedWith: 'Third-Person Limited: follows one consciousness but refers to that character as “he,” “she,” or “they.”',
      examples: [
        { text: 'I hid the key beneath my tongue and told the guard I had never seen it.', explanation: 'A participant narrates personal action using “I.”', difficulty: 'easy' },
        { text: 'We believed Tomas had betrayed us. Only later did I learn what he had carried across the river.', explanation: 'A participating speaker narrates from a limited “we/I” perspective.', difficulty: 'medium' },
        { text: 'Perhaps Mara forgave me when she closed the door softly. I have replayed that sound for twenty years, but I cannot know.', explanation: 'The “I” narrator openly reveals the limits of personal interpretation.', difficulty: 'hard' },
      ],
    },
    {
      id: 'second-person-point-of-view',
      term: 'Second-Person Point of View',
      definition: 'A narrative stance that makes “you” the character experiencing the story’s actions, perceptions, or choices.',
      spottingTips: ['Confirm that “you” is the narrated subject, not just a character being addressed in dialogue.', 'The narration assigns experiences or actions directly to the reader-like protagonist.'],
      confusedWith: 'Apostrophe: a speaker directly addresses an absent or nonhuman addressee without necessarily narrating that addressee’s actions.',
      examples: [
        { text: 'You open the letter only after the last train leaves, when no apology can bring it back.', explanation: 'The narrated “you” performs the story’s action.', difficulty: 'easy' },
        { text: 'At the checkpoint, you rehearse your false name. The guard studies your hands, and you wonder which one has betrayed you.', explanation: 'Actions and inner experience are assigned to a second-person protagonist.', difficulty: 'medium' },
        { text: 'Years from now, you will insist the bell never rang. Even then, you will remember reaching for the rope.', explanation: 'The narrator constructs the subject’s experience and future denial through “you.”', difficulty: 'hard' },
      ],
    },
    {
      id: 'third-person-limited',
      term: 'Third-Person Limited Point of View',
      definition: 'A narrative stance using “he,” “she,” or “they” that enters one focal character’s mind while withholding direct access to other minds.',
      spottingTips: ['Identify whose thoughts or perceptions the narration can enter.', 'Other characters must remain externally observed or interpreted by the focal character.'],
      confusedWith: 'Omniscient Point of View: can directly reveal more than one character’s inner experience.',
      examples: [
        { text: 'Lena hoped the letter was a joke. Across the table, Arun smiled, but she could not tell whether he had written it.', explanation: 'The narration enters Lena’s mind while Arun remains externally observed.', difficulty: 'easy' },
        { text: 'Tomas watched the council whisper. They looked confident to him, though he suspected everyone in the room was afraid.', explanation: 'Only Tomas’s perception and suspicion are directly available.', difficulty: 'medium' },
        { text: 'Mara remembered the lock’s old combination. When the guard turned away, she wondered whether his sudden cough was a warning.', explanation: 'Mara’s memory and uncertainty form the sole channel of inner access.', difficulty: 'hard' },
      ],
    },
  ],
  'setting-time-place-situation': [
    {
      id: 'setting-time',
      term: 'Setting: Time',
      definition: 'The period, season, date, time of day, or duration in which a narrative’s events occur.',
      spottingTips: ['Look for temporal details that shape what can happen.', 'Distinguish when the story occurs from an earlier event shown in a flashback.'],
      confusedWith: 'Setting: Place: the physical and social environment in which events occur.',
      examples: [
        { text: 'It was the final humid week of August 1920, three days before women could vote nationwide.', explanation: 'The date and historical moment establish when the action occurs.', difficulty: 'easy' },
        { text: 'Between the factory’s midnight whistle and the first streetcar at five, the workers had four hours to cross the city.', explanation: 'Time of day and duration constrain the action.', difficulty: 'medium' },
        { text: 'On election night, while the eastern counties still counted paper ballots, the embassy clocks moved toward midnight.', explanation: 'A specific civic moment and narrowing span of hours establish temporal conditions.', difficulty: 'hard' },
      ],
    },
    {
      id: 'setting-place',
      term: 'Setting: Place',
      definition: 'The physical location and social environment in which a narrative’s events occur.',
      spottingTips: ['Identify landscape, architecture, climate, and human surroundings.', 'Ask how the environment enables, restricts, or pressures the characters.'],
      confusedWith: 'Setting: Time: when and for how long the events occur.',
      examples: [
        { text: 'The town clung to a Louisiana barrier island, its houses raised on pilings above the salt marsh.', explanation: 'Geography and built environment establish the location.', difficulty: 'easy' },
        { text: 'Their one-room apartment sat above an all-night bakery, between the elevated train and the garment district.', explanation: 'Physical and urban-social details establish the environment.', difficulty: 'medium' },
        { text: 'Below the embassy kitchen, protestors filled the avenue; above it, diplomats watched from shuttered offices.', explanation: 'The building and surrounding political geography define the scene’s spatial environment.', difficulty: 'hard' },
      ],
    },
    {
      id: 'setting-situation',
      term: 'Setting: Situation',
      definition: 'The historical, cultural, political, or personal circumstances surrounding a narrative’s action.',
      spottingTips: ['Look beyond coordinates to the conditions governing the characters’ lives.', 'Ask what public or personal circumstance makes this moment consequential.'],
      confusedWith: 'Plot: the chain of events and causes; these are the surrounding conditions in which that chain begins.',
      examples: [
        { text: 'The transit workers had been on strike for six days, and Laila’s employer had just fired anyone who could not reach the office.', explanation: 'A labor crisis and its personal consequence establish the surrounding circumstances.', difficulty: 'easy' },
        { text: 'No one in the village had spoken the old language publicly since the occupation, though every grandmother still sang it at bedtime.', explanation: 'Political and cultural conditions shape the narrative world.', difficulty: 'medium' },
        { text: 'The government had fallen before dinner; the borders would close at dawn, and every embassy employee now had to choose which passport to carry.', explanation: 'A regime collapse creates the immediate political and personal circumstances.', difficulty: 'hard' },
      ],
    },
  ],
}

export function quizVariantsForTerm(termOrId) {
  const id = typeof termOrId === 'string' ? termOrId : termOrId?.id
  return quizVariants[id] || []
}

export default quizVariants
