import { html as htmlLang } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { Trans, useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/Button.jsx'
import { PlayIcon } from '../../../components/icons/PlayIcon.jsx'
import { ButtonVariant } from '../../../types/buttonVariant.js'
import { EditorTab } from '../../../types/editorTab.js'
import './CodeEditor.scss'

const editorTheme = EditorView.theme({
  '&': { fontSize: 'var(--font-size-code)', height: '100%' },
  '.cm-scroller': { fontFamily: 'var(--font-code)', lineHeight: 'var(--line-height-editor)' },
  '.cm-content': { padding: 'var(--spacing-6) 0' },
  '.cm-gutters': { backgroundColor: 'var(--color-panel-sunk)', border: 'none', color: 'var(--color-ink-faint)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--color-ink)' },
  '.cm-activeLine': { backgroundColor: 'var(--color-active-line)' },
  '&.cm-focused': { outline: 'none' },
})

const LANGS = {
  [EditorTab.Js]: [javascript(), editorTheme],
  [EditorTab.Html]: [htmlLang(), editorTheme],
}

const SETUP = { foldGutter: false, highlightActiveLine: true, autocompletion: true }

export function CodeEditor({ tab, onTab, js, html, onChange, onRun, onReset }) {
  const { t } = useTranslation()

  const isHtml = tab === EditorTab.Html

  // Captured before CodeMirror, which would insert a blank line.
  const runOnShortcut = (e) => {
    if (e.key !== 'Enter' || !(e.ctrlKey || e.metaKey)) return
    e.preventDefault()
    e.stopPropagation()
    onRun()
  }

  const renderTab = (value) => (
    <button
      key={value}
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={tab === value}
      aria-controls="editor-panel"
      className="tab"
      onClick={() => onTab(value)}
    >
      {t(`editor.tabs.${value}`)}
    </button>
  )

  return (
    <section className="editor" aria-label={t('editor.label')}>
      <div className="editor-bar">
        <div role="tablist" aria-label={t('editor.files')} className="tabs">
          {Object.values(EditorTab).map(renderTab)}
        </div>
        <div className="editor-actions">
          <Button variant={ButtonVariant.Quiet} onClick={onReset}>
            {t('editor.startOver')}
          </Button>
          <Button variant={ButtonVariant.Primary} className="run-button" onClick={onRun} title={t('editor.runShortcut')}>
            <PlayIcon />
            {t('editor.run')}
          </Button>
        </div>
      </div>
      {isHtml && (
        <p className="editor-note">
          <Trans i18nKey="editor.htmlFixed" components={{ strong: <strong /> }} />
        </p>
      )}
      <div
        className="editor-body"
        id="editor-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        onKeyDownCapture={runOnShortcut}
      >
        <CodeMirror
          key={tab}
          value={isHtml ? html : js}
          height="100%"
          extensions={LANGS[tab]}
          basicSetup={SETUP}
          readOnly={isHtml}
          editable={!isHtml}
          onChange={(value) => onChange(value)}
          aria-label={t(`editor.code.${tab}`)}
        />
      </div>
    </section>
  )
}
