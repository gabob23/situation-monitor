import { useRSSFeed } from '../../hooks/useRSSFeed'
import { NEWS_FEEDS } from '../../data/sources'
import NewsItem from './NewsItem'

export default function FeedPanel({ sourceKey }) {
  const source = NEWS_FEEDS[sourceKey]
  const { items, loading, error } = useRSSFeed(source.url)

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        SIGNAL LOST: {error}
      </div>
    )
  }

  return (
    <div className="feed-container">
      {items.map((item) => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  )
}
