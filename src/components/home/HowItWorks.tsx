'use client'

import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ClipboardCheck, Sparkles, Workflow } from 'lucide-react'

const steps = [
  {
    title: 'Onboard in Minutes',
    description: 'Sign up or get invited by your clinic. CHWs can register patients offline.',
    icon: ClipboardCheck,
  },
  {
    title: 'Prakriti + Lifestyle Assessment',
    description: 'Guided questionnaire captures dosha, symptoms, habits, and goals.',
    icon: Workflow,
  },
  {
    title: 'ML + LLM Decision Layer',
    description: 'Models blend Prakriti scores with vitals to craft a personalized plan.',
    icon: Sparkles,
  },
  {
    title: 'Receive 15-Day Plan',
    description: 'Daily meals, yoga, and reminders delivered via app, SMS, and printable PDF.',
    icon: ArrowRight,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-spacing bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How SwasthPrameh works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A guided four-step journey from onboarding to actionable daily plans.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full border-border/50 bg-card/95 shadow-sm">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="text-xl font-semibold text-foreground">{`0${index + 1}. ${step.title}`}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {index === steps.length - 1 && (
                    <a
                      href="/onboarding"
                      className="text-sm font-semibold text-primary hover:text-primary/80"
                    >
                      Start onboarding →
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


