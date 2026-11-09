import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../../test/render.js'
import { levels } from '../levels.js'
import { StepStrip } from './StepStrip.jsx'

describe('StepStrip', () => {
  describe('rendering', () => {
    it('labels every step with its title and marks the done and current ones', () => {
      render(<StepStrip levels={levels} current={1} completed={['shop-sign']} onSelect={() => {}} />)

      expect(screen.getAllByRole('button')).toHaveLength(levels.length)
      expect(screen.getByRole('button', { name: 'Step 1: Name your shop, done' })).toHaveClass('is-done')
      expect(screen.getByRole('button', { name: 'Step 2: 12 + 8 = 128?' })).toHaveAttribute('aria-current', 'step')
    })
  })

  describe('selection', () => {
    it('reports the index of the clicked step', async () => {
      const onSelect = vi.fn()
      const { user } = renderWithUser(<StepStrip levels={levels} current={0} completed={[]} onSelect={onSelect} />)

      await user.click(screen.getByRole('button', { name: 'Step 3: The price tag' }))
      expect(onSelect).toHaveBeenCalledWith(2)
    })
  })
})
