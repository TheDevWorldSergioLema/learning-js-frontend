import { describe, expect, it, vi } from 'vitest'
import { openPage } from '../test/page.js'
import { LogLevel } from '../types/logLevel.js'
import { RunError } from '../types/runError.js'
import { createMemoryStorage } from './memoryStorage.js'
import { runCode } from './runner.js'

const page = () => openPage('<p id="out"></p><form id="f"><input name="a" value="x"></form><button id="b"></button>')

describe('runCode', () => {
  describe('success', () => {
    it('runs the code against the page document', () => {
      const win = page()

      const result = runCode(win, "document.querySelector('#out').textContent = 'hi'")

      expect(result.error).toBeNull()
      expect(win.document.querySelector('#out').textContent).toBe('hi')
    })

    it('returns the requested top-level names, undefined when missing', () => {
      const result = runCode(page(), 'const a = 1\nfunction twice(n) { return n * 2 }', { exports: ['twice', 'a', 'missing'] })

      expect(result.exports.twice(4)).toBe(8)
      expect(result.exports.a).toBe(1)
      expect(result.exports.missing).toBeUndefined()
    })

    it('sends console calls to onLog, formatted', () => {
      const onLog = vi.fn()

      runCode(page(), "console.log('total', 20, ['a'])\nconsole.warn('careful')\nconsole.group()", { onLog })

      expect(onLog.mock.calls.map(([entry]) => entry)).toEqual([
        { level: LogLevel.Log, text: "total 20 ['a']" },
        { level: LogLevel.Warn, text: 'careful' },
      ])
    })

    it('uses the given storage as localStorage', () => {
      const storage = createMemoryStorage({ theme: 'dark' })

      const result = runCode(page(), "localStorage.setItem('seen', localStorage.getItem('theme'))", { storage })

      expect(result.error).toBeNull()
      expect(storage.getItem('seen')).toBe('dark')
    })
  })

  describe('errors', () => {
    it('reports a syntax error', () => {
      const { error } = runCode(page(), 'const = 3')

      expect(error).toMatchObject({ type: RunError.Syntax, name: 'SyntaxError' })
    })

    it('reports a runtime error with its line', () => {
      const { error } = runCode(page(), "const a = 1\n\ndocument.querySelector('#nope').textContent = a")

      expect(error).toMatchObject({ type: RunError.Runtime, name: 'TypeError', line: 3 })
    })

    it('stops a loop that never ends', () => {
      const { error } = runCode(page(), 'let i = 0\nwhile (i < 10) {\n  i--\n}')

      expect(error).toMatchObject({ type: RunError.InfiniteLoop, line: 2 })
    })

    it('reports the errors thrown later by event listeners', () => {
      const win = page()
      const onError = vi.fn()
      runCode(win, "document.querySelector('#b').addEventListener('click', () => missing())", { onError })

      win.document.querySelector('#b').click()

      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ type: RunError.Runtime, name: 'ReferenceError' }))
    })
  })

  describe('forms', () => {
    it('calls onFormReload when a form is submitted without preventDefault', () => {
      const win = page()
      const onFormReload = vi.fn()
      runCode(win, '', { onFormReload })

      const event = new win.Event('submit', { bubbles: true, cancelable: true })
      win.document.querySelector('#f').dispatchEvent(event)

      expect(onFormReload).toHaveBeenCalledOnce()
      expect(event.defaultPrevented).toBe(true)
    })

    it('leaves a submission the code prevented alone', () => {
      const win = page()
      const onFormReload = vi.fn()
      runCode(win, "document.querySelector('#f').addEventListener('submit', (e) => e.preventDefault())", { onFormReload })

      win.document.querySelector('#f').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }))

      expect(onFormReload).not.toHaveBeenCalled()
    })
  })
})
