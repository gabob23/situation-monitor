# Situation Monitor

A cyberpunk-styled geopolitical news dashboard with live video feeds, interactive maps, flight/marine tracking, and real-time news aggregation. Inspired by Blade Runner aesthetics and 90s news TV broadcasts.

## Features

### Live Video Broadcasts
- **Multi-view grid**: 4 simultaneous live news streams from global broadcasters
- **Channel pool**: 12 major 24/7 news channels using YouTube's channel live stream format
- **Supported channels**: Al Jazeera EN, France 24 EN, DW News, Euronews EN, Sky News, WION, TRT World, India Today, CNA Singapore, Africanews, NDTV 24x7, ABC News AU
- **Manual controls**: Cycle button (⟳) and dropdown selector for each cell
- **Auto-refresh**: Iframes refresh every 5 minutes to catch streams that come online

### News Wire
- **Multi-source aggregation**: Pulls from The Guardian, BBC, Al Jazeera, NPR, and DW News via RSS
- **Real-time updates**: Refreshes every 60 seconds
- **Developing story highlighting**: Automatically highlights stories containing keywords for major developing events:
  - Greenland, ICE shooting, Minneapolis
  - Venezuela, Ukraine, Russia, Syria, Iran
  - Gaza, Israel, China, Taiwan, North Korea
- **Auto-scroll**: Smooth scrolling feed with hover-to-pause

### X Wire / Social Feed
- **Alternative news sources**: Different slice of the same RSS feeds for variety
- **Same highlighting system**: Developing stories highlighted in red
- **Independent scroll**: Separate from main news feed

### Conflict Map (NASA FIRMS)
- **Interactive Leaflet map**: Dark-themed OpenStreetMap tiles
- **NASA FIRMS overlay**: Real-time thermal anomalies (fires, explosions)
- **Theater selection**: Ukraine, Syria, Gaza, Middle East, Sudan, Global views
- **External links**: Quick access to LiveUAMap, DeepState, and NASA FIRMS

### Live Tracker (Flights & Marine)
- **ADS-B Exchange integration**: Real-time aircraft positions (open-source, unfiltered)
- **VesselFinder integration**: Real-time vessel tracking with AIS data
- **Region selection**: Global, Europe, Middle East, Asia, USA views
- **Mode toggle**: Switch between flight and marine tracking
- **Direct links**: Quick access to full tracker websites

### Status Bar
- **World clocks**: UTC, NYC, London, Moscow, Delhi, Shanghai, Tokyo, Damascus
- **Live indicator**: Pulsing red dot
- **Date display**: Current date

### Breaking News Ticker
- **Scrolling headlines**: Latest stories from all sources
- **Source attribution**: Shows which outlet reported each story

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Custom CSS with CSS variables (cyberpunk theme)
- **Maps**: Leaflet with OpenStreetMap tiles (dark filter applied)
- **Data**: RSS feeds via rss2json proxy
- **Video**: YouTube live stream embeds
- **Tracking**: FlightRadar24 and MarineTraffic embeds

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  components/
    Layout/
      Dashboard.jsx       # Main grid layout
      Panel.jsx          # Reusable panel with cyber styling
    Video/
      VideoGrid.jsx      # 4-cell video grid with auto-cycling
    NewsFeed/
      CombinedNewsFeed.jsx  # Multi-source news aggregator
    Social/
      SocialFeed.jsx     # X Wire social-style feed
    Map/
      ConflictMap.jsx    # Leaflet map with FIRMS overlay
    Tracker/
      LiveTracker.jsx    # FlightRadar24/MarineTraffic embed
    Header/
      StatusBar.jsx      # Top bar with clocks and status
    Ticker/
      BreakingTicker.jsx # Scrolling breaking news
  data/
    sources.js           # News feed URLs, video streams, map configs
  styles/
    cyber.css            # Main cyberpunk theme
  App.jsx
  main.jsx
```

## Data Sources

### News Feeds (RSS)
- The Guardian World
- BBC World
- Al Jazeera
- NPR World
- DW News

### Video Streams (YouTube Live)
All streams use YouTube's channel-based live_stream URLs which auto-resolve to current livestreams when available.

### Maps
- **Base tiles**: OpenStreetMap with dark CSS filter
- **FIRMS overlay**: NASA MODIS/VIIRS thermal anomaly data

### Tracking
- **Flights**: ADS-B Exchange globe view (unfiltered aircraft data)
- **Marine**: VesselFinder AIS map

## Configuration

### Adding Developing Story Keywords

Edit the `DEVELOPING_KEYWORDS` array in:
- `src/components/NewsFeed/CombinedNewsFeed.jsx`
- `src/components/Social/SocialFeed.jsx`

```javascript
const DEVELOPING_KEYWORDS = [
  'greenland', 'ice shooting', 'venezuela',
  // Add more keywords here
]
```

### Adding Video Streams

Edit `ALL_STREAMS` in `src/components/Video/VideoGrid.jsx`:

```javascript
const ALL_STREAMS = [
  {
    id: 'unique-id',
    name: 'Display Name',
    url: 'https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID&autoplay=1&mute=1'
  },
  // Add more streams - use YouTube channel IDs, not video IDs
]
```

To find a channel ID: Go to the YouTube channel, view page source, search for "channelId".

### Adjusting Scroll Speed

The scroll speed for feeds is set in:
- `CombinedNewsFeed.jsx`: `const scrollSpeed = 0.35`
- `SocialFeed.jsx`: `const scrollSpeed = 0.35`

Lower values = slower scroll.

## Theme Customization

CSS variables in `src/styles/cyber.css`:

```css
:root {
  --bg-primary: #0a0a0f;
  --neon-cyan: #00ffff;
  --neon-magenta: #ff00ff;
  --neon-amber: #ffaa00;
  --neon-red: #ff3333;
  --neon-green: #00ff88;
}
```

## Known Limitations

1. **YouTube stream availability**: Live streams may be unavailable due to:
   - Regional restrictions
   - Channel not currently streaming
   - YouTube API limitations

2. **RSS proxy rate limits**: The rss2json free tier has usage limits

3. **Map tiles**: Some tile providers may require API keys for heavy usage

4. **Third-party embeds**: ADS-B Exchange and VesselFinder embeds depend on their services being available

5. **Video stream availability**: YouTube live streams may show "Video unavailable" if:
   - The channel isn't currently streaming
   - Regional restrictions apply
   - Use the cycle button (⟳) or dropdown to find working streams

## License

MIT
