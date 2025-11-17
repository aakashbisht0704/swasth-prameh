'use client'

import { motion } from 'motion/react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Type 2 Diabetes Patient',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    quote: 'The personalized diet plan based on my Prakriti has been life-changing. My blood sugar levels are more stable, and I feel more energetic than ever.',
  },
  {
    name: 'Priya Sharma',
    role: 'Pre-diabetic',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    quote: 'The AI-powered recommendations combined with doctor oversight gave me confidence in my health journey. The 15-day plan was easy to follow and effective.',
  },
  {
    name: 'Amit Patel',
    role: 'Type 2 Diabetes Patient',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    quote: 'Finally, a diabetes management approach that considers my whole being, not just my blood sugar. The lifestyle recommendations have made a huge difference.',
  },
  {
    name: 'Sunita Devi',
    role: 'Type 1 Diabetes Patient',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    quote: 'The continuous monitoring and plan adjustments based on my progress show that this platform truly cares about my long-term health.',
  },
  {
    name: 'Vikram Singh',
    role: 'Type 2 Diabetes Patient',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    quote: 'The combination of Ayurvedic wisdom and modern technology is exactly what I needed. My doctor is impressed with my progress.',
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
            What Our Patients Say
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
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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

