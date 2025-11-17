'use client'

import { motion } from 'motion/react'
import { Sparkles, Heart, Brain, Users, AlertCircle, TrendingUp, Users2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { intro } from '@/content/intro'

const usps = [
  {
    icon: Sparkles,
    title: 'Personalized Prakriti Analysis',
    description: 'Discover your unique Ayurvedic constitution through comprehensive assessment and get plans tailored to your dosha.',
  },
  {
    icon: Brain,
    title: 'AI-Assisted Personalization',
    description: 'Advanced AI technology analyzes your health data to create truly personalized recommendations.',
  },
  {
    icon: Users,
    title: 'Doctor-Reviewed Plans',
    description: 'All plans are reviewed and approved by certified Ayurvedic practitioners before delivery.',
  },
  {
    icon: Heart,
    title: '15-Day Plans + Tracking',
    description: 'Receive customized 15-day plans with continuous monitoring and updates based on your progress.',
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

        {/* Prakriti Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-foreground mb-4">
            {intro.prakriti.title}
          </h3>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            {intro.prakriti.description}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {intro.prakriti.doshas.map((dosha, index) => (
              <Card key={index} className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{dosha.name}</CardTitle>
                  <CardDescription className="text-sm font-medium">{dosha.elements}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{dosha.characteristics}</p>
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

