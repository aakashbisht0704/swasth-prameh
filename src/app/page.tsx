'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { HeroText } from '@/components/home/HeroText'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { AboutUs } from '@/components/home/AboutUs'
import { USPGrid } from '@/components/home/USPGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { SamplePlan } from '@/components/home/SamplePlan'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQ } from '@/components/home/FAQ'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    init()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <main className="bg-background text-foreground">
      <section
        id="hero"
        className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-background via-primary/5 to-background pb-12 pt-20 sm:pb-16 sm:pt-24"
        aria-labelledby="hero-heading"
      >
        <div className="container grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <HeroText isAuthed={!!user} />
          <div className="hidden lg:block lg:sticky lg:top-28">
            <HeroCarousel />
          </div>
        </div>
        <div className="mt-10 px-4 lg:hidden">
          <HeroCarousel />
        </div>
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden />
      </section>

      <AboutUs />
      <USPGrid />
      <HowItWorks />
      <SamplePlan />
      <Testimonials />
      <FAQ />
    </main>
  )
}
