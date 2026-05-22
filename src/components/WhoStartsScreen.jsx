import { useState, useEffect } from 'react'
import './WhoStartsScreen.css'
import HomeButton from './HomeButton.jsx'

const DOT_LAYOUTS = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 28], [70, 28], [30, 50], [70, 50], [30, 72], [70, 72]],
}

function DiceFace({ value }) {
  const dots = DOT_LAYOUTS[value] || DOT_LAYOUTS[1]
  return (
    <svg viewBox="0 0 100 100" className="dice-svg">
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={8.5} className="dice-dot" />
      ))}
    </svg>
  )
}

export default function WhoStartsScreen({ teams, onBegin, onHome }) {
  const [phase, setPhase] = useState('rolling')
  const [diceValue, setDiceValue] = useState(1)
  const [winnerIdx] = useState(() => Math.floor(Math.random() * teams.length))

  const winner = teams[winnerIdx]
  const starterPlayer = winner.players?.[0]?.name || ''

  useEffect(() => {
    const timeouts = []

    function tick(count) {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      if (count < 28) {
        let delay = 70
        if (count > 18) delay = 130
        if (count > 23) delay = 210
        if (count > 26) delay = 360
        const t = setTimeout(() => tick(count + 1), delay)
        timeouts.push(t)
      } else {
        const t = setTimeout(() => setPhase('done'), 500)
        timeouts.push(t)
      }
    }

    const start = setTimeout(() => tick(0), 250)
    timeouts.push(start)
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="screen who-starts-screen">
      <HomeButton onHome={onHome} />

      <div className="whos-header">
        <p className="setup-step">GET READY</p>
        <h1 className="setup-title">WHO STARTS?</h1>
        <p className="setup-sub">Rolling to decide…</p>
      </div>

      <div className="dice-stage">
        <div className={`dice-wrap ${phase}`}>
          <DiceFace value={diceValue} />
        </div>

        {phase === 'rolling' && (
          <div className="team-legend">
            {teams.map((t) => (
              <div key={t.id} className="legend-pill">
                <span className="legend-dot" style={{ background: t.color }} />
                <span className="legend-name">{t.name}</span>
              </div>
            ))}
          </div>
        )}

        {phase === 'done' && (
          <div className="winner-reveal">
            <div className="winner-card" style={{ borderColor: winner.color }}>
              <p className="winner-eyebrow">FIRST TO PLAY</p>
              <div className="winner-team-row">
                <span className="winner-dot" style={{ background: winner.color }} />
                <span className="winner-team-name">{winner.name}</span>
              </div>
              {starterPlayer && (
                <p className="winner-player">
                  {starterPlayer} is describing first
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={`whos-footer ${phase === 'done' ? 'visible' : ''}`}>
        <button
          className="btn-primary"
          disabled={phase !== 'done'}
          onClick={() => onBegin(winnerIdx)}
        >
          LET'S GO →
        </button>
      </div>
    </div>
  )
}
