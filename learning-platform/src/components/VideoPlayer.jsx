import React from 'react'
import YouTube from 'react-youtube'


export default function VideoPlayer({
  videoUrl,
  lessonId,
  onPlay,
  onPause,
  onEnd,
  onStateChange
}) {
  // Extract ID from URL (supports full URL or just ID)
  const match = videoUrl.match(/[?&]v=([^&]+)/)
  const videoId = match ? match[1] : videoUrl

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1
    }
  }

  const handleStateChange = (e) => {
    const state = e.data
    console.log(`Lesson ${lessonId} state changed:`, state)
    onStateChange?.(lessonId, state)
    if (state === YouTube.PlayerState.PLAYING)  {
      console.log(`Lesson ${lessonId} play`)
      onPlay?.(lessonId)
    }
    if (state === YouTube.PlayerState.PAUSED)   {
      console.log(`Lesson ${lessonId} pause`)
      onPause?.(lessonId)
    }
    if (state === YouTube.PlayerState.ENDED)    {
      console.log(`Lesson ${lessonId} end`)
      onEnd?.(lessonId)
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-2xl bg-black">
      <YouTube
        videoId={videoId}
        opts={opts}
        onStateChange={handleStateChange}
      />
    </div>
  )
}
