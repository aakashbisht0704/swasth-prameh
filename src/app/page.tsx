'use client'

import { Hero } from '@/components/landing/Hero'
import { About } from '@/components/landing/About'
import { Team } from '@/components/landing/Team'
import { Services } from '@/components/landing/Services'
import { Testimonials } from '@/components/landing/Testimonials'
import { FAQ } from '@/components/landing/FAQ'
import { Contact } from '@/components/landing/Contact'

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <About />
      <Team />
      <Services />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  )
}
