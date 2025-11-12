'use client'

import Image from 'next/image'
import { motion } from 'motion/react'

const bulletPoints = [
  'Co-created with Ayurvedic physicians and endocrinologists.',
  'Built for semi-urban clinics with intermittent connectivity.',
  'Delivers actionable dashboards for clinicians and community health workers.',
]

export function AboutUs() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-spacing bg-gradient-to-br from-background via-background to-primary/5"
    >
      <div className="container grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          <h2 id="about-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why we built SwasthPrameh
          </h2>
          <p className="text-lg text-muted-foreground">
            We are a student-led health tech collective partnering with community clinics to make
            preventive diabetes care accessible, culturally resonant, and data-driven.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            {bulletPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-base">
                <span aria-hidden className="mt-1 text-primary">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative aspect-square overflow-hidden rounded-3xl border border-border/40 bg-card shadow-xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1587502536595-4e9695d6f3a1?auto=format&fit=crop&w=900&q=80"
            alt="Community health workers collaborating with doctors on digital tablets."
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  )
}


