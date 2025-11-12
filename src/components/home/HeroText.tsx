'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

type HeroTextProps = {
  isAuthed: boolean
}

const trustBadges = [
  {
    name: 'Govt. Ayurveda College',
    image: 'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=200&q=70',
    alt: 'Seal of collaboration partner college',
  },
  {
    name: 'TechFest 2025 Demo',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=200&q=70',
    alt: 'Tech fest recognition badge',
  },
  {
    name: 'AI for Health Lab',
    image: 'https://images.unsplash.com/photo-1530026346624-1ef9c0c57d43?auto=format&fit=crop&w=200&q=70',
    alt: 'AI for Health Lab logo placeholder',
  },
]

export function HeroText({ isAuthed }: HeroTextProps) {
  const handleCTA = (ctaLabel: string) => {
    if (typeof window === 'undefined') return
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'homepage_cta_click',
      ctaLabel,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col gap-6"
      >
        <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
          Diabetes Care • Ayurveda • AI
        </Badge>
        <h1
          id="hero-heading"
          className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Personalized Ayurvedic Diabetes Care, Supercharged by AI
        </h1>
        <p className="max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
          SwasthPrameh blends Prakriti insights, ML powered predictions, and community-led care to deliver
          a 15-day adaptive lifestyle plan that actually fits your routine.
        </p>
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span aria-hidden>✅</span>
            Outcome-focused pilot with 92% plan adherence across 120 participants.
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden>✅</span>
            Supports offline-first data capture for community health workers.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href={isAuthed ? '/dashboard' : '/auth'}>
            <Button
              size="lg"
              className="group inline-flex items-center gap-2 rounded-2xl px-8 py-6 text-base font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => handleCTA(isAuthed ? 'Dashboard' : 'Get Started')}
            >
              {isAuthed ? 'Go to Dashboard' : 'Get Started'}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Button>
          </Link>
          <Link href="/assistant">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-primary/30 px-8 py-6 text-base font-semibold text-primary shadow-sm transition-all hover:border-primary hover:bg-primary/5"
              onClick={() => handleCTA('Use Our AI')}
            >
              Use Our AI
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">Medical disclaimer:</strong> SwasthPrameh
          offers educational guidance and lifestyle support. Always consult a certified medical
          professional before starting a new treatment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {trustBadges.map((badge) => (
          <div
            key={badge.name}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 p-3 shadow-sm backdrop-blur transition hover:border-primary/40"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
              <Image
                src={badge.image}
                alt={badge.alt}
                fill
                sizes="40px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{badge.name}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}


