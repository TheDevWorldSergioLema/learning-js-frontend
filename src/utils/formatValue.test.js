import { describe, expect, it } from 'vitest'
import { formatValue } from './formatValue.js'

describe('formatValue', () => {
  describe('primitives', () => {
    it('shows strings as they are and the other primitives as JavaScript writes them', () => {
      expect([formatValue('hi'), formatValue(4.5), formatValue(true), formatValue(null), formatValue(undefined)]).toEqual([
        'hi',
        '4.5',
        'true',
        'null',
        'undefined',
      ])
    })
  })

  describe('objects', () => {
    it('quotes the strings inside arrays and objects', () => {
      expect(formatValue(['a', 1])).toBe("['a', 1]")
      expect(formatValue({ name: 'Red brick', price: 0.5 })).toBe("{ name: 'Red brick', price: 0.5 }")
    })

    it('shows nested values down to a depth, and circular references', () => {
      const loop = { a: 1 }
      loop.self = loop
      expect(formatValue({ a: { b: { c: { d: 1 } } } })).toBe('{ a: { b: { c: {…} } } }')
      expect(formatValue(loop)).toBe('{ a: 1, self: [Circular] }')
    })

    it('shows functions and errors by name', () => {
      expect(formatValue(function stockLabel() {})).toBe('ƒ stockLabel()')
      expect(formatValue(new TypeError('nope'))).toBe('TypeError: nope')
    })
  })

  describe('DOM', () => {
    it('shows an element by its tag, id and classes', () => {
      const el = document.createElement('p')
      el.id = 'status'
      el.className = 'badge sold-out'

      expect(formatValue(el)).toBe('<p#status.badge.sold-out>')
    })

    it('shows a NodeList with its size and elements', () => {
      document.body.innerHTML = '<b></b><b class="x"></b>'

      expect(formatValue(document.querySelectorAll('b'))).toBe('NodeList(2) [<b>, <b.x>]')
    })
  })
})
