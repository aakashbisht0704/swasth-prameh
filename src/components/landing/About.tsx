'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { Sparkles, Activity, Utensils, BarChart, FileText, Database, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { intro } from '@/content/intro'
import { approachSteps, comparison } from '@/content/approach'
import { mission, vision } from '@/content/team'

const stepIcons = [FileText, Database, Sparkles, TrendingUp]

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

export function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-to-b from-background to-primary/5">
      <div className="container">
        {/* About Us Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            About Us
          </h2>
        </motion.div>

        {/* What is SwasthPrameh Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full mb-16 py-16 overflow-hidden"
        >
          {/* Background Image - Full Width */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/WISP.jpg"
              alt="SwasthPrameh background"
              fill
              className="object-cover object-bottom"
              quality={90}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Content - Centered */}
          <div className="relative z-10 container mx-auto max-w-3xl text-center space-y-4 px-4">
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {intro.title}
            </h3>
            <p className="text-lg text-white/90 sm:text-xl">
              {intro.mission}
            </p>
          </div>
        </motion.div>

        {/* Why We Built This */}
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

        {/* 4 USP Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
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

        {/* Our Mission & Vision */}
        <div className="grid gap-6 mb-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{mission.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">{mission.content}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{vision.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">{vision.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Our Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-left text-foreground mb-12 sm:text-4xl lg:text-5xl">
            Our Approach
          </h3>

          {/* Step-by-Step Process */}
          <div className="space-y-8 mb-20">
            {approachSteps.map((step, index) => {
              const Icon = stepIcons[index] || FileText
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-4">
                      <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                      <h4 className="text-2xl font-bold text-foreground">{step.title}</h4>
                    </div>
                    <p className="text-lg text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Comparison Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h4 className="text-2xl font-bold text-center text-foreground mb-8">
              Ayurvedic Personalization vs Generic Diabetic Diet
            </h4>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                    {comparison.ayurvedic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {comparison.ayurvedic.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    {comparison.generic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {comparison.generic.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

