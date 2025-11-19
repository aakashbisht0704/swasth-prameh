'use client'

import { motion } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Sparkles, Heart, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

const examplePrompts = [
  {
    icon: Sparkles,
    text: 'What is Prakriti and how does it affect diabetes management?',
    color: 'text-purple-500',
  },
  {
    icon: Heart,
    text: 'What are the best Ayurvedic practices for managing blood sugar?',
    color: 'text-pink-500',
  },
  {
    icon: UtensilsCrossed,
    text: 'Can you suggest a diet plan for Vata dosha with diabetes?',
    color: 'text-green-500',
  },
]

type EmptyStateProps = {
  onPromptClick: (prompt: string) => void
}

export function EmptyState({ onPromptClick }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-foreground mb-3 sm:text-4xl">
          Welcome to SwasthPrameh Assistant
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Ask anything related to Ayurvedic Diabetes Management. Get personalized guidance based on your Prakriti.
        </p>

        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3 mt-8">
          {examplePrompts.map((prompt, index) => {
            const Icon = prompt.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-md transition-all p-4 h-full"
                  onClick={() => onPromptClick(prompt.text)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', prompt.color)} />
                    <p className="text-sm text-foreground leading-relaxed">
                      {prompt.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

