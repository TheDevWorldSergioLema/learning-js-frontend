import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../../test/render.js'
import { LogLevel } from '../../../types/logLevel.js'
import { Notice } from '../../../types/notice.js'
import { RunError } from '../../../types/runError.js'
import { ConsolePanel } from './ConsolePanel.jsx'

const props = { entries: [], storage: {}, onClearStorage: () => {} }

describe('ConsolePanel', () => {
  describe('lines', () => {
    it('invites to log something when empty', () => {
      render(<ConsolePanel {...props} />)

      expect(screen.getByText("console.log('hello')")).toBeInTheDocument()
    })

    it('shows logs, errors and notices, each with its level', () => {
      const entries = [
        { id: 1, level: LogLevel.Log, text: 'number string' },
        { id: 2, level: LogLevel.Error, error: { type: RunError.Syntax, name: 'SyntaxError', message: 'Unexpected token' } },
        { id: 3, level: LogLevel.Warn, notice: Notice.FormReload },
      ]
      render(<ConsolePanel {...props} entries={entries} />)

      const lines = screen.getAllByRole('listitem')
      expect(lines[0]).toHaveTextContent('number string')
      expect(lines[1]).toHaveTextContent('Syntax error: Unexpected token')
      expect(lines[1]).toHaveClass('is-error')
      expect(lines[2]).toHaveTextContent(/the page reloaded/)
    })
  })

  describe('localStorage', () => {
    it('is hidden while nothing is saved', () => {
      render(<ConsolePanel {...props} />)

      expect(screen.queryByText('localStorage')).not.toBeInTheDocument()
    })

    it('lists the saved keys and clears them', async () => {
      const onClearStorage = vi.fn()
      const { user } = renderWithUser(<ConsolePanel {...props} storage={{ theme: 'dark' }} onClearStorage={onClearStorage} />)

      expect(screen.getByText('theme')).toBeInTheDocument()
      expect(screen.getByText('dark')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Clear and run again' }))
      expect(onClearStorage).toHaveBeenCalledOnce()
    })
  })
})
