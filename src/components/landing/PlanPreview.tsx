'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import Link from 'next/link'
import { Calendar, UtensilsCrossed, Sun, Moon, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import samplePlan from '@/content/sample-plan.json'

export function PlanPreview() {
  const [selectedDay, setSelectedDay] = useState(1)

  const selectedDayData = samplePlan.days.find(d => d.day === selectedDay) || samplePlan.days[0]

  return (
    <section id="plan-preview" className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            15-Day Sample Plan
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            {samplePlan.summary}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Day Selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">Select a Day</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {samplePlan.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedDay === day.day
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`h-5 w-5 ${selectedDay === day.day ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium ${selectedDay === day.day ? 'text-primary' : 'text-foreground'}`}>
                      Day {day.day}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Day Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Day {selectedDayData.day} Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Morning */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg text-foreground">Morning Routine</h4>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedDayData.morning}</p>
                </div>

                {/* Meals */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg text-foreground">Meals</h4>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedDayData.meals}</p>
                </div>

                {/* Evening */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-lg text-foreground">Evening Routine</h4>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">{selectedDayData.evening}</p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="mt-6 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {samplePlan.notes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="mt-8">
              <Link href="/onboarding">
                <Button size="lg" className="w-full rounded-xl">
                  Generate Your Personalized Plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

