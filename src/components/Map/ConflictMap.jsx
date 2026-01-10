import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Simple theater configurations - just show a map with markers
const THEATERS = {
  ukraine: { name: 'Ukraine', center: [48.5, 36.0], zoom: 6 },
  syria: { name: 'Syria', center: [35.0, 38.5], zoom: 7 },
  middleeast: { name: 'Middle East', center: [32.0, 42.0], zoom: 5 },
  global: { name: 'Global', center: [20, 0], zoom: 2 }
}

// External links
const EXTERNAL_LINKS = {
  ukraine: 'https://liveuamap.com/',
  syria: 'https://syria.liveuamap.com/',
  middleeast: 'https://mideast.liveuamap.com/',
  global: 'https://liveuamap.com/'
}

export default function ConflictMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [activeTheater, setActiveTheater] = useState('ukraine')

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current) return

    // Clean up existing map
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    const theater = THEATERS[activeTheater]

    const map = L.map(mapRef.current, {
      center: theater.center,
      zoom: theater.zoom,
      zoomControl: false,
      attributionControl: false
    })

    // Dark tiles - OpenStreetMap with CSS filter
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '',
      className: 'dark-tiles'
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstance.current = map

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [activeTheater])

  const openExternal = () => {
    window.open(EXTERNAL_LINKS[activeTheater], '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="conflict-map">
      {/* Controls */}
      <div className="map-controls">
        <div className="control-group">
          <span className="control-label">REGION:</span>
          <div className="region-select">
            {Object.entries(THEATERS).map(([key, t]) => (
              <button
                key={key}
                className={`ctrl-btn ${key === activeTheater ? 'active' : ''}`}
                onClick={() => setActiveTheater(key)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-content">
        <div ref={mapRef} className="leaflet-map" />
      </div>

      {/* Footer */}
      <div className="map-footer">
        <span className="map-info">
          Click "Open Full Site" for detailed conflict tracking
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
        .leaflet-map {
          width: 100%;
          height: 100%;
          background: #0a0a0f;
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
        /* Leaflet overrides */
        .leaflet-container {
          background: #0a0a0f;
        }
        .dark-tiles {
          filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2);
        }
        .leaflet-control-zoom a {
          background: rgba(10, 10, 15, 0.9) !important;
          color: var(--neon-cyan) !important;
          border-color: rgba(0, 255, 255, 0.3) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(0, 255, 255, 0.2) !important;
        }
      `}</style>
    </div>
  )
}
