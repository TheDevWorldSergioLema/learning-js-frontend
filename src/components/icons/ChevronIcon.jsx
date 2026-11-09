export function ChevronIcon({ size = 12, ...props }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
    </svg>
  )
}
