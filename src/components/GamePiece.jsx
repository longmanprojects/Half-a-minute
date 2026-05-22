export default function GamePiece({ color, size = 72, rotation = 0, style = {} }) {
  const uid = `disc-${color.replace(/[^a-z0-9]/gi, '')}-${size}`

  // Circular text path — starts at 9 o'clock, goes clockwise, r=37 sits inside the rim
  const r = 37
  const textPath = `M50,50 m-${r},0 a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)`, display: 'block', flexShrink: 0, overflow: 'visible', ...style }}
    >
      <defs>
        {/* Emboss filter — simulates raised plastic surface on text */}
        <filter id={`${uid}-emboss`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur" />
          <feOffset dx="1" dy="1.2" result="shadow" />
          <feOffset dx="-0.7" dy="-0.8" in="SourceAlpha" result="highlight-offset" />
          <feFlood floodColor="rgba(0,0,0,0.55)" result="shadow-color" />
          <feFlood floodColor="rgba(255,255,255,0.55)" result="highlight-color" />
          <feComposite in="shadow-color"    in2="shadow"          operator="in" result="shadow-fill" />
          <feComposite in="highlight-color" in2="highlight-offset" operator="in" result="highlight-fill" />
          <feMerge>
            <feMergeNode in="shadow-fill" />
            <feMergeNode in="highlight-fill" />
          </feMerge>
        </filter>

        {/* Disc face lighting: strong highlight top-left, dark bottom-right */}
        <radialGradient id={`${uid}-light`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.50)" />
          <stop offset="40%"  stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.40)" />
        </radialGradient>

        {/* Rim darkening — feathers in from the outer edge */}
        <radialGradient id={`${uid}-rim`} cx="50%" cy="50%" r="50%">
          <stop offset="68%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="84%"  stopColor="rgba(0,0,0,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.62)" />
        </radialGradient>

        {/* Inner recess shadow — thin ring just inside the rim */}
        <radialGradient id={`${uid}-recess`} cx="50%" cy="50%" r="50%">
          <stop offset="62%"  stopColor="rgba(0,0,0,0)" />
          <stop offset="74%"  stopColor="rgba(0,0,0,0.30)" />
          <stop offset="78%"  stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Text circular path */}
        <path id={`${uid}-tp`} d={textPath} />

        {/* Clip to disc shape */}
        <clipPath id={`${uid}-clip`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>

      {/* ── Drop shadow ── */}
      <ellipse cx="52" cy="97" rx="40" ry="5" fill="rgba(0,0,0,0.30)" />

      {/* ── Disc edge / thickness (4 offset layers, each darkened) ── */}
      <g clipPath={`url(#${uid}-clip)`}>
        <circle cx="50" cy="55.5" r="46" fill={color} opacity="0.40" />
        <circle cx="50" cy="54.0" r="46" fill={color} opacity="0.55" />
        <circle cx="50" cy="52.5" r="46" fill={color} opacity="0.70" />
        <circle cx="50" cy="51.2" r="46" fill={color} opacity="0.85" />
      </g>

      {/* ── Main disc face ── */}
      <circle cx="50" cy="50" r="46" fill={color} />

      {/* ── 3D face lighting ── */}
      <circle cx="50" cy="50" r="46" fill={`url(#${uid}-light)`} />

      {/* ── Raised rim: dark gradient feathering in from edge ── */}
      <circle cx="50" cy="50" r="46" fill={`url(#${uid}-rim)`} />

      {/* ── Inner recess groove (thin shadow ring just inside rim) ── */}
      <circle cx="50" cy="50" r="46" fill={`url(#${uid}-recess)`} />

      {/* ── Rim inner lip highlight ── */}
      <circle cx="50" cy="50" r="37.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />

      {/* ── Embossed circular text ── */}
      {/* Dark shadow pass */}
      <text
        fontFamily="'Archivo Black', Arial Black, sans-serif"
        fontSize="8"
        fontWeight="900"
        letterSpacing="4.2"
        fill="rgba(0,0,0,0.60)"
        dx="1.0" dy="1.2"
      >
        <textPath href={`#${uid}-tp`} startOffset="2%">
          30 SECONDS · 30 SECONDS ·
        </textPath>
      </text>

      {/* Light highlight pass */}
      <text
        fontFamily="'Archivo Black', Arial Black, sans-serif"
        fontSize="8"
        fontWeight="900"
        letterSpacing="4.2"
        fill="rgba(255,255,255,0.50)"
        dx="-0.8" dy="-0.8"
      >
        <textPath href={`#${uid}-tp`} startOffset="2%">
          30 SECONDS · 30 SECONDS ·
        </textPath>
      </text>

      {/* ── Rim top-left specular glint ── */}
      <ellipse
        cx="28" cy="22"
        rx="10" ry="6"
        fill="rgba(255,255,255,0.18)"
        transform="rotate(-35 28 22)"
      />
    </svg>
  )
}
