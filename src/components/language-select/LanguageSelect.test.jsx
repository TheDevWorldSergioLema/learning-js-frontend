import { render, screen } from '@testing-library/react'
import { useTranslation } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import { loadLanguage } from '../../services/languageService.js'
import { renderWithUser } from '../../test/render.js'
import { Language } from '../../types/language.js'
import { LanguageSelect } from './LanguageSelect.jsx'

function AppName() {
  const { t } = useTranslation()
  return <h1>{t('app.name')}</h1>
}

describe('LanguageSelect', () => {
  describe('rendering', () => {
    it('lists every language by its own name, English selected by default', () => {
      render(<LanguageSelect />)

      const select = screen.getByRole('combobox', { name: 'Language' })
      expect(select).toHaveValue(Language.English)
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
        'English',
        'Français',
        'Español',
        'Italiano',
        'Deutsch',
      ])
    })
  })

  describe('selection', () => {
    it('switches the texts, the page language and saves the choice', async () => {
      const { user } = renderWithUser(
        <>
          <AppName />
          <LanguageSelect />
        </>,
      )

      await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), Language.French)

      expect(screen.getByRole('heading', { name: 'La boutique de briques' })).toBeInTheDocument()
      expect(screen.getByRole('combobox', { name: 'Langue' })).toHaveValue(Language.French)
      expect(document.documentElement).toHaveAttribute('lang', Language.French)
      expect(document.title).toBe('La boutique de briques : apprends JavaScript et le DOM')
      expect(loadLanguage()).toBe(Language.French)
    })
  })
})
