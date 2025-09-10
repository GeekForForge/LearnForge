// src/components/VideoPlayer.jsx
import React, { useRef } from 'react';
import YouTube from 'react-youtube';
import ApiService from '../services/api';

export default function VideoPlayer({
  videoUrl,
  lessonId,
  onPlay,
  onPause,
  onEnd,
  onStateChange
}) {
  const playerRef = useRef(null);
  const TEMP_USER_ID = "temp-user-123";

  const extractVideoId = (url) => {
    if (!url) return '';
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return url;
  };

  const videoId = extractVideoId(videoUrl);

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
      enablejsapi: 1,
      origin: window.location.origin,
      playsinline: 1,
      iv_load_policy: 3,
      cc_load_policy: 0,
      disablekb: 0,
      fs: 1,
      hl: 'en'
    }
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    console.log('YouTube player ready for lesson:', lessonId);
  };

  const handleStateChange = async (event) => {
    const state = event.data;
    console.log(`Lesson ${lessonId} state changed:`, state);
    
    try {
      if (state === YouTube.PlayerState.PLAYING) {
        console.log(`Lesson ${lessonId} started playing`);
        await ApiService.recordVideoPlay(TEMP_USER_ID, lessonId);
        onPlay?.(lessonId);
      }
      
      if (state === YouTube.PlayerState.PAUSED) {
        console.log(`Lesson ${lessonId} paused`);
        const currentTime = playerRef.current?.getCurrentTime();
        const position = formatTime(currentTime);
        await ApiService.recordVideoPause(TEMP_USER_ID, lessonId, position);
        onPause?.(lessonId);
      }
      
      if (state === YouTube.PlayerState.ENDED) {
        console.log(`Lesson ${lessonId} completed`);
        await ApiService.markLessonComplete(TEMP_USER_ID, lessonId);
        onEnd?.(lessonId);
      }

      onStateChange?.(lessonId, state);
      
    } catch (error) {
      console.error('Error tracking video progress:', error);
    }
  };

  const handleError = (event) => {
    console.error('YouTube Player Error:', event.data);
    const errorMessages = {
      2: 'Invalid video ID',
      5: 'HTML5 player error',
      100: 'Video not found or private',
      101: 'Video owner does not allow embedding',
      150: 'Video owner does not allow embedding'
    };
    
    const errorMsg = errorMessages[event.data] || 'Unknown error';
    console.error(`YouTube Error ${event.data}: ${errorMsg}`);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-gray-800 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No video available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full bg-black rounded-xl shadow-2xl overflow-hidden"
      data-lenis-prevent
      style={{ 
        paddingBottom: '56.25%', // 16:9 Aspect Ratio
        height: 0,
        isolation: 'isolate',
        transform: 'translateZ(0)'
      }}
    >
      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-0">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300">Loading video...</span>
        </div>
      </div>

      {/* YouTube Player - positioned absolutely to fill container */}
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={handleError}
          className="w-full h-full"
          iframeClassName="w-full h-full border-0"
          style={{ 
            pointerEvents: 'auto',
            userSelect: 'auto'
          }}
        />
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded z-20">
          Video ID: {videoId}
        </div>
      )}
    </div>
  );
}
