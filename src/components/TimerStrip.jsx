import './TimerStrip.css'

// sandColor varies by phase
const SAND_COLORS = {
  calm: '#F5E06E',
  amber: '#FB8C00',
  critical: '#E5523B',
}

export default function TimerStrip({ timeLeft, maxTime, teamName, teamColor, playerName, roundNumber, phase }) {
  const sandPct = timeLeft / maxTime

  // Digit size grows as critical seconds count down (5→0)
  const digitSize = phase === 'critical'
    ? 72 + (5 - Math.max(timeLeft, 0)) * 6  // 72 → 102px
    : 72

  return (
    <div className={`timer-strip phase-${phase}`}>
      <div className="timer-meta">
        <span className="round-label">ROUND {roundNumber}</span>
        <div className="team-info">
          <span className="team-label" style={{ color: teamColor }}>
            {teamName.toUpperCase()}'S TURN
          </span>
          {playerName && (
            <span className="player-label">{playerName} is describing</span>
          )}
        </div>
      </div>

      <div className="timer-main">
        <HourglassSVG sandPct={sandPct} phase={phase} />
        <span
          className="timer-digits"
          style={{ fontSize: `${digitSize}px`, color: phase !== 'calm' ? SAND_COLORS[phase] : 'var(--white)' }}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  )
}

function HourglassSVG({ sandPct, phase }) {
  const sandColor = SAND_COLORS[phase]
  const topFill = sandPct
  const bottomFill = 1 - sandPct

  return (
    <svg width="40" height="56" viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="top-clip">
          <polygon points="2,2 34,2 18,26" />
        </clipPath>
        <clipPath id="bot-clip">
          <polygon points="18,26 34,50 2,50" />
        </clipPath>
      </defs>

      {/* Top chamber background */}
      <polygon points="2,2 34,2 18,26" fill="rgba(255,255,255,0.08)" />
      {/* Top sand — shrinks as time passes */}
      <rect
        x="0" y={2 + (1 - topFill) * 24} width="36" height={topFill * 24}
        fill={sandColor}
        clipPath="url(#top-clip)"
        style={{ transition: 'y 0.8s linear, height 0.8s linear, fill 0.5s' }}
      />

      {/* Bottom chamber background */}
      <polygon points="18,26 34,50 2,50" fill="rgba(255,255,255,0.08)" />
      {/* Bottom sand — grows as time passes */}
      <rect
        x="0" y={26 + (1 - bottomFill) * 24} width="36" height={bottomFill * 24}
        fill={sandColor}
        clipPath="url(#bot-clip)"
        style={{ transition: 'y 0.8s linear, height 0.8s linear, fill 0.5s' }}
      />

      {/* Frame */}
      <polyline points="2,2 34,2 18,26 34,50 2,50 18,26 2,2"
        stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <line x1="0" y1="2" x2="36" y2="2" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <line x1="0" y1="50" x2="36" y2="50" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
    </svg>
  )
}
