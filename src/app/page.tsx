'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  return (
    <main className="flex min-h-screen bg-background">
      {/* Left Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
                SwasthPrameh
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                AI-Enhanced Ayurvedic Care
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Combining ancient wisdom with modern technology to provide personalized diabetes management through Prakriti assessment and AI-driven recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
          <Link href={user ? '/dashboard' : '/auth'}>
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    {user ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
          </Link>
                <Link href="/assistant">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-shadow bg-background">
                    Use Our AI
                  </Button>
          </Link>
        </div>
            </motion.div>
          </section>

          {/* Features Section */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SwasthaPrameh?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the perfect blend of traditional Ayurvedic wisdom and cutting-edge AI technology.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-xl mb-2">Prakriti Assessment</h3>
                <p className="text-muted-foreground text-sm">
                  Discover your unique Ayurvedic constitution through comprehensive evaluation
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-xl mb-2">AI Powered Plans</h3>
                <p className="text-muted-foreground text-sm">
                  Get personalized 15-day lifestyle plans tailored to your dosha and health goals
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-bold text-xl mb-2">Smart Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  Chat with our AI assistant for ongoing guidance and support
                </p>
              </motion.div>

              {/* Row 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-bold text-xl mb-2">Personalized Care Plans</h3>
                <p className="text-muted-foreground text-sm">
                  AI-driven Ayurvedic treatment recommendations based on your unique Prakriti and health profile
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-bold text-xl mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Monitor your health metrics and see the impact of your Ayurvedic treatment over time
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
              >
                <div className="text-4xl mb-3">👨‍⚕️</div>
                <h3 className="font-bold text-xl mb-2">Expert Support</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with Ayurvedic practitioners and receive ongoing guidance through our platform
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Footer */}
          {/* <footer className="py-8 border-t border-border text-sm text-muted-foreground">
            <p className="mb-4">
              Built with ❤️ for better diabetes care through Ayurveda. © 2025 SwasthPrameh.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Private Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </footer> */}
        </div>
      </div>

      {/* Right Sticky Illustration - Hidden on mobile */}
      <div className="hidden lg:block w-1/2 sticky top-0 h-screen overflow-hidden">
        <div className="h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-12">
          <div className="text-center max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-card rounded-2xl p-8 shadow-2xl border border-border"
            >
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-2xl font-bold text-primary mb-4">Modern Healthcare</h3>
              <p className="text-muted-foreground leading-relaxed">
                Combining traditional Ayurvedic wisdom with cutting-edge AI technology to deliver personalized diabetes care tailored to your unique constitution.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
