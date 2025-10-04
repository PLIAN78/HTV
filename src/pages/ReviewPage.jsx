import React, { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import VideoPlayerWithComments from '../components/VideoPlayerWithComments.jsx'
import CommentList from '../components/CommentList.jsx'

function findCurrentComment(comments, currentTime) {
  if (!Array.isArray(comments) || comments.length === 0) return null
  const past = comments.filter(c => c.time <= currentTime)
  return past.length ? past[past.length - 1] : null
}

export default function ReviewPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const playerRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)

  const videoUrl = state?.videoUrl || null
  const comments = useMemo(() => state?.comments || [], [state])
  const currentComment = useMemo(() => findCurrentComment(comments, currentTime), [comments, currentTime])

  const handleSelectComment = (time) => {
    playerRef.current?.seekTo(time)
  }

  if (!videoUrl) {
    return (
      <div className="container-page">
        <div className="max-w-2xl mx-auto card p-6">
          <div className="text-gray-300">No video provided. Please upload a video first.</div>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/upload')}>Go to Upload</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-4">
          <VideoPlayerWithComments
            ref={playerRef}
            src={videoUrl}
            comments={comments}
            onTimeUpdate={setCurrentTime}
          />
        </div>

        <aside className="card p-4">
          <h2 className="text-lg font-semibold mb-3">AI Feedback</h2>

          <div className="mb-4 p-3 rounded-lg border border-gray-800 bg-gray-900/70">
            <div className="text-xs text-gray-400">Now</div>
            <div className="mt-1 min-h-[2.5rem]">
              {currentComment ? (
                <div className="text-gray-100">{currentComment.text}</div>
              ) : (
                <div className="text-gray-500">Waiting for the first comment...</div>
              )}
            </div>
          </div>

          <CommentList
            comments={comments}
            currentTime={currentTime}
            onSelectTime={handleSelectComment}
          />
        </aside>
      </div>
    </div>
  )
}
