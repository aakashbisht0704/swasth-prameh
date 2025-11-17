'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Heart, Brain, UtensilsCrossed, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'

const examplePrompts = [
  {
    icon: Heart,
    title: 'Feeling Anxious?',
    subtitle: 'Get calming Ayurvedic exercises',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Need Focus?',
    subtitle: 'Breathing techniques for clarity',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: UtensilsCrossed,
    title: 'Diet Questions?',
    subtitle: 'Ask about your Prakriti-based diet',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Activity,
    title: 'Lifestyle Tips?',
    subtitle: 'Get personalized recommendations',
    gradient: 'from-orange-500 to-red-500',
  },
]

type ChatHeroProps = {
  onPromptClick?: (prompt: string) => void
}

export function ChatHero({ onPromptClick }: ChatHeroProps) {
  const [animatedText, setAnimatedText] = useState('assist')

  useEffect(() => {
    const words = ['assist', 'help', 'guide', 'support']
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % words.length
      setAnimatedText(words[index])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4 sm:text-5xl">
          How can we{' '}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            {animatedText}
          </span>{' '}
          you today?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI tools for Ayurvedic health and diabetes management. Get personalized guidance based on your Prakriti.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl w-full">
        {examplePrompts.map((prompt, index) => {
          const Icon = prompt.icon
          return (
            <motion.div
              key={prompt.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer border-border/50 hover:shadow-lg transition-all overflow-hidden group"
                onClick={() => onPromptClick?.(prompt.title + '?')}
              >
                <div className={`h-32 bg-gradient-to-br ${prompt.gradient} flex items-center justify-center`}>
                  <Icon className="h-12 w-12 text-white opacity-90" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{prompt.title}</h3>
                  <p className="text-sm text-muted-foreground">{prompt.subtitle}</p>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

