'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Plan Demo', href: '#sample-plan' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full border border-border/60"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden />
    </Button>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/auth'
  const [isAuthed, setIsAuthed] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (mounted) setIsAuthed(!!user)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        alert('Error signing out: ' + error.message)
      } else {
        window.location.href = '/auth'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Error signing out')
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10">
            <Image
              src="/logo.png"
              alt="SwasthPrameh logo"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            SwasthPrameh
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <Link href="/assistant" className="text-sm font-medium text-muted-foreground transition hover:text-primary">
            AI Assistant
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {isAuthed ? (
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="rounded-full">
                Sign in
              </Button>
            </Link>
          )}
          <Link href={isAuthed ? '/dashboard' : '/auth'}>
            <Button size="sm" className="rounded-full bg-primary px-5 font-semibold">
              {isAuthed ? 'Dashboard' : 'Get Started'}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-border/60"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="border-t border-border/60 bg-background/95 px-4 pb-6 pt-4 shadow-lg lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/assistant"
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Assistant
              </Link>
              <div className="mt-2 flex flex-col gap-2">
                {isAuthed ? (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleSignOut()
                    }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-full">Sign in</Button>
                  </Link>
                )}
                <Link href={isAuthed ? '/dashboard' : '/auth'} onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-full bg-primary font-semibold">
                    {isAuthed ? 'Dashboard' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}