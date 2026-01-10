import { useState, useEffect } from 'react'
import { NEWS_FEEDS, RSS_PROXY } from '../../data/sources'

export default function BreakingTicker() {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const allHeadlines = []
        const sources = ['guardian', 'bbc', 'aljazeera']

        for (const sourceKey of sources) {
          const source = NEWS_FEEDS[sourceKey]
          try {
            const response = await fetch(`${RSS_PROXY}${encodeURIComponent(source.url)}`)
            const data = await response.json()

            if (data.status === 'ok' && data.items) {
              data.items.slice(0, 3).forEach((item) => {
                allHeadlines.push({
                  text: item.title,
                  source: source.name
                })
              })
            }
          } catch (e) {
            console.error(`Ticker fetch error for ${sourceKey}:`, e)
          }
        }

        setHeadlines(allHeadlines)
        setLoading(false)
      } catch (error) {
        console.error('Ticker fetch error:', error)
        setLoading(false)
      }
    }

    fetchHeadlines()
    const interval = setInterval(fetchHeadlines, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading || headlines.length === 0) {
    return (
      <div className="ticker-container">
        <div className="ticker-label">
          <span className="ticker-icon">◆</span>
          BREAKING
        </div>
        <div className="ticker-content">
          <span className="ticker-loading">CONNECTING TO NEWS WIRE...</span>
        </div>
      </div>
    )
  }

  // Create ticker text
  const tickerText = headlines.map(h => `${h.text} [${h.source}]`).join('  ●  ')
  // Duplicate for seamless scroll
  const fullText = `${tickerText}  ●  ${tickerText}  ●  `

  return (
    <div className="ticker-container">
      <div className="ticker-label">
        <span className="ticker-icon">◆</span>
        BREAKING
      </div>
      <div className="ticker-content">
        <div className="ticker-scroll">
          <span className="ticker-text">{fullText}</span>
        </div>
      </div>
      <style>{`
        .ticker-container {
          display: flex;
          align-items: stretch;
          background: var(--bg-secondary);
          border: 1px solid var(--neon-red);
          overflow: hidden;
          height: 28px;
        }
        .ticker-label {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 12px;
          background: var(--neon-red);
          color: #000;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          white-space: nowrap;
          animation: tickerPulse 2s ease-in-out infinite;
        }
        .ticker-icon {
          animation: spin 3s linear infinite;
        }
        .ticker-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          position: relative;
        }
        .ticker-scroll {
          display: flex;
          animation: tickerScroll 60s linear infinite;
          white-space: nowrap;
        }
        .ticker-text {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-primary);
          padding-left: 20px;
        }
        .ticker-loading {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          padding-left: 20px;
          animation: pulse 1s ease-in-out infinite;
        }
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes tickerPulse {
          0%, 100% {
            background: var(--neon-red);
          }
          50% {
            background: #cc2929;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
