import { useState, useEffect } from 'react'
import './OfflineBanner.css'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline  = () => setIsOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online',  goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online',  goOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="offline-overlay">
      <div className="offline-card">
        <div className="offline-icon">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="#F5E06E" strokeWidth="3" strokeOpacity="0.3" />
            {/* Wifi arc 3 */}
            <path d="M10 26 C17 18 47 18 54 26" stroke="#F5E06E" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.3"/>
            {/* Wifi arc 2 */}
            <path d="M17 33 C22 27 42 27 47 33" stroke="#F5E06E" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.3"/>
            {/* Wifi arc 1 */}
            <path d="M24 40 C27 36 37 36 40 40" stroke="#F5E06E" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.3"/>
            {/* Dot */}
            <circle cx="32" cy="48" r="3.5" fill="#F5E06E" fillOpacity="0.3"/>
            {/* Slash */}
            <line x1="14" y1="14" x2="50" y2="50" stroke="#F5E06E" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="offline-eyebrow">CONNECTION REQUIRED</p>
        <h1 className="offline-title">No Internet</h1>
        <p className="offline-body">
          30 Seconds needs an internet connection to run.
          Connect to Wi-Fi or mobile data and try again.
        </p>
        <button
          className="offline-retry"
          onClick={() => setIsOffline(!navigator.onLine)}
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  )
}
