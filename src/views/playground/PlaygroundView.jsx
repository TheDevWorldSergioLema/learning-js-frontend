import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCodeComments } from '../../hooks/useCodeComments.js'
import { useDebounced } from '../../hooks/useDebounced.js'
import { PublicLayout } from '../../layout/PublicLayout.jsx'
import { useProgressStore } from '../../stores/progressStore.js'
import { CheckStatus } from '../../types/checkStatus.js'
import { EditorTab } from '../../types/editorTab.js'
import { runChecks } from '../../utils/checks.js'
import { fillComments } from '../../utils/codeComments.js'
import { createMemoryStorage } from '../../utils/memoryStorage.js'
import { writePage } from '../../utils/page.js'
import { CheckList } from './check/CheckList.jsx'
import { ConsolePanel } from './console/ConsolePanel.jsx'
import { CodeEditor } from './editor/CodeEditor.jsx'
import { LessonPanel } from './lesson/LessonPanel.jsx'
import { levels } from './levels.js'
import { BrowserWindow } from './preview/BrowserWindow.jsx'
import { PageFrame, ProbeFrame } from './preview/PageFrame.jsx'
import { StepStrip } from './steps/StepStrip.jsx'
import './PlaygroundView.scss'

const RUN_DELAY = 600
const MAX_CONSOLE_LINES = 200

export function PlaygroundView() {
  const { t } = useTranslation()
  const comments = useCodeComments()
  const progress = useProgressStore()
  const [tabChoice, setTabChoice] = useState(null)
  const [probe, setProbe] = useState(null)
  const [runCount, setRunCount] = useState(0)
  const [entries, setEntries] = useState([])
  const [storageView, setStorageView] = useState({ levelId: null, data: {} })
  // Per step, what the student's code saved in localStorage: kept across runs, lost on reload.
  const [storageData] = useState(() => ({}))
  const [lineIds] = useState(() => ({ next: 0 }))

  const index = Math.min(progress.current, levels.length - 1)
  const level = levels[index]
  const code = progress.code[level.id] ?? fillComments(level.js, comments)
  const tab = tabChoice?.id === level.id ? tabChoice.tab : EditorTab.Js
  const hintsShown = progress.hints[level.id] ?? 0
  const isLast = index === levels.length - 1
  const step = index + 1
  const shownStorage = storageView.levelId === level.id ? storageView.data : (storageData[level.id] ?? {})

  const [ranCode, flushRun] = useDebounced(code, RUN_DELAY, level.id)

  const storage = useMemo(() => {
    storageData[level.id] ??= {}
    return createMemoryStorage(storageData[level.id], (data) => setStorageView({ levelId: level.id, data }))
  }, [storageData, level.id])

  const check = useMemo(() => {
    if (!probe) return { results: null, solved: false }
    const results = runChecks(level, ranCode, (body) => {
      writePage(probe, body)
      return probe
    })
    return { results, solved: results.length > 0 && results.every((r) => r.status === CheckStatus.Pass) }
  }, [probe, level, ranCode])

  const run = () => {
    flushRun()
    setRunCount((n) => n + 1)
  }

  const clearStorage = () => {
    storage.clear()
    setRunCount((n) => n + 1)
  }

  const addEntry = (entry) =>
    setEntries((all) => [...all, { ...entry, id: lineIds.next++ }].slice(-MAX_CONSOLE_LINES))

  const renderCodeColumn = () => (
    <div className="column column-code">
      <LessonPanel
        key={level.id}
        step={step}
        total={levels.length}
        level={level}
        hintsShown={hintsShown}
        onHint={() => progress.showHint(level.id)}
        onSolution={() => progress.setCode(level.id, fillComments(level.solution, comments))}
      />
      <CodeEditor
        tab={tab}
        onTab={(next) => setTabChoice({ id: level.id, tab: next })}
        js={code}
        html={level.html}
        onChange={(value) => progress.setCode(level.id, value)}
        onRun={run}
        onReset={() => progress.resetCode(level.id)}
      />
    </div>
  )

  const renderPreviewColumn = () => (
    <div className="column column-preview">
      <BrowserWindow address={t('preview.address', { step: String(step).padStart(2, '0') })}>
        <PageFrame
          title={t('preview.page')}
          html={level.html}
          code={ranCode}
          runId={runCount}
          storage={storage}
          onStart={() => setEntries([])}
          onEntry={addEntry}
        />
      </BrowserWindow>
      <ConsolePanel entries={entries} storage={shownStorage} onClearStorage={clearStorage} />
      <CheckList
        levelId={level.id}
        results={check.results}
        solved={check.solved}
        onSolved={progress.complete}
        isLast={isLast}
        onNext={() => progress.goTo(index + 1)}
      />
    </div>
  )

  return (
    <PublicLayout
      navigation={<StepStrip levels={levels} current={index} completed={progress.completed} onSelect={progress.goTo} />}
    >
      <main className="workspace">
        {renderCodeColumn()}
        {renderPreviewColumn()}
      </main>
      <ProbeFrame title={t('preview.probe')} onReady={setProbe} />
    </PublicLayout>
  )
}
