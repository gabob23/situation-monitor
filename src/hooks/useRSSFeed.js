import { useState, useEffect, useCallback } from 'react'
import { RSS_PROXY, REFRESH_INTERVALS } from '../data/sources'

export function useRSSFeed(feedUrl) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchFeed = useCallback(async () => {
    try {
      const response = await fetch(`${RSS_PROXY}${encodeURIComponent(feedUrl)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch feed')
      }

      const data = await response.json()

      if (data.status !== 'ok') {
        throw new Error(data.message || 'Feed parsing failed')
      }

      const newItems = data.items.map((item, index) => ({
        id: item.guid || `${item.link}-${index}`,
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate),
        source: data.feed?.title || 'Unknown',
        description: item.description?.replace(/<[^>]*>/g, '').slice(0, 150)
      }))

      setItems(newItems)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('RSS fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [feedUrl])

  useEffect(() => {
    fetchFeed()

    const interval = setInterval(fetchFeed, REFRESH_INTERVALS.news)

    return () => clearInterval(interval)
  }, [fetchFeed])

  return { items, loading, error, lastUpdated, refetch: fetchFeed }
}
