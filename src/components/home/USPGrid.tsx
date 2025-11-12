'use client'

import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BrainCircuit,
  CloudLightning,
  Stethoscope,
  LineChart,
  ShieldCheck,
  Users,
} from 'lucide-react'

const features = [
  {
    title: 'Prakriti + ML Engine',
    description: 'Hybrid diagnostics combine classical Tridosha assessment with modern machine learning.',
    icon: BrainCircuit,
  },
  {
    title: 'Bilingual Experience',
    description: 'Supports English and regional languages with culturally-aware copy and voice notes.',
    icon: Users,
  },
  {
    title: 'Offline-first Capture',
    description: 'Progressive web app syncs glucose logs and surveys when connectivity returns.',
    icon: CloudLightning,
  },
  {
    title: 'Clinical Oversight',
    description: 'Doctor dashboards flag anomalies, adherence risks, and escalate urgent cases.',
    icon: Stethoscope,
  },
  {
    title: 'Outcome Analytics',
    description: 'Track fasting glucose, HbA1c, lifestyle adherence, and sentiment in one view.',
    icon: LineChart,
  },
  {
    title: 'Privacy by Design',
    description: 'Secure storage with role-based access aligned with NDHM and HIPAA guidelines.',
    icon: ShieldCheck,
  },
]

export function USPGrid() {
  return (
    <section id="features" className="section-spacing container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our unique differentiators
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          SwasthPrameh is engineered to deliver clinically meaningful outcomes while respecting
          Ayurvedic principles and the realities of community healthcare.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="h-full border-border/60 bg-card/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="h-10 w-10 rounded-full bg-primary/10 p-2 text-primary" aria-hidden />
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}


