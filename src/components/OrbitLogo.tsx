export function OrbitLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* orbit ring */}
      <ellipse
        cx="32"
        cy="34"
        rx="26"
        ry="10"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="2"
        transform="rotate(-20 32 34)"
      />
      {/* planet */}
      <circle cx="32" cy="34" r="11" fill="currentColor" />
      <circle cx="28" cy="31" r="2.4" fill="white" fillOpacity="0.35" />
      {/* stars */}
      <g fill="currentColor">
        <path d="M52 14l1.4 3.6L57 19l-3.6 1.4L52 24l-1.4-3.6L47 19l3.6-1.4z" opacity="0.95" />
        <path d="M12 10l.9 2.3L15.2 13l-2.3.9L12 16l-.9-2.1L8.8 13l2.3-.7z" opacity="0.85" />
        <circle cx="56" cy="40" r="1.6" opacity="0.85" />
        <circle cx="9" cy="44" r="1.2" opacity="0.7" />
      </g>
    </svg>
  );
}
