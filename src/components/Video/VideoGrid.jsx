import { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js'

// FREE IPTV HLS STREAMS - No embedding restrictions!
const STREAMS_BY_REGION = {
  'North America': [
    { id: 'abc-us', name: 'ABC News US', streamUrl: 'https://abclive2-lh.akamaihd.net/i/abc_live11@423404/master.m3u8' },
    { id: 'cbs-us', name: 'CBS News', streamUrl: 'http://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8' },
    { id: 'bloomberg-us', name: 'Bloomberg US', streamUrl: 'https://liveproduseast.global.ssl.fastly.net/btv/desktop/us_live.m3u8' },
    { id: 'cgtn-us', name: 'CGTN America', streamUrl: 'http://api.new.livestream.com/accounts/7082210/events/7115682/live.m3u8' },
  ],
  'South America': [
    { id: 'aljazeera', name: 'Al Jazeera EN', streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
    { id: 'france24', name: 'France 24', streamUrl: 'http://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_900.m3u8' },
    { id: 'dw', name: 'DW News', streamUrl: 'http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8' },
    { id: 'trt', name: 'TRT World', streamUrl: 'http://trtcanlitv-lh.akamaihd.net/i/TRTWORLD_1@321783/master.m3u8' },
  ],
  'Europe': [
    { id: 'sky-uk', name: 'Sky News UK', streamUrl: 'http://skydvn-nowtv-atv-prod.skydvn.com/atv/skynews/1404/live/index.m3u8' },
    { id: 'bbc', name: 'BBC World News', streamUrl: 'http://z5ams.akamaized.net/bbcworldnews/tracks-v1a1/index.m3u8' },
    { id: 'france24', name: 'France 24', streamUrl: 'http://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_900.m3u8' },
    { id: 'dw', name: 'DW News', streamUrl: 'http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8' },
  ],
  'Asia': [
    { id: 'aljazeera', name: 'Al Jazeera EN', streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
    { id: 'cgtn', name: 'CGTN', streamUrl: 'http://api.new.livestream.com/accounts/7082210/events/7115682/live.m3u8' },
    { id: 'france24', name: 'France 24', streamUrl: 'http://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_900.m3u8' },
    { id: 'bloomberg-au', name: 'Bloomberg AU', streamUrl: 'https://liveprodapnortheast.global.ssl.fastly.net/btv/desktop/aus_live.m3u8' },
  ],
  'Oceania': [
    { id: 'abc-au', name: 'ABC News Australia', streamUrl: 'https://abc-iview-mediapackagestreams-1.akamaized.net/out/v1/50345bf35f664739912f0b255c172ae9/index_1.m3u8' },
    { id: 'bloomberg-au', name: 'Bloomberg AU', streamUrl: 'https://liveprodapnortheast.global.ssl.fastly.net/btv/desktop/aus_live.m3u8' },
    { id: 'aljazeera', name: 'Al Jazeera EN', streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
    { id: 'france24', name: 'France 24', streamUrl: 'http://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_900.m3u8' },
  ],
  'Middle East': [
    { id: 'aljazeera', name: 'Al Jazeera EN', streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
    { id: 'trt', name: 'TRT World', streamUrl: 'http://trtcanlitv-lh.akamaihd.net/i/TRTWORLD_1@321783/master.m3u8' },
    { id: 'france24', name: 'France 24', streamUrl: 'http://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_900.m3u8' },
    { id: 'dw', name: 'DW News', streamUrl: 'http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8' },
  ],
  'Africa': [
    { id: 'arise', name: 'Arise News', streamUrl: 'http://contributionstreams.ashttp9.visionip.tv/live/visiontv-contributionstreams-arise-tv-hsslive-25f-16x9-SD/chunklist.m3u8' },
    { id: 'aljazeera', name: 'Al Jazeera EN', streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
    { id: 'france24', name: 'France 24', streamUrl: 'http://f24hls-i.akamaihd.net/hls/live/221193/F24_EN_LO_HLS/master_900.m3u8' },
    { id: 'trt', name: 'TRT World', streamUrl: 'http://trtcanlitv-lh.akamaihd.net/i/TRTWORLD_1@321783/master.m3u8' },
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

  // Initialize HLS player
  useEffect(() => {
    const video = playerRef.current
    if (!video || !stream.streamUrl) return

    // Safari supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream.streamUrl
      video.play().catch(err => console.log('Play error:', err))
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })

      hls.loadSource(stream.streamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true)
        video.play().catch(err => console.log('Play error:', err))
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.log(`HLS Error on ${stream.name}:`, data.type, data.details)

          // Clear any pending error timeout
          if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current)
          }

          // Cycle to next stream after delay
          errorTimeoutRef.current = setTimeout(() => {
            setStreamIndex((prev) => (prev + 1) % availableStreams.length)
            setIsReady(false)
            errorTimeoutRef.current = null
          }, 2000)
        }
      })

      return () => {
        hls.destroy()
      }
    }
  }, [stream.streamUrl, availableStreams.length])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted = !isActive
      if (isActive) {
        playerRef.current.volume = 1.0
      }
    }
  }, [isActive])

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
      <div className="video-wrapper">
        <video
          ref={playerRef}
          key={`${stream.id}-${streamIndex}`}
          className="hls-video"
          muted={!isActive}
          playsInline
          autoPlay
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
        .video-wrapper {
          width: 100%;
          height: 100%;
        }
        .hls-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #000;
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
