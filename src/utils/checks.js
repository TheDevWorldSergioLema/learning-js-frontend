import { CheckStatus } from '../types/checkStatus.js'
import { RunError } from '../types/runError.js'
import { createMemoryStorage } from './memoryStorage.js'
import { runCode, toRunError } from './runner.js'
import { stripComments } from './scan.js'

/** @typedef {import('../types/entities.js').Level} Level */
/** @typedef {import('../types/entities.js').CheckContext} CheckContext */
/** @typedef {import('../types/entities.js').CheckResult} CheckResult */

/**
 * @param {string} body
 * @param {string} code
 * @param {string[]} exportNames
 * @param {(body: string) => Window} openPage
 * @returns {{ ctx: CheckContext, errors: import('../types/entities.js').RunErrorInfo[] }}
 */
function createContext(body, code, exportNames, openPage) {
  const errors = []
  const storage = createMemoryStorage()
  const $ = (selector) => ctx.doc.querySelector(selector)
  const $$ = (selector) => [...ctx.doc.querySelectorAll(selector)]

  const load = () => {
    const win = openPage(body)
    const result = runCode(win, code, {
      storage,
      onLog: (entry) => ctx.logs.push(entry),
      onError: (error) => errors.push(error),
      exports: exportNames,
    })
    ctx.win = win
    ctx.doc = win.document
    ctx.exports = result.exports
    if (result.error) errors.push(result.error)
  }

  /** @type {CheckContext} */
  const ctx = {
    code: stripComments(code),
    logs: [],
    storage,
    win: null,
    doc: null,
    exports: {},
    $,
    $$,
    text: (selector) => $(selector)?.textContent.trim() ?? null,
    texts: (selector) => $$(selector).map((el) => el.textContent.trim()),
    hasClass: (selector, name) => Boolean($(selector)?.classList.contains(name)),
    click: (selector, times = 1) => {
      for (let i = 0; i < times; i++) $(selector)?.dispatchEvent(new ctx.win.MouseEvent('click', { bubbles: true, cancelable: true }))
    },
    type: (selector, value) => {
      const field = $(selector)
      if (!field) return
      field.value = value
      field.dispatchEvent(new ctx.win.Event('input', { bubbles: true }))
      field.dispatchEvent(new ctx.win.Event('change', { bubbles: true }))
    },
    submit: (selector) => {
      const event = new ctx.win.Event('submit', { bubbles: true, cancelable: true })
      $(selector)?.dispatchEvent(event)
      return event
    },
    reload: load,
  }

  load()
  return { ctx, errors }
}

/**
 * Runs every check of the step on a fresh page: `openPage` must return a window showing the given body, with no
 * trace of the previous run (except the storage, which each check keeps across its own reloads).
 * @param {Level} level
 * @param {string} code
 * @param {(body: string) => Window} openPage
 * @returns {CheckResult[]}
 */
export function runChecks(level, code, openPage) {
  return level.checks.map((check) => {
    const fail = (error) => ({ key: check.key, status: CheckStatus.Error, error })
    try {
      const { ctx, errors } = createContext(check.html ?? level.html, code, level.exports ?? [], openPage)
      if (errors.length) return fail(errors[0])
      const ok = Boolean(check.test(ctx))
      if (errors.length) return fail(errors[0])
      return { key: check.key, status: ok ? CheckStatus.Pass : CheckStatus.Fail }
    } catch (error) {
      return fail(toRunError(error, RunError.Runtime))
    }
  })
}
