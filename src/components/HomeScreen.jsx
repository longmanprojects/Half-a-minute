import './HomeScreen.css'

export default function HomeScreen({ onHowToPlay, onStartGame }) {
  return (
    <div className="screen home-screen">
      <div className="home-top">
        <div className="home-logo-mark">30</div>
        <div className="home-title-block">
          <h1 className="home-title">30 Seconds</h1>
          <p className="home-subtitle">Travel Edition</p>
        </div>
        <p className="home-tagline">One card. Five clues. Thirty seconds.</p>
      </div>

      <div className="home-actions">
        <button className="btn-primary" onClick={onStartGame}>
          START NEW GAME →
        </button>
        <button className="btn-secondary" onClick={onHowToPlay}>
          HOW TO PLAY
        </button>
      </div>
    </div>
  )
}
