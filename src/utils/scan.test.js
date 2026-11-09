import { describe, expect, it } from 'vitest'
import { CharKind } from '../types/charKind.js'
import { scan, stripComments } from './scan.js'

const kindsOf = (code) => scan(code).join('')

describe('scan', () => {
  describe('kinds', () => {
    it('marks strings as text and the rest as code', () => {
      expect(kindsOf("a('x')")).toBe('cctttc')
      expect(kindsOf('"a\\"b"')).toBe('tttttt')
    })

    it('marks line and block comments', () => {
      expect(kindsOf('a // b\nc')).toBe('ccmmmmcc')
      expect(kindsOf('a /* b */ c')).toBe('ccmmmmmmmcc')
    })

    it('reads the expressions of a template literal as code', () => {
      expect(kindsOf('`a${b}c`')).toBe('ttcccctt')
      const kinds = scan('`a${f({ x: 1 })}b`')
      expect(kinds[0]).toBe(CharKind.Text)
      expect(kinds['`a${f({ x: 1 '.length]).toBe(CharKind.Code)
      expect(kinds.at(-2)).toBe(CharKind.Text)
    })

    it('ignores comment and quote marks inside strings', () => {
      expect(kindsOf("'//' + x")).toBe('ttttcccc')
    })
  })

  describe('stripComments', () => {
    it('removes the comments and keeps the strings', () => {
      expect(stripComments("// .map(\nconst a = '// x' /* .filter( */")).toBe("\nconst a = '// x' ")
    })
  })
})
