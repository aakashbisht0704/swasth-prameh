'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { UtensilsCrossed, Calendar, Phone, Video, FileText, Activity, Heart, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const dietPlanFeatures = [
  { icon: FileText, text: 'Prakriti assessment' },
  { icon: UtensilsCrossed, text: 'Customized diet chart' },
  { icon: Activity, text: 'Lifestyle + yoga recommendations' },
  { icon: Calendar, text: '15-day & ongoing plans' },
  { icon: Heart, text: 'Regular follow-ups' },
  { icon: Activity, text: 'Monitoring and updates' },
]

const consultationFeatures = [
  { icon: Video, text: 'Online Ayurvedic doctor consultations' },
  { icon: Phone, text: 'Phone/Facetime consultation' },
  { icon: Calendar, text: 'Flexible scheduling' },
  { icon: Heart, text: 'Personalized health guidance' },
]

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Comprehensive Ayurvedic solutions for diabetes management tailored to your unique needs.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Personalized Diet & Lifestyle Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-border/50 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80"
                  alt="Personalized diet and lifestyle plan"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Personalized Diet & Lifestyle Plan</CardTitle>
                <CardDescription className="text-base">
                  Get a comprehensive 15-day plan designed specifically for your Prakriti and health goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {dietPlanFeatures.map((feature, idx) => {
                    const Icon = feature.icon
                    return (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-muted-foreground">{feature.text}</span>
                      </li>
                    )
                  })}
                </ul>
                <Link href="/auth" className="block pt-4">
                  <Button className="w-full rounded-xl" size="lg">
                    Get Your Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Consultation Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full border-border/50 hover:shadow-xl transition-shadow overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80"
                  alt="Ayurvedic consultation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Consultation Services</CardTitle>
                <CardDescription className="text-base">
                  Connect with certified Ayurvedic doctors for personalized guidance and support.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {consultationFeatures.map((feature, idx) => {
                    const Icon = feature.icon
                    return (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-muted-foreground">{feature.text}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="space-y-2 pt-4">
                  <Link href="/dashboard" className="block">
                    <Button className="w-full rounded-xl" size="lg" variant="outline">
                      Book a Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="block">
                    <Button className="w-full rounded-xl" size="lg">
                      Payment & Booking Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

