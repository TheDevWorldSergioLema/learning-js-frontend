import { describe, expect, it } from 'vitest'
import { openPage } from '../test/page.js'
import { CheckStatus } from '../types/checkStatus.js'
import { RunError } from '../types/runError.js'
import { runChecks } from './checks.js'

const level = (checks, extra = {}) => ({ id: 'test', html: '<p id="out">0</p><button id="b"></button>', checks, ...extra })
const statuses = (results) => results.map((r) => r.status)

describe('runChecks', () => {
  describe('statuses', () => {
    it('passes or fails every check on its own fresh page', () => {
      const l = level([
        { key: 'a', test: (ctx) => ctx.text('#out') === '1' },
        { key: 'b', test: (ctx) => ctx.text('#out') === '2' },
      ])

      const results = runChecks(l, "const out = document.querySelector('#out')\nout.textContent = Number(out.textContent) + 1", openPage)

      expect(results).toEqual([
        { key: 'a', status: CheckStatus.Pass },
        { key: 'b', status: CheckStatus.Fail },
      ])
    })

    it('uses the page of the check when it has one', () => {
      const l = level([{ key: 'a', html: '<p id="out">41</p>', test: (ctx) => ctx.text('#out') === '42' }])

      expect(statuses(runChecks(l, "const out = document.querySelector('#out')\nout.textContent = Number(out.textContent) + 1", openPage))).toEqual([CheckStatus.Pass])
    })

    it('reports the error of the code on every check', () => {
      const results = runChecks(level([{ key: 'a', test: () => true }]), 'nope()', openPage)

      expect(results[0]).toMatchObject({ status: CheckStatus.Error, error: { type: RunError.Runtime, name: 'ReferenceError' } })
    })

    it('reports the error of a listener the check triggers', () => {
      const l = level([{ key: 'a', test: (ctx) => { ctx.click('#b'); return true } }])

      const results = runChecks(l, "document.querySelector('#b').addEventListener('click', () => null.x)", openPage)

      expect(results[0]).toMatchObject({ status: CheckStatus.Error, error: { name: 'TypeError' } })
    })
  })

  describe('context', () => {
    it('reads the code without its comments', () => {
      const l = level([{ key: 'a', test: (ctx) => /\.map\(/.test(ctx.code) }])

      expect(statuses(runChecks(l, '// use .map(', openPage))).toEqual([CheckStatus.Fail])
    })

    it('keeps the storage across a reload, on a new page', () => {
      const l = level([
        {
          key: 'a',
          test: (ctx) => {
            ctx.click('#b')
            ctx.reload()
            return ctx.text('#out') === 'saved'
          },
        },
      ])
      const code = `const out = document.querySelector('#out')
out.textContent = localStorage.getItem('x') ?? 'empty'
document.querySelector('#b').addEventListener('click', () => localStorage.setItem('x', 'saved'))`

      expect(statuses(runChecks(l, code, openPage))).toEqual([CheckStatus.Pass])
    })

    it('calls the exported functions of the code', () => {
      const l = level([{ key: 'a', test: (ctx) => ctx.exports.twice(2) === 4 }], { exports: ['twice'] })

      expect(statuses(runChecks(l, 'const twice = (n) => n * 2', openPage))).toEqual([CheckStatus.Pass])
    })
  })
})
