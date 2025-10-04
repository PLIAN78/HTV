import React, { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function VideoUploader({ accept = 'video/mp4,video/quicktime', onFileSelected, selectedFile }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files) => {
    const file = files && files[0]
    if (file && onFileSelected) onFileSelected(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        isDragging ? 'border-accent bg-accent/5' : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col items-center gap-3">
        <UploadCloud className="text-accent" size={40} />
        <div className="text-gray-300">Drag and drop your .mp4 or .mov here</div>
        <div className="text-gray-500 text-sm">or click to choose a file</div>
        {selectedFile && (
          <div className="mt-4 text-sm text-gray-400">
            Selected: <span className="text-gray-200">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  )
}
