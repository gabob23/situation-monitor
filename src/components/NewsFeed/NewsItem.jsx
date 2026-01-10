function formatTimeAgo(date) {
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'JUST NOW'
  if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`
  if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`
  return `${Math.floor(diff / 86400)}D AGO`
}

export default function NewsItem({ item }) {
  const handleClick = () => {
    window.open(item.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="news-item" onClick={handleClick}>
      <div className="news-item-time">{formatTimeAgo(item.pubDate)}</div>
      <div className="news-item-title">{item.title}</div>
      <div className="news-item-source">{item.source}</div>
    </div>
  )
}
