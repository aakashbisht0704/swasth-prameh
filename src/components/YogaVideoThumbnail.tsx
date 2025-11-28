'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface YogaVideoThumbnailProps {
  videoUrl: string
  title: string
  className?: string
}

export function YogaVideoThumbnail({ videoUrl, title, className = '' }: YogaVideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    let timeoutId: NodeJS.Timeout

    const captureFrame = () => {
      try {
        const ctx = canvas.getContext('2d')
        if (!ctx || !video) return

        // Set canvas dimensions
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setThumbnail(dataUrl)
        setLoading(false)
      } catch (e) {
        setError(true)
        setLoading(false)
      }
    }

    const handleLoadedMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }
    }

    const handleLoadedData = () => {
      // Seek to 0.1 seconds to get a good frame (first frame might be black)
      try {
        video.currentTime = 0.1
      } catch (e) {
        // If seeking fails, try to capture current frame
        captureFrame()
      }
    }

    const handleSeeked = () => {
      captureFrame()
    }

    const handleError = () => {
      setError(true)
      setLoading(false)
    }

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('error', handleError)

    // Fallback: capture after a delay if seeked doesn't fire
    timeoutId = setTimeout(() => {
      if (video.readyState >= 2 && loading) {
        captureFrame()
      }
    }, 2000)

    // Load the video
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('error', handleError)
      clearTimeout(timeoutId)
    }
  }, [videoUrl, loading])

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Hidden video element for thumbnail generation */}
      <video
        ref={videoRef}
        src={videoUrl}
        crossOrigin="anonymous"
        preload="metadata"
        className="hidden"
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Display thumbnail or loading/error state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <div className="text-4xl mb-2">🧘‍♀️</div>
            <p className="text-xs text-muted-foreground">Video Preview</p>
          </div>
        </div>
      )}

      {thumbnail && !loading && (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => {
            setError(true)
            setLoading(false)
          }}
        />
      )}

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
        <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
          <svg
            className="w-8 h-8 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

