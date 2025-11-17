'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroCarousel } from './HeroCarousel'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background"
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden />

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Personalized Diet & Lifestyle Plans for{' '}
                <span className="text-primary">Prameh (Diabetes)</span> Management
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground sm:text-xl"
              >
                Rooted in Ayurveda. Personalized with AI.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#approach" onClick={(e) => {
                e.preventDefault()
                document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base px-8 py-6 rounded-xl"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore How It Works
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>AI-Powered Personalization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Doctor-Backed Plans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>15-Day Custom Plans</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image/Video Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block lg:sticky lg:top-24"
          >
            <HeroCarousel />
          </motion.div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}

