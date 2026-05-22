import './RulesScreen.css'
import HomeButton from './HomeButton.jsx'

export default function RulesScreen({ onPlay, onHome }) {
  return (
    <div className="screen rules-screen">
      <HomeButton onHome={onHome} />

      <div className="rules-header">
        <p className="rules-eyebrow">HOW TO PLAY</p>
        <h1 className="rules-title">31 SECONDS</h1>
        <p className="rules-tagline">One card. Five words. Thirty-one seconds.<br />No skipping. No nonsense.</p>
      </div>

      <div className="rules-cards">
        <div className="rule-card">
          <span className="rule-number">01</span>
          <div className="rule-text">
            <h2>DESCRIBE IT</h2>
            <p>One player from your team has 31 seconds to describe all 5 words — without saying the word itself.</p>
          </div>
        </div>

        <div className="rule-card">
          <span className="rule-number">02</span>
          <div className="rule-text">
            <h2>BEAT THE CLOCK</h2>
            <p>The hourglass is brutal. Every word your team gets right in time earns a point.</p>
          </div>
        </div>

        <div className="rule-card">
          <span className="rule-number">03</span>
          <div className="rule-text">
            <h2>FIRST TO WIN</h2>
            <p>Teams take turns describing and guessing. First team to hit the target score wins. No cheating.</p>
          </div>
        </div>
      </div>

      <div className="rules-footer">
        <button className="btn-primary" onClick={onPlay}>
          LET'S PLAY →
        </button>
      </div>
    </div>
  )
}
