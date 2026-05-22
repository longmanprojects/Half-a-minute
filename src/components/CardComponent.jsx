import { useState } from 'react'
import './CardComponent.css'

export default function CardComponent({ card, dimmed, teamColor, timerActive, onStart, showWords }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className={`card-area ${dimmed ? 'card-dimmed' : ''}`}>
      <div className="card-scene-wrapper">
        <div className={`card-scene ${flipped ? 'is-flipped' : ''}`}>
          <div className="card-face card-front">
            <CardInner
              words={card.front}
              onFlip={() => setFlipped(true)}
              timerActive={timerActive}
              onStart={onStart}
              teamColor={teamColor}
              faceColor="#F5E06E"
              showWords={showWords}
            />
          </div>
          <div className="card-face card-back">
            <CardInner
              words={card.back}
              onFlip={() => setFlipped(false)}
              timerActive={timerActive}
              onStart={onStart}
              teamColor={teamColor}
              faceColor="#7BB8D4"
              showWords={showWords}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CardInner({ words, onFlip, timerActive, onStart, teamColor, faceColor, showWords }) {
  return (
    <div className="card-inner" style={{ background: faceColor }}>
      <div className="card-brand-band">
        <div className="card-brand-block">
          <span className="card-brand-name">31 SECONDS</span>
          <span className="card-brand-edition">TRAVEL EDITION</span>
        </div>
        <button
          className="flip-btn"
          onClick={onFlip}
          style={{ color: faceColor }}
        >
          <span className="flip-icon">↻</span>
          <span className="flip-label">FLIP</span>
        </button>
      </div>

      {!timerActive && !showWords ? (
        <div className="card-start-state">
          <p className="start-hint">Ready when you are</p>
          <button
            className="start-btn"
            style={{ background: teamColor || '#1A1F3A' }}
            onClick={onStart}
          >
            ▶ START
          </button>
        </div>
      ) : (
        <div className="word-list">
          {words.map((word, i) => (
            <div key={i} className="word-row">
              <span className="word-num">{i + 1}</span>
              <span className="word-text">{word}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card-footer">
        <span className="card-footer-label">THIS CARD</span>
        <span className="card-pts">5 CLUES</span>
      </div>
    </div>
  )
}
