'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Team', href: '#team' },
  { label: 'Testimonials', href: '#testimonials' },
]

const moreDropdownLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Contact Us', href: '#contact' },
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
  const [isScrolled, setIsScrolled] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert('Error signing out: ' + error.message)
      } else {
        window.location.href = '/auth'
      }
    } catch (error) {
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

  const [isMoreHovered, setIsMoreHovered] = useState(false)

  if (isAuthPage) return null

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-border/60 bg-background/95 backdrop-blur-md shadow-sm' 
        : 'border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'
    }`}>
      <div className="container flex h-24 items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
            <Image
              src="/logoSP.png"
              alt="SwasthPrameh logo"
            width={80}
            height={80}
              className="object-contain"
              priority
            />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    const element = document.getElementById(link.href.slice(1))
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                {link.label}
              </a>
          ))}
          
          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsMoreHovered(true)}
            onMouseLeave={() => setIsMoreHovered(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-primary">
              More
              <ChevronDown className={`h-4 w-4 transition-transform ${isMoreHovered ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isMoreHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-border/60 bg-background/95 backdrop-blur-md shadow-lg py-2"
                >
                  {moreDropdownLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault()
                          const element = document.getElementById(link.href.slice(1))
                          element?.scrollIntoView({ behavior: 'smooth' })
                        }
                        setIsMoreHovered(false)
                      }}
                      className="block px-4 py-2 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SGT Ayurveda Hospital Link */}
          <a
            href="https://sgtuniversity.ac.in/ims/hospital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            SGT Ayurveda Hospital
          </a>
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
              {isAuthed ? 'Dashboard' : 'Get Your Personalized Plan'}
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
                    onClick={(e) => {
                      if (link.href.startsWith('#')) {
                        e.preventDefault()
                        const element = document.getElementById(link.href.slice(1))
                        element?.scrollIntoView({ behavior: 'smooth' })
                      }
                      setIsMenuOpen(false)
                    }}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    {link.label}
                  </a>
              ))}
              
              {/* More Dropdown in Mobile */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">More</div>
                <div className="flex flex-col gap-1 pl-4">
                  {moreDropdownLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault()
                          const element = document.getElementById(link.href.slice(1))
                          element?.scrollIntoView({ behavior: 'smooth' })
                        }
                        setIsMenuOpen(false)
                      }}
                      className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* SGT Ayurveda Hospital Link in Mobile */}
              <a
                href="https://sgtuniversity.ac.in/ims/hospital"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
              >
                SGT Ayurveda Hospital
              </a>
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
                    {isAuthed ? 'Dashboard' : 'Get Your Personalized Plan'}
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