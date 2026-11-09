import { Language } from '../types/language.js'

const KEY = 'brick-shop:language'

/** @returns {import('../types/entities.js').LanguageValue} */
export function loadLanguage() {
  try {
    const saved = localStorage.getItem(KEY)
    return Object.values(Language).includes(saved) ? saved : Language.English
  } catch {
    return Language.English
  }
}

/** @param {import('../types/entities.js').LanguageValue} language */
export function saveLanguage(language) {
  try {
    localStorage.setItem(KEY, language)
  } catch {
    // Storage can be full or blocked (private mode): the choice just won't survive a reload.
  }
}
