'use client'

import { motion } from 'motion/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const demoDays = [
  {
    id: 'day-1',
    title: 'Day 1 • Grounding Start',
    meals: {
      breakfast: 'Moong dal chilla + tulsi infused water',
      lunch: 'Millet khichdi with lightly sautéed vegetables',
      dinner: 'Jeera rice with lauki curry and warm golden milk',
    },
    tips: ['5 min breathing before meals', '15 min evening walk', 'Hydration reminder'],
  },
  {
    id: 'day-7',
    title: 'Day 7 • Mobility Reset',
    meals: {
      breakfast: 'Steamed idli with coconut chutney',
      lunch: 'Brown rice with moringa dal & salad',
      dinner: 'Veg stew with whole wheat phulka',
    },
    tips: ['Morning Surya Namaskar x6', 'Pranayama Bhramari 7 min', 'Log fasting glucose'],
  },
  {
    id: 'day-12',
    title: 'Day 12 • Detox Focus',
    meals: {
      breakfast: 'Warm barley porridge with almonds',
      lunch: 'Quinoa upma with sprouts & herbs',
      dinner: 'Pumpkin soup with methi thepla',
    },
    tips: ['Ayurvedic herbal tea post dinner', 'Yoga Nidra audio 10 min', 'Journal mood & cravings'],
  },
]

export function SamplePlan() {
  return (
    <section id="sample-plan" className="section-spacing bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore the 15-day adaptive plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Each day blends Ayurvedic diet principles, guided movement, and mindful rituals. AI
            adjusts the plan using your feedback, glucose logs, and CHW notes.
          </p>
          <Accordion type="single" collapsible className="mt-2 divide-y divide-border/40 rounded-2xl border border-border/50 bg-card/95 shadow-sm">
            {demoDays.map((day) => (
              <AccordionItem key={day.id} value={day.id}>
                <AccordionTrigger className="text-base font-semibold text-foreground">
                  {day.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Meals
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        <li>
                          <strong className="text-foreground">Breakfast:</strong> {day.meals.breakfast}
                        </li>
                        <li>
                          <strong className="text-foreground">Lunch:</strong> {day.meals.lunch}
                        </li>
                        <li>
                          <strong className="text-foreground">Dinner:</strong> {day.meals.dinner}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Daily rituals
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {day.tips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2">
                            <span aria-hidden className="mt-1 text-primary">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="sticky top-28 border-primary/20 bg-card/90 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Ready for the full experience?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
              <p>
                Download a sample 15-day PDF or jump into the live dashboard to explore interactive
                plan adjustments, reminders, and AI suggestions.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild className="rounded-xl">
                  <a href="/docs/sample-plan.pdf" target="_blank" rel="noopener noreferrer">
                    View full plan (PDF)
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-primary/40 text-primary hover:bg-primary/10">
                  <a href="/dashboard">Open demo dashboard</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                TODO: Replace the sample PDF link with the production onboarding plan once finalized.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}


