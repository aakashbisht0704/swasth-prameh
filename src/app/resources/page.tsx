'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Video, HelpCircle, ArrowLeft, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const articles = [
  {
    id: 1,
    title: 'Understanding Prakriti: Your Ayurvedic Constitution',
    description: 'Learn how your unique Prakriti influences your health and how we use it to personalize your diabetes management plan.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    type: 'article',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Ayurveda Basics',
  },
  {
    id: 2,
    title: 'Ayurvedic Diet Principles for Diabetes',
    description: 'Discover the fundamental principles of Ayurvedic nutrition and how they apply to managing Prameh (diabetes).',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    type: 'article',
    date: 'March 10, 2024',
    readTime: '7 min read',
    category: 'Nutrition',
  },
  {
    id: 3,
    title: 'Yoga and Lifestyle for Diabetes Management',
    description: 'Explore yoga poses and lifestyle practices that complement your Ayurvedic treatment plan.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    type: 'video',
    date: 'March 5, 2024',
    readTime: '12 min watch',
    category: 'Lifestyle',
  },
  {
    id: 4,
    title: 'The Science Behind Ayurvedic Diabetes Management',
    description: 'Understanding how traditional Ayurvedic principles align with modern medical research in diabetes care.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    type: 'article',
    date: 'February 28, 2024',
    readTime: '8 min read',
    category: 'Research',
  },
  {
    id: 5,
    title: 'Seasonal Adjustments in Your Diabetes Plan',
    description: 'Learn how to adapt your diet and lifestyle according to seasonal changes for optimal health.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    type: 'article',
    date: 'February 20, 2024',
    readTime: '6 min read',
    category: 'Lifestyle',
  },
  {
    id: 6,
    title: 'Ashtvidha Pariksha: The Eight-Fold Examination',
    description: 'A deep dive into the traditional Ayurvedic diagnostic method used in our assessment process.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80',
    type: 'article',
    date: 'February 15, 2024',
    readTime: '10 min read',
    category: 'Ayurveda Basics',
  },
]

const faqs = [
  {
    question: 'How does Prakriti assessment work?',
    answer: 'Our AI analyzes your responses to health questions, lifestyle habits, and physical characteristics to determine your unique Ayurvedic constitution (Prakriti). This includes assessing your dominant dosha (Vata, Pitta, or Kapha) and creating a personalized profile that guides all recommendations.',
  },
  {
    question: 'Are the plans reviewed by doctors?',
    answer: 'Yes, all personalized plans are reviewed and approved by certified Ayurvedic practitioners before being delivered to you. Our team of BAMS and MD (Ayurveda) doctors ensures that every recommendation aligns with both traditional Ayurvedic principles and modern health standards.',
  },
  {
    question: 'How often are plans updated?',
    answer: 'Plans are updated based on your progress, health metrics, and feedback. Typically, adjustments are made every 15 days or as needed. You can also request plan updates through your dashboard if your health status changes significantly.',
  },
  {
    question: 'Can I use this alongside my current diabetes medication?',
    answer: 'SwasthPrameh is designed to complement your existing treatment plan. However, you should always consult with your primary healthcare provider before making significant changes to your diet or lifestyle, especially if you are on medication. Our Ayurvedic doctors can work with your medical team to create a holistic approach.',
  },
  {
    question: 'What makes Ayurvedic diabetes management different?',
    answer: 'Ayurvedic diabetes management focuses on your unique constitution (Prakriti), considers the whole person (body, mind, and spirit), and emphasizes prevention and lifestyle modifications. Unlike generic diabetic diets, our approach is personalized to your dosha, seasonal changes, and individual health goals.',
  },
  {
    question: 'How do I book a consultation?',
    answer: 'You can book a consultation directly through your patient portal dashboard. We offer online video consultations and phone consultations with our certified Ayurvedic doctors. Simply log in to your account and navigate to the "Book Consultation" section.',
  },
  {
    question: 'Is SwasthPrameh suitable for Type 1 diabetes?',
    answer: 'While our platform is primarily designed for Type 2 diabetes and pre-diabetes management, many Type 1 diabetes patients find value in our lifestyle and dietary recommendations. However, Type 1 diabetes requires insulin management, so our plans should be used as a complementary approach alongside your medical treatment.',
  },
  {
    question: 'What information do I need to provide during onboarding?',
    answer: 'During onboarding, you\'ll complete a comprehensive questionnaire covering your medical history, current symptoms, lifestyle habits, dietary preferences, and physical characteristics. This information helps us determine your Prakriti and create a personalized plan tailored to your needs.',
  },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Resources & Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our collection of articles, videos, and frequently asked questions about Ayurvedic diabetes management.
          </p>
        </motion.div>

        {/* Articles & Videos */}
        <section id="articles" className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Articles & Videos
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow overflow-hidden group">
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      {article.type === 'video' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Video className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full rounded-xl">
                      {article.type === 'video' ? 'Watch Now' : 'Read More'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="mb-20">
          <div className="mb-8 flex items-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border/50 rounded-xl px-6 data-[state=open]:bg-primary/5"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-base">
                Get your personalized Ayurvedic diabetes management plan today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/auth">
                <Button size="lg" className="rounded-xl px-8">
                  Get Your Personalized Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </main>
  )
}

