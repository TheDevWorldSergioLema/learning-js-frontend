import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/button/Button.jsx'
import { BrickIcon } from '../components/icons/BrickIcon.jsx'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { ButtonVariant } from '../types/buttonVariant.js'
import { ScreenQuery, ScreenSize } from '../types/screenSize.js'
import { PublicLayout } from './PublicLayout.jsx'
import './ScreenGuard.scss'

export function ScreenGuard({ children }) {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const isMobile = useMediaQuery(ScreenQuery.Mobile)
  const isWide = useMediaQuery(ScreenQuery.Wide)

  const screen = isMobile ? ScreenSize.Mobile : isWide ? ScreenSize.Wide : ScreenSize.Small

  if (screen === ScreenSize.Wide || (screen === ScreenSize.Small && dismissed)) {
    return children
  }

  return (
    <PublicLayout>
      <main className="screen-notice">
        <section className={`screen-notice-card screen-notice-${screen}`} aria-labelledby="screen-notice-title">
          <BrickIcon className="screen-notice-icon" width={68} height={40} />
          <h1 id="screen-notice-title" className="screen-notice-title">
            {t(`screenNotice.${screen}.title`)}
          </h1>
          <p className="screen-notice-text">{t(`screenNotice.${screen}.text`)}</p>
          {screen === ScreenSize.Small && (
            <Button variant={ButtonVariant.Primary} onClick={() => setDismissed(true)}>
              {t('screenNotice.small.continue')}
            </Button>
          )}
        </section>
      </main>
    </PublicLayout>
  )
}
