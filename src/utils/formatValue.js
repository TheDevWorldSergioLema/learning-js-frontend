const MAX_DEPTH = 2
const MAX_ITEMS = 20

const tagOf = (value) => Object.prototype.toString.call(value).slice(8, -1)

function formatElement(el) {
  const id = el.id ? `#${el.id}` : ''
  const classes = [...el.classList].map((c) => `.${c}`).join('')
  return `<${el.tagName.toLowerCase()}${id}${classes}>`
}

function formatList(items, depth, seen) {
  const shown = items.slice(0, MAX_ITEMS).map((item) => formatNested(item, depth + 1, seen))
  if (items.length > MAX_ITEMS) shown.push('…')
  return shown.join(', ')
}

function formatNested(value, depth, seen) {
  if (typeof value === 'string') return `'${value}'`
  return format(value, depth, seen)
}

function format(value, depth, seen) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'symbol') return value.toString()
  if (typeof value === 'function') return `ƒ ${value.name || '(anonymous)'}()`
  if (value.nodeType === 1) return formatElement(value)
  if (value.nodeType === 3) return `'${value.textContent}'`
  if (value.nodeType === 9) return '#document'
  if (seen.has(value)) return '[Circular]'

  const tag = tagOf(value)
  if (tag === 'Error') return `${value.name}: ${value.message}`
  if (depth > MAX_DEPTH) return Array.isArray(value) ? '[…]' : '{…}'

  seen.add(value)
  try {
    if (Array.isArray(value)) return `[${formatList(value, depth, seen)}]`
    if (tag === 'NodeList' || tag === 'HTMLCollection') return `${tag}(${value.length}) [${formatList([...value], depth, seen)}]`
    if (tag === 'Map') return `Map(${value.size}) {${[...value].map(([k, v]) => ` ${formatNested(k, depth + 1, seen)} => ${formatNested(v, depth + 1, seen)}`).join(',')} }`
    if (tag === 'Set') return `Set(${value.size}) {${[...value].map((v) => ` ${formatNested(v, depth + 1, seen)}`).join(',')} }`
    if (tag === 'Date') return value.toISOString()
    if (tag === 'FormData') return `FormData {${[...value].map(([k, v]) => ` ${k}: ${formatNested(v, depth + 1, seen)}`).join(',')} }`
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    const shown = entries.slice(0, MAX_ITEMS).map(([k, v]) => `${k}: ${formatNested(v, depth + 1, seen)}`)
    if (entries.length > MAX_ITEMS) shown.push('…')
    return `{ ${shown.join(', ')} }`
  } finally {
    seen.delete(value)
  }
}

/** The text the console shows for a value: strings as they are at the top level, quoted inside arrays and objects. */
export function formatValue(value) {
  return format(value, 0, new Set())
}
