import { LogLevel } from '../types/logLevel.js'
import { RunError } from '../types/runError.js'
import { formatValue } from './formatValue.js'
import { guardLoops } from './loopGuard.js'

/** @typedef {import('../types/entities.js').RunErrorInfo} RunErrorInfo */
/** @typedef {import('../types/entities.js').LogEntry} LogEntry */

const GUARD = '__loopGuard'
export const MAX_ITERATIONS = 100_000

const LOOP_STOP = Symbol('loopStop')
const HANDLERS = Symbol('handlers')
const noop = () => {}

// `new Function` adds two lines before the body: `function anonymous(` and `) {`.
const FUNCTION_HEADER_LINES = 2

function errorLine(error) {
  const stack = String(error?.stack ?? '')
  const v8 = stack.match(/<anonymous>:(\d+):\d+/)
  if (v8) return Number(v8[1]) - FUNCTION_HEADER_LINES
  const firefox = stack.match(/> Function:(\d+):\d+/)
  return firefox ? Number(firefox[1]) : undefined
}

/**
 * @param {unknown} error
 * @param {import('../types/entities.js').RunErrorValue} type
 * @returns {RunErrorInfo}
 */
export function toRunError(error, type) {
  if (error?.[LOOP_STOP]) return { type: RunError.InfiniteLoop, line: errorLine(error) }
  const isError = typeof error === 'object' && error !== null && 'message' in error
  return {
    type,
    name: isError ? String(error.name) : 'Error',
    message: isError ? String(error.message) : formatValue(error),
    line: errorLine(error),
  }
}

function installGuard(win) {
  let iterations = 0
  win[GUARD] = () => {
    if (iterations === 0) setTimeout(() => (iterations = 0))
    if (++iterations > MAX_ITERATIONS) {
      const stop = new win.Error('loop')
      stop[LOOP_STOP] = true
      throw stop
    }
    return true
  }
}

function installConsole(win, onLog) {
  const write = (level) => (...args) => onLog({ level, text: args.map(formatValue).join(' ') })
  const methods = {
    log: write(LogLevel.Log),
    info: write(LogLevel.Log),
    debug: write(LogLevel.Log),
    table: write(LogLevel.Log),
    dir: write(LogLevel.Log),
    warn: write(LogLevel.Warn),
    error: write(LogLevel.Error),
  }
  const console = new Proxy(methods, { get: (target, name) => target[name] ?? noop })
  Object.defineProperty(win, 'console', { value: console, configurable: true, writable: true })
}

function installHandlers(win, onError, onFormReload) {
  const previous = win[HANDLERS]
  if (previous) {
    win.removeEventListener('error', previous.error)
    win.removeEventListener('submit', previous.submit)
  }
  const handlers = {
    error: (event) => {
      event.preventDefault()
      onError(toRunError(event.error, RunError.Runtime))
    },
    submit: (event) => {
      if (event.defaultPrevented) return
      event.preventDefault()
      onFormReload()
    },
  }
  win.addEventListener('error', handlers.error)
  if (onFormReload) win.addEventListener('submit', handlers.submit)
  win[HANDLERS] = handlers
}

const exportsSuffix = (names) =>
  names.length ? `\n;return { ${names.map((n) => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(', ')} }` : ''

/**
 * Runs the student's code in `win`, a window whose document already holds the page.
 * `exports` names top-level functions or variables of the code that the checks need to call.
 * Errors thrown later, by event listeners, go to `onError`. A form submitted without `preventDefault` calls
 * `onFormReload` instead of navigating the frame.
 * @param {Window} win
 * @param {string} code
 * @param {{
 *   storage?: Storage,
 *   onLog?: (entry: LogEntry) => void,
 *   onError?: (error: RunErrorInfo) => void,
 *   onFormReload?: () => void,
 *   exports?: string[],
 * }} [options]
 * @returns {{ error: RunErrorInfo | null, exports: Record<string, unknown> }}
 */
export function runCode(win, code, { storage, onLog = noop, onError = noop, onFormReload, exports = [] } = {}) {
  installGuard(win)
  installConsole(win, onLog)
  installHandlers(win, onError, onFormReload)
  if (storage) Object.defineProperty(win, 'localStorage', { value: storage, configurable: true })

  let compiled
  try {
    compiled = new win.Function(guardLoops(code, GUARD) + exportsSuffix(exports))
  } catch (error) {
    return { error: toRunError(error, RunError.Syntax), exports: {} }
  }
  try {
    return { error: null, exports: compiled() ?? {} }
  } catch (error) {
    return { error: toRunError(error, RunError.Runtime), exports: {} }
  }
}
