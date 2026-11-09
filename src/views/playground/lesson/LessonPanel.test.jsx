import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../../test/render.js'
import { levels } from '../levels.js'
import { LessonPanel } from './LessonPanel.jsx'

const [level] = levels
const props = { step: 1, total: levels.length, level, onHint: () => {}, onSolution: () => {} }

describe('LessonPanel', () => {
  describe('lesson', () => {
    it('shows the translated title, goal and definition of the level', () => {
      render(<LessonPanel {...props} hintsShown={0} />)

      expect(screen.getByRole('heading', { name: 'Name your shop' })).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 20')).toBeInTheDocument()
      expect(screen.getByText(/so the sign shows the name of your shop/)).toBeInTheDocument()
      expect(screen.getByText(/A named box that holds a value/)).toBeInTheDocument()
    })

    it('hides the example code until it is given as a hint', () => {
      render(<LessonPanel {...props} hintsShown={0} />)

      expect(screen.queryByText(/let can change, const cannot/)).not.toBeInTheDocument()
    })
  })

  describe('hints', () => {
    it('asks for the next hint', async () => {
      const onHint = vi.fn()
      const { user } = renderWithUser(<LessonPanel {...props} hintsShown={1} onHint={onHint} />)

      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      await user.click(screen.getByRole('button', { name: /Another hint/ }))
      expect(onHint).toHaveBeenCalledOnce()
    })

    it('gives the example code just before the last hint', () => {
      render(<LessonPanel {...props} hintsShown={2} />)

      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(2)
      expect(items[1]).toHaveTextContent(/let can change, const cannot/)
      expect(screen.getByRole('button', { name: /3 of 3/ })).toBeInTheDocument()
    })

    it('replaces the code with the solution only after confirming', async () => {
      const onSolution = vi.fn()
      const { user } = renderWithUser(<LessonPanel {...props} hintsShown={3} onSolution={onSolution} />)

      await user.click(screen.getByRole('button', { name: 'Show me the solution' }))
      await user.click(screen.getByRole('button', { name: 'Keep trying' }))
      expect(onSolution).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: 'Show me the solution' }))
      await user.click(screen.getByRole('button', { name: 'Replace my code' }))
      expect(onSolution).toHaveBeenCalledOnce()
    })
  })
})
