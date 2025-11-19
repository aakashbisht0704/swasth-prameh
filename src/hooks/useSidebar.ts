import { useState, useEffect, useCallback } from 'react'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      // On mobile, sidebar starts closed
      if (mobile) {
        setIsOpen(false)
      } else {
        // On desktop, restore from localStorage or default to open
        const saved = localStorage.getItem('sidebar_open')
        if (saved !== null) {
          setIsOpen(saved === 'true')
        }
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const newValue = !prev
      if (!isMobile) {
        localStorage.setItem('sidebar_open', String(newValue))
      }
      return newValue
    })
  }, [isMobile])

  const open = useCallback(() => {
    setIsOpen(true)
    if (!isMobile) {
      localStorage.setItem('sidebar_open', 'true')
    }
  }, [isMobile])

  const close = useCallback(() => {
    setIsOpen(false)
    if (!isMobile) {
      localStorage.setItem('sidebar_open', 'false')
    }
  }, [isMobile])

  return {
    isOpen,
    isMobile,
    toggle,
    open,
    close,
  }
}

