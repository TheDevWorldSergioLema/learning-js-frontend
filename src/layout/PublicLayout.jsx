import { useTranslation } from 'react-i18next'
import { BrickIcon } from '../components/icons/BrickIcon.jsx'
import { LanguageSelect } from '../components/language-select/LanguageSelect.jsx'
import './PublicLayout.scss'

export function PublicLayout({ navigation, children }) {
  const { t } = useTranslation()

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <BrickIcon className="brand-icon" />
          {t('app.name')}
        </span>
        {navigation}
        <LanguageSelect />
      </header>
      {children}
    </div>
  )
}
