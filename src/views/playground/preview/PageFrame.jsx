import { useEffect, useRef, useState } from 'react'
import { useLatest } from '../../../hooks/useLatest.js'
import { LogLevel } from '../../../types/logLevel.js'
import { Notice } from '../../../types/notice.js'
import { pageHtml, writePage } from '../../../utils/page.js'
import { runCode } from '../../../utils/runner.js'
import './PageFrame.scss'

// Scripts must run (event listeners included) and the app reads the frame's document directly, hence
// allow-scripts with allow-same-origin. Forms are allowed so the submit event fires; the runner cancels it.
const SANDBOX = 'allow-scripts allow-same-origin allow-forms'
const BLANK = pageHtml('')

/**
 * The page the student plays with: on every change of `runId`, `html` or `code`, the page is written again and the
 * code runs on it. Console lines and errors go to `onEntry`; `onStart` is called before each run.
 */
export function PageFrame({ title, html, code, runId, storage, onStart, onEntry }) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)
  const callbacks = useLatest({ onStart, onEntry, storage })

  useEffect(() => {
    if (!ready) return
    const win = ref.current.contentWindow
    let reloadTimer

    const run = () => {
      const { onStart: start, onEntry: entry, storage: currentStorage } = callbacks.current
      start()
      writePage(win, html)
      const { error } = runCode(win, code, {
        storage: currentStorage,
        onLog: entry,
        onError: (e) => entry({ level: LogLevel.Error, error: e }),
        onFormReload: () => {
          reloadTimer = setTimeout(() => {
            run()
            callbacks.current.onEntry({ level: LogLevel.Warn, notice: Notice.FormReload })
          })
        },
      })
      if (error) entry({ level: LogLevel.Error, error })
    }

    run()
    return () => clearTimeout(reloadTimer)
  }, [ready, html, code, runId, callbacks])

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={BLANK}
      sandbox={SANDBOX}
      onLoad={() => setReady(true)}
      className="page-frame"
    />
  )
}

/** A hidden frame the checks run in: `onReady` receives its window once it can be written to. */
export function ProbeFrame({ title, onReady }) {
  return (
    <iframe
      title={title}
      srcDoc={BLANK}
      sandbox={SANDBOX}
      onLoad={(e) => onReady(e.currentTarget.contentWindow)}
      className="probe-frame"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
