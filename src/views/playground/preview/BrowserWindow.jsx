import { useTranslation } from 'react-i18next'
import './BrowserWindow.scss'

export function BrowserWindow({ address, children }) {
  const { t } = useTranslation()

  return (
    <section className="browser" aria-label={t('preview.label')}>
      <div className="browser-bar">
        <span className="browser-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-address">{address}</span>
      </div>
      <div className="browser-viewport">{children}</div>
    </section>
  )
}
