import { useState, useEffect } from 'react'
import './ScoresScreen.css'
import HomeButton from './HomeButton.jsx'

export default function ScoresScreen({ teams, targetScore, currentTeamIdx, lastTurnPoints, winner, pendingWin, winTriggerTeam, turnsPlayed, nextTeam, nextPlayerName, onNext, onReset, onHome }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)
  const scoringTeam = teams[currentTeamIdx]

  const teamsDue = pendingWin
    ? (() => {
        const maxTurns = Math.max(...Object.values(turnsPlayed || {}))
        return teams.filter(t => (turnsPlayed?.[t.id] || 0) < maxTurns)
      })()
    : []

  function formatDueList(due) {
    if (due.length === 1) return due[0].name
    return due.slice(0, -1).map(t => t.name).join(', ') + ' and ' + due[due.length - 1].name
  }

  // Animate bars from 0 → actual on mount
  const [animated, setAnimated] = useState(false)
  const [showFlying, setShowFlying] = useState(false)

  useEffect(() => {
    // Tiny delay so browser paints width:0 first, then transitions to real value
    const t1 = setTimeout(() => setAnimated(true), 60)
    // Show the flying "+N pts" shortly after
    const t2 = setTimeout(() => setShowFlying(true), 80)
    const t3 = setTimeout(() => setShowFlying(false), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="screen scores-screen">
      <HomeButton onHome={onHome} />

      {/* Flying points burst */}
      {showFlying && !winner && lastTurnPoints > 0 && (
        <div className="pts-fly" style={{ color: scoringTeam?.color }}>
          +{lastTurnPoints}
        </div>
      )}

      {winner ? (
        <div className="winner-banner">
          <div className="winner-trophy">🏆</div>
          <p className="winner-eyebrow">WINNER</p>
          <h1 className="winner-name" style={{ color: winner.color }}>{winner.name}</h1>
          <p className="winner-score">{winner.score} pts</p>
        </div>
      ) : pendingWin ? (
        <div className="final-round-banner">
          <p className="final-round-flag">🏁 FINAL ROUND</p>
          <p className="final-round-headline">
            <span style={{ color: winTriggerTeam?.color }}>{winTriggerTeam?.name}</span>
            {' '}hit {targetScore} pts!
          </p>
          <p className="final-round-body">
            {formatDueList(teamsDue)} {teamsDue.length === 1 ? 'still has' : 'each have'} one more turn.
          </p>
        </div>
      ) : (
        <div className="scores-header">
          <p className="scores-eyebrow">AFTER THAT ROUND</p>
          <h1 className="scores-title">SCOREBOARD</h1>
          {lastTurnPoints > 0
            ? <p className="scores-pts">
                <span className="pts-badge" style={{ background: scoringTeam?.color }}>
                  +{lastTurnPoints} {lastTurnPoints === 1 ? 'pt' : 'pts'}
                </span>
                {' '}banked for{' '}
                <span style={{ color: scoringTeam?.color }}>{scoringTeam?.name}</span>
              </p>
            : <p className="scores-pts">No points scored this round</p>
          }
        </div>
      )}

      <div className="score-list">
        {sorted.map((team) => {
          const progress = animated ? Math.min((team.score / targetScore) * 100, 100) : 0
          const isScorer = !winner && team.id === scoringTeam?.id && lastTurnPoints > 0
          return (
            <div className={`score-row ${isScorer ? 'scorer-flash' : ''}`} key={team.id}
              style={{ '--flash-color': team.color + '33' }}>
              <div className="score-row-top">
                <div className="score-team-info">
                  <div className="score-color-bar" style={{ background: team.color }} />
                  <span className="score-team-name">{team.name}</span>
                </div>
                <span className="score-number" style={{ color: team.color }}>
                  {team.score}
                  <span className="score-denom">/{targetScore}</span>
                </span>
              </div>
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{ width: `${progress}%`, background: team.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="scores-footer">
        {!winner && nextTeam && nextPlayerName && (
          <div
            className="handoff-banner"
            style={{
              '--hc': nextTeam.color,
              '--hc-glow': nextTeam.color + '55',
              '--hc-border': nextTeam.color + 'AA',
            }}
          >
            <p className="handoff-eyebrow">UP NEXT</p>
            <p className="handoff-team" style={{ color: nextTeam.color }}>
              {nextTeam.name}
            </p>
            <p className="handoff-player">
              <span className="handoff-player-name">{nextPlayerName}</span>
              {' '}is describing
            </p>
          </div>
        )}
        {winner ? (
          <button className="btn-primary" onClick={onReset}>
            PLAY AGAIN →
          </button>
        ) : (
          <button className="btn-primary" onClick={onNext}>
            NEXT TURN →
          </button>
        )}
        <button className="btn-ghost" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  )
}
