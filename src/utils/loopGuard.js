import { CharKind } from '../types/charKind.js'
import { scan } from './scan.js'

const LOOP = /\b(for|while)\s*\(/g
const OPENING = '([{'
const CLOSING = ')]}'

function closingParen(code, kinds, open) {
  let depth = 0
  for (let i = open; i < code.length; i++) {
    if (kinds[i] !== CharKind.Code) continue
    if (OPENING.includes(code[i])) depth++
    if (CLOSING.includes(code[i]) && --depth === 0) return i
  }
  return -1
}

function topLevelSemicolons(code, kinds, from, to) {
  const found = []
  let depth = 0
  for (let i = from; i < to; i++) {
    if (kinds[i] !== CharKind.Code) continue
    if (OPENING.includes(code[i])) depth++
    else if (CLOSING.includes(code[i])) depth--
    else if (code[i] === ';' && depth === 0) found.push(i)
  }
  return found
}

/**
 * Adds a call to `guard` in the condition of every `while`, `do...while` and `for (;;)` loop, so that a loop
 * which never ends can be stopped. Lines are kept as they are, so error line numbers still match the code.
 * `for...of` and `for...in` loops always end and are left untouched.
 * @param {string} code
 * @param {string} guard name of a global function that throws when a loop has run too long
 */
export function guardLoops(code, guard) {
  const kinds = scan(code)
  const edits = []

  for (const match of code.matchAll(LOOP)) {
    const start = match.index
    if (kinds[start] !== CharKind.Code || /[\w$.]/.test(code[start - 1] ?? '')) continue
    const open = start + match[0].length - 1
    const close = closingParen(code, kinds, open)
    if (close === -1) continue

    if (match[1] === 'while') {
      edits.push({ from: open + 1, to: close, text: `${guard}() && (${code.slice(open + 1, close)})` })
      continue
    }
    const semicolons = topLevelSemicolons(code, kinds, open + 1, close)
    if (semicolons.length !== 2) continue
    const [first, second] = semicolons
    const condition = code.slice(first + 1, second)
    edits.push({ from: first + 1, to: second, text: `${guard}() && (${condition.trim() ? condition : 'true'})` })
  }

  let guarded = code
  let limit = Infinity
  for (const edit of edits.sort((a, b) => b.from - a.from)) {
    if (edit.to > limit) continue
    guarded = guarded.slice(0, edit.from) + edit.text + guarded.slice(edit.to)
    limit = edit.from
  }
  return guarded
}
