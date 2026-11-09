/** Renders text where `backticks` mark inline code. */
export function RichText({ text }) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part,
  )
}
