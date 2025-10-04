import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const VideoPlayerWithComments = forwardRef(function VideoPlayerWithComments(
  { src, comments = [], onTimeUpdate },
  ref
) {
  const videoRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useImperativeHandle(ref, () => ({
    seekTo: (time) => {
      if (!videoRef.current) return
      const t = Math.min(Math.max(time, 0), duration || time)
      videoRef.current.currentTime = t
    },
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
  }), [duration])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const handleLoaded = () => setDuration(v.duration || 0)
    const handleTime = () => {
      setCurrentTime(v.currentTime || 0)
      onTimeUpdate?.(v.currentTime || 0)
    }
    v.addEventListener('loadedmetadata', handleLoaded)
    v.addEventListener('timeupdate', handleTime)
    return () => {
      v.removeEventListener('loadedmetadata', handleLoaded)
      v.removeEventListener('timeupdate', handleTime)
    }
  }, [onTimeUpdate])

  const progress = duration ? (currentTime / duration) * 100 : 0

  const markers = useMemo(() => {
    if (!duration) return []
    return comments.map((c, idx) => ({ key: idx, left: `${Math.min(100, Math.max(0, (c.time / duration) * 100))}%`, time: c.time }))
  }, [comments, duration])

  const onClickProgress = (e) => {
    if (!videoRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(duration * ratio, duration))
    videoRef.current.currentTime = newTime
  }

  return (
    <div className="w-full">
      <div className="relative">
        <video ref={videoRef} src={src} controls className="w-full rounded-lg border border-gray-800" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative h-2 bg-gray-800 rounded cursor-pointer" onClick={onClickProgress}>
          <div className="absolute left-0 top-0 h-2 bg-accent rounded" style={{ width: `${progress}%` }} />
          {markers.map(m => (
            <div
              key={m.key}
              title={`Jump to ${formatTime(m.time)}`}
              className="absolute top-0 -translate-x-1/2 h-2 w-[2px] bg-white/70"
              style={{ left: m.left }}
              onClick={(e) => {
                e.stopPropagation()
                if (videoRef.current) videoRef.current.currentTime = m.time
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

export default VideoPlayerWithComments
