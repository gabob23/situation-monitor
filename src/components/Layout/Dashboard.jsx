import StatusBar from '../Header/StatusBar'
import Panel from './Panel'
import VideoGrid from '../Video/VideoGrid'
import ConflictMap from '../Map/ConflictMap'
import LiveTracker from '../Tracker/LiveTracker'
import CombinedNewsFeed from '../NewsFeed/CombinedNewsFeed'
import SocialFeed from '../Social/SocialFeed'
import BreakingTicker from '../Ticker/BreakingTicker'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <StatusBar />
      <BreakingTicker />

      <div className="dashboard-content">
        {/* Left side - Video grid and maps */}
        <div className="main-section">
          <Panel title="LIVE BROADCAST // MULTI-VIEW" color="cyan">
            <VideoGrid />
          </Panel>

          <div className="maps-row">
            <Panel title="CONFLICT MAP" color="red">
              <ConflictMap />
            </Panel>
            <Panel title="LIVE TRACKER // FLIGHTS & MARINE" color="cyan">
              <LiveTracker />
            </Panel>
          </div>
        </div>

        {/* Right side - Two feed panels */}
        <div className="side-section">
          <Panel title="NEWS WIRE // ALL SOURCES" color="cyan">
            <CombinedNewsFeed />
          </Panel>

          <Panel title="X WIRE // SOCIAL FEED" color="amber">
            <SocialFeed />
          </Panel>
        </div>
      </div>
    </div>
  )
}
