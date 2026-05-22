import './HomeButton.css'

export default function HomeButton({ onHome }) {
  return (
    <button className="home-button" onClick={onHome} aria-label="Home">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1h-4v-4H8v4H4a1 1 0 01-1-1V9.5z"
          stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
