'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type HeroSlide = {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'Prameh',
    subtitle: 'Metabolic Disorder',
    description: 'A metabolic disorder described with dosha imbalance, mainly Kapha. Linked to improper diet, inactivity, and poor metabolism. Managed through diet, lifestyle changes, herbs, and yoga.',
    image: '/pram.jpg',
    ctaText: 'Start Your Assessment',
    ctaLink: '/onboarding',
  },
  {
    id: 'slide-2',
    title: 'Prakriti',
    subtitle: 'Your Unique Constitution',
    description: 'Prakriti is your unique body constitution formed by Vata, Pitta, and Kapha. It defines your physical, mental, and metabolic tendencies. Used in Ayurveda to give personalized health and lifestyle guidance.',
    image: '/heroNew.jpg',
    ctaText: 'Discover Your Plan',
    ctaLink: '/onboarding',
  },
  {
    id: 'slide-3',
    title: 'The Three Doshas',
    subtitle: 'Vata, Pitta, and Kapha',
    description: 'Vata (Air and Space): Creative, energetic, quick-thinking. Pitta (Fire and Water): Intelligent, focused, goal-oriented. Kapha (Earth and Water): Stable, calm, nurturing. Understanding your dosha balance is key to personalized health.',
    image: '/prak.jpg',
    ctaText: 'Begin Your Journey',
    ctaLink: '/onboarding',
  },
]

const AUTO_PLAY_INTERVAL = 6000 // 6 seconds per slide

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      goToNext()
    }, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [isPaused, goToNext])

  const currentSlide = heroSlides[currentIndex]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            quality={90}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="container relative z-10 py-20 lg:py-32">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 text-white"
            >
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  {currentSlide.title}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  className="text-2xl sm:text-3xl lg:text-4xl text-primary font-semibold"
                >
                  {currentSlide.subtitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-lg sm:text-xl text-white/90"
                >
                  {currentSlide.description}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Link href={currentSlide.ctaLink}>
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90">
                    {currentSlide.ctaText}
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
                    className="w-full sm:w-auto text-base px-8 py-6 rounded-xl border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
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
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/80"
              >
                {/* <div className="flex items-center gap-2">
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
                </div> */}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

