'use client'

import { Hero } from '@/components/landing/Hero'
import { Intro } from '@/components/landing/Intro'
import { About } from '@/components/landing/About'
import { Approach } from '@/components/landing/Approach'
import { Services } from '@/components/landing/Services'
import { PlanPreview } from '@/components/landing/PlanPreview'
import { Testimonials } from '@/components/landing/Testimonials'
import { Resources } from '@/components/landing/Resources'
import { FAQ } from '@/components/landing/FAQ'
import { Contact } from '@/components/landing/Contact'

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Intro />
      <About />
      <Approach />
      <Services />
      <PlanPreview />
      <Testimonials />
      <Resources />
      <FAQ />
      <Contact />
    </main>
  )
}
