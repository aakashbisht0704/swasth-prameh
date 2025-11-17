'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Video, HelpCircle, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const articles = [
  {
    title: 'Understanding Prakriti: Your Ayurvedic Constitution',
    description: 'Learn how your unique Prakriti influences your health and how we use it to personalize your diabetes management plan.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    type: 'article',
  },
  {
    title: 'Ayurvedic Diet Principles for Diabetes',
    description: 'Discover the fundamental principles of Ayurvedic nutrition and how they apply to managing Prameh (diabetes).',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    type: 'article',
  },
  {
    title: 'Yoga and Lifestyle for Diabetes Management',
    description: 'Explore yoga poses and lifestyle practices that complement your Ayurvedic treatment plan.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    type: 'video',
  },
]

const faqs = [
  {
    question: 'How does Prakriti assessment work?',
    answer: 'Our AI analyzes your responses to health questions, lifestyle habits, and physical characteristics to determine your unique Ayurvedic constitution.',
  },
  {
    question: 'Are the plans reviewed by doctors?',
    answer: 'Yes, all personalized plans are reviewed and approved by certified Ayurvedic practitioners before being delivered to you.',
  },
  {
    question: 'How often are plans updated?',
    answer: 'Plans are updated based on your progress, health metrics, and feedback. Typically, adjustments are made every 15 days or as needed.',
  },
]

export function Resources() {
  return (
    <section id="resources" className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ayurvedic Insights for Prameh Management
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Explore our resources to learn more about Ayurvedic approaches to diabetes management.
          </p>
        </motion.div>

        {/* Articles & Videos */}
        <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    {item.type === 'video' ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Video className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/resources" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </h3>
            <Link href="/resources">
              <Button variant="outline" className="rounded-xl">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{faq.answer}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

