import { useTranslation } from 'react-i18next'
import { saveLanguage } from '../../services/languageService.js'
import { Language } from '../../types/language.js'
import { ChevronIcon } from '../icons/ChevronIcon.jsx'
import { GlobeIcon } from '../icons/GlobeIcon.jsx'
import './LanguageSelect.scss'

export function LanguageSelect() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (language) => i18n.changeLanguage(language).then(() => saveLanguage(language))

  return (
    <div className="language-select">
      <GlobeIcon className="language-icon" />
      <select
        value={i18n.resolvedLanguage}
        aria-label={t('language.label')}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {Object.values(Language).map((language) => (
          <option key={language} value={language} lang={language}>
            {t(`language.names.${language}`)}
          </option>
        ))}
      </select>
      <ChevronIcon className="language-chevron" />
    </div>
  )
}
