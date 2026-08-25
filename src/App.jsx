import { useEffect, useMemo, useRef, useState } from 'react'
import terms from './data/terms.json'
import { quizVariantsForTerm } from './data/quizVariants'
import {
  clearProgress,
  getLearnStage,
  isMastered,
  loadProgress,
  masteryPercent,
  needsReview,
  rate,
  replaceLearnAttempt,
  saveProgress,
  statsFor,
  summarizeProgress,
  toggleStar,
  updateAttempt,
  updateLearnAttempt,
} from './lib/progress'
import { learnAttempts, pickNextLearnQuestion } from './lib/learn'
import {
  clearLearnSession,
  loadLastView,
  loadLearnSession,
  saveLastView,
  saveLearnSession,
} from './lib/sessionStorage'
import {
  buildCompleteLearnQuestions,
  buildTestQuestions,
  countCompleteLearnQuestions,
  gradeWrittenDefinition,
  gradeWrittenTerm,
  learnQuestionFormats,
  shuffle,
} from './lib/quiz'

const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'learn', label: 'Learn', icon: 'learn' },
  { id: 'flashcards', label: 'Flashcards', icon: 'cards' },
  { id: 'test', label: 'Test', icon: 'test' },
  { id: 'library', label: 'Library', icon: 'library' },
  { id: 'review', label: 'Review', icon: 'review' },
]

const SELF_GRADE_DELAY_MS = 450

function Icon({ name, size = 20, filled = false }) {
  const paths = {
    home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7"/></>,
    learn: <><path d="m12 3 1.5 4.2L18 8.5l-4.5 1.3L12 14l-1.5-4.2L6 8.5l4.5-1.3z"/><path d="M5 15.5 5.8 18 8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-1zM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></>,
    cards: <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h5"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    test: <><path d="M7 3h10v4H7z"/><path d="M6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><path d="m8 14 2.2 2.2L16.5 10"/></>,
    library: <><path d="M4 4h5v16H4zM10 4h5v16h-5zM16.5 5l3.5-1 3.5 14-3.5 1z"/></>,
    review: <><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/><path d="M12 8v4l3 2"/></>,
    star: <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z"/>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Logo() {
  return (
    <div className="logo" aria-label="Litmus">
      <span className="logo-mark"><span>L</span></span>
      <span className="logo-word">litmus</span>
    </div>
  )
}

function filterPool(allTerms, category, focus, progress) {
  let pool = category === 'All topics'
    ? allTerms
    : allTerms.filter((term) => term.category === category)

  if (focus === 'Review') {
    const reviewTerms = pool.filter((term) => needsReview(statsFor(progress, term.id)))
    pool = reviewTerms
  } else if (focus === 'New') {
    const newTerms = pool.filter((term) => {
      const stats = statsFor(progress, term.id)
      return stats.recognitionAttempts + stats.typedAttempts + stats.exampleAttempts === 0
    })
    pool = newTerms
  }

  return pool
}

function App() {
  const [view, setView] = useState(() => loadLastView(navItems.map((item) => item.id)))
  const [progress, setProgress] = useState(loadProgress)
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const categories = useMemo(
    () => ['All topics', ...new Set(terms.map((term) => term.category))],
    [],
  )

  useEffect(() => saveProgress(progress), [progress])
  useEffect(() => saveLastView(view), [view])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMenuOpen(false)
  }, [view])

  const record = (id, kind, correct) => {
    setProgress((current) => updateAttempt(current, id, kind, correct))
  }

  const recordLearn = (id, skill, correct) => {
    setProgress((current) => updateLearnAttempt(current, id, skill, correct))
  }

  const replaceLearnStats = (id, stats) => {
    setProgress((current) => ({ ...current, [id]: stats }))
  }

  const star = (id) => {
    setProgress((current) => toggleStar(current, id))
  }

  if (!terms.length) {
    return (
      <main className="loading-screen">
        <Logo />
        <div className="loader" />
        <p>Preparing the verified study set…</p>
      </main>
    )
  }

  const pageProps = {
    terms,
    categories,
    progress,
    record,
    recordLearn,
    replaceLearnStats,
    star,
    openTerm: setSelectedTerm,
    navigate: setView,
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(item.id)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.id === 'review' && <ReviewCount terms={terms} progress={progress} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <Icon name="check" size={17} />
          <span>87 verified terms</span>
        </div>
      </aside>

      {menuOpen && <button className="menu-scrim" onClick={() => setMenuOpen(false)} aria-label="Dismiss menu" />}

      <header className="mobile-header">
        <Logo />
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </header>

      <main className="main-content">
        {view === 'home' && <Home {...pageProps} />}
        {view === 'learn' && <ContinuousLearn {...pageProps} />}
        {view === 'flashcards' && <Flashcards {...pageProps} />}
        {view === 'test' && <TestMode {...pageProps} />}
        {view === 'library' && <Library {...pageProps} />}
        {view === 'review' && <Review {...pageProps} />}
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.filter((item) => ['home', 'learn', 'test', 'library', 'review'].includes(item.id)).map((item) => (
          <button
            key={item.id}
            className={view === item.id ? 'active' : ''}
            onClick={() => setView(item.id)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {selectedTerm && (
        <TermDetail
          term={selectedTerm}
          stats={statsFor(progress, selectedTerm.id)}
          onClose={() => setSelectedTerm(null)}
          onStar={() => star(selectedTerm.id)}
        />
      )}
    </div>
  )
}

function ReviewCount({ terms, progress }) {
  const count = terms.filter((term) => needsReview(statsFor(progress, term.id))).length
  return count ? <span className="nav-count">{count}</span> : null
}

function Home({ terms, progress, navigate, openTerm }) {
  const summary = summarizeProgress(terms, progress)
  const attention = terms
    .filter((term) => needsReview(statsFor(progress, term.id)))
    .sort((a, b) => {
      const aStats = statsFor(progress, a.id)
      const bStats = statsFor(progress, b.id)
      return masteryPercent(aStats) - masteryPercent(bStats)
    })
    .slice(0, 5)

  return (
    <div className="page home-page">
      <div className="eyebrow">Your literary terms study set</div>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker">Custom Learn</span>
          <h1>Learn it. Recall it.<br /><em>Use it in the wild.</em></h1>
          <p>Choose the question formats you want, then work through every available question in one complete session.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate('learn')}>
              Start Learn <Icon name="arrow" size={18} />
            </button>
            <button className="secondary-button light" onClick={() => navigate('test')}>
              Take a test
            </button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="floating-card card-back">
            <span className="mini-label">Spot the clue</span>
            <p>“The wind whispered warnings through the wheat.”</p>
          </div>
          <div className="floating-card card-front">
            <span className="term-chip">PERSONIFICATION</span>
            <strong>Human behavior given to something nonhuman.</strong>
            <span className="clue-line"><i /> “whispered warnings”</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="section-kicker">At a glance</span>
            <h2>Your progress</h2>
          </div>
          <span className="quiet-label">Saved on this device</span>
        </div>
        <div className="stats-grid">
          <StatCard label="Choice recall" value={summary.recognitionRate} suffix="%" accent="purple" />
          <StatCard label="Written recall" value={summary.typedRate} suffix="%" accent="blue" />
          <StatCard label="Examples" value={summary.exampleRate} suffix="%" accent="coral" />
          <StatCard label="Mastered" value={summary.mastered} suffix={` / ${terms.length}`} accent="green" />
        </div>
        <div className="mastery-map">
          <div className="mastery-map-copy">
            <span className="section-kicker">The complete set</span>
            <strong>Where your 87 terms are now</strong>
          </div>
          <SetProgressSummary summary={summary} total={terms.length} />
          <button className="secondary-button small" onClick={() => navigate('learn')}>Start Learn</button>
        </div>
      </section>

      <section className="section-block split-section">
        <div className="mode-panel example-panel">
          <span className="mode-number">01</span>
          <div className="mode-icon purple"><Icon name="learn" size={26} /></div>
          <h3>Custom Learn</h3>
          <p>Choose multiple choice, typed terms, written definitions, passage examples, or any combination.</p>
          <button className="text-button" onClick={() => navigate('learn')}>Start Learn <Icon name="arrow" size={16} /></button>
        </div>
        <div className="mode-panel">
          <span className="mode-number">02</span>
          <div className="mode-icon coral"><Icon name="test" size={26} /></div>
          <h3>Mixed Test</h3>
          <p>Check both skills together with definitions and example-identification questions.</p>
          <button className="text-button" onClick={() => navigate('test')}>Take a test <Icon name="arrow" size={16} /></button>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Smart review</span>
            <h2>{attention.length ? 'Needs another look' : 'Ready when you are'}</h2>
          </div>
          {attention.length > 0 && <button className="text-button" onClick={() => navigate('review')}>View all</button>}
        </div>
        {attention.length ? (
          <div className="attention-list">
            {attention.map((term) => {
              const stats = statsFor(progress, term.id)
              return (
                <button key={term.id} className="attention-row" onClick={() => openTerm(term)}>
                  <span className="attention-letter">{term.term.charAt(0)}</span>
                  <span className="attention-copy"><strong>{term.term}</strong><small>{term.category}</small></span>
                  <span className="attention-score">{masteryPercent(stats)}% mastery</span>
                  <Icon name="arrow" size={17} />
                </button>
              )
            })}
          </div>
        ) : (
          <div className="empty-state compact">
            <div className="empty-icon"><Icon name="cards" size={28} /></div>
            <div><strong>Start a complete Learn session.</strong><p>Choose the question formats you want and work through every available question.</p></div>
            <button className="secondary-button" onClick={() => navigate('learn')}>Start Learn</button>
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

function StatCard({ label, value, suffix, accent }) {
  return (
    <div className={`stat-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}<small>{suffix}</small></strong>
      <div className="stat-line"><i style={{ width: `${suffix === '%' ? value : Math.min(value * 8, 100)}%` }} /></div>
    </div>
  )
}

function createLearnSession(terms, progress, enabledFormats) {
  if (!enabledFormats.length) throw new Error('A Learn session needs at least one question format.')
  const questions = buildCompleteLearnQuestions(terms, enabledFormats)
  return {
    progress,
    enabledFormats: [...enabledFormats],
    questions,
    question: pickNextLearnQuestion(questions),
    completedIds: [],
    results: [],
  }
}

function ContinuousLearn({ terms, progress, recordLearn, replaceLearnStats, openTerm, navigate }) {
  const allFormatIds = learnQuestionFormats.map((format) => format.id)
  const [restoredSession] = useState(() => loadLearnSession())
  const [phase, setPhase] = useState(() => restoredSession?.phase || 'setup')
  const [selectedFormats, setSelectedFormats] = useState(() => restoredSession?.round.enabledFormats || allFormatIds)
  const [round, setRound] = useState(() => restoredSession?.round || createLearnSession(terms, progress, allFormatIds))
  const [selected, setSelected] = useState(() => restoredSession?.ui?.selected || null)
  const [writtenAnswer, setWrittenAnswer] = useState(() => restoredSession?.ui?.writtenAnswer || '')
  const [writtenReview, setWrittenReview] = useState(() => restoredSession?.ui?.writtenReview || null)
  const [answered, setAnswered] = useState(() => restoredSession?.ui?.answered || null)
  const [selfGradeChoice, setSelfGradeChoice] = useState(null)
  const selfGradeTimer = useRef(null)

  const resetQuestionUi = () => {
    setSelected(null)
    setWrittenAnswer('')
    setWrittenReview(null)
    setAnswered(null)
    setSelfGradeChoice(null)
  }

  const commit = (correct, grading = 'automatic') => {
    if (answered) return null
    const before = statsFor(round.progress, round.question.termId)
    const updated = updateLearnAttempt(round.progress, round.question.termId, round.question.skill, correct)
    const after = statsFor(updated, round.question.termId)
    const nextStage = getLearnStage(after)
    setRound((current) => ({
      ...current,
      progress: updated,
      completedIds: correct && !current.completedIds.includes(round.question.id)
        ? [...current.completedIds, round.question.id]
        : current.completedIds,
      results: [...current.results, {
        questionId: round.question.id,
        conceptId: round.question.conceptId,
        termId: round.question.termId,
        skill: round.question.skill,
        format: round.question.format,
        correct,
        wasNew: learnAttempts(before) === 0,
      }],
    }))
    setAnswered({
      correct,
      grading,
      promoted: nextStage !== getLearnStage(before),
      mastered: nextStage === 'mastered',
      beforeStats: before,
    })
    recordLearn(round.question.termId, round.question.skill, correct)
    return updated
  }

  const answerChoice = (choiceId) => {
    if (answered) return
    setSelected(choiceId)
    commit(choiceId === round.question.answerId)
  }

  const checkWritten = (event) => {
    event?.preventDefault()
    if (!writtenAnswer.trim() || answered) return
    const review = round.question.writtenKind === 'term'
      ? gradeWrittenTerm(writtenAnswer, round.question.expected)
      : gradeWrittenDefinition(writtenAnswer, round.question.expected)
    setWrittenReview(review)
    if (round.question.writtenKind === 'term') {
      commit(review.accepted)
    } else if (review.accepted) {
      commit(true)
    }
  }

  const showWrittenAnswer = () => {
    if (answered) return
    setWrittenReview({ accepted: false, close: false, coverage: 0, skipped: true })
    commit(false)
  }

  const next = (progressOverride = null, correctOverride = null) => {
    const nextProgress = progressOverride || round.progress
    const wasCorrect = correctOverride ?? answered?.correct ?? false
    const completedIds = new Set(round.completedIds)
    if (wasCorrect) completedIds.add(round.question.id)

    if (completedIds.size === round.questions.length) {
      setPhase('complete')
      return
    }

    const nextQuestion = pickNextLearnQuestion(
      round.questions,
      [...completedIds],
      round.question,
    )

    setRound((current) => ({
      ...current,
      progress: nextProgress,
      completedIds: [...completedIds],
      question: nextQuestion,
    }))
    resetQuestionUi()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const gradeAndAdvance = (correct) => {
    const updated = commit(correct, 'manual')
    if (updated) next(updated, correct)
  }

  const overrideWrittenAsCorrect = () => {
    if (!answered || answered.correct || !answered.beforeStats || round.question.skill !== 'written') return null

    const termId = round.question.termId
    const corrected = replaceLearnAttempt(
      round.progress,
      termId,
      round.question.skill,
      answered.beforeStats,
      true,
    )
    const correctedStats = statsFor(corrected, termId)
    const nextStage = getLearnStage(correctedStats)

    setRound((current) => ({
      ...current,
      progress: corrected,
      completedIds: current.completedIds.includes(round.question.id)
        ? current.completedIds
        : [...current.completedIds, round.question.id],
      results: current.results.map((result, index) => (
        index === current.results.length - 1 ? { ...result, correct: true } : result
      )),
    }))
    setAnswered((current) => ({
      ...current,
      correct: true,
      grading: 'override',
      promoted: nextStage !== getLearnStage(current.beforeStats),
      mastered: nextStage === 'mastered',
    }))
    replaceLearnStats(termId, correctedStats)
    return corrected
  }

  const overrideAndAdvance = () => {
    const corrected = overrideWrittenAsCorrect()
    if (corrected) next(corrected, true)
  }

  const chooseSelfGrade = (choice) => {
    if (selfGradeTimer.current || selfGradeChoice) return

    setSelfGradeChoice(choice)
    selfGradeTimer.current = window.setTimeout(() => {
      selfGradeTimer.current = null
      if (choice === 'needs-work') {
        if (answered) next()
        else gradeAndAdvance(false)
      } else if (answered) {
        overrideAndAdvance()
      } else {
        gradeAndAdvance(true)
      }
    }, SELF_GRADE_DELAY_MS)
  }

  useEffect(() => () => {
    if (selfGradeTimer.current) window.clearTimeout(selfGradeTimer.current)
  }, [])

  useEffect(() => {
    if (phase === 'setup') return
    saveLearnSession({
      phase,
      round,
      ui: { selected, writtenAnswer, writtenReview, answered },
    })
  }, [phase, round, selected, writtenAnswer, writtenReview, answered])

  const restartSession = () => {
    setRound(createLearnSession(terms, round.progress, round.enabledFormats))
    resetQuestionUi()
    setPhase('study')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startSession = () => {
    if (!selectedFormats.length) return
    setRound(createLearnSession(terms, round.progress, selectedFormats))
    resetQuestionUi()
    setPhase('study')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const configureNewSession = () => {
    const isIncomplete = round.completedIds.length < round.questions.length
    if (isIncomplete && !window.confirm('End this Learn session? Your saved study progress will remain, but this session’s pending queue will be discarded.')) return

    clearLearnSession()
    setSelectedFormats(round.enabledFormats)
    resetQuestionUi()
    setPhase('setup')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFormat = (formatId) => {
    setSelectedFormats((current) => (
      current.includes(formatId)
        ? current.filter((id) => id !== formatId)
        : [...current, formatId]
    ))
  }

  useEffect(() => {
    if (phase !== 'study') return undefined
    const onKey = (event) => {
      if (selfGradeChoice) {
        event.preventDefault()
        return
      }

      const target = event.target
      const isTyping = target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target?.isContentEditable

      // The answer field owns its Enter press. Without this guard, that same
      // keydown can reach the session shortcut after React renders feedback
      // and immediately advance past it.
      if (isTyping && !writtenReview) return

      if (round.question.skill === 'written') {
        if (writtenReview && !answered && (event.key === '1' || event.key === '2')) {
          event.preventDefault()
          chooseSelfGrade(event.key === '2' ? 'got-it' : 'needs-work')
        } else if (answered && !answered.correct && round.question.writtenKind === 'term' && event.key === '1') {
          event.preventDefault()
          chooseSelfGrade('needs-work')
        } else if (answered && !answered.correct && round.question.writtenKind === 'term' && event.key === '2') {
          event.preventDefault()
          chooseSelfGrade('got-it')
        } else if (answered && event.key === 'Enter') {
          event.preventDefault()
          next()
        }
        return
      }
      const number = Number(event.key)
      if (!answered && number >= 1 && number <= 4) {
        const choice = round.question.choices[number - 1]
        if (choice) answerChoice(choice.id)
      } else if (answered && event.key === 'Enter') {
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, round, answered, writtenReview, selfGradeChoice])

  const summary = summarizeProgress(terms, round.progress)

  if (phase === 'setup') {
    return (
      <LearnSessionSetup
        formats={learnQuestionFormats}
        selectedFormats={selectedFormats}
        onToggle={toggleFormat}
        onSelectAll={() => setSelectedFormats(allFormatIds)}
        onClear={() => setSelectedFormats([])}
        onStart={startSession}
        questionCount={countCompleteLearnQuestions(terms, selectedFormats)}
        summary={summary}
        total={terms.length}
      />
    )
  }

  if (phase === 'paused') {
    return (
      <div className="page learn-pause-page">
        <div className="learn-pause-card">
          <div className="setup-icon"><Icon name="learn" size={28} /></div>
          <span className="section-kicker">Learn paused</span>
          <h1>Your place is saved.</h1>
          <p>You’ve mastered {round.completedIds.length} of {round.questions.length} questions in this session. It will remain saved until you explicitly end it.</p>
          <SetProgressSummary summary={summary} total={terms.length} />
          <div className="result-actions">
            <button className="primary-button" onClick={() => setPhase('study')}>Resume learning <Icon name="arrow" size={17} /></button>
            <button className="secondary-button" onClick={configureNewSession}>End session</button>
            <button className="secondary-button" onClick={() => navigate('home')}>Back home</button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'complete') {
    const score = round.results.filter((result) => result.correct).length
    const practicedIds = [...new Set(round.results.map((result) => result.termId))]
    const practicedTerms = practicedIds.map((id) => terms.find((term) => term.id === id)).filter(Boolean)
    return (
      <div className="page results-page learn-results">
        <ResultRing score={score} total={round.results.length} />
        <span className="section-kicker">Learn complete</span>
        <h1>All {round.questions.length} questions complete.</h1>
        <p>You finished every available question for the formats selected in this session.</p>
        <SetProgressSummary summary={summary} total={terms.length} />
        <div className="round-skill-summary">
          {learnQuestionFormats.filter((format) => round.enabledFormats.includes(format.id)).map((format) => {
            const formatResults = round.results.filter((result) => result.format === format.id)
            const correct = formatResults.filter((result) => result.correct).length
            return (
              <div key={format.id}>
                <span>{format.shortLabel}</span>
                <strong>{formatResults.length ? `${correct}/${formatResults.length}` : '—'}</strong>
              </div>
            )
          })}
        </div>
        <div className="learn-result-terms">
          {practicedTerms.map((term) => {
            const stats = statsFor(round.progress, term.id)
            return (
              <button key={term.id} onClick={() => openTerm(term)}>
                <span><strong>{term.term}</strong><small>{isMastered(stats) ? 'Mastered' : 'Still learning'}</small></span>
                <b>{masteryPercent(stats)}%</b>
              </button>
            )
          })}
        </div>
        <div className="result-actions">
          <button className="primary-button" onClick={restartSession}>Study these again <Icon name="arrow" size={17} /></button>
          <button className="secondary-button" onClick={configureNewSession}>New session</button>
          <button className="secondary-button" onClick={() => navigate('home')}>Back home</button>
        </div>
      </div>
    )
  }

  const question = round.question
  const term = terms.find((item) => item.id === question.termId)
  const isWritten = question.skill === 'written'
  const isTermRecall = isWritten && question.writtenKind === 'term'
  const activeFormat = learnQuestionFormats.find((format) => format.id === question.format)
  const answerLabel = question.choices?.find((choice) => choice.id === question.answerId)?.text || term.term
  const visibleSeen = Math.min(
    terms.length,
    summary.seen + (learnAttempts(statsFor(round.progress, question.termId)) === 0 ? 1 : 0),
  )

  return (
    <div className="page active-session-page learn-session-page">
      <SessionHeader
        label={`${summary.mastered} / ${terms.length} mastered`}
        completed={round.completedIds.length}
        total={round.questions.length}
        onExit={() => setPhase('paused')}
      />
      <div className="learn-session-meta">
        <span className={`skill-chip ${question.skill}`}>{activeFormat?.shortLabel || 'Learn'}</span>
        <span>{visibleSeen} introduced <i /> {terms.length - summary.mastered} still learning</span>
      </div>

      <div className="question-shell learn-question-shell">
        <span className="question-type">{isTermRecall ? 'Type the term' : isWritten ? 'Recall the meaning' : question.skill === 'example' ? 'Apply the term' : 'Recognize the definition'}</span>
        <h2>{question.prompt}</h2>
        {question.passage && <blockquote className={`question-passage ${question.skill === 'recognition' || isTermRecall ? 'definition-passage' : ''}`}>{question.passage}</blockquote>}

        {isWritten ? (
          <>
            <form className="written-answer-form" onSubmit={checkWritten}>
              <label htmlFor="written-answer">{isTermRecall ? 'Your answer' : 'Your definition'}</label>
              {isTermRecall ? (
                <input
                  id="written-answer"
                  value={writtenAnswer}
                  onChange={(event) => setWrittenAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.stopPropagation()
                      checkWritten(event)
                    }
                  }}
                  placeholder="Type the literary term…"
                  disabled={Boolean(writtenReview)}
                  autoComplete="off"
                  autoFocus
                />
              ) : (
                <textarea
                  id="written-answer"
                  value={writtenAnswer}
                  onChange={(event) => setWrittenAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.stopPropagation()
                      checkWritten(event)
                    }
                  }}
                  placeholder="Type the complete idea—not just a synonym…"
                  disabled={Boolean(writtenReview)}
                  autoFocus
                />
              )}
              {!writtenReview && (
                <>
                  <div className="written-actions">
                    <button type="button" className="dont-know-button" onClick={showWrittenAnswer}>I don’t know</button>
                    <button type="submit" className="primary-button" disabled={!writtenAnswer.trim()}>Check answer</button>
                  </div>
                  <small className="written-key-hint">{isTermRecall ? 'Press Enter to check' : 'Enter to check · Shift + Enter for a new line'}</small>
                </>
              )}
            </form>

            {writtenReview && (
              <div className={`written-feedback ${answered?.correct ? 'correct' : answered ? 'incorrect' : 'compare'}`}>
                <div className="written-feedback-title">
                  <span>{answered?.correct ? <Icon name="check" /> : answered ? '!' : <Icon name="info" />}</span>
                  <div>
                    <strong>{isTermRecall
                      ? answered?.correct ? 'Correct term' : 'Not quite'
                      : answered?.correct
                        ? answered.grading === 'manual' ? 'Marked correct by you' : 'Strong definition'
                        : answered
                          ? answered.grading === 'manual' ? 'Marked for more practice' : 'Definition needs review'
                          : writtenReview.close ? 'Close—check the full idea' : 'Compare your meaning'}</strong>
                    {isTermRecall
                      ? <p>{answered?.correct
                        ? answered.grading === 'override' ? 'Marked correct by you.' : `Matched ${question.expected}.`
                        : writtenReview.close ? 'Very close—check the spelling and exact term.' : 'Your answer was checked automatically.'}</p>
                      : !writtenReview.skipped && <p>Your response included about {writtenReview.coverage}% of the definition’s key wording.</p>}
                  </div>
                </div>
                {!writtenReview.skipped && <div className="definition-compare"><span>Your answer</span><p>{writtenAnswer}</p></div>}
                <div className="definition-compare model"><span>{isTermRecall ? 'Correct term' : 'Verified definition'}</span><p>{question.expected}</p></div>
                {!answered ? (
                  <div className="self-grade-actions">
                    <button
                      className={`again-button ${selfGradeChoice === 'needs-work' ? 'selected' : selfGradeChoice ? 'not-selected' : ''}`}
                      onClick={() => chooseSelfGrade('needs-work')}
                      disabled={Boolean(selfGradeChoice)}
                      aria-pressed={selfGradeChoice === 'needs-work'}
                    ><span className="self-grade-key">1</span>Needs more work</button>
                    <button
                      className={`know-button ${selfGradeChoice === 'got-it' ? 'selected' : selfGradeChoice ? 'not-selected' : ''}`}
                      onClick={() => chooseSelfGrade('got-it')}
                      disabled={Boolean(selfGradeChoice)}
                      aria-pressed={selfGradeChoice === 'got-it'}
                    ><span className="self-grade-key">2</span>I got it</button>
                  </div>
                ) : isTermRecall && !answered.correct ? (
                  <div className="self-grade-actions override-actions">
                    <button
                      className={`again-button ${selfGradeChoice === 'needs-work' ? 'selected' : selfGradeChoice ? 'not-selected' : ''}`}
                      onClick={() => chooseSelfGrade('needs-work')}
                      disabled={Boolean(selfGradeChoice)}
                      aria-pressed={selfGradeChoice === 'needs-work'}
                    ><span className="self-grade-key">1</span>Needs more work</button>
                    <button
                      className={`know-button ${selfGradeChoice === 'got-it' ? 'selected' : selfGradeChoice ? 'not-selected' : ''}`}
                      onClick={() => chooseSelfGrade('got-it')}
                      disabled={Boolean(selfGradeChoice)}
                      aria-pressed={selfGradeChoice === 'got-it'}
                    ><span className="self-grade-key">2</span>I got this right</button>
                  </div>
                ) : (
                  <LearnNextPanel answered={answered} onNext={() => next()} isLast={answered?.correct && round.completedIds.length === round.questions.length} />
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="answer-grid">
              {question.choices.map((choice, choiceIndex) => {
                const classNames = ['answer-choice']
                if (selected) {
                  if (choice.id === question.answerId) classNames.push('correct')
                  else if (choice.id === selected) classNames.push('incorrect')
                  else classNames.push('muted')
                }
                return (
                  <button key={choice.id} className={classNames.join(' ')} onClick={() => answerChoice(choice.id)} disabled={Boolean(selected)}>
                    <span className="choice-key">{choiceIndex + 1}</span>
                    <span>{choice.text}</span>
                    {selected && choice.id === question.answerId && <Icon name="check" size={19} />}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={`feedback-panel ${answered.correct ? 'correct' : 'incorrect'} learn-feedback`}>
                <div className="feedback-top">
                  <span className="feedback-icon">{answered.correct ? <Icon name="check" /> : '!'}</span>
                  <div>
                    <strong>{answered.correct ? `Correct — ${answerLabel}` : `The answer is ${answerLabel}`}</strong>
                    <p>{question.explanation}</p>
                  </div>
                </div>
                {question.skill === 'example' && <p className="feedback-definition"><strong>Definition:</strong> {question.definition}</p>}
                {question.confusedWith && <p className="feedback-confusion"><strong>Common mix-up:</strong> {question.confusedWith}</p>}
                <LearnNextPanel answered={answered} onNext={() => next()} isLast={answered.correct && round.completedIds.length === round.questions.length} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function LearnSessionSetup({
  formats,
  selectedFormats,
  onToggle,
  onSelectAll,
  onClear,
  onStart,
  questionCount,
  summary,
  total,
}) {
  const selectedCount = selectedFormats.length

  return (
    <div className="page session-page learn-builder-page">
      <div className="session-setup learn-session-setup">
        <div className="setup-icon"><Icon name="learn" size={28} /></div>
        <span className="section-kicker">Learn session</span>
        <h1>Create a new session.</h1>
        <p className="setup-description">Choose exactly which question formats you want. Turn on all four, mix a few, or clear everything and build from scratch.</p>

        <div className="setup-form learn-format-form">
          <fieldset aria-labelledby="learn-format-legend">
            <div className="format-picker-heading">
              <div>
                <strong className="format-picker-title" id="learn-format-legend">Question types</strong>
                <span>{selectedCount ? `${selectedCount} of ${formats.length} selected` : 'None selected'}</span>
              </div>
              <div className="format-picker-actions">
                <button type="button" onClick={onSelectAll} disabled={selectedCount === formats.length}>Select all</button>
                <button type="button" onClick={onClear} disabled={!selectedCount}>Clear all</button>
              </div>
            </div>

            <div className="learn-format-grid">
              {formats.map((format) => {
                const enabled = selectedFormats.includes(format.id)
                return (
                  <button
                    type="button"
                    className={`learn-format-toggle ${enabled ? 'selected' : ''}`}
                    key={format.id}
                    onClick={() => onToggle(format.id)}
                    aria-pressed={enabled}
                  >
                    <span className="format-toggle-check">{enabled && <Icon name="check" size={15} />}</span>
                    <span><strong>{format.label}</strong><small>{format.description}</small></span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {selectedCount
            ? <p className="format-question-count">{questionCount} questions to master. Incorrect answers stay pending and do not increase the counter.</p>
            : <p className="format-selection-note">Select at least one question type to start a session.</p>}
          <button className="primary-button wide" onClick={onStart} disabled={!selectedCount}>
            Start Learn <Icon name="arrow" size={18} />
          </button>
        </div>

        {summary.seen > 0 && (
          <div className="learn-builder-progress">
            <span>Your saved progress carries into every new session.</span>
            <SetProgressSummary summary={summary} total={total} />
          </div>
        )}
      </div>
    </div>
  )
}

function SetProgressSummary({ summary, total }) {
  const weak = Math.max(0, summary.seen - summary.mastered)
  return (
    <div className="set-progress-summary">
      <div><strong>{summary.seen}</strong><span>Introduced</span></div>
      <div><strong>{weak}</strong><span>In progress</span></div>
      <div><strong>{summary.mastered}</strong><span>Mastered</span></div>
      <div><strong>{total - summary.seen}</strong><span>Not seen yet</span></div>
    </div>
  )
}

function LearnNextPanel({ answered, onNext, isLast }) {
  return (
    <div className="learn-next-row">
      <span>
        {answered.mastered
          ? <><Icon name="check" size={17} /><strong>This term is mastered</strong></>
          : answered.promoted
            ? <><Icon name="check" size={17} />Your mastery progress advanced</>
            : <>{answered.correct ? 'Correct—this question is complete' : 'Incorrect—this question will return until you get it right'}</>}
      </span>
      <button className="primary-button feedback-next" onClick={onNext}>{isLast ? 'See results' : 'Next question'} <Icon name="arrow" size={17} /></button>
    </div>
  )
}

function SessionSetup({
  title,
  description,
  icon,
  categories,
  onStart,
  progress,
  terms,
  modeLabel,
  unitLabel = 'questions',
  countAvailable = (pool) => pool.length,
  availabilityLabel = 'terms',
  countOptions = [10, 20, 30],
}) {
  const [category, setCategory] = useState('All topics')
  const [focus, setFocus] = useState('All')
  const [count, setCount] = useState(10)
  const filteredPool = filterPool(terms, category, focus, progress)
  const available = countAvailable(filteredPool)
  const sessionCount = Math.min(count, available)

  return (
    <div className="session-setup">
      <div className="setup-icon"><Icon name={icon} size={28} /></div>
      <span className="section-kicker">{modeLabel}</span>
      <h1>{title}</h1>
      <p className="setup-description">{description}</p>
      <div className="setup-form">
        <label>
          <span>Topic</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <fieldset>
          <legend>Focus</legend>
          <div className="segmented-control">
            {['All', 'New', 'Review'].map((item) => (
              <button key={item} className={focus === item ? 'active' : ''} onClick={() => setFocus(item)}>{item}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Session length</legend>
          <div className="segmented-control count-control">
            {countOptions.map((item) => (
              <button key={item} className={count === item ? 'active' : ''} onClick={() => setCount(item)}>{item}</button>
            ))}
          </div>
        </fieldset>
        <button
          className="primary-button wide"
          onClick={() => onStart(filteredPool, sessionCount)}
          disabled={!available}
        >
          Start {sessionCount} {unitLabel} <Icon name="arrow" size={18} />
        </button>
        <p className="available-note">{available} {available === 1 ? availabilityLabel.replace(/s$/, '') : availabilityLabel} available in this selection</p>
      </div>
    </div>
  )
}

function Flashcards({ terms, categories, progress, record, star, openTerm }) {
  const [phase, setPhase] = useState('setup')
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)

  const start = (pool, count) => {
    setCards(shuffle(pool).slice(0, count))
    setIndex(0)
    setKnown(0)
    setFlipped(false)
    setPhase('study')
  }

  const grade = (correct) => {
    const current = cards[index]
    record(current.id, 'definition', correct)
    if (correct) setKnown((value) => value + 1)
    if (index === cards.length - 1) {
      setPhase('complete')
    } else {
      setIndex((value) => value + 1)
      setFlipped(false)
    }
  }

  useEffect(() => {
    if (phase !== 'study') return undefined
    const onKey = (event) => {
      if (event.code === 'Space') {
        event.preventDefault()
        setFlipped((value) => !value)
      }
      if (flipped && event.key === '1') grade(false)
      if (flipped && event.key === '2') grade(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, flipped, index, cards])

  if (phase === 'setup') {
    return (
      <div className="page session-page">
        <SessionSetup
          title="Build the definition first."
          description="Flip each card to check the meaning, spotting clues, and the nearest terms people commonly mix up."
          icon="cards"
          modeLabel="Flashcards"
          categories={categories}
          terms={terms}
          progress={progress}
          onStart={start}
          unitLabel="cards"
        />
      </div>
    )
  }

  if (phase === 'complete') {
    return <SessionComplete title="Cards complete" score={known} total={cards.length} onAgain={() => setPhase('setup')} onNext={() => setPhase('setup')} nextLabel="New session" />
  }

  const term = cards[index]
  const stats = statsFor(progress, term.id)

  return (
    <div className="page active-session-page">
      <SessionHeader label="Flashcards" index={index} total={cards.length} onExit={() => setPhase('setup')} />
      <div className="flashcard-wrap">
        <button className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label="Flip card">
          <div className="flashcard-face flashcard-front">
            <span className="card-category">{term.category}</span>
            <h2>{term.term}</h2>
            <span className="flip-hint">Tap to reveal the definition</span>
          </div>
          <div className="flashcard-face flashcard-back-face">
            <span className="card-category">Definition</span>
            <p className="card-definition">{term.definition}</p>
            <div className="card-tip"><strong>Spot it:</strong> {term.spottingTips[0]}</div>
            {term.confusedWith && <div className="card-confusion"><strong>Don’t confuse it with:</strong> {term.confusedWith}</div>}
          </div>
        </button>
        <div className="card-toolbar">
          <button className={stats.starred ? 'icon-button starred' : 'icon-button'} onClick={() => star(term.id)} aria-label="Star term">
            <Icon name="star" filled={stats.starred} />
          </button>
          <span>Space to flip</span>
          <button className="detail-link" onClick={() => openTerm(term)}>View examples</button>
        </div>
        {flipped ? (
          <div className="grade-actions">
            <button className="again-button" onClick={() => grade(false)}><span>1</span> Study again</button>
            <button className="know-button" onClick={() => grade(true)}><span>2</span> Got it</button>
          </div>
        ) : (
          <button className="primary-button reveal-button" onClick={() => setFlipped(true)}>Show answer</button>
        )}
      </div>
    </div>
  )
}

function TestMode({ terms, categories, progress, record, openTerm }) {
  const [phase, setPhase] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [lastSetup, setLastSetup] = useState(null)
  const [answers, setAnswers] = useState({})
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState(null)

  const start = (pool, count) => {
    setLastSetup({ pool, count })
    setQuestions(buildTestQuestions(pool, count, terms))
    setAnswers({})
    setIndex(0)
    setResult(null)
    setPhase('test')
  }

  const submit = () => {
    const graded = questions.map((question) => ({
      ...question,
      selected: answers[question.id],
      correct: answers[question.id] === question.answerId,
    }))
    graded.forEach((question) => record(question.termId, question.kind === 'definition' ? 'definition' : 'example', question.correct))
    setResult({ graded, score: graded.filter((question) => question.correct).length })
    setPhase('results')
  }

  if (phase === 'setup') {
    return (
      <div className="page session-page">
        <SessionSetup
          title="Check what you can recall."
          description="A no-feedback-until-the-end mix of definitions and example identification, like a real quiz."
          icon="test"
          modeLabel="Mixed test"
          categories={categories}
          terms={terms}
          progress={progress}
          onStart={start}
          countAvailable={(pool) => pool.length ? 600 : 0}
          availabilityLabel="questions"
          countOptions={[10, 50, 100, 300, 600]}
        />
      </div>
    )
  }

  if (phase === 'results') {
    const missed = result.graded.filter((question) => !question.correct)
    return (
      <div className="page results-page">
        <ResultRing score={result.score} total={questions.length} />
        <h1>Test complete</h1>
        <p>{missed.length ? `${missed.length} answer${missed.length === 1 ? '' : 's'} to review below.` : 'Perfect score — excellent work.'}</p>
        <div className="result-actions">
          <button className="primary-button" onClick={() => setPhase('setup')}>New test</button>
          <button className="secondary-button" onClick={() => start(lastSetup.pool, lastSetup.count)}>Retake with new questions</button>
        </div>
        {missed.length > 0 && (
          <div className="missed-review">
            <div className="section-heading"><div><span className="section-kicker">Answer review</span><h2>What you missed</h2></div></div>
            {missed.map((question) => {
              const term = terms.find((item) => item.id === question.termId)
              return (
                <button key={question.id} className="missed-card" onClick={() => openTerm(term)}>
                  <span className="missed-x">×</span>
                  <span><strong>{term.term}</strong><p>{question.explanation}</p></span>
                  <Icon name="arrow" size={17} />
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const question = questions[index]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="page active-session-page">
      <SessionHeader label="Mixed test" index={index} total={questions.length} onExit={() => setPhase('setup')} />
      <div className="question-shell test-shell">
        <div className="test-meta"><span>{question.kind === 'definition' ? 'Definition' : 'Example identification'}</span><span>{answeredCount} of {questions.length} answered</span></div>
        <h2>{question.prompt}</h2>
        <blockquote className={`question-passage ${question.kind === 'definition' ? 'definition-passage' : ''}`}>{question.passage}</blockquote>
        <div className="answer-grid">
          {question.choices.map((choice, choiceIndex) => (
            <button
              key={choice.id}
              className={answers[question.id] === choice.id ? 'answer-choice selected' : 'answer-choice'}
              onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice.id }))}
            >
              <span className="choice-key">{choiceIndex + 1}</span><span>{choice.text}</span>
            </button>
          ))}
        </div>
        <div className="test-navigation">
          <button className="secondary-button" onClick={() => setIndex((value) => value - 1)} disabled={index === 0}>Back</button>
          {index === questions.length - 1 ? (
            <button className="primary-button" onClick={submit} disabled={answeredCount !== questions.length}>Submit test</button>
          ) : (
            <button className="primary-button" onClick={() => setIndex((value) => value + 1)} disabled={!answers[question.id]}>Next <Icon name="arrow" size={17} /></button>
          )}
        </div>
      </div>
    </div>
  )
}

function Library({ terms, categories, progress, star, openTerm }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All topics')
  const filtered = terms.filter((term) => {
    const matchesCategory = category === 'All topics' || term.category === category
    const searchText = `${term.term} ${term.definition} ${term.category}`.toLowerCase()
    return matchesCategory && searchText.includes(query.toLowerCase())
  })

  return (
    <div className="page library-page">
      <PageTitle kicker="All 87 terms" title="Term library" description="Search definitions, open complete examples, or star anything you want to revisit." />
      <div className="library-tools">
        <label className="search-box"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search terms or definitions" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="library-count">Showing {filtered.length} term{filtered.length === 1 ? '' : 's'}</div>
      <div className="term-grid">
        {filtered.map((term) => {
          const stats = statsFor(progress, term.id)
          const attempts = stats.recognitionAttempts + stats.typedAttempts + stats.exampleAttempts
          return (
            <article key={term.id} className="term-card">
              <div className="term-card-top">
                <span className="category-pill">{term.category}</span>
                <button className={stats.starred ? 'star-button starred' : 'star-button'} onClick={() => star(term.id)} aria-label={`Star ${term.term}`}><Icon name="star" size={18} filled={stats.starred} /></button>
              </div>
              <h3>{term.term}</h3>
              <p>{term.definition}</p>
              <div className="term-card-footer">
                <span className={isMastered(stats) ? 'mastery-badge mastered' : 'mastery-badge'}>{isMastered(stats) ? 'Mastered' : attempts ? 'In progress' : 'Not started'}</span>
                <button className="text-button" onClick={() => openTerm(term)}>Open <Icon name="arrow" size={15} /></button>
              </div>
            </article>
          )
        })}
      </div>
      {!filtered.length && <div className="empty-state"><strong>No matching terms</strong><p>Try a different search or topic.</p></div>}
      <Footer />
    </div>
  )
}

function Review({ terms, progress, openTerm, star, navigate }) {
  const reviewTerms = terms.filter((term) => needsReview(statsFor(progress, term.id)))
  const starred = reviewTerms.filter((term) => statsFor(progress, term.id).starred)
  const missed = reviewTerms.filter((term) => !statsFor(progress, term.id).starred)

  const reset = () => {
    if (window.confirm('Reset all Litmus study progress on this device?')) {
      clearProgress()
      clearLearnSession()
      window.location.reload()
    }
  }

  return (
    <div className="page review-page">
      <PageTitle kicker="Your saved list" title="Review" description="Starred terms and missed answers collect here so you can inspect them before another Learn session." />
      {reviewTerms.length > 0 && (
        <div className="review-learn-cta">
          <div><Icon name="learn" size={22} /><span><strong>Ready to keep going?</strong><small>In Learn, every missed question remains pending until you answer it correctly.</small></span></div>
          <button className="primary-button" onClick={() => navigate('learn')}>Open Learn <Icon name="arrow" size={16} /></button>
        </div>
      )}
      {!reviewTerms.length ? (
        <div className="empty-state large">
          <div className="empty-icon"><Icon name="review" size={30} /></div>
          <strong>Nothing to review yet</strong>
          <p>Missed questions and starred terms will appear here.</p>
        </div>
      ) : (
        <>
          {starred.length > 0 && <ReviewGroup title="Starred" terms={starred} progress={progress} openTerm={openTerm} star={star} />}
          {missed.length > 0 && <ReviewGroup title="Needs practice" terms={missed} progress={progress} openTerm={openTerm} star={star} />}
        </>
      )}
      <div className="data-controls"><div><strong>Progress is stored only in this browser.</strong><p>Resetting removes scores and starred terms from this device.</p></div><button className="danger-link" onClick={reset}>Reset progress</button></div>
      <Footer />
    </div>
  )
}

function ReviewGroup({ title, terms: groupTerms, progress, openTerm, star }) {
  return (
    <section className="review-group">
      <div className="section-heading"><div><span className="section-kicker">{groupTerms.length} terms</span><h2>{title}</h2></div></div>
      <div className="review-grid">
        {groupTerms.map((term) => {
          const stats = statsFor(progress, term.id)
          return (
            <article className="review-card" key={term.id}>
              <button className={stats.starred ? 'star-button starred' : 'star-button'} onClick={() => star(term.id)}><Icon name="star" size={18} filled={stats.starred} /></button>
              <span className="category-pill">{term.category}</span>
              <h3>{term.term}</h3>
              <div className="skill-bars">
                <SkillBar label="Choose" value={rate(stats.recognitionCorrect, stats.recognitionAttempts)} attempts={stats.recognitionAttempts} />
                <SkillBar label="Write" value={rate(stats.typedCorrect, stats.typedAttempts)} attempts={stats.typedAttempts} />
                <SkillBar label="Identify" value={rate(stats.exampleCorrect, stats.exampleAttempts)} attempts={stats.exampleAttempts} />
              </div>
              <button className="secondary-button small" onClick={() => openTerm(term)}>Review term</button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function SkillBar({ label, value, attempts }) {
  return <div className="skill-bar"><span>{label}<small>{attempts ? `${value}%` : '—'}</small></span><i><b style={{ width: `${value}%` }} /></i></div>
}

function TermDetail({ term, stats, onClose, onStar }) {
  const quizVariants = quizVariantsForTerm(term)

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="term-title">
      <button className="modal-scrim" onClick={onClose} aria-label="Close term" />
      <article className="term-modal">
        <div className="modal-header">
          <span className="category-pill">{term.category}</span>
          <div className="modal-header-actions">
            <button className={stats.starred ? 'icon-button starred' : 'icon-button'} onClick={onStar} aria-label="Star term"><Icon name="star" filled={stats.starred} /></button>
            <button className="icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
          </div>
        </div>
        <div className="modal-body">
          <h2 id="term-title">{term.term}</h2>
          <p className="modal-definition">{term.definition}</p>

          <section className="detail-section">
            <h3>How to spot it</h3>
            <ul className="spotting-list">
              {term.spottingTips.map((tip) => <li key={tip}><Icon name="check" size={16} />{tip}</li>)}
            </ul>
          </section>

          {term.confusedWith && (
            <section className="confusion-note">
              <Icon name="info" size={20} />
              <div><h3>Common mix-up</h3><p>{term.confusedWith}</p></div>
            </section>
          )}

          <section className="detail-section">
            <h3>{quizVariants.length ? 'Subtype examples' : 'Examples'}</h3>
            {quizVariants.length ? quizVariants.map((variant) => (
              <div className="example-variant-group" key={variant.id}>
                <h4>{variant.term}</h4>
                <p className="variant-definition">{variant.definition}</p>
                <div className="examples-stack">
                  {variant.examples.map((example, index) => (
                    <div className="example-card" key={`${variant.id}-${index}`}>
                      <div className="example-meta"><span>Passage {index + 1}</span><span className={`difficulty ${example.difficulty}`}>{example.difficulty}</span></div>
                      <blockquote>{example.text}</blockquote>
                      <p><strong>Why it works:</strong> {example.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <div className="examples-stack">
                {term.examples.map((example, index) => (
                  <div className="example-card" key={`${term.id}-${index}`}>
                    <div className="example-meta"><span>Passage {index + 1}</span><span className={`difficulty ${example.difficulty}`}>{example.difficulty}</span></div>
                    <blockquote>{example.text}</blockquote>
                    <p><strong>Why it works:</strong> {example.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {term.sourceUrls?.length > 0 && (
            <section className="source-section">
              <h3>Reference sources</h3>
              <p>Definitions and original examples were checked against multiple educational references.</p>
              <div className="source-links">
                {term.sourceUrls.map((url) => {
                  let label = url
                  try { label = new URL(url).hostname.replace('www.', '') } catch { /* use URL as supplied */ }
                  return <a key={url} href={url} target="_blank" rel="noreferrer">{label}</a>
                })}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  )
}

function SessionHeader({ label, index, completed, total, onExit }) {
  const progressCount = completed ?? index + 1
  return (
    <header className="session-header">
      <button className="exit-session" onClick={onExit}><Icon name="close" size={18} /> Exit</button>
      <div className="session-progress"><div><i style={{ width: `${(progressCount / total) * 100}%` }} /></div><span>{progressCount} / {total}</span></div>
      <span className="session-label">{label}</span>
    </header>
  )
}

function SessionComplete({ title, score, total, onAgain, onNext, nextLabel }) {
  return (
    <div className="page results-page simple-results">
      <ResultRing score={score} total={total} />
      <span className="section-kicker">Session finished</span>
      <h1>{title}</h1>
      <p>{score === total ? 'Perfect — you caught every one.' : `You got ${score} of ${total}. Missed terms are now waiting in Review.`}</p>
      <div className="result-actions">
        <button className="primary-button" onClick={onAgain}>Practice again</button>
        <button className="secondary-button" onClick={onNext}>{nextLabel}</button>
      </div>
    </div>
  )
}

function ResultRing({ score, total }) {
  const percentage = Math.round((score / total) * 100)
  return <div className="result-ring" style={{ '--score': `${percentage * 3.6}deg` }}><div><strong>{percentage}%</strong><span>{score} / {total}</span></div></div>
}

function PageTitle({ kicker, title, description }) {
  return <header className="page-title"><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></header>
}

function Footer() {
  return (
    <footer className="app-footer">
      <Logo />
      <p>Built for careful practice. Definitions and examples are independently researched and verified.</p>
    </footer>
  )
}

export default App
