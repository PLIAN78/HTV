import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import VideoUploader from '../components/VideoUploader.jsx'

const MOCK_RESPONSE = {
  comments: [
    { time: 5, text: 'Player left defensive zone too early' },
    { time: 18, text: 'Missed pass opportunity on right wing' },
    { time: 32, text: 'Poor positioning during breakout' },
  ],
}

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onConfirm = async () => {
    if (!file) return
    setError('')
    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return
          const percent = Math.round((evt.loaded / evt.total) * 100)
          setProgress(percent)
        },
        timeout: 60000,
      })

      const data = response?.data || MOCK_RESPONSE
      navigate('/review', { state: { videoUrl: previewUrl, comments: data.comments } })
    } catch (err) {
      // Fallback to mock if backend is unavailable
      console.warn('Upload failed, using mock data:', err?.message)
      navigate('/review', { state: { videoUrl: previewUrl, comments: MOCK_RESPONSE.comments } })
    } finally {
      setUploading(false)
    }
  }

  const onCancel = () => {
    setFile(null)
    setError('')
    setProgress(0)
  }

  return (
    <div className="container-page">
      <div className="max-w-3xl mx-auto card p-6">
        <h1 className="text-2xl font-semibold mb-6">Upload your game video</h1>

        <VideoUploader onFileSelected={setFile} selectedFile={file} />

        {previewUrl && (
          <div className="mt-6">
            <video src={previewUrl} controls className="w-full rounded-lg border border-gray-800" />
          </div>
        )}

        {uploading && (
          <div className="mt-6 flex items-center gap-3 text-sm text-gray-300">
            <Loader2 className="animate-spin text-accent" />
            <span>Uploading... {progress}%</span>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-sm">{error}</div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button className="btn btn-primary" onClick={onConfirm} disabled={!file || uploading}>
            <CheckCircle2 size={18} />
            Confirm Upload
          </button>
          <button className="btn btn-secondary" onClick={onCancel} disabled={uploading}>
            <XCircle size={18} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
