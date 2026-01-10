import { useState, useEffect, useRef } from 'react'
import { NEWS_FEEDS, RSS_PROXY } from '../../data/sources'

// All news sources to combine
const SOURCES = ['guardian', 'bbc', 'aljazeera', 'npr', 'dw']

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

// Check if title contains developing story keywords
const isDevelopingStory = (title) => {
  const lower = title.toLowerCase()
  return DEVELOPING_KEYWORDS.some(keyword => lower.includes(keyword))
}

export default function CombinedNewsFeed() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const fetchAllFeeds = async () => {
      const allItems = []

      for (const sourceKey of SOURCES) {
        const source = NEWS_FEEDS[sourceKey]
        if (!source) continue

        try {
          const response = await fetch(`${RSS_PROXY}${encodeURIComponent(source.url)}`)
          const data = await response.json()

          if (data.status === 'ok' && data.items) {
            data.items.slice(0, 8).forEach((item, index) => {
              allItems.push({
                id: `${sourceKey}-${index}-${Date.now()}`,
                title: item.title,
                source: source.name,
                time: new Date(item.pubDate),
                link: item.link
              })
            })
          }
        } catch (e) {
          console.error(`Failed to fetch ${sourceKey}:`, e)
        }
      }

      // Sort by time, newest first
      allItems.sort((a, b) => b.time - a.time)
      setItems(allItems)
      setLoading(false)
    }

    fetchAllFeeds()
    const interval = setInterval(fetchAllFeeds, 60000)
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
    if (diff < 60) return 'NOW'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
  }

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="loading-spinner" />
        <span>CONNECTING...</span>
      </div>
    )
  }

  return (
    <div className="combined-feed">
      <div className="feed-header">
        <span className="feed-status">
          <span className="status-dot" />
          LIVE
        </span>
        <span className="feed-count">{items.length} STORIES</span>
      </div>

      <div
        ref={scrollRef}
        className="feed-scroll"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Original items */}
        {items.map((item) => {
          const isDeveloping = isDevelopingStory(item.title)
          return (
            <div
              key={item.id}
              className={`feed-item ${isDeveloping ? 'developing' : ''}`}
              onClick={() => openLink(item.link)}
            >
              <span className="item-time">{formatTime(item.time)}</span>
              <span className="item-title">{item.title}</span>
              <span className="item-source">{item.source}</span>
            </div>
          )
        })}
        {/* Duplicate for seamless scroll */}
        {items.map((item) => {
          const isDeveloping = isDevelopingStory(item.title)
          return (
            <div
              key={`dup-${item.id}`}
              className={`feed-item ${isDeveloping ? 'developing' : ''}`}
              onClick={() => openLink(item.link)}
            >
              <span className="item-time">{formatTime(item.time)}</span>
              <span className="item-title">{item.title}</span>
              <span className="item-source">{item.source}</span>
            </div>
          )
        })}
      </div>

      <div className="feed-footer">
        <span>{isPaused ? 'PAUSED' : 'HOVER TO PAUSE'}</span>
      </div>

      <style>{`
        .combined-feed {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .feed-loading {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 10px;
        }
        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        }
        .feed-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--neon-cyan);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--neon-green);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--neon-green);
          animation: pulse 1s ease-in-out infinite;
        }
        .feed-count {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
        }
        .feed-scroll {
          flex: 1;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        .feed-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .feed-scroll::-webkit-scrollbar-thumb {
          background: var(--neon-cyan);
        }
        .feed-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .feed-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: background 0.15s;
        }
        .feed-item:hover {
          background: rgba(0, 255, 255, 0.05);
        }
        .feed-item.developing {
          background: rgba(255, 51, 51, 0.15);
          border-left: 2px solid var(--neon-red);
          animation: developingPulse 2s ease-in-out infinite;
        }
        .feed-item.developing .item-title {
          color: var(--neon-red);
          text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);
        }
        .feed-item.developing .item-time {
          color: var(--neon-red);
        }
        @keyframes developingPulse {
          0%, 100% { background: rgba(255, 51, 51, 0.1); }
          50% { background: rgba(255, 51, 51, 0.2); }
        }
        .item-time {
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-muted);
          min-width: 28px;
        }
        .item-title {
          flex: 1;
          font-size: 11px;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .item-source {
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--neon-cyan);
          padding: 1px 5px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          white-space: nowrap;
        }
        .feed-footer {
          padding: 3px 8px;
          background: rgba(0, 0, 0, 0.5);
          border-top: 1px solid rgba(0, 255, 255, 0.2);
          text-align: center;
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
