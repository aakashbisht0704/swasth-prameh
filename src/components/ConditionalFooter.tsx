'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide footer on assistant and dashboard pages
  if (pathname === '/assistant' || pathname === '/dashboard') {
    return null
  }
  
  return <Footer />
}

