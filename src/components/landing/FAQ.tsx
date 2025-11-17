'use client'

import { motion } from 'motion/react'
import { HelpCircle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqs } from '@/content/faq'

export function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Find answers to common questions about SwasthPrameh and our approach to Ayurvedic diabetes management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 rounded-xl px-6 data-[state=open]:bg-primary/5"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-muted/50 border border-border/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Medical Disclaimer:</strong> SwasthPrameh is not a medical device and does not replace professional medical care. 
              Our platform provides lifestyle recommendations based on Ayurvedic principles. Always consult with your healthcare provider 
              before making significant changes to your diet or lifestyle, especially if you are on medication.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

