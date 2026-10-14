export function WorldCardsLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 40 40" role="img">
        <path className="brand-logo-ring" d="M28.5 10.5a12 12 0 1 0 0 19" />
        <path className="brand-logo-w" d="M8 14.5 11.5 27l4.5-9 4.5 9 3.5-12.5" />
      </svg>
    </span>
  );
}
