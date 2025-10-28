'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

interface NavItemProps {
  href: string
  children: React.ReactNode
}

const NavItem = ({ href, children }: NavItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full"
      >
        {children}
      </Button>
    </Link>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/auth'
  const [isAuthed, setIsAuthed] = useState(false)

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
        // Redirect to auth page after successful sign out
        window.location.href = '/auth'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Error signing out')
    }
  }

  if (isAuthPage) return null

  return (
    <header className="flex justify-center mx-auto sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg md:text-xl">SwasthPrameh</span>
        </Link>
        
        <nav className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
            <NavItem href="/dashboard">Dashboard</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </div>
          {isAuthed ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs md:text-sm">
              Sign Out
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}