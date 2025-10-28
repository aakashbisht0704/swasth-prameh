'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setLoading(true)
    try {
      console.log('Attempting to fetch videos from yoga_vids bucket...')
      
      // First, check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user?.email || 'Not logged in')
      
      // Build base URL for storage
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const baseUrl = `${supabaseUrl}/storage/v1/object/public/yoga_vids/`
      console.log('Base URL:', baseUrl)
      
      // List all files from the yoga_vids bucket
      const { data: files, error } = await supabase.storage
        .from('yoga_vids')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })
      
      console.log('Files from bucket:', files)
      console.log('Files length:', files?.length)
      console.log('Error:', error)
      
      if (error) {
        console.error('Storage error:', error)
        throw error
      }

      // If bucket is empty or has no files, try using hardcoded filenames as fallback
      if (!files || files.length === 0) {
        console.log('No files found via list() - attempting direct URL access')
        
        // Try accessing videos directly if list() fails but files exist
        // You can add your actual video filenames here
        const knownFilenames = [
          'Ardh Mastsyendra asana.MOV',
          'IMG_8636.MOV',
          'Sarvana Asan.MOV',
          'Setu Bandhasan.MOV',
          'Sputa Vajra Asan.MOV',
          'Ushtra Asana.MOV'
        ]
        
        if (knownFilenames.length === 0) {
          toast.error('No videos found and no filenames configured. Please configure known filenames or fix bucket permissions.')
          setVideos([])
          return
        }
        
        // Create video objects from known filenames
        const videoData = knownFilenames.map((filename, index) => {
          // URL-encode filename to handle spaces
          const encodedFilename = encodeURIComponent(filename)
          const { data } = supabase.storage
            .from('yoga_vids')
            .getPublicUrl(filename)
          
          // Parse filename for metadata (these are Yoga poses, so they're intermediate/advanced)
          const title = filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '')
          const isAdvanced = filename.toLowerCase().includes('urdhva') || filename.toLowerCase().includes('vajra')
          const difficulty = isAdvanced ? 'advanced' : 'intermediate'
          
          console.log(`Video ${index + 1}: ${title} → ${data.publicUrl}`)
          
          return {
            id: filename,
            title: title,
            description: `Traditional yoga pose demonstration - ${difficulty} level`,
            video_url: data.publicUrl,
            duration: 'N/A',
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
            category: 'therapeutic',
            created_at: new Date().toISOString()
          }
        })
        
        setVideos(videoData)
        return
      }

      // Filter out folders and get only files
      const videoFiles = files.filter(file => file.name && !file.name.endsWith('/'))
      console.log(`Found ${videoFiles.length} video files in bucket (filtered from ${files.length} total items)`)
      
      if (videoFiles.length === 0) {
        console.log('No actual video files found (only folders)')
        setVideos([])
        toast.error('No video files found. Please upload video files to the yoga_vids bucket.')
        return
      }

      // Transform storage files into video objects
      const videoData = await Promise.all(
        videoFiles.map(async (file) => {
          // Get public URL for the video
          // Generate public URL for the video
          const { data: urlData } = supabase.storage
            .from('yoga_vids')
            .getPublicUrl(file.name)
          
          console.log(`Generated URL for ${file.name}:`, urlData.publicUrl)

          // Parse metadata from filename - works with any format!
          // Best results with: beginner-morning-sun-salutation.mp4
          // But works with any name like: video-1.mov, my-video.mp4, etc.
          const parts = file.name.replace(/\.[^/.]+$/, '').split(/[-_]/) // Remove extension and split by hyphens or underscores
          const difficulty = parts.find(p => ['beginner', 'intermediate', 'advanced'].includes(p)) || 'beginner'
          // Category is any word that's not a difficulty level, "video", or "yoga"
          const category = parts.find(p => !['beginner', 'intermediate', 'advanced', 'video', 'yoga'].includes(p)) || 'general'

          return {
            id: file.id || file.name,
            title: file.name
              .replace(/[-_]/g, ' ')
              .replace(/\.[^/.]+$/, '') // Remove extension
              .replace(/\b\w/g, l => l.toUpperCase()), // Capitalize words
            description: `Yoga video for ${difficulty} practitioners - ${category} category`,
            video_url: urlData.publicUrl,
            duration: 'N/A',
            difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
            category: category,
            created_at: file.created_at || file.updated_at || new Date().toISOString(),
            metadata: file.metadata
          }
        })
      )

      console.log('Processed video data:', videoData)
      setVideos(videoData)
    } catch (error: any) {
      console.error('Error loading videos:', error)
      
      // Provide more specific error messages
      if (error?.message?.includes('does not exist')) {
        toast.error('yoga_vids bucket does not exist. Please create it in Supabase Storage.')
      } else if (error?.message?.includes('permission') || error?.message?.includes('denied')) {
        toast.error('Permission denied. Please make the yoga_vids bucket public or check your RLS policies.')
      } else {
        toast.error(`Failed to load yoga videos: ${error?.message || 'Unknown error'}`)
      }
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
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">🧘‍♀️</div>
                      <p className="text-sm text-muted-foreground">Video Preview</p>
                    </div>
                  </div>
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
                      onClick={() => setSelectedVideo(video)}
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

      {/* Sample videos for demonstration */}
      {videos.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Yoga Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'sample-1',
                  title: 'Morning Yoga for Beginners',
                  description: 'Start your day with gentle yoga poses to energize your body and mind.',
                  duration: '15 min',
                  difficulty: 'beginner' as const,
                  category: 'morning'
                },
                {
                  id: 'sample-2',
                  title: 'Diabetes-Friendly Yoga Flow',
                  description: 'Specialized yoga sequence designed to help manage diabetes through gentle movements.',
                  duration: '20 min',
                  difficulty: 'intermediate' as const,
                  category: 'therapeutic'
                },
                {
                  id: 'sample-3',
                  title: 'Evening Relaxation Yoga',
                  description: 'Wind down with calming poses to reduce stress and improve sleep quality.',
                  duration: '25 min',
                  difficulty: 'beginner' as const,
                  category: 'evening'
                }
              ].map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🧘‍♀️</div>
                      <p className="text-sm text-muted-foreground">Sample Video</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                        {video.difficulty}
                      </span>
                      <span className="text-sm text-muted-foreground">{video.duration}</span>
                    </div>
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-background rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
              
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
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
