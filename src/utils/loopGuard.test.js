import { describe, expect, it } from 'vitest'
import { guardLoops } from './loopGuard.js'

const guard = (code) => guardLoops(code, 'g')

describe('guardLoops', () => {
  describe('loops', () => {
    it('guards the condition of a while loop', () => {
      expect(guard('while (x < 3) x++')).toBe('while (g() && (x < 3)) x++')
    })

    it('guards the condition of a do...while loop', () => {
      expect(guard('do { x++ } while (x < 3)')).toBe('do { x++ } while (g() && (x < 3))')
    })

    it('guards the middle part of a for loop, even when empty', () => {
      expect(guard('for (let i = 0; i < 5; i--) {}')).toBe('for (let i = 0;g() && ( i < 5); i--) {}')
      expect(guard('for (;;) {}')).toBe('for (;g() && (true);) {}')
    })

    it('guards nested loops', () => {
      expect(guard('for (;;) { while (a) {} }')).toBe('for (;g() && (true);) { while (g() && (a)) {} }')
    })

    it('leaves for...of and for...in loops untouched', () => {
      const code = 'for (const x of [1, 2]) {}\nfor (const k in o) {}'
      expect(guard(code)).toBe(code)
    })
  })

  describe('what is not a loop', () => {
    it('ignores loop words in strings, comments and names', () => {
      const code = "const s = 'while (x)' // for (;;)\nawaitFor(1); a.while(2); forEach(3)"
      expect(guard(code)).toBe(code)
    })

    it('ignores semicolons in nested calls of a for header', () => {
      expect(guard('for (let i = f(() => { a; b }); i < 2; i++) {}')).toBe('for (let i = f(() => { a; b });g() && ( i < 2); i++) {}')
    })

    it('keeps the line numbers of the code', () => {
      const code = 'let i = 0\nwhile (\n  i < 3\n) {\n  i++\n}\nnull.x'
      expect(guard(code).split('\n')).toHaveLength(code.split('\n').length)
    })
  })
})
