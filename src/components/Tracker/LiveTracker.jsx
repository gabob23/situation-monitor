import { useState } from 'react'

// Tracker modes - using FlightAware for flights (no ad blocker issues)
const TRACKERS = {
  flights: {
    name: 'FLIGHTS',
    // FlightAware live tracking maps
    getUrl: (region) => {
      const regions = {
        europe: 'https://www.flightaware.com/live/map?center=50,10&zoom=5',
        middleeast: 'https://www.flightaware.com/live/map?center=30,45&zoom=5',
        asia: 'https://www.flightaware.com/live/map?center=35,105&zoom=4',
        usa: 'https://www.flightaware.com/live/map?center=39,-98&zoom=4',
        global: 'https://www.flightaware.com/live/map?center=30,0&zoom=2',
      }
      return regions[region] || regions.global
    }
  },
  marine: {
    name: 'MARINE',
    // MyShipTracking - clean marine tracking without ads
    getUrl: (region) => {
      const regions = {
        europe: 'https://www.myshiptracking.com/?zoom=6&lat=54&lon=4',
        middleeast: 'https://www.myshiptracking.com/?zoom=5&lat=26&lon=52',
        asia: 'https://www.myshiptracking.com/?zoom=4&lat=25&lon=120',
        usa: 'https://www.myshiptracking.com/?zoom=4&lat=35&lon=-75',
        global: 'https://www.myshiptracking.com/?zoom=2&lat=20&lon=0',
      }
      return regions[region] || regions.global
    }
  }
}

const REGIONS = [
  { id: 'global', name: 'Global' },
  { id: 'europe', name: 'Europe' },
  { id: 'middleeast', name: 'Mid East' },
  { id: 'asia', name: 'Asia' },
  { id: 'usa', name: 'USA' },
]

export default function LiveTracker() {
  const [mode, setMode] = useState('flights')
  const [region, setRegion] = useState('europe')

  const tracker = TRACKERS[mode]
  const iframeUrl = tracker.getUrl(region)

  const openExternal = () => {
    const externalUrls = {
      flights: 'https://www.flightaware.com/live/',
      marine: 'https://www.myshiptracking.com/'
    }
    window.open(externalUrls[mode], '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="live-tracker">
      {/* Controls */}
      <div className="tracker-controls">
        <div className="control-group">
          <span className="control-label">MODE:</span>
          <div className="mode-select">
            {Object.entries(TRACKERS).map(([key, t]) => (
              <button
                key={key}
                className={`ctrl-btn ${key === mode ? 'active' : ''}`}
                onClick={() => setMode(key)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">REGION:</span>
          <div className="region-select">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                className={`ctrl-btn ${r.id === region ? 'active' : ''}`}
                onClick={() => setRegion(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracker iframe */}
      <div className="tracker-content">
        <iframe
          src={iframeUrl}
          title={`${tracker.name} Tracker`}
          allowFullScreen
        />
      </div>

      {/* Footer */}
      <div className="tracker-footer">
        <span className="tracker-info">
          {mode === 'flights' ? 'FlightAware' : 'MyShipTracking'} - Live {mode === 'flights' ? 'aircraft' : 'vessel'} positions
        </span>
        <button className="ext-btn" onClick={openExternal}>
          Open Full Site ↗
        </button>
      </div>

      <style>{`
        .live-tracker {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #0a0a0f;
        }
        .tracker-controls {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 6px;
          background: rgba(0, 0, 0, 0.8);
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          flex-wrap: wrap;
          gap: 6px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .control-label {
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .mode-select, .region-select {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
        }
        .ctrl-btn {
          padding: 4px 8px;
          background: transparent;
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 9px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ctrl-btn:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }
        .ctrl-btn.active {
          background: rgba(0, 255, 255, 0.2);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
          text-shadow: 0 0 5px var(--neon-cyan);
        }
        .tracker-content {
          flex: 1;
          position: relative;
          min-height: 0;
        }
        .tracker-content iframe {
          width: 100%;
          height: 100%;
          border: none;
          filter: saturate(0.8) brightness(0.9);
        }
        .tracker-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.8);
          border-top: 1px solid rgba(0, 255, 255, 0.3);
        }
        .tracker-info {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
        }
        .ext-btn {
          padding: 2px 6px;
          background: transparent;
          border: 1px solid rgba(0, 255, 255, 0.5);
          color: var(--neon-cyan);
          font-family: var(--font-mono);
          font-size: 8px;
          cursor: pointer;
        }
        .ext-btn:hover {
          background: rgba(0, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
