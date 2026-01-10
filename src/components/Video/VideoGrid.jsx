import { useState, useEffect, useRef } from 'react'
import YouTube from 'react-youtube'

// Pool of 24/7 news channels - using channel live stream format
const ALL_STREAMS = [
  { id: 'aljazeeraCH', name: 'Al Jazeera EN', videoId: 'bNyUyrR0PHo' },
  { id: 'france24CH', name: 'France 24 EN', videoId: 'h3MuIUNCCzI' },
  { id: 'dwCH', name: 'DW News', videoId: 'pqabxBKzZ6M' },
  { id: 'euronewsCH', name: 'Euronews EN', videoId: 'pykpO5kQJ98' },
  { id: 'skyCH', name: 'Sky News', videoId: '9Auq9mYxFEE' },
  { id: 'wionCH', name: 'WION', videoId: 'Qz__Eptw1JM' },
  { id: 'trtCH', name: 'TRT World', videoId: '5VF4aor94gw' },
  { id: 'indiaTodayCH', name: 'India Today', videoId: 'rqc2UfuGN7Q' },
  { id: 'cnaCH', name: 'CNA', videoId: 'XWq5kBlakcQ' },
  { id: 'africanewsCH', name: 'Africanews', videoId: 'NQjabLGdP5g' },
  { id: 'ndtvCH', name: 'NDTV 24x7', videoId: 'WjzR1vXfWmE' },
  { id: 'abcCH', name: 'ABC News AU', videoId: 'vOTiJkg1voo' },
]

// Default starting streams for each cell
const DEFAULT_STREAMS = [0, 1, 2, 3]

function VideoCell({ defaultStreamIndex, cellIndex, activeCell, onActivate }) {
  const [streamIndex, setStreamIndex] = useState(defaultStreamIndex)
  const [showMenu, setShowMenu] = useState(false)
  const playerRef = useRef(null)

  const stream = ALL_STREAMS[streamIndex]
  const isActive = activeCell === cellIndex

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: isActive ? 0 : 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
    },
  }

  const handleReady = (event) => {
    playerRef.current = event.target
    if (isActive) {
      event.target.unMute()
    } else {
      event.target.mute()
    }
  }

  useEffect(() => {
    if (playerRef.current) {
      if (isActive) {
        playerRef.current.unMute()
      } else {
        playerRef.current.mute()
      }
    }
  }, [isActive])

  const handleCellClick = () => {
    onActivate(cellIndex)
  }

  const cycleNext = (e) => {
    e.stopPropagation()
    setStreamIndex((prev) => (prev + 1) % ALL_STREAMS.length)
    setShowMenu(false)
  }

  const selectStream = (idx, e) => {
    e.stopPropagation()
    setStreamIndex(idx)
    setShowMenu(false)
  }

  return (
    <div
      className={`video-cell ${isActive ? 'active' : ''}`}
      onClick={handleCellClick}
    >
      <div className="video-cell-header">
        <span className="video-cell-label">{stream.name}</span>
        <div className="video-cell-controls">
          <button className="cycle-btn" onClick={cycleNext} title="Next channel">⟳</button>
          <button className="menu-btn" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>▼</button>
        </div>
        {showMenu && (
          <div className="video-dropdown" onClick={(e) => e.stopPropagation()}>
            {ALL_STREAMS.map((s, idx) => (
              <button
                key={s.id}
                className={`dropdown-item ${idx === streamIndex ? 'active' : ''}`}
                onClick={(e) => selectStream(idx, e)}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="youtube-wrapper">
        <YouTube
          videoId={stream.videoId}
          opts={opts}
          onReady={handleReady}
        />
      </div>
      {isActive && (
        <div className="active-indicator">
          <span className="sound-icon">🔊</span>
        </div>
      )}
    </div>
  )
}

export default function VideoGrid() {
  const [activeCell, setActiveCell] = useState(null)

  return (
    <div className="video-grid">
      <VideoCell
        defaultStreamIndex={DEFAULT_STREAMS[0]}
        cellIndex={0}
        activeCell={activeCell}
        onActivate={setActiveCell}
      />
      <VideoCell
        defaultStreamIndex={DEFAULT_STREAMS[1]}
        cellIndex={1}
        activeCell={activeCell}
        onActivate={setActiveCell}
      />
      <VideoCell
        defaultStreamIndex={DEFAULT_STREAMS[2]}
        cellIndex={2}
        activeCell={activeCell}
        onActivate={setActiveCell}
      />
      <VideoCell
        defaultStreamIndex={DEFAULT_STREAMS[3]}
        cellIndex={3}
        activeCell={activeCell}
        onActivate={setActiveCell}
      />

      <style>{`
        .video-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 3px;
          height: 100%;
          background: #000;
        }
        .video-cell {
          position: relative;
          background: #0a0a0f;
          border: 2px solid rgba(0, 255, 255, 0.2);
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.3s;
        }
        .video-cell:hover {
          border-color: rgba(0, 255, 255, 0.5);
        }
        .video-cell.active {
          border-color: var(--neon-green);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
        }
        .youtube-wrapper {
          width: 100%;
          height: 100%;
        }
        .youtube-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
          pointer-events: none;
        }
        .video-cell-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent);
          z-index: 10;
        }
        .video-cell-label {
          font-family: var(--font-display);
          font-size: 10px;
          color: var(--neon-cyan);
          text-shadow: 0 0 5px var(--neon-cyan);
          letter-spacing: 1px;
        }
        .video-cell.active .video-cell-label {
          color: var(--neon-green);
          text-shadow: 0 0 5px var(--neon-green);
        }
        .video-cell-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cycle-btn, .menu-btn {
          background: transparent;
          border: 1px solid rgba(0, 255, 255, 0.4);
          color: var(--neon-cyan);
          font-size: 10px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 2px;
          pointer-events: auto;
        }
        .cycle-btn:hover, .menu-btn:hover {
          background: rgba(0, 255, 255, 0.2);
        }
        .video-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(10, 10, 15, 0.98);
          border: 1px solid var(--neon-cyan);
          min-width: 140px;
          z-index: 100;
          max-height: 200px;
          overflow-y: auto;
          pointer-events: auto;
        }
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 6px 10px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 10px;
          text-align: left;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: rgba(0, 255, 255, 0.15);
          color: var(--neon-cyan);
        }
        .dropdown-item.active {
          color: var(--neon-cyan);
          background: rgba(0, 255, 255, 0.1);
        }
        .active-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 255, 136, 0.9);
          padding: 4px 8px;
          border-radius: 3px;
          z-index: 10;
        }
        .sound-icon {
          font-size: 14px;
          filter: drop-shadow(0 0 5px rgba(0, 255, 136, 0.8));
        }
        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
