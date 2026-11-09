import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { loadLanguage } from '../services/languageService.js'
import { Language } from '../types/language.js'
import de from './locales/de/translation.json'
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import fr from './locales/fr/translation.json'
import it from './locales/it/translation.json'

export const locales = { en, fr, es, it, de }

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  document.title = i18n.t('app.title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('app.description'))
})

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(Object.entries(locales).map(([language, translation]) => [language, { translation }])),
  lng: loadLanguage(),
  fallbackLng: Language.English,
  supportedLngs: Object.values(Language),
  interpolation: { escapeValue: false },
})

export default i18n
