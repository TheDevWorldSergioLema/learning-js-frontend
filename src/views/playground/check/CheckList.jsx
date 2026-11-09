import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/Button.jsx'
import { RichText } from '../../../components/rich-text/RichText.jsx'
import { useErrorText } from '../../../hooks/useErrorText.js'
import { ButtonVariant } from '../../../types/buttonVariant.js'
import { CheckStatus } from '../../../types/checkStatus.js'
import './CheckList.scss'

/** Calls `onSolved` with the step id once every check passes. */
export function CheckList({ levelId, results, solved, onSolved, onNext, isLast }) {
  const { t } = useTranslation()
  const errorText = useErrorText()

  useEffect(() => {
    if (solved) onSolved(levelId)
  }, [solved, levelId, onSolved])

  const passed = results?.filter((r) => r.status === CheckStatus.Pass).length ?? 0

  const renderResult = (result) => (
    <li key={result.key} className={`is-${result.status}`}>
      <span className="check-mark" aria-hidden="true" />
      <span className="check-text">
        <RichText text={t(`levels.${levelId}.checks.${result.key}`)} />
        <span className="visually-hidden">{t(`check.status.${result.status}`)}</span>
        {result.error && <span className="check-error">{errorText(result.error)}</span>}
      </span>
    </li>
  )

  const renderSolved = () => (
    <section className="check check-solved" aria-live="polite">
      <div className="solved-studs" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="solved-text">
        <h2>{t(isLast ? 'check.finished' : 'check.solved')}</h2>
        <p>
          <RichText text={t(`levels.${levelId}.recap`)} />
        </p>
      </div>
      {!isLast && (
        <Button variant={ButtonVariant.Primary} onClick={onNext}>
          {t('check.nextStep')}
        </Button>
      )}
    </section>
  )

  if (solved) return renderSolved()

  return (
    <section className="check" aria-labelledby="check-title">
      <h2 id="check-title">
        {t('check.title')}
        {results && (
          <span className="check-count" aria-live="polite">
            {t('check.count', { passed, count: results.length })}
          </span>
        )}
      </h2>
      {results && <ul className="check-list">{results.map(renderResult)}</ul>}
    </section>
  )
}
