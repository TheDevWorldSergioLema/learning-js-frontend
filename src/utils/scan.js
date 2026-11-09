import { CharKind } from '../types/charKind.js'

/**
 * Tells, for every character of the code, whether it is code, text (inside a string or a template literal) or a
 * comment. The `${...}` expressions of template literals are code. Regular expression literals are read as code.
 * @param {string} code
 * @returns {string[]} one `CharKind` per character
 */
export function scan(code) {
  const n = code.length
  const kinds = new Array(n).fill(CharKind.Code)
  const mark = (from, to, kind) => kinds.fill(kind, from, Math.min(to, n))
  const stack = []
  let i = 0

  while (i < n) {
    const c = code[i]
    const top = stack.at(-1)

    if (top === 'template') {
      const start = i
      while (i < n && code[i] !== '`' && !(code[i] === '$' && code[i + 1] === '{')) i += code[i] === '\\' ? 2 : 1
      mark(start, i, CharKind.Text)
      if (i >= n) break
      if (code[i] === '`') {
        mark(i, i + 1, CharKind.Text)
        stack.pop()
        i++
      } else {
        stack.push('expression')
        i += 2
      }
      continue
    }

    if (c === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i)
      const stop = end === -1 ? n : end
      mark(i, stop, CharKind.Comment)
      i = stop
    } else if (c === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2)
      const stop = end === -1 ? n : end + 2
      mark(i, stop, CharKind.Comment)
      i = stop
    } else if (c === '"' || c === "'") {
      let j = i + 1
      while (j < n && code[j] !== c && code[j] !== '\n') j += code[j] === '\\' ? 2 : 1
      mark(i, j + 1, CharKind.Text)
      i = j + 1
    } else if (c === '`') {
      mark(i, i + 1, CharKind.Text)
      stack.push('template')
      i++
    } else {
      if (c === '{' && top) stack.push('brace')
      if (c === '}' && top) stack.pop()
      i++
    }
  }

  return kinds
}

/** The code without its comments, to look for the APIs a step asks for. */
export function stripComments(code) {
  const kinds = scan(code)
  return code.split('').filter((_, i) => kinds[i] !== CharKind.Comment).join('')
}
