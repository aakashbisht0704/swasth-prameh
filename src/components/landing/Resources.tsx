'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const articles = [
  {
    title: 'Understanding Prakriti: Your Ayurvedic Constitution',
    description: 'Learn how your unique Prakriti influences your health and how we use it to personalize your diabetes management plan.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    url: 'https://blog.theayurvedaexperience.com/understanding-prakriti-vikrti-your-ayurvedic-constitution/',
  },
  {
    title: 'Ayurvedic Diet Principles for Diabetes',
    description: 'Discover the fundamental principles of Ayurvedic nutrition and how they apply to managing Prameh (diabetes).',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    url: 'https://madhavbaug.org/health-corner/ayurvedic-diet-and-lifestyle-guide-for-diabetes/',
  },
]

// YouTube video ID for Ayurvedic diabetes management
// TODO: Replace with actual Ayurvedic diabetes management video ID
// Example: If your YouTube URL is https://www.youtube.com/watch?v=ABC123xyz, use 'ABC123xyz'
// Suggested video: https://www.youtube.com/watch?v=6VFbs34JbEY (Ayurvedic Treatment for Diabetes by Swami Ramdev)
const youtubeVideoId = '6VFbs34JbEY'

export function Resources() {
  return (
    <section id="resources" className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ayurvedic Insights for Prameh Management
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Explore our resources to learn more about Ayurvedic approaches to diabetes management.
          </p>
        </motion.div>

        {/* Articles & Videos */}
        <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-3">
          {/* Blog Articles */}
          {articles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* YouTube Video Embed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Card className="h-full border-border/50 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative w-full aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="Ayurvedic Diabetes Management"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>Yoga and Lifestyle for Diabetes Management</CardTitle>
                <CardDescription>
                  Explore yoga poses and lifestyle practices that complement your Ayurvedic treatment plan.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

