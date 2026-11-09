export function BrickIcon({ width = 34, height = 20, ...props }) {
  return (
    <svg viewBox="0 0 40 24" width={width} height={height} fill="currentColor" aria-hidden="true" {...props}>
      <rect x="6" y="0" width="10" height="5" rx="1.5" />
      <rect x="24" y="0" width="10" height="5" rx="1.5" />
      <rect x="0" y="4" width="40" height="20" rx="2.5" />
    </svg>
  )
}
