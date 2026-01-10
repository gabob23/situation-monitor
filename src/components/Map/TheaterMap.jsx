import { useState } from 'react'
import { THEATER_MAPS } from '../../data/sources'

const theaters = Object.entries(THEATER_MAPS)

export default function TheaterMap() {
  const [activeTheater, setActiveTheater] = useState('ukraine')
  const theater = THEATER_MAPS[activeTheater]

  const openLiveMap = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="theater-map">
      <div className="theater-tabs">
        {theaters.map(([key, t]) => (
          <button
            key={key}
            className={`theater-tab ${key === activeTheater ? 'active' : ''}`}
            onClick={() => setActiveTheater(key)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="theater-content">
        {/* Use OpenStreetMap embed - this works */}
        <iframe
          src={theater.osmUrl}
          title={theater.name}
          className="theater-iframe"
        />

        {/* Overlay with live data buttons */}
        <div className="theater-overlay">
          <div className="theater-info">
            <span className="theater-name">{theater.name.toUpperCase()}</span>
            {theater.liveLinks && theater.liveLinks.length > 0 && (
              <div className="live-buttons">
                {theater.liveLinks.map((link, i) => (
                  <button
                    key={i}
                    className="live-btn"
                    onClick={() => openLiveMap(link.url)}
                  >
                    <span className="live-btn-icon">◉</span>
                    {link.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .theater-map {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .theater-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 4px;
          background: rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid rgba(255, 51, 51, 0.3);
        }
        .theater-tab {
          padding: 4px 10px;
          background: transparent;
          border: 1px solid rgba(255, 51, 51, 0.3);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .theater-tab:hover {
          border-color: var(--neon-red);
          color: var(--neon-red);
        }
        .theater-tab.active {
          background: rgba(255, 51, 51, 0.2);
          border-color: var(--neon-red);
          color: var(--neon-red);
          text-shadow: 0 0 5px var(--neon-red);
        }
        .theater-content {
          flex: 1;
          position: relative;
          background: #0a0a0f;
        }
        .theater-iframe {
          width: 100%;
          height: 100%;
          border: none;
          filter: invert(1) hue-rotate(180deg) saturate(0.3) brightness(0.8);
        }
        .theater-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%);
        }
        .theater-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .theater-name {
          font-family: var(--font-display);
          font-size: 11px;
          color: var(--neon-red);
          text-shadow: 0 0 10px var(--neon-red);
          letter-spacing: 2px;
        }
        .live-buttons {
          display: flex;
          gap: 6px;
        }
        .live-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 51, 51, 0.15);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .live-btn:hover {
          background: rgba(255, 51, 51, 0.35);
          box-shadow: 0 0 15px rgba(255, 51, 51, 0.4);
          transform: scale(1.02);
        }
        .live-btn-icon {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
