import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../../test/render.js'
import { CheckStatus } from '../../../types/checkStatus.js'
import { RunError } from '../../../types/runError.js'
import { CheckList } from './CheckList.jsx'

const props = { levelId: 'sold-out', solved: false, isLast: false, onSolved: () => {}, onNext: () => {} }

describe('CheckList', () => {
  describe('while coding', () => {
    it('counts the passed checks and labels every check', () => {
      const results = [
        { key: 'soldOut', status: CheckStatus.Fail },
        { key: 'inStock', status: CheckStatus.Pass },
      ]
      render(<CheckList {...props} results={results} />)

      expect(screen.getByText('1 of 2 checks passed')).toBeInTheDocument()
      expect(screen.getByText('With a stock of 0, the badge says')).toBeInTheDocument()
      expect(screen.getByText('not yet')).toBeInTheDocument()
      expect(screen.getByText('passed')).toBeInTheDocument()
    })

    it('explains why the code failed, with its line', () => {
      const results = [
        {
          key: 'soldOut',
          status: CheckStatus.Error,
          error: { type: RunError.Runtime, name: 'TypeError', message: 'status is null', line: 4 },
        },
      ]
      render(<CheckList {...props} results={results} />)

      expect(screen.getByText('TypeError: status is null (line 4)')).toBeInTheDocument()
    })

    it('shows how long a loop ran before it was stopped', () => {
      const results = [{ key: 'soldOut', status: CheckStatus.Error, error: { type: RunError.InfiniteLoop } }]
      render(<CheckList {...props} results={results} />)

      expect(screen.getByText(/stopped after 100000 turns/)).toBeInTheDocument()
    })
  })

  describe('when solved', () => {
    it('shows the recap and goes to the next step', async () => {
      const onNext = vi.fn()
      const { user } = renderWithUser(<CheckList {...props} solved results={[]} onNext={onNext} />)

      expect(screen.getByText('Step complete!')).toBeInTheDocument()
      expect(screen.getByText(/choose between two pieces of code/)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Next step' }))
      expect(onNext).toHaveBeenCalledOnce()
    })

    it('reports the solved step', () => {
      const onSolved = vi.fn()
      render(<CheckList {...props} solved results={[]} onSolved={onSolved} />)

      expect(onSolved).toHaveBeenCalledWith('sold-out')
    })

    it('has no next step after the last one', () => {
      render(<CheckList {...props} solved isLast results={[]} />)

      expect(screen.getByText('You finished every step!')).toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
