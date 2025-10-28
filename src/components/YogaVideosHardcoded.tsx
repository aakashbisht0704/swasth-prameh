'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

interface YogaVideo {
  id: string
  title: string
  description: string
  video_url: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

export function YogaVideosHardcoded() {
  const [selectedVideo, setSelectedVideo] = useState<YogaVideo | null>(null)
  const bucketUrl = 'https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/yoga_vids/'
  
  // Hardcoded video list - you'll need to replace this with actual filenames
  const videoList = [
    'video-1.mp4',
    'video-2.mp4',
    // Add all your video filenames here
  ].map((filename, index) => ({
    id: filename,
    title: filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Yoga video ${index + 1}`,
    video_url: `${bucketUrl}${filename}`,
    duration: 'N/A',
    difficulty: 'beginner' as const,
    category: 'general'
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Yoga Videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoList.map((video) => (
          <Card key={video.id} className="overflow-hidden rounded-xl shadow-md">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">🧘‍♀️</div>
                <p className="text-sm text-muted-foreground">Video Preview</p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
              <Button 
                className="w-full rounded-xl" 
                onClick={() => setSelectedVideo(video)}
              >
                Start Now!!!
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-full mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

