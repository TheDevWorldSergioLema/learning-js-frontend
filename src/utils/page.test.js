import { describe, expect, it, vi } from 'vitest'
import { openPage } from '../test/page.js'
import { pageHtml, writePage } from './page.js'

describe('page', () => {
  describe('pageHtml', () => {
    it('wraps the body of a step in a styled document', () => {
      const html = pageHtml('<p id="a"></p>')

      expect(html).toMatch(/^<!doctype html>/)
      expect(html).toContain('<style>')
      expect(html).toContain('<body><p id="a"></p></body>')
    })
  })

  describe('writePage', () => {
    it('replaces the document with the new page', () => {
      const win = openPage('<p id="a">1</p>')

      writePage(win, '<p id="b">2</p>')

      expect(win.document.querySelector('#a')).toBeNull()
      expect(win.document.querySelector('#b').textContent).toBe('2')
    })

    it('cancels the timers of the previous run', async () => {
      const win = openPage('')
      const tick = vi.fn()
      win.setTimeout(tick, 0)
      win.setInterval(tick, 1)

      writePage(win, '')
      await new Promise((resolve) => setTimeout(resolve, 20))

      expect(tick).not.toHaveBeenCalled()
    })
  })
})
