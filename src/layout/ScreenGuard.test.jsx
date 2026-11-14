import { act, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../test/render.js'
import { ScreenQuery } from '../types/screenSize.js'
import { ScreenGuard } from './ScreenGuard.jsx'

const listeners = new Set()
let matching = []

const stubScreen = (...queries) => {
  matching = queries
  vi.stubGlobal('matchMedia', (query) => ({
    matches: matching.includes(query),
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  }))
}

const resizeTo = (...queries) => act(() => {
  matching = queries
  listeners.forEach((listener) => listener())
})

const renderGuard = () => renderWithUser(<ScreenGuard><p>The course</p></ScreenGuard>)

afterEach(() => {
  listeners.clear()
  vi.unstubAllGlobals()
})

describe('ScreenGuard', () => {
  describe('on a wide screen', () => {
    it('shows the content', () => {
      stubScreen(ScreenQuery.Wide)

      renderGuard()

      expect(screen.getByText('The course')).toBeInTheDocument()
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })
  })

  describe('on a small screen', () => {
    it('asks for a bigger screen instead of the content', () => {
      stubScreen()

      renderGuard()

      expect(screen.getByRole('heading', { name: 'Hey, you may need a bigger screen to display all the content' })).toBeInTheDocument()
      expect(screen.queryByText('The course')).not.toBeInTheDocument()
    })

    it('shows the content once dismissed', async () => {
      stubScreen()
      const { user } = renderGuard()

      await user.click(screen.getByRole('button', { name: 'Continue anyway' }))

      expect(screen.getByText('The course')).toBeInTheDocument()
    })

    it('shows the content when the window gets wide enough', () => {
      stubScreen()
      renderGuard()

      resizeTo(ScreenQuery.Wide)

      expect(screen.getByText('The course')).toBeInTheDocument()
    })
  })

  describe('on a mobile phone', () => {
    it('sends to a desktop with no way to continue', () => {
      stubScreen(ScreenQuery.Mobile)

      renderGuard()

      expect(screen.getByRole('heading', { name: 'Do you really think you can develop something on a mobile phone?' })).toBeInTheDocument()
      expect(screen.getByText('Go for a desktop.')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Continue anyway' })).not.toBeInTheDocument()
      expect(screen.queryByText('The course')).not.toBeInTheDocument()
    })
  })
})
