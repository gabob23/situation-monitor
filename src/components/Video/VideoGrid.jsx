import { useState, useEffect } from 'react'

// Pool of 24/7 news channels - using channel live stream format
// These auto-resolve to whatever the channel is currently streaming
const ALL_STREAMS = [
  // Primary news channels (usually have 24/7 live streams)
  { id: 'aljazeeraCH', name: 'Al Jazeera EN', url: 'https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=1' },
  { id: 'france24CH', name: 'France 24 EN', url: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg&autoplay=1&mute=1' },
  { id: 'dwCH', name: 'DW News', url: 'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1&mute=1' },
  { id: 'euronewsCH', name: 'Euronews EN', url: 'https://www.youtube.com/embed/live_stream?channel=UCW2QcKZiU8aUGg4yxCIditg&autoplay=1&mute=1' },
  { id: 'skyCH', name: 'Sky News', url: 'https://www.youtube.com/embed/live_stream?channel=UCoMdktPbSTixAyNGwb-UYkQ&autoplay=1&mute=1' },
  { id: 'wionCH', name: 'WION', url: 'https://www.youtube.com/embed/live_stream?channel=UC_gUM8rL-Lrg6O3adPW9K1g&autoplay=1&mute=1' },
  { id: 'trtCH', name: 'TRT World', url: 'https://www.youtube.com/embed/live_stream?channel=UC7fWeaHhqgM4Lba7ftsL0Ag&autoplay=1&mute=1' },
  { id: 'indiaTodayCH', name: 'India Today', url: 'https://www.youtube.com/embed/live_stream?channel=UCYPvAwZP8pZhSMW8qs7cVCw&autoplay=1&mute=1' },
  { id: 'cnaCH', name: 'CNA', url: 'https://www.youtube.com/embed/live_stream?channel=UCo8bcnLyZH8tBIH9V1mLgqQ&autoplay=1&mute=1' },
  { id: 'africanewsCH', name: 'Africanews', url: 'https://www.youtube.com/embed/live_stream?channel=UC1_E8NeF5QHY2dtdLRBCCLA&autoplay=1&mute=1' },
  { id: 'ndtvCH', name: 'NDTV 24x7', url: 'https://www.youtube.com/embed/live_stream?channel=UCttspZesZIDEwwpVIgoZtWQ&autoplay=1&mute=1' },
  { id: 'abcCH', name: 'ABC News AU', url: 'https://www.youtube.com/embed/live_stream?channel=UCVgO39Bk5sMo66-6o6Spn6Q&autoplay=1&mute=1' },
]

// Default starting streams for each cell
const DEFAULT_STREAMS = [0, 1, 2, 3]

function VideoCell({ defaultStreamIndex }) {
  const [streamIndex, setStreamIndex] = useState(defaultStreamIndex)
  const [showMenu, setShowMenu] = useState(false)
  const [key, setKey] = useState(Date.now())

  const stream = ALL_STREAMS[streamIndex]

  const cycleNext = () => {
    setStreamIndex((prev) => (prev + 1) % ALL_STREAMS.length)
    setKey(Date.now())
    setShowMenu(false)
  }

  const selectStream = (idx) => {
    setStreamIndex(idx)
    setKey(Date.now())
    setShowMenu(false)
  }

  // Refresh iframe periodically to catch streams that come online
  useEffect(() => {
    const interval = setInterval(() => {
      setKey(Date.now())
    }, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="video-cell">
      <div className="video-cell-header">
        <span className="video-cell-label">{stream.name}</span>
        <div className="video-cell-controls">
          <button className="cycle-btn" onClick={cycleNext} title="Next channel">⟳</button>
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>▼</button>
        </div>
        {showMenu && (
          <div className="video-dropdown">
            {ALL_STREAMS.map((s, idx) => (
              <button
                key={s.id}
                className={`dropdown-item ${idx === streamIndex ? 'active' : ''}`}
                onClick={() => selectStream(idx)}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <iframe
        key={key}
        src={stream.url}
        title={stream.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default function VideoGrid() {
  return (
    <div className="video-grid">
      <VideoCell defaultStreamIndex={DEFAULT_STREAMS[0]} />
      <VideoCell defaultStreamIndex={DEFAULT_STREAMS[1]} />
      <VideoCell defaultStreamIndex={DEFAULT_STREAMS[2]} />
      <VideoCell defaultStreamIndex={DEFAULT_STREAMS[3]} />

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
          border: 1px solid rgba(0, 255, 255, 0.2);
          overflow: hidden;
        }
        .video-cell iframe {
          width: 100%;
          height: 100%;
          border: none;
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
