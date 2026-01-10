// ============================================
// SITUATION MONITOR - Data Sources
// News feeds, video streams, and map embeds
// ============================================

// RSS Feed sources (using rss2json proxy for CORS)
export const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='

export const NEWS_FEEDS = {
  guardian: {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/world/rss',
    color: 'cyan'
  },
  bbc: {
    name: 'BBC World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    color: 'magenta'
  },
  aljazeera: {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    color: 'green'
  },
  npr: {
    name: 'NPR World',
    url: 'https://feeds.npr.org/1004/rss.xml',
    color: 'amber'
  },
  dw: {
    name: 'DW News',
    url: 'https://rss.dw.com/rdf/rss-en-world',
    color: 'amber'
  }
}

// YouTube Live streams - using direct video IDs for reliable 24/7 streams
// These are persistent livestream video IDs that don't change
export const VIDEO_STREAMS = {
  // Most reliable 24/7 streams (verified working)
  aljazeera: {
    name: 'Al Jazeera EN',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI0vo?autoplay=1&mute=1',
    region: 'middle-east'
  },
  france24: {
    name: 'France 24 EN',
    embedUrl: 'https://www.youtube.com/embed/h3MuIUNCCzI?autoplay=1&mute=1',
    region: 'europe'
  },
  dw: {
    name: 'DW News',
    embedUrl: 'https://www.youtube.com/embed/pqabxBKzZ6M?autoplay=1&mute=1',
    region: 'europe'
  },
  sky: {
    name: 'Sky News',
    embedUrl: 'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1',
    region: 'europe'
  },
  euronews: {
    name: 'Euronews',
    embedUrl: 'https://www.youtube.com/embed/pykpO5kQJ98?autoplay=1&mute=1',
    region: 'europe'
  },
  wion: {
    name: 'WION',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC_gUM8rL-Lrg6O3adPW9K1g&autoplay=1&mute=1',
    region: 'asia'
  },
  trt: {
    name: 'TRT World',
    embedUrl: 'https://www.youtube.com/embed/CV5Fooi8YJE?autoplay=1&mute=1',
    region: 'middle-east'
  },
  cgtn: {
    name: 'CGTN',
    embedUrl: 'https://www.youtube.com/embed/ELw3gdFp5k8?autoplay=1&mute=1',
    region: 'asia'
  },
  africanews: {
    name: 'Africanews',
    embedUrl: 'https://www.youtube.com/embed/NkX1LEmXfec?autoplay=1&mute=1',
    region: 'africa'
  },
  nhk: {
    name: 'NHK World',
    embedUrl: 'https://www.youtube.com/embed/f0lYkdA-Gtw?autoplay=1&mute=1',
    region: 'asia'
  },
  arirang: {
    name: 'Arirang TV',
    embedUrl: 'https://www.youtube.com/embed/KXI5DOjUKOk?autoplay=1&mute=1',
    region: 'asia'
  },
  indiatoday: {
    name: 'India Today',
    embedUrl: 'https://www.youtube.com/embed/Nq2wYlWFucg?autoplay=1&mute=1',
    region: 'asia'
  }
}

// Default 4-screen layout - using channels with reliable 24/7 streams
export const DEFAULT_SCREENS = ['aljazeera', 'france24', 'sky', 'euronews']

// World clocks configuration
export const WORLD_CLOCKS = [
  { city: 'UTC', timezone: 'UTC', short: 'UTC' },
  { city: 'New York', timezone: 'America/New_York', short: 'NYC' },
  { city: 'London', timezone: 'Europe/London', short: 'LON' },
  { city: 'Moscow', timezone: 'Europe/Moscow', short: 'MSK' },
  { city: 'Delhi', timezone: 'Asia/Kolkata', short: 'DEL' },
  { city: 'Shanghai', timezone: 'Asia/Shanghai', short: 'SHA' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', short: 'TYO' },
  { city: 'Damascus', timezone: 'Asia/Damascus', short: 'DAM' },
]

// Conflict theater maps
export const THEATER_MAPS = {
  ukraine: {
    name: 'Ukraine',
    // Try embedding LiveUAMap directly
    embedUrl: 'https://liveuamap.com/',
    osmUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=30.0%2C46.0%2C40.0%2C52.0&layer=mapnik',
    liveLinks: [
      { name: 'LiveUAMap', url: 'https://liveuamap.com/' },
      { name: 'DeepState', url: 'https://deepstatemap.live/' }
    ]
  },
  syria: {
    name: 'Syria',
    embedUrl: 'https://syria.liveuamap.com/',
    osmUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=35.0%2C32.0%2C42.0%2C37.5&layer=mapnik',
    liveLinks: [
      { name: 'Syria LiveMap', url: 'https://syria.liveuamap.com/' }
    ]
  },
  venezuela: {
    name: 'Venezuela',
    embedUrl: null,
    osmUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=-73.0%2C1.0%2C-59.0%2C12.5&layer=mapnik',
    liveLinks: []
  },
  iran: {
    name: 'Iran',
    embedUrl: 'https://iran.liveuamap.com/',
    osmUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=44.0%2C25.0%2C63.0%2C40.0&layer=mapnik',
    liveLinks: [
      { name: 'Iran LiveMap', url: 'https://iran.liveuamap.com/' }
    ]
  },
  middleeast: {
    name: 'Middle East',
    embedUrl: 'https://middleeast.liveuamap.com/',
    osmUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=30.0%2C25.0%2C55.0%2C40.0&layer=mapnik',
    liveLinks: [
      { name: 'ME LiveMap', url: 'https://middleeast.liveuamap.com/' }
    ]
  },
  gaza: {
    name: 'Gaza',
    embedUrl: 'https://middleeast.liveuamap.com/',
    osmUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=34.0%2C31.0%2C35.0%2C32.0&layer=mapnik',
    liveLinks: [
      { name: 'ME LiveMap', url: 'https://middleeast.liveuamap.com/' }
    ]
  }
}

// Social media / News wire accounts for scrolling feed
export const SOCIAL_ACCOUNTS = [
  { handle: 'BBCBreaking', name: 'BBC Breaking', type: 'news' },
  { handle: 'Reuters', name: 'Reuters', type: 'news' },
  { handle: 'AFP', name: 'AFP', type: 'news' },
  { handle: 'AP', name: 'Associated Press', type: 'news' },
  { handle: 'AJEnglish', name: 'Al Jazeera English', type: 'news' },
  { handle: 'CNN', name: 'CNN', type: 'news' },
  { handle: 'naboris', name: 'NEXTA', type: 'ukraine' },
  { handle: 'KyivIndependent', name: 'Kyiv Independent', type: 'ukraine' },
]

// Refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  news: 60000,      // 1 minute
  clock: 1000,      // 1 second
  social: 30000,    // 30 seconds
  ticker: 5000      // 5 seconds for ticker rotation
}
