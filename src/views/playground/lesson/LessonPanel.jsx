import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/button/Button.jsx'
import { RichText } from '../../../components/rich-text/RichText.jsx'
import { useCodeComments } from '../../../hooks/useCodeComments.js'
import { ButtonVariant } from '../../../types/buttonVariant.js'
import { fillComments } from '../../../utils/codeComments.js'
import './LessonPanel.scss'

export function LessonPanel({ step, total, level, hintsShown, onHint, onSolution }) {
  const { t } = useTranslation()
  const comments = useCodeComments()
  const [confirming, setConfirming] = useState(false)

  const texts = `levels.${level.id}`
  const intro = t(`${texts}.intro`, { returnObjects: true })
  const hints = t(`${texts}.hints`, { returnObjects: true }).map((text) => ({ text }))
  const example = level.example && { code: fillComments(level.example, comments) }
  const hintList = example ? [...hints.slice(0, -1), example, hints.at(-1)] : hints
  const allHints = hintsShown >= hintList.length

  const replaceCode = () => {
    setConfirming(false)
    onSolution()
  }

  const renderHints = () => (
    <ol className="hint-list">
      {hintList.slice(0, hintsShown).map((hint) => (
        <li key={hint.text ?? hint.code}>
          {hint.code ? (
            <pre className="example">
              <code>{hint.code}</code>
            </pre>
          ) : (
            <RichText text={hint.text} />
          )}
        </li>
      ))}
    </ol>
  )

  const renderConfirm = () => (
    <div className="confirm" role="group" aria-label={t('lesson.confirmLabel')}>
      <span>{t('lesson.confirmText')}</span>
      <Button onClick={replaceCode}>{t('lesson.replaceCode')}</Button>
      <Button variant={ButtonVariant.Quiet} onClick={() => setConfirming(false)}>
        {t('lesson.keepTrying')}
      </Button>
    </div>
  )

  return (
    <section className="lesson" aria-labelledby="lesson-title">
      <header className="lesson-head">
        <span className="step-number" aria-hidden="true">{step}</span>
        <div>
          <p className="lesson-meta">
            {t('lesson.meta', { step, total })} <span className="concept">{t(`concepts.${level.concept}.name`)}</span>
          </p>
          <h1 id="lesson-title">{t(`${texts}.title`)}</h1>
        </div>
      </header>

      {intro.map((p) => (
        <p key={p} className="lesson-text">
          <RichText text={p} />
        </p>
      ))}
      <div className="definition">
        <p className="definition-term">
          {t('lesson.definition')} <code>{t(`concepts.${level.concept}.name`)}</code>
        </p>
        <p>
          <RichText text={t(`concepts.${level.concept}.definition`)} />
        </p>
      </div>

      <div className="goal">
        <span className="goal-brick" aria-hidden="true" />
        <p>
          <strong>{t('lesson.goal')}</strong>
          <RichText text={t(`${texts}.goal`)} />
        </p>
      </div>

      <div className="hints">
        {hintsShown > 0 && renderHints()}
        <div className="hint-actions">
          {!allHints && (
            <Button onClick={onHint}>
              {t(hintsShown === 0 ? 'lesson.firstHint' : 'lesson.nextHint')}
              <span className="hint-count">{t('lesson.hintCount', { current: hintsShown + 1, total: hintList.length })}</span>
            </Button>
          )}
          {allHints && !confirming && (
            <Button variant={ButtonVariant.Quiet} onClick={() => setConfirming(true)}>
              {t('lesson.showSolution')}
            </Button>
          )}
          {confirming && renderConfirm()}
        </div>
      </div>
    </section>
  )
}
