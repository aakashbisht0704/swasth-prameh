'use client'

import { motion } from 'motion/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Is SwasthPrameh a replacement for medical advice?',
    answer: 'No. SwasthPrameh is an educational and monitoring platform. It augments consultations but does not replace certified medical care. Always consult your physician before making treatment decisions.',
  },
  {
    question: 'How accurate are the AI-generated plans?',
    answer: 'Plans combine validated Ayurvedic protocols with machine learning insights. They are reviewed by clinicians during pilot cohorts. Accuracy improves as you log meals, vitals, and feedback.',
  },
  {
    question: 'What happens to my data?',
    answer: 'Data is encrypted in transit and at rest. Only authorized care teams can view identifiable information. We follow NDHM guidelines and anonymize analytics for research.',
  },
  {
    question: 'Can I use the platform offline?',
    answer: 'Yes. Community health workers can enter data offline using the progressive web app. Once a connection is available, the data syncs automatically.',
  },
  {
    question: 'Do you integrate with glucometers?',
    answer: 'We currently support BLE-enabled glucometers with plans to expand device coverage. Manual entry remains available for unsupported devices.',
  },
  {
    question: 'How do I contact the team?',
    answer: 'Email hello@swasthprameh.ai or reach us via the in-app chat widget. We aim to respond within 24 hours on business days.',
  },
  {
    question: 'What is the pricing model?',
    answer: 'The student pilot is free. We plan to move to a subscription model for clinics with subsidized pricing for community deployments.',
  },
  {
    question: 'How do I report an issue or provide feedback?',
    answer: 'Use the dashboard feedback form or message us on the contact page. Critical issues can be escalated via the hotline shown in the onboarding email.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="section-spacing bg-background">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Still curious? Explore common concerns around privacy, accuracy, and onboarding.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="divide-y divide-border/50 rounded-2xl border border-border/60 bg-card/95 shadow-sm">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-base font-semibold text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}


