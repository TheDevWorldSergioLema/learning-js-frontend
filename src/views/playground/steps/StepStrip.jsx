import { useTranslation } from 'react-i18next'
import './StepStrip.scss'

export function StepStrip({ levels, current, completed, onSelect }) {
  const { t } = useTranslation()

  const renderStep = (level, i) => {
    const done = completed.includes(level.id)
    const labels = { number: i + 1, title: t(`levels.${level.id}.title`) }
    return (
      <li key={level.id}>
        <button
          type="button"
          className={`stud${done ? ' is-done' : ''}`}
          aria-current={i === current ? 'step' : undefined}
          aria-label={t(done ? 'steps.stepDone' : 'steps.step', labels)}
          title={t('steps.tooltip', labels)}
          onClick={() => onSelect(i)}
        >
          {i + 1}
        </button>
      </li>
    )
  }

  return (
    <nav className="steps" aria-label={t('steps.label')}>
      <ol>{levels.map(renderStep)}</ol>
    </nav>
  )
}
