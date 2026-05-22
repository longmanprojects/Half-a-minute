import './HomeScreen.css'
import GamePiece from './GamePiece'

export default function HomeScreen({ onHowToPlay, onStartGame }) {
  return (
    <div className="screen home-screen">
      <div className="home-top">
        <div className="home-logo-mark">30</div>
        <div className="home-title-block">
          <h1 className="home-title">SECONDS</h1>
          <p className="home-subtitle">TRAVEL EDITION</p>
        </div>
        <p className="home-tagline">One card. Five clues. Thirty seconds.</p>

        <div className="home-pieces">
          <GamePiece color="#E5523B" size={64} rotation={-8} />
          <GamePiece color="#F5E06E" size={80} rotation={0} />
          <GamePiece color="#7BB8D4" size={64} rotation={8} />
        </div>
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
