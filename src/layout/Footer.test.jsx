import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FooterLink } from '../types/footerLink.js'
import { Footer } from './Footer.jsx'

describe('Footer', () => {
  describe('links', () => {
    it.each([
      ['Source code on GitHub', FooterLink.GitHub],
      ['LinkedIn', FooterLink.LinkedIn],
      ['Blog', FooterLink.Blog],
    ])('links %s in a new tab', (name, href) => {
      render(<Footer />)

      const link = screen.getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
    })
  })
})
