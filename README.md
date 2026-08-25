# Litmus

Litmus is a static literary terms study app with browser-only progress tracking. It covers all 87 terms from the supplied class list with customizable Learn sessions, flashcards, passage recognition, mixed tests, and a searchable library. Bundled class-list entries are split into 101 independently testable concepts during quizzes.

## Custom Learn sessions

Learn opens with a session builder for the complete 87-term set. Each of four formats can be toggled independently: multiple-choice terms, free-response terms, free-response definitions, and passage examples. Select all four, any subset, or clear all four before making a new selection; a session starts once at least one format is enabled. Each of the 101 independently testable terms and subtypes must be answered correctly once per enabled format, for 404 milestones when all four formats are enabled. Incorrect answers remain pending and do not advance the completion counter.

Enabled formats follow a prerequisite order for each concept: multiple-choice term, free-response term, free-response definition, then passage example. Unselected stages are skipped, so an example can appear as soon as that same concept’s selected definition stages have been passed; the user does not need to finish every definition first. The passage is chosen randomly from the concept’s three examples and stays pending until answered correctly. Bundled entries—such as the four kinds of metaphor—use separate subtype questions whose definitions do not repeat the answer label.

An active Learn session is stored in the browser with its pending queue, completed milestones, current question, attempts, and visible answer state. Reloading while Learn is open returns to that session, and leaving Learn for another section does not discard it. The learner must use the explicit End session or New session action before creating a different Learn session.

Passage practice now lives in Learn rather than a separate Examples center. Mixed tests can contain 10, 50, 100, 300, or 600 questions; when the requested length exceeds the 404 unique definition and passage templates, templates repeat in a newly shuffled cycle with reshuffled answer choices.

## Run locally

```bash
npm install
npm run dev
```

The development server prints the local URL. Progress is stored in the browser's `localStorage`.

## Check and build

```bash
npm run build
npm run preview
```

The build validates the study dataset before creating the static site in `dist/`.

## Publish on GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository settings, open **Pages** and select **GitHub Actions** as the source.
3. The included workflow builds and publishes the site after each push to `main`.

No backend, account, environment variables, or paid service is required.
