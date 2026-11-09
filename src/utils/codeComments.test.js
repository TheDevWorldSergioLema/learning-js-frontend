import { describe, expect, it } from 'vitest'
import { fillComments } from './codeComments.js'

describe('fillComments', () => {
  describe('placeholders', () => {
    it('replaces every placeholder with its comment', () => {
      const code = '/* {{square}} */\n.square {\n}\n/* {{square}} */'

      expect(fillComments(code, { square: '2 × 2 studs' })).toBe('/* 2 × 2 studs */\n.square {\n}\n/* 2 × 2 studs */')
    })

    it('keeps an unknown placeholder as it is', () => {
      expect(fillComments('/* {{missing}} */', {})).toBe('/* {{missing}} */')
    })

    it('leaves code without placeholders untouched', () => {
      const code = '.brick {\n  padding: 20px;\n}\n'

      expect(fillComments(code, { square: 'x' })).toBe(code)
    })
  })
})
