'use client'

import { motion } from 'motion/react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Kapil Sharma',
    image: '/Kapil.jpg',
    rating: 5,
    quote: 'SwasthaPrameh helped me understand my Prakriti and manage my sugar levels with simple daily guidance. Feels truly personalized.',
  },
  {
    name: 'Mukta Sharma',
    image: '/Mukta.jpg',
    rating: 5,
    quote: 'The diet and lifestyle tips are easy to follow. I finally feel in control of my diabetes journey.',
  },
  {
    name: 'Arun Jain',
    image: '',
    rating: 5,
    quote: 'I\'m not diabetic, but the Prakriti test and lifestyle tips were incredibly insightful. The platform feels genuinely helpful.',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Real stories from people who have transformed their health with SwasthPrameh.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="mb-4 h-8 w-8 text-primary/20" />
                  <p className="mb-6 text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {testimonial.image && (
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      )}
                      <AvatarFallback>
                        {testimonial.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

