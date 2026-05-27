import { useState, useEffect } from 'react'
import './ScoresScreen.css'
import HomeButton from './HomeButton.jsx'

export default function ScoresScreen({
  teams, targetScore, currentTeamIdx, lastTurnPoints, winner,
  pendingWin, winTriggerTeam, turnsPlayed,
  nextTeam, nextPlayerName,
  isSuddenDeath, suddenDeathTeams, suddenDeathScores, suddenDeathRound,
  onNext, onReset, onHome,
}) {
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

  const [animated, setAnimated] = useState(false)
  const [showFlying, setShowFlying] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimated(true), 60)
    const t2 = setTimeout(() => setShowFlying(true), 80)
    const t3 = setTimeout(() => setShowFlying(false), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const sdAnnouncementMode = isSuddenDeath && Object.keys(suddenDeathScores).length === 0
  const sdInProgressMode = isSuddenDeath && Object.keys(suddenDeathScores).length > 0

  return (
    <div className="screen scores-screen">
      <HomeButton onHome={onHome} />

      {/* Flying points burst — suppressed during SD announcement */}
      {showFlying && !winner && lastTurnPoints > 0 && !sdAnnouncementMode && (
        <div className="pts-fly" style={{ color: scoringTeam?.color }}>
          +{lastTurnPoints}
        </div>
      )}

      {/* Header section */}
      {winner ? (
        <div className="winner-banner">
          <div className="winner-trophy">🏆</div>
          <p className="winner-eyebrow">WINNER</p>
          <h1 className="winner-name" style={{ color: winner.color }}>{winner.name}</h1>
          <p className="winner-score">{winner.score} pts</p>
        </div>
      ) : sdAnnouncementMode ? (
        <div className="sudden-death-banner">
          <p className="sd-eyebrow">
            {suddenDeathRound === 1 ? "IT'S A TIE" : 'STILL TIED'}
          </p>
          <h1 className="sd-title">⚡ SUDDEN DEATH</h1>
          {suddenDeathRound > 1 && (
            <p className="sd-round-label">Round {suddenDeathRound}</p>
          )}
          <p className="sd-body">
            {suddenDeathTeams.map(t => t.name).join(' vs ')}
            {' '}— one round each. Most points wins.
          </p>
        </div>
      ) : sdInProgressMode ? (
        <div className="scores-header">
          <p className="scores-eyebrow">
            ⚡ SUDDEN DEATH{suddenDeathRound > 1 ? ` — ROUND ${suddenDeathRound}` : ''}
          </p>
          <h1 className="scores-title">TIEBREAKER</h1>
          {lastTurnPoints > 0
            ? <p className="scores-pts">
                <span className="pts-badge" style={{ background: scoringTeam?.color }}>
                  +{lastTurnPoints} {lastTurnPoints === 1 ? 'pt' : 'pts'}
                </span>
                {' '}for{' '}
                <span style={{ color: scoringTeam?.color }}>{scoringTeam?.name}</span>
              </p>
            : <p className="scores-pts">No points this turn</p>
          }
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

      {/* Score list */}
      {!winner && (
        <div className="score-list">
          {sdInProgressMode ? (
            // Tiebreaker round: show only the SD teams and their round scores
            suddenDeathTeams.map((team) => {
              const sdScore = suddenDeathScores[team.id]
              const hasPlayed = sdScore !== undefined
              const isScorer = team.id === scoringTeam?.id && lastTurnPoints > 0
              return (
                <div
                  className={`score-row ${isScorer ? 'scorer-flash' : ''}`}
                  key={team.id}
                  style={{ '--flash-color': team.color + '33' }}
                >
                  <div className="score-row-top">
                    <div className="score-team-info">
                      <div className="score-color-bar" style={{ background: team.color }} />
                      <span className="score-team-name">{team.name}</span>
                    </div>
                    <span
                      className="score-number"
                      style={{ color: hasPlayed ? team.color : 'rgba(255,255,255,0.2)', fontSize: '48px' }}
                    >
                      {hasPlayed ? sdScore : '—'}
                      {hasPlayed && <span className="score-denom"> pts</span>}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            // Normal scoreboard
            sorted.map((team) => {
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
            })
          )}
        </div>
      )}

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
            <p className="handoff-eyebrow">{sdAnnouncementMode ? 'FIRST UP' : 'UP NEXT'}</p>
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
        ) : sdAnnouncementMode ? (
          <button className="btn-primary sd-begin-btn" onClick={onNext}>
            BEGIN SUDDEN DEATH →
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
