export function ButterflyIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* body */}
      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* antennae */}
      <path d="M12 5c-1-1.5-2.5-2-3.5-1.5M12 5c1-1.5 2.5-2 3.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* left wings */}
      <path
        d="M12 9C9 5 3 6 3 10c0 3 3 4 5 4 2.5 0 4-1.5 4-3z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M12 13c-2.5 0-4 1.5-4 3 0 2.5 2 4 4 4 0 0 0-3 0-7z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      {/* right wings */}
      <path
        d="M12 9c3-4 9-3 9 1 0 3-3 4-5 4-2.5 0-4-1.5-4-3z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M12 13c2.5 0 4 1.5 4 3 0 2.5-2 4-4 4 0 0 0-3 0-7z"
        fill="currentColor"
        fillOpacity="0.55"
      />
    </svg>
  );
}
