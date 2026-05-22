import { useState } from 'react'
import './TargetScoreScreen.css'
import HomeButton from './HomeButton.jsx'

const OPTIONS = [
  { score: 30, label: 'Quick', desc: 'Perfect for a short session' },
  { score: 50, label: 'Standard', desc: 'The classic experience' },
  { score: 100, label: 'Marathon', desc: 'For the seriously competitive' },
]

export default function TargetScoreScreen({ initialTarget, onStart, onBack, onHome }) {
  const [targetScore, setTargetScore] = useState(initialTarget)

  return (
    <div className="screen target-screen">
      <HomeButton onHome={onHome} />

      <div className="target-screen-header">
        <p className="setup-step">STEP 2 OF 2</p>
        <h1 className="setup-title">THE TARGET</h1>
        <p className="setup-sub">How far are you playing?</p>
      </div>

      <div className="target-options-list">
        {OPTIONS.map(({ score, label, desc }) => (
          <button
            key={score}
            className={`target-option-card ${targetScore === score ? 'active' : ''}`}
            onClick={() => setTargetScore(score)}
          >
            <div className="target-option-left">
              <span className="target-option-num">{score}</span>
              <span className="target-option-pts">pts</span>
            </div>
            <div className="target-option-right">
              <span className="target-option-label">{label}</span>
              <span className="target-option-desc">{desc}</span>
            </div>
            <div className="target-option-check">
              {targetScore === score && <span>✓</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="target-screen-footer">
        <button className="btn-primary" onClick={() => onStart(targetScore)}>
          START GAME →
        </button>
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}
