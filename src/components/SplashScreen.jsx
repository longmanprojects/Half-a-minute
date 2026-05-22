import { useState, useEffect } from 'react'
import './SplashScreen.css'

// Countdown schedule: [fromNumber, interval_ms]
// Starts fast, slows as it approaches 30
const SCHEDULE = buildSchedule()

function buildSchedule() {
  const steps = []
  for (let n = 1; n <= 30; n++) {
    const dist = 30 - n
    let interval
    if (dist > 20) interval = 18
    else if (dist > 10) interval = 25
    else if (dist > 5)  interval = 60
    else if (dist > 2)  interval = 150
    else if (dist > 0)  interval = 320
    else                interval = 0
    steps.push({ n, interval })
  }
  return steps
}

export default function SplashScreen({ onBegin }) {
  const [displayNum, setDisplayNum] = useState(1)
  const [landed, setLanded] = useState(false)
  const [showRest, setShowRest] = useState(false)

  useEffect(() => {
    let stepIdx = 0
    let timeout

    function tick() {
      if (stepIdx >= SCHEDULE.length) {
        // Landed on 30
        setDisplayNum(30)
        setLanded(true)
        setTimeout(() => setShowRest(true), 300)
        return
      }
      const { n, interval } = SCHEDULE[stepIdx]
      setDisplayNum(n)
      stepIdx++
      timeout = setTimeout(tick, interval)
    }

    // Small initial pause before counting starts
    timeout = setTimeout(tick, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="screen splash-screen" onClick={showRest ? onBegin : undefined}>
      <div className="splash-content">
        <p className="splash-eyebrow">MZANZI'S FAVOURITE GAME</p>
        <h1 className="splash-title">
          <span className={`splash-30 ${landed ? 'landed' : 'counting'}`}>
            {displayNum}
          </span>
          <span className={`splash-seconds ${showRest ? 'visible' : ''}`}>SECONDS</span>
          <span className={`splash-edition ${showRest ? 'visible' : ''}`}>TRAVEL EDITION</span>
        </h1>
      </div>

      <button
        className={`splash-tap ${showRest ? 'visible' : ''}`}
        onClick={onBegin}
      >
        TAP TO BEGIN
      </button>
    </div>
  )
}
