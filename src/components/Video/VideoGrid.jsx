import { useState, useEffect, useRef } from 'react'
import YouTube from 'react-youtube'

// REGION-SPECIFIC STREAMS ONLY - No cross-contamination
// Reality: Most regional broadcasters block YouTube embedding
const STREAMS_BY_REGION = {
  'North America': [
    // No major US/Canadian networks allow embedding - all show error 150
    // Using working international channels as fallback
    { id: 'euronews', name: 'Euronews', videoId: 'pykpO5kQJ98' },
    { id: 'gbn', name: 'GB News', videoId: 'GpJmUWiJgb4' },
    { id: 'cna', name: 'CNA', videoId: 'XWq5kBlakcQ' },
    { id: 'wion', name: 'WION', videoId: 'Qz__Eptw1JM' },
  ],
  'South America': [
    // Most LATAM channels block embedding
    { id: 'euronews', name: 'Euronews', videoId: 'pykpO5kQJ98' },
    { id: 'cna', name: 'CNA', videoId: 'XWq5kBlakcQ' },
    { id: 'wion', name: 'WION', videoId: 'Qz__Eptw1JM' },
    { id: 'africanews', name: 'Africanews', videoId: 'NQjabLGdP5g' },
  ],
  'Europe': [
    { id: 'euronews', name: 'Euronews', videoId: 'pykpO5kQJ98' },
    { id: 'gbn', name: 'GB News', videoId: 'GpJmUWiJgb4' },
    { id: 'euronews-fr', name: 'Euronews (FR)', videoId: 'NiRIbKwAejk' },
    { id: 'euronews-de', name: 'Euronews (DE)', videoId: 'I4fWWvkFf7Y' },
  ],
  'Asia': [
    { id: 'cna', name: 'CNA Singapore', videoId: 'XWq5kBlakcQ' },
    { id: 'wion', name: 'WION India', videoId: 'Qz__Eptw1JM' },
    { id: 'tvbs', name: 'TVBS Taiwan', videoId: 'L7qjQd-P_yM' },
    { id: 'cna-2', name: 'CNA Singapore', videoId: 'XWq5kBlakcQ' },
  ],
  'Oceania': [
    { id: 'sky-au', name: 'Sky News Australia', videoId: 'NvqAbRN39d8' },
    { id: 'abc-au', name: 'ABC Australia', videoId: 'vOTiJkg1voo' },
    { id: 'sky-au-2', name: 'Sky News Australia', videoId: 'NvqAbRN39d8' },
    { id: 'abc-au-2', name: 'ABC Australia', videoId: 'vOTiJkg1voo' },
  ],
  'Middle East': [
    { id: 'aljazeera', name: 'Al Jazeera EN', videoId: 'bNyUyrR0PHo' },
    { id: 'trt', name: 'TRT World', videoId: '5VF4aor94gw' },
    { id: 'aljazeera-ar', name: 'Al Jazeera Arabic', videoId: 'ghoov5dTz9M' },
    { id: 'trt-2', name: 'TRT World', videoId: '5VF4aor94gw' },
  ],
  'Africa': [
    { id: 'africanews', name: 'Africanews', videoId: 'NQjabLGdP5g' },
    { id: 'aljazeera', name: 'Al Jazeera EN', videoId: 'bNyUyrR0PHo' },
    { id: 'africanews-2', name: 'Africanews', videoId: 'NQjabLGdP5g' },
    { id: 'trt', name: 'TRT World', videoId: '5VF4aor94gw' },
  ],
}

// Flatten all streams for GLOBAL mode - REMOVE DUPLICATES
const ALL_STREAMS_WITH_DUPES = Object.values(STREAMS_BY_REGION).flat()
const ALL_STREAMS = Array.from(
  new Map(ALL_STREAMS_WITH_DUPES.map(s => [s.id, s])).values()
)

function VideoCell({ cellIndex, activeCell, onActivate, selectedRegion }) {
  const [streamIndex, setStreamIndex] = useState(cellIndex)
  const [showMenu, setShowMenu] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const playerRef = useRef(null)
  const errorTimeoutRef = useRef(null)
  const prevRegionRef = useRef(selectedRegion)

  // Get available streams based on region
  const availableStreams = selectedRegion === 'GLOBAL'
    ? ALL_STREAMS
    : STREAMS_BY_REGION[selectedRegion] || ALL_STREAMS

  const stream = availableStreams[streamIndex % availableStreams.length]
  const isActive = activeCell === cellIndex

  // Reset to cell index when region changes (keeps cells different)
  useEffect(() => {
    if (prevRegionRef.current !== selectedRegion) {
      setStreamIndex(cellIndex % availableStreams.length)
      prevRegionRef.current = selectedRegion
    }
  }, [selectedRegion, cellIndex, availableStreams.length])

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
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
    setIsReady(true)
    event.target.mute()
  }

  const handleError = (event) => {
    console.log(`Error on ${stream.name} (${stream.videoId}):`, event.data)

    // Ignore certain error codes that are temporary
    // 2 = Invalid video ID
    // 5 = HTML5 player error
    // 100 = Video not found or private
    // 101/150 = Owner doesn't allow embedding
    if (event.data === 101 || event.data === 150) {
      console.log(`${stream.name} doesn't allow embedding, cycling...`)
    } else if (event.data === -1) {
      // -1 = player not fully loaded yet, ignore
      return
    }

    // Clear any pending error timeout to prevent stacking
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }

    // Cycle to next stream after brief delay
    errorTimeoutRef.current = setTimeout(() => {
      setStreamIndex((prev) => (prev + 1) % availableStreams.length)
      setIsReady(false)
      errorTimeoutRef.current = null
    }, 2000) // 2 second delay
  }

  useEffect(() => {
    if (isReady && playerRef.current) {
      try {
        if (isActive) {
          playerRef.current.unMute()
          playerRef.current.setVolume(100)
        } else {
          playerRef.current.mute()
        }
      } catch (e) {
        // Silently ignore mute errors
      }
    }
  }, [isActive, isReady])

  useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  const handleCellClick = () => {
    onActivate(cellIndex)
  }

  const cycleNext = (e) => {
    e.stopPropagation()
    setStreamIndex((prev) => (prev + 1) % availableStreams.length)
    setIsReady(false)
    setShowMenu(false)
  }

  const selectStream = (idx, e) => {
    e.stopPropagation()
    setStreamIndex(idx)
    setIsReady(false)
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
            {availableStreams.map((s, idx) => (
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
          key={`${stream.id}-${streamIndex}`}
          videoId={stream.videoId}
          opts={opts}
          onReady={handleReady}
          onError={handleError}
        />
      </div>
      {isActive && (
        <div className="active-indicator"></div>
      )}
    </div>
  )
}

export default function VideoGrid() {
  const [activeCell, setActiveCell] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('GLOBAL')

  const regions = ['GLOBAL', 'North America', 'South America', 'Europe', 'Asia', 'Oceania', 'Middle East', 'Africa']

  const muteAll = () => {
    setActiveCell(null)
  }

  return (
    <div className="video-grid-container">
      <div className="video-controls">
        <div className="region-selector">
          <span className="control-label">REGION:</span>
          {regions.map((region) => (
            <button
              key={region}
              className={`region-btn ${selectedRegion === region ? 'active' : ''}`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
        <button className="mute-all-btn" onClick={muteAll}>
          MUTE ALL
        </button>
      </div>

      <div className="video-grid">
        <VideoCell
          cellIndex={0}
          activeCell={activeCell}
          onActivate={setActiveCell}
          selectedRegion={selectedRegion}
        />
        <VideoCell
          cellIndex={1}
          activeCell={activeCell}
          onActivate={setActiveCell}
          selectedRegion={selectedRegion}
        />
        <VideoCell
          cellIndex={2}
          activeCell={activeCell}
          onActivate={setActiveCell}
          selectedRegion={selectedRegion}
        />
        <VideoCell
          cellIndex={3}
          activeCell={activeCell}
          onActivate={setActiveCell}
          selectedRegion={selectedRegion}
        />
      </div>

      <style>{`
        .video-grid-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .video-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 8px;
          background: rgba(0, 0, 0, 0.8);
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          flex-wrap: wrap;
          gap: 8px;
        }
        .region-selector {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .control-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 1px;
          margin-right: 4px;
        }
        .region-btn {
          padding: 3px 8px;
          background: transparent;
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 9px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .region-btn:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }
        .region-btn.active {
          background: rgba(0, 255, 255, 0.2);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          text-shadow: 0 0 5px var(--neon-cyan);
        }
        .mute-all-btn {
          padding: 4px 12px;
          background: transparent;
          border: 1px solid rgba(255, 51, 51, 0.5);
          color: var(--neon-red);
          font-family: var(--font-mono);
          font-size: 9px;
          cursor: pointer;
          letter-spacing: 1px;
          transition: all 0.2s;
        }
        .mute-all-btn:hover {
          background: rgba(255, 51, 51, 0.2);
          border-color: var(--neon-red);
          box-shadow: 0 0 5px rgba(255, 51, 51, 0.3);
        }
        .video-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 3px;
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
          min-width: 180px;
          z-index: 100;
          max-height: 250px;
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
          width: 12px;
          height: 12px;
          background: var(--neon-green);
          box-shadow: 0 0 10px var(--neon-green);
          z-index: 10;
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
