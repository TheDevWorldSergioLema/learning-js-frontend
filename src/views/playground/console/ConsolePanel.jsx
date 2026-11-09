import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/Button.jsx'
import { RichText } from '../../../components/rich-text/RichText.jsx'
import { useErrorText } from '../../../hooks/useErrorText.js'
import { ButtonVariant } from '../../../types/buttonVariant.js'
import './ConsolePanel.scss'

/** What `console.log` printed in the page, the errors of the code, and what it saved in `localStorage`. */
export function ConsolePanel({ entries, storage, onClearStorage }) {
  const { t } = useTranslation()
  const errorText = useErrorText()

  const storageKeys = Object.keys(storage)

  const renderEntry = (entry) => (
    <li key={entry.id} className={`console-line is-${entry.level}`}>
      {entry.error && errorText(entry.error)}
      {entry.notice && <RichText text={t(`console.notices.${entry.notice}`)} />}
      {entry.text}
    </li>
  )

  const renderStorage = () => (
    <div className="storage">
      <div className="storage-head">
        <h3>{t('console.storage')}</h3>
        <Button variant={ButtonVariant.Quiet} onClick={onClearStorage}>
          {t('console.clearStorage')}
        </Button>
      </div>
      <dl>
        {storageKeys.map((key) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{storage[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  )

  return (
    <section className="console" aria-labelledby="console-title">
      <h2 id="console-title">{t('console.title')}</h2>
      {entries.length > 0 ? (
        <ol className="console-lines" aria-live="polite">
          {entries.map(renderEntry)}
        </ol>
      ) : (
        <p className="console-empty">
          <RichText text={t('console.empty')} />
        </p>
      )}
      {storageKeys.length > 0 && renderStorage()}
    </section>
  )
}
