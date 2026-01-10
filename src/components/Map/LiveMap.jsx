import { LIVE_MAPS } from '../../data/sources'

const mapLinks = [
  { key: 'liveuamap', name: 'LiveUAMap', url: 'https://liveuamap.com/', region: 'UKRAINE' },
  { key: 'deepstate', name: 'DeepState Map', url: 'https://deepstatemap.live/', region: 'UKRAINE' },
  { key: 'mideast', name: 'LiveUAMap Middle East', url: 'https://middleeast.liveuamap.com/', region: 'MIDDLE EAST' },
  { key: 'syria', name: 'Syria Live Map', url: 'https://syria.liveuamap.com/', region: 'SYRIA' },
]

export default function LiveMap() {
  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="map-fallback">
      <div className="map-header">
        <span className="map-icon">◉</span>
        <span>LIVE CONFLICT MAPS</span>
      </div>
      <div className="map-notice">
        External access required - select a map to open
      </div>
      <div className="map-links">
        {mapLinks.map((link) => (
          <button
            key={link.key}
            className="map-link-btn"
            onClick={() => handleOpen(link.url)}
          >
            <span className="map-link-region">{link.region}</span>
            <span className="map-link-name">{link.name}</span>
            <span className="map-link-arrow">→</span>
          </button>
        ))}
      </div>
      <style>{`
        .map-fallback {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 12px;
        }
        .map-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-size: 12px;
          color: var(--neon-red);
          text-shadow: 0 0 10px var(--neon-red);
        }
        .map-icon {
          animation: pulse 1s ease-in-out infinite;
        }
        .map-notice {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .map-links {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
        }
        .map-link-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 51, 51, 0.05);
          border: 1px solid rgba(255, 51, 51, 0.3);
          padding: 10px 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .map-link-btn:hover {
          background: rgba(255, 51, 51, 0.15);
          border-color: var(--neon-red);
          box-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
        }
        .map-link-region {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--neon-red);
          background: rgba(255, 51, 51, 0.2);
          padding: 2px 6px;
          letter-spacing: 1px;
        }
        .map-link-name {
          flex: 1;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-primary);
        }
        .map-link-arrow {
          color: var(--neon-red);
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
