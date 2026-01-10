import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Theater configurations
const THEATERS = {
  ukraine: { name: 'Ukraine', center: [48.5, 36.0], zoom: 6 },
  syria: { name: 'Syria', center: [35.0, 38.5], zoom: 7 },
  gaza: { name: 'Gaza', center: [31.4, 34.4], zoom: 10 },
  middleeast: { name: 'Middle East', center: [32.0, 42.0], zoom: 5 },
  sudan: { name: 'Sudan', center: [15.5, 32.5], zoom: 6 },
  global: { name: 'Global', center: [20, 0], zoom: 2 }
}

// External resources for each theater
const THEATER_LINKS = {
  ukraine: [
    { name: 'LiveUAMap', url: 'https://liveuamap.com/' },
    { name: 'DeepState', url: 'https://deepstatemap.live/' }
  ],
  syria: [
    { name: 'SyriaMap', url: 'https://syria.liveuamap.com/' }
  ],
  gaza: [
    { name: 'MEMap', url: 'https://middleeast.liveuamap.com/' }
  ],
  middleeast: [
    { name: 'MEMap', url: 'https://middleeast.liveuamap.com/' },
    { name: 'IranMap', url: 'https://iran.liveuamap.com/' }
  ],
  sudan: [
    { name: 'AfricaMap', url: 'https://africa.liveuamap.com/' }
  ],
  global: [
    { name: 'LiveUAMap', url: 'https://liveuamap.com/' }
  ]
}

export default function ConflictMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const firmsLayer = useRef(null)
  const [activeTheater, setActiveTheater] = useState('ukraine')
  const [showFirms, setShowFirms] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

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

    // Dark base layer - use OpenStreetMap with dark filter applied via CSS
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '',
      className: 'dark-tiles'
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // NASA FIRMS WMS Layer - thermal anomalies (fires, explosions)
    if (showFirms) {
      const firms = L.tileLayer.wms('https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/c61d6ebe8ff5b09d8bf94739a7aa95e9/', {
        layers: 'fires_viirs_snpp',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        opacity: 0.9
      })
      firms.addTo(map)
      firmsLayer.current = firms
    }

    mapInstance.current = map
    setLastUpdate(new Date())

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [activeTheater, showFirms])

  // Update map view when theater changes
  useEffect(() => {
    if (!mapInstance.current) return
    const theater = THEATERS[activeTheater]
    mapInstance.current.flyTo(theater.center, theater.zoom, { duration: 1 })
  }, [activeTheater])

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const refreshMap = () => {
    // Force refresh FIRMS layer
    if (firmsLayer.current && mapInstance.current) {
      mapInstance.current.removeLayer(firmsLayer.current)
      const firms = L.tileLayer.wms('https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/c61d6ebe8ff5b09d8bf94739a7aa95e9/', {
        layers: 'fires_viirs_snpp',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        opacity: 0.9
      })
      firms.addTo(mapInstance.current)
      firmsLayer.current = firms
      setLastUpdate(new Date())
    }
  }

  const theaterLinks = THEATER_LINKS[activeTheater] || []

  return (
    <div className="conflict-map">
      {/* Top controls row */}
      <div className="map-controls">
        <div className="control-group">
          <span className="control-label">REGION:</span>
          <div className="theater-select">
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
        <div className="control-group">
          <span className="control-label">LAYER:</span>
          <div className="layer-toggle">
            <button
              className={`ctrl-btn layer-btn ${showFirms ? 'active' : ''}`}
              onClick={() => setShowFirms(!showFirms)}
            >
              FIRMS {showFirms ? 'ON' : 'OFF'}
            </button>
            <button className="ctrl-btn refresh-btn" onClick={refreshMap} title="Refresh data">
              ⟳
            </button>
          </div>
        </div>
      </div>

      {/* Map content */}
      <div className="map-content">
        <div ref={mapRef} className="leaflet-map" />
      </div>

      {/* Footer with info and external links */}
      <div className="map-footer">
        <span className="map-info">
          FIRMS: Thermal anomalies (fires, explosions) · Updated: {lastUpdate.toLocaleTimeString()}
        </span>
        <div className="ext-links">
          {theaterLinks.map((link, i) => (
            <button key={i} onClick={() => openExternal(link.url)}>{link.name} ↗</button>
          ))}
          <button onClick={() => openExternal('https://firms.modaps.eosdis.nasa.gov/map/')}>NASA ↗</button>
        </div>
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
        .theater-select, .layer-toggle {
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
          background: rgba(255, 51, 51, 0.25);
          border-color: var(--neon-red);
          color: var(--neon-red);
          text-shadow: 0 0 5px var(--neon-red);
        }
        .layer-btn {
          border-color: rgba(255, 170, 0, 0.3);
        }
        .layer-btn:hover {
          border-color: var(--neon-amber);
          color: var(--neon-amber);
        }
        .layer-btn.active {
          background: rgba(255, 170, 0, 0.2);
          border-color: var(--neon-amber);
          color: var(--neon-amber);
          text-shadow: 0 0 5px var(--neon-amber);
        }
        .refresh-btn {
          border-color: rgba(0, 255, 255, 0.3);
          font-size: 11px;
          padding: 3px 6px;
        }
        .refresh-btn:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
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
          flex-wrap: wrap;
          gap: 4px;
        }
        .map-info {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
        }
        .ext-links {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .ext-links button {
          padding: 2px 6px;
          background: transparent;
          border: 1px solid rgba(255, 51, 51, 0.5);
          color: var(--neon-red);
          font-family: var(--font-mono);
          font-size: 8px;
          cursor: pointer;
        }
        .ext-links button:hover {
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
