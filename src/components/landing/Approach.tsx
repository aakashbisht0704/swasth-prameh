'use client'

import { motion } from 'motion/react'
import { FileText, Database, Sparkles, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { approachSteps, comparison } from '@/content/approach'

const stepIcons = [FileText, Database, Sparkles, TrendingUp]

export function Approach() {
  return (
    <section id="approach" className="py-20 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Our Approach
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            How our Prakriti-based algorithm works to deliver personalized diabetes management plans
            tailored to your unique constitution.
          </p>
        </motion.div>

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
                    <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
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
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Ayurvedic Personalization vs Generic Diabetic Diet
          </h3>
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
      </div>
    </section>
  )
}

