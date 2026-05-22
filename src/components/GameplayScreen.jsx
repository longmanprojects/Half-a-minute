import { useState, useEffect, useRef, useCallback } from 'react'
import TimerStrip from './TimerStrip.jsx'
import CardComponent from './CardComponent.jsx'
import './GameplayScreen.css'
import { playTick, playTimeUp } from '../utils/sounds.js'

const MAX_TIME = 31

function getPhase(t, active) {
  if (!active) return 'calm'
  if (t <= 5) return 'critical'
  if (t <= 10) return 'amber'
  return 'calm'
}

export default function GameplayScreen({ card, team, playerName, roundNumber, onEndTurn, onHome }) {
  const [timeLeft, setTimeLeft] = useState(MAX_TIME)
  const [timerActive, setTimerActive] = useState(false)
  const [scoring, setScoring] = useState(false)   // post-round scoring panel
  const [scored, setScored] = useState(0)          // how many they got

  const intervalRef = useRef(null)
  const endedRef = useRef(false)

  const phase = getPhase(timeLeft, timerActive)

  // Reset when card or team changes
  useEffect(() => {
    clearInterval(intervalRef.current)
    setTimeLeft(MAX_TIME)
    setTimerActive(false)
    setScoring(false)
    setScored(0)
    endedRef.current = false
  }, [card, team])

  const finishTurn = useCallback(() => {
    if (endedRef.current) return
    endedRef.current = true
    clearInterval(intervalRef.current)
    setTimerActive(false)
    setScoring(true)
    setScored(0)
  }, [])

  function startTimer() {
    endedRef.current = false
    setScoring(false)
    setScored(0)
    setTimerActive(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          finishTurn()
          playTimeUp()
          return 0
        }
        const next = t - 1
        const phase = next <= 5 ? 'critical' : next <= 10 ? 'amber' : 'calm'
        playTick(phase)
        return next
      })
    }, 1000)
  }

  function bankPoints() {
    onEndTurn(scored)
  }

  return (
    <div className={`screen gameplay-screen phase-${phase}`}>
      {phase === 'critical' && <div className="vignette" />}

      <TimerStrip
        timeLeft={timeLeft}
        maxTime={MAX_TIME}
        teamName={team.name}
        teamColor={team.color}
        playerName={playerName}
        roundNumber={roundNumber}
        phase={phase}
      />

      {/* Post-round scoring panel */}
      {scoring && (
        <div className="scoring-panel">
          <p className="scoring-question">How many did you get?</p>
          <div className="scoring-toggle">
            <button
              className="toggle-btn"
              onClick={() => setScored(s => Math.max(0, s - 1))}
            >−</button>
            <span className="scored-num" style={{ color: team.color }}>{scored}</span>
            <button
              className="toggle-btn"
              onClick={() => setScored(s => Math.min(10, s + 1))}
            >+</button>
          </div>
          <button
            className="bank-btn"
            style={{ background: team.color }}
            onClick={bankPoints}
          >
            BANK {scored} {scored === 1 ? 'PT' : 'PTS'} →
          </button>
        </div>
      )}

      <CardComponent
        card={card}
        dimmed={scoring}
        showWords={scoring}
        teamColor={team.color}
        timerActive={timerActive}
        onStart={startTimer}
      />

      {timerActive && (
        <button className="end-turn-bar" onClick={finishTurn}>
          END TURN
        </button>
      )}
    </div>
  )
}
