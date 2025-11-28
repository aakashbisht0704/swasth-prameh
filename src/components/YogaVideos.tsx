'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'
import { trackActivity } from '@/lib/activity-tracking'
import { YogaVideoThumbnail } from '@/components/YogaVideoThumbnail'

interface YogaVideo {
  id: string
  title: string
  description: string
  video_url: string
  thumbnail_url?: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  created_at: string
  metadata?: any
}

interface YogaVideosProps {
  userId: string
}

export function YogaVideos({ userId }: YogaVideosProps) {
  const [videos, setVideos] = useState<YogaVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedVideo, setSelectedVideo] = useState<YogaVideo | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const watchStartTime = useRef<number>(0)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setLoading(true)
    try {
      // Hardcoded video list with URLs from Supabase bucket
      const videoList: Array<{
        id: string
        title: string
        videoUrl: string
        difficulty: 'beginner' | 'intermediate' | 'advanced'
        duration?: string
      }> = [
        {
          id: 'adho-mukha-svanasana',
          title: 'Adho Mukha Svanasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/AdhoMukhaSvanasana.mp4',
          difficulty: 'intermediate',
        },
        {
          id: 'ardh-matsyendrasana',
          title: 'Ardh Matsyendrasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Ardhmatsyendraasana.mp4',
          difficulty: 'intermediate',
        },
        {
          id: 'dhanurasana',
          title: 'Dhanurasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Dhanurasana.mp4',
          difficulty: 'intermediate',
        },
        {
          id: 'mandukasana',
          title: 'Mandukasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Mandukasana.mp4',
          difficulty: 'beginner',
        },
        {
          id: 'paschimottanasana',
          title: 'Paschimottanasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Paschimottanasana.mp4',
          difficulty: 'intermediate',
        },
        {
          id: 'sarvangasana',
          title: 'Sarvangasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Sarvangasana.mp4',
          difficulty: 'advanced',
        },
        {
          id: 'setu-bandhasana',
          title: 'Setu Bandhasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/SetuBandhasana.mp4',
          difficulty: 'beginner',
        },
        {
          id: 'supta-vajrasana',
          title: 'Supta Vajrasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/SuptaVajrasana.mp4',
          difficulty: 'advanced',
        },
        {
          id: 'tarasana',
          title: 'Tarasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Tarasana.mp4',
          difficulty: 'intermediate',
        },
        {
          id: 'vakrasana',
          title: 'Vakrasana',
          videoUrl: 'https://gdcfuasdaaveskiscqfl.supabase.co/storage/v1/object/public/yoga_vids/Vakrasana.mp4',
          difficulty: 'beginner',
        },
      ]

      // Filter out videos without URLs
      const validVideos = videoList.filter(v => v.videoUrl && v.videoUrl.trim() !== '')
      
      if (validVideos.length === 0) {
        toast.error('No video URLs configured. Please add video URLs to the code.')
        setVideos([])
        return
      }

      // Transform to video objects
      const videoData: YogaVideo[] = validVideos.map((video) => ({
        id: video.id,
        title: video.title,
        description: `Traditional ${video.title} yoga pose demonstration - ${video.difficulty} level`,
        video_url: video.videoUrl,
        duration: video.duration || 'N/A',
        difficulty: video.difficulty,
        category: 'therapeutic',
        created_at: new Date().toISOString(),
      }))
      setVideos(videoData)
    } catch (error: any) {
      toast.error(`Failed to load yoga videos: ${error?.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const categories = ['all', ...Array.from(new Set(videos.map(v => v.category)))]

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">Yoga videos</h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-xl capitalize"
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </div>

      <Card className="rounded-xl shadow-md border-border">
        <CardContent className="p-6">

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading videos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {selectedCategory === 'all' 
                  ? 'No yoga videos available yet.' 
                  : `No videos found in ${selectedCategory} category.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden rounded-xl shadow-md border-border hover:shadow-lg transition-shadow">
                  <YogaVideoThumbnail 
                    videoUrl={video.video_url} 
                    title={video.title}
                    className="w-full"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 text-foreground">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                        {video.difficulty}
                      </span>
                      <span className="text-sm text-muted-foreground">{video.duration}</span>
                    </div>
                    <Button 
                      className="w-full rounded-xl" 
                      onClick={async () => {
                        await trackActivity(userId, 'yoga_video_click', {
                          video_id: video.id,
                          video_title: video.title,
                        })
                        setSelectedVideo(video)
                        watchStartTime.current = Date.now()
                      }}
                    >
                      Start Now!!!
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 hover:bg-destructive hover:text-destructive-foreground"
              onClick={async () => {
                // Track watch time when closing
                if (videoRef.current && watchStartTime.current > 0) {
                  const duration = videoRef.current.duration || 0
                  const watchTime = Date.now() - watchStartTime.current
                  // Track if watched for at least 30 seconds or 50% of video
                  if (watchTime > 30000 || (duration > 0 && watchTime > duration * 500)) {
                    await trackActivity(userId, 'yoga_video_watch', {
                      video_id: selectedVideo.id,
                      video_title: selectedVideo.title,
                      video_duration: Math.round(duration),
                      watch_time: Math.round(watchTime / 1000), // in seconds
                    })
                  }
                }
                setSelectedVideo(null)
                watchStartTime.current = 0
              }}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
              
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                  onEnded={async () => {
                    if (videoRef.current) {
                      const duration = videoRef.current.duration || 0
                      const watchTime = Date.now() - watchStartTime.current
                      // Track if watched for at least 50% of video or 30 seconds
                      if (watchTime > 30000 || (duration > 0 && watchTime > duration * 500)) {
                        await trackActivity(userId, 'yoga_video_watch', {
                          video_id: selectedVideo.id,
                          video_title: selectedVideo.title,
                          video_duration: Math.round(duration),
                          watch_time: Math.round(watchTime / 1000), // in seconds
                        })
                      }
                    }
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedVideo.difficulty)}`}>
                  {selectedVideo.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">{selectedVideo.duration}</span>
                <span className="text-sm text-muted-foreground capitalize">{selectedVideo.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
