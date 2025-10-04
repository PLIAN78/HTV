import React from 'react'

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function CommentList({ comments = [], currentTime = 0, onSelectTime }) {
  return (
    <div>
      <div className="text-sm text-gray-400 mb-2">All comments</div>
      <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-2">
        {comments.length === 0 && (
          <div className="text-gray-500 text-sm">No comments available.</div>
        )}
        {comments.map((c, idx) => {
          const isActive = c.time <= currentTime && (idx === comments.length - 1 || currentTime < comments[idx + 1].time)
          return (
            <button
              key={idx}
              onClick={() => onSelectTime?.(c.time)}
              className={`w-full text-left p-3 rounded border transition-colors ${
                isActive ? 'border-accent bg-accent/10' : 'border-gray-800 hover:bg-gray-800'
              }`}
            >
              <div className="text-xs text-gray-400">{formatTime(c.time)}</div>
              <div className="text-sm text-gray-100">{c.text}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
