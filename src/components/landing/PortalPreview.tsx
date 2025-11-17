'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, LayoutDashboard, Smartphone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function PortalPreview() {
  return (
    <section id="portal" className="py-20 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Your Personal Health Portal
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Log in to access your personalized plan, track progress, and book consultations—all in one place.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left - Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Personalized Dashboard</h3>
                  <p className="text-muted-foreground">
                    View your customized diet plan, lifestyle recommendations, and health metrics all in one place.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Mobile-Friendly</h3>
                  <p className="text-muted-foreground">
                    Access your plan and log meals on the go with our responsive mobile interface.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Book Consultations</h3>
                  <p className="text-muted-foreground">
                    Schedule appointments with our Ayurvedic doctors directly from your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto rounded-xl px-8">
                Access Your Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Right - Screenshots */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative space-y-4">
              {/* Desktop Preview */}
              <Card className="border-border/50 overflow-hidden p-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                    alt="Dashboard preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <p className="text-sm text-muted-foreground">Dashboard Preview</p>
                  </div>
                </div>
              </Card>

              {/* Mobile Preview */}
              <div className="flex justify-end">
                <Card className="w-48 border-border/50 overflow-hidden p-2">
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"
                      alt="Mobile dashboard preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <p className="text-xs text-muted-foreground">Mobile View</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

