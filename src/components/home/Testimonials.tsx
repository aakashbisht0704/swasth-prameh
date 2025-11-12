'use client'

import { motion } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Dr. Asha Menon',
    role: 'Ayurveda Resident, Govt. Ayurveda College',
    quote: '“SwasthPrameh bridges classical practice and modern analytics. It helped us triage patients who needed immediate interventions.”',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Ravi Sharma',
    role: 'Type-2 Diabetes Patient, Pilot Cohort',
    quote: '“The 15-day plan felt personal. Reminders and voice notes kept me on track even during late shifts.”',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
  },
  {
    name: 'Anjali Patel',
    role: 'Community Health Worker',
    quote: '“Offline logging is a game changer. I can sync data later and still feel supported by the AI assistant.”',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=256&q=80',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="section-spacing container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Voices from our pilot cohorts
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Students, clinicians, and patients collaborated to stress test every flow.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => {
          const initials = testimonial.name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')
            .slice(0, 2)

          return (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full border-border/50 bg-card/90 shadow-md">
                <CardContent className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={testimonial.image}
                        alt={`${testimonial.name} portrait`}
                        loading="lazy"
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{testimonial.quote}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}


