'use client'

import { motion } from 'motion/react'
import { Sparkles, Activity, Utensils, BarChart, AlertCircle, TrendingUp, Users2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { intro } from '@/content/intro'

const usps = [
  {
    icon: Sparkles,
    title: 'Prakriti Analysis',
    description: 'Understand your body type',
  },
  {
    icon: Activity,
    title: 'Smart Data Integration',
    description: 'Sync vitals',
  },
  {
    icon: Utensils,
    title: 'Lifestyle & Diet Guidance',
    description: 'Personalized Ayurvedic recommendations.',
  },
  {
    icon: BarChart,
    title: 'Progress Dashboard',
    description: 'Track your wellness journey visually',
  },
]

export function Intro() {
  return (
    <section id="intro" className="py-20 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {intro.title}
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            {intro.mission}
          </p>
        </motion.div>

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            {intro.problem.title}
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {intro.problem.points.map((point, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{point.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{point.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((usp, index) => {
            const Icon = usp.icon
            return (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{usp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{usp.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

