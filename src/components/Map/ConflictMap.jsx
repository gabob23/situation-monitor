import { useState } from 'react'

// Conflict tracking map sources - simplified, no FIRMS
const CONFLICT_MAPS = {
  ukraine: {
    name: 'Ukraine',
    url: 'https://liveuamap.com/en',
  },
  syria: {
    name: 'Syria',
    url: 'https://syria.liveuamap.com/',
  },
  middleeast: {
    name: 'Middle East',
    url: 'https://mideast.liveuamap.com/',
  },
  global: {
    name: 'Global',
    url: 'https://liveuamap.com/',
  },
}

export default function ConflictMap() {
  const [selectedRegion, setSelectedRegion] = useState('ukraine')

  const regions = ['ukraine', 'syria', 'middleeast', 'global']
  const currentMap = CONFLICT_MAPS[selectedRegion]

  const openExternal = () => {
    window.open(currentMap.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="conflict-map">
      {/* Controls */}
      <div className="map-controls">
        <div className="control-group">
          <span className="control-label">REGION:</span>
          <div className="region-select">
            {regions.map((r) => (
              <button
                key={r}
                className={`ctrl-btn ${r === selectedRegion ? 'active' : ''}`}
                onClick={() => setSelectedRegion(r)}
              >
                {CONFLICT_MAPS[r].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map iframe */}
      <div className="map-content">
        <iframe
          key={selectedRegion}
          src={currentMap.url}
          title={`${currentMap.name} Conflict Map`}
          allowFullScreen
        />
      </div>

      {/* Footer */}
      <div className="map-footer">
        <span className="map-info">
          LiveUAMap - Real-time conflict tracking
        </span>
        <button className="ext-btn" onClick={openExternal}>
          Open Full Site ↗
        </button>
      </div>

      <style>{`
        .conflict-map {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #0a0a0f;
        }
        .map-controls {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 6px;
          background: rgba(0, 0, 0, 0.8);
          border-bottom: 1px solid rgba(255, 51, 51, 0.3);
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
        .region-select {
          display: flex;
          gap: 2px;
          flex-wrap: wrap;
        }
        .ctrl-btn {
          padding: 4px 8px;
          background: transparent;
          border: 1px solid rgba(255, 51, 51, 0.3);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 9px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ctrl-btn:hover {
          border-color: var(--neon-red);
          color: var(--neon-red);
        }
        .ctrl-btn.active {
          background: rgba(255, 51, 51, 0.2);
          border-color: var(--neon-red);
          color: var(--neon-red);
          text-shadow: 0 0 5px var(--neon-red);
        }
        .map-content {
          flex: 1;
          position: relative;
          min-height: 0;
        }
        .map-content iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .map-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.8);
          border-top: 1px solid rgba(255, 51, 51, 0.3);
        }
        .map-info {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
        }
        .ext-btn {
          padding: 2px 6px;
          background: transparent;
          border: 1px solid rgba(255, 51, 51, 0.5);
          color: var(--neon-red);
          font-family: var(--font-mono);
          font-size: 8px;
          cursor: pointer;
        }
        .ext-btn:hover {
          background: rgba(255, 51, 51, 0.2);
        }
      `}</style>
    </div>
  )
}
