import { afterEach, describe, expect, it, vi } from 'vitest'
import { Language } from '../types/language.js'
import { loadLanguage, saveLanguage } from './languageService.js'

describe('languageService', () => {
  afterEach(() => vi.restoreAllMocks())

  describe('loadLanguage', () => {
    it('defaults to English when nothing is saved', () => {
      expect(loadLanguage()).toBe(Language.English)
    })

    it('returns the saved language', () => {
      saveLanguage(Language.German)

      expect(loadLanguage()).toBe(Language.German)
    })

    it('falls back to English when the saved value is not supported', () => {
      localStorage.setItem('brick-shop:language', 'pt')

      expect(loadLanguage()).toBe(Language.English)
    })

    it('falls back to English when the storage is blocked', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })

      expect(loadLanguage()).toBe(Language.English)
    })
  })

  describe('saveLanguage', () => {
    it('does not throw when the storage is blocked', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked')
      })

      expect(() => saveLanguage(Language.French)).not.toThrow()
    })
  })
})
