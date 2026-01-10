import { useState, useEffect, useRef } from 'react'
import { NEWS_FEEDS, RSS_PROXY } from '../../data/sources'

// Use different/additional sources for variety
const SOURCES = ['aljazeera', 'bbc', 'guardian']

// Keywords for developing stories - these will be highlighted
const DEVELOPING_KEYWORDS = [
  'greenland', 'ice shooting', 'ice agent', 'minneapolis',
  'venezuela', 'maduro', 'trump',
  'ukraine', 'russia', 'putin', 'zelensky', 'kyiv', 'moscow',
  'syria', 'aleppo', 'damascus', 'kurdish', 'assad',
  'iran', 'tehran', 'protest',
  'israel', 'gaza', 'hamas', 'netanyahu',
  'breaking', 'just in', 'developing',
  'china', 'taiwan', 'xi jinping',
  'north korea', 'kim jong'
]

const isDevelopingStory = (text) => {
  const lower = text.toLowerCase()
  return DEVELOPING_KEYWORDS.some(keyword => lower.includes(keyword))
}

export default function SocialFeed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const fetchFeeds = async () => {
      const allItems = []

      for (const sourceKey of SOURCES) {
        const source = NEWS_FEEDS[sourceKey]
        if (!source) continue

        try {
          const response = await fetch(`${RSS_PROXY}${encodeURIComponent(source.url)}`)
          const data = await response.json()

          if (data.status === 'ok' && data.items) {
            // Get different items than the news feed (offset)
            data.items.slice(3, 12).forEach((item, index) => {
              allItems.push({
                id: `social-${sourceKey}-${index}-${Date.now()}`,
                text: item.title,
                source: `@${source.name.replace(/\s+/g, '')}`,
                time: new Date(item.pubDate),
                link: item.link
              })
            })
          }
        } catch (e) {
          console.error(`Social feed error ${sourceKey}:`, e)
        }
      }

      // Sort by time
      allItems.sort((a, b) => b.time - a.time)
      setItems(allItems)
      setLoading(false)
    }

    fetchFeeds()
    const interval = setInterval(fetchFeeds, 90000) // Slightly different interval
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (!scrollRef.current || isPaused || items.length === 0) return

    const container = scrollRef.current
    let animationId
    const scrollSpeed = 0.4 // Moderate speed for readability

    const scroll = () => {
      if (!isPaused && container) {
        container.scrollTop += scrollSpeed
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          container.scrollTop = 0
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [isPaused, items])

  const formatTime = (date) => {
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    if (diff < 60) return 'now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="social-loading">
        <div className="loading-spinner" />
        <span>CONNECTING TO X...</span>
      </div>
    )
  }

  return (
    <div className="social-feed">
      <div className="social-header">
        <span className="social-status">
          <span className="status-dot" />
          X WIRE
        </span>
        <span className="social-count">{items.length} POSTS</span>
      </div>

      <div
        ref={scrollRef}
        className="social-scroll"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {items.map((item) => {
          const isDeveloping = isDevelopingStory(item.text)
          return (
            <div
              key={item.id}
              className={`social-item ${isDeveloping ? 'developing' : ''}`}
              onClick={() => openLink(item.link)}
            >
              <span className="social-time">{formatTime(item.time)}</span>
              <span className="social-text">{item.text}</span>
              <span className="social-source">{item.source}</span>
            </div>
          )
        })}
        {/* Duplicate for seamless scroll */}
        {items.map((item) => {
          const isDeveloping = isDevelopingStory(item.text)
          return (
            <div
              key={`dup-${item.id}`}
              className={`social-item ${isDeveloping ? 'developing' : ''}`}
              onClick={() => openLink(item.link)}
            >
              <span className="social-time">{formatTime(item.time)}</span>
              <span className="social-text">{item.text}</span>
              <span className="social-source">{item.source}</span>
            </div>
          )
        })}
      </div>

      <div className="social-footer">
        <span>{isPaused ? 'PAUSED' : 'HOVER TO PAUSE'}</span>
      </div>

      <style>{`
        .social-feed {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .social-loading {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 10px;
        }
        .social-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid rgba(255, 170, 0, 0.2);
        }
        .social-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--neon-amber);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--neon-green);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--neon-green);
          animation: pulse 1s ease-in-out infinite;
        }
        .social-count {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
        }
        .social-scroll {
          flex: 1;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        .social-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .social-scroll::-webkit-scrollbar-thumb {
          background: var(--neon-amber);
        }
        .social-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .social-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: background 0.15s;
        }
        .social-item:hover {
          background: rgba(255, 170, 0, 0.05);
        }
        .social-item.developing {
          background: rgba(255, 51, 51, 0.15);
          border-left: 2px solid var(--neon-red);
          animation: developingPulse 2s ease-in-out infinite;
        }
        .social-item.developing .social-text {
          color: var(--neon-red);
          text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);
        }
        .social-item.developing .social-time {
          color: var(--neon-red);
        }
        @keyframes developingPulse {
          0%, 100% { background: rgba(255, 51, 51, 0.1); }
          50% { background: rgba(255, 51, 51, 0.2); }
        }
        .social-time {
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
          min-width: 24px;
        }
        .social-text {
          flex: 1;
          font-size: 11px;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .social-source {
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--neon-amber);
          padding: 1px 5px;
          border: 1px solid rgba(255, 170, 0, 0.3);
          white-space: nowrap;
        }
        .social-footer {
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.5);
          border-top: 1px solid rgba(255, 170, 0, 0.2);
          text-align: center;
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
