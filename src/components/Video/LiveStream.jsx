import { useState } from 'react'
import { VIDEO_STREAMS } from '../../data/sources'

export default function LiveStream() {
  const [currentChannel, setCurrentChannel] = useState('aljazeera')

  const handleChannelChange = (e) => {
    setCurrentChannel(e.target.value)
  }

  const stream = VIDEO_STREAMS[currentChannel]

  return (
    <div className="video-container">
      <iframe
        src={stream.embedUrl}
        title={stream.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="channel-selector">
        <select value={currentChannel} onChange={handleChannelChange}>
          {Object.entries(VIDEO_STREAMS).map(([key, channel]) => (
            <option key={key} value={key}>
              {channel.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
