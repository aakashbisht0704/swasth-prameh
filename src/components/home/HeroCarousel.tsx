'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

type HeroSlide = {
  id: string
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
}

const AUTO_PLAY_INTERVAL = 7000
const SWIPE_THRESHOLD_PX = 45

const baseSlides: HeroSlide[] = [
  {
    id: 'community-screening',
    title: 'Community Health Camps',
    description: 'Empowering health workers with rapid screening and instant analytics.',
    image: {
      src: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
      alt: 'Community health worker taking a patient’s blood pressure during a screening camp.',
    },
  },
  {
    id: 'personalized-plans',
    title: 'Personalized Daily Plans',
    description: 'Dosha-aligned meal suggestions and yoga routines curated by our AI.',
    image: {
      src: 'https://images.unsplash.com/photo-1556910110-a5af165c1dda?auto=format&fit=crop&w=900&q=80',
      alt: 'Healthy vegetarian meal plan arranged on a table with fresh ingredients.',
    },
  },
  {
    id: 'analytics-dashboard',
    title: 'Insightful Dashboards',
    description: 'Track glucose trends, lifestyle adherence, and AI insights in one place.',
    image: {
      src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
      alt: 'Tablet displaying health analytics graphs with a person interacting.',
    },
  },
]

export function HeroCarousel() {
  const slides = useMemo(() => baseSlides, [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const pointerStartX = useRef<number | null>(null)

  const goTo = useCallback(
    (nextIndex: number, movement: 1 | -1 = 1) => {
      const total = slides.length
      setDirection(movement)
      setActiveIndex(() => {
        if (nextIndex < 0) return total - 1
        if (nextIndex >= total) return 0
        return nextIndex
      })
    },
    [slides.length]
  )

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1)
  }, [activeIndex, goTo])

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1)
  }, [activeIndex, goTo])

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => {
        setDirection(1)
        return (prev + 1) % slides.length
      })
    }, AUTO_PLAY_INTERVAL)
    return () => window.clearInterval(timer)
  }, [slides.length, isPaused])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  const activeSlide = slides[activeIndex]

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      pointerStartX.current = event.clientX
      setIsPaused(true)
    }
  }, [])

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerStartX.current === null) return
      const deltaX = event.clientX - pointerStartX.current
      pointerStartX.current = null
      setIsPaused(false)
      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return
      if (deltaX > 0) {
        goPrev()
      } else {
        goNext()
      }
    },
    [goNext, goPrev]
  )

  const handlePointerCancel = useCallback(() => {
    pointerStartX.current = null
    setIsPaused(false)
  }, [])

  return (
    <div
      className="group relative flex w-full flex-col gap-4 rounded-3xl border border-border bg-card/80 p-4 shadow-lg backdrop-blur-md transition hover:shadow-xl lg:p-6 xl:p-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Project highlights"
      aria-live="polite"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activeSlide.id}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={{
              enter: (dir: 1 | -1) => ({
                x: dir > 0 ? 48 : -48,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (dir: 1 | -1) => ({
                x: dir > 0 ? -48 : 48,
                opacity: 0,
              }),
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <figure className="relative h-full w-full">
              <Image
                src={activeSlide.image.src}
                alt={activeSlide.image.alt}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 420px"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-card/90 p-4 text-card-foreground shadow-md backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1F7A4C]">
                  {`0${activeIndex + 1} / 0${slides.length}`}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[#2FA46F]">
                  {activeSlide.title}
                </h3>
                <p className="mt-1 text-sm text-[#6BBF8F]">
                  {activeSlide.description}
                </p>
              </figcaption>
            </figure>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Select carousel slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                if (index === activeIndex) return
                const movement = index > activeIndex ? 1 : -1
                goTo(index, movement)
              }}
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-selected={activeIndex === index}
              role="tab"
              className={cn(
                'h-2 rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                activeIndex === index ? 'w-8 bg-primary' : 'w-3 bg-muted'
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 font-semibold text-primary shadow-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Previous slide"
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 font-semibold text-primary shadow-sm transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Next slide"
          >
            <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  )
}


