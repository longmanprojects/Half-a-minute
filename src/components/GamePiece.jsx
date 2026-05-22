export default function GamePiece({ color, size = 72, rotation = 0, opacity = 1 }) {
  const id = `gp-${color.replace(/[^a-z0-9]/gi, '')}-${size}`

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 56 84"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)`, opacity, display: 'block', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={`${id}-head`} cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </radialGradient>
        <radialGradient id={`${id}-body`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
        </radialGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="28" cy="81" rx="18" ry="4" fill="rgba(0,0,0,0.25)" />

      {/* Body — classic pawn silhouette */}
      <path
        d="M28 32
           C21 32 17 37 17 43
           C17 50 13 58 11 67
           C9 74 15 78 28 78
           C41 78 47 74 45 67
           C43 58 39 50 39 43
           C39 37 35 32 28 32 Z"
        fill={color}
      />
      <path
        d="M28 32
           C21 32 17 37 17 43
           C17 50 13 58 11 67
           C9 74 15 78 28 78
           C41 78 47 74 45 67
           C43 58 39 50 39 43
           C39 37 35 32 28 32 Z"
        fill={`url(#${id}-body)`}
      />

      {/* Neck */}
      <rect x="22" y="29" width="12" height="6" rx="3" fill={color} />

      {/* Head */}
      <circle cx="28" cy="18" r="14" fill={color} />
      <circle cx="28" cy="18" r="14" fill={`url(#${id}-head)`} />

      {/* Specular highlight on head */}
      <ellipse
        cx="23"
        cy="12"
        rx="5"
        ry="3.5"
        fill="rgba(255,255,255,0.5)"
        transform="rotate(-20 23 12)"
      />
    </svg>
  )
}
