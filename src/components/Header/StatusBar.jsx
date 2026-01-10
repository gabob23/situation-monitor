import { useState, useEffect } from 'react'
import { WORLD_CLOCKS } from '../../data/sources'

export default function StatusBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date, timezone) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }).toUpperCase()
  }

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-bar-title">SITUATION MONITOR</span>
        <div className="live-indicator">
          <span className="live-dot" />
          <span>LIVE</span>
        </div>
      </div>

      <div className="status-bar-clocks">
        {WORLD_CLOCKS.map((clock, index) => (
          <div key={clock.city} className="world-clock">
            <span className="clock-city">{clock.short}</span>
            <span className={`clock-time ${index === 0 ? 'clock-primary' : ''}`}>
              {formatTime(time, clock.timezone)}
            </span>
          </div>
        ))}
      </div>

      <div className="status-bar-right">
        <span className="date">{formatDate(time)}</span>
      </div>

      <style>{`
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--neon-cyan);
          border-radius: 2px;
          position: relative;
          flex-wrap: wrap;
          gap: 8px;
        }
        .status-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          box-shadow: 0 0 5px var(--neon-cyan);
          pointer-events: none;
          border-radius: 2px;
        }
        .status-bar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .status-bar-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 900;
          color: var(--neon-cyan);
          text-shadow: 0 0 10px var(--neon-cyan);
          letter-spacing: 3px;
        }
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 700;
          color: var(--neon-red);
          text-shadow: 0 0 5px var(--neon-red);
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--neon-red);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--neon-red);
          animation: pulse 1s ease-in-out infinite;
        }
        .status-bar-clocks {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .world-clock {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-width: 58px;
        }
        .clock-city {
          font-family: var(--font-mono);
          font-size: 8px;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .clock-time {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }
        .clock-primary {
          color: var(--neon-amber);
          text-shadow: 0 0 5px var(--neon-amber);
        }
        .status-bar-right {
          display: flex;
          align-items: center;
        }
        .date {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
        }
        @media (max-width: 1024px) {
          .status-bar-clocks {
            order: 3;
            width: 100%;
            justify-content: center;
            padding-top: 6px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
        @media (max-width: 600px) {
          .status-bar-title {
            font-size: 11px;
            letter-spacing: 2px;
          }
          .world-clock {
            min-width: 50px;
            padding: 2px 4px;
          }
          .clock-time {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  )
}
