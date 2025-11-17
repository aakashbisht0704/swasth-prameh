'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { LayoutDashboard, UtensilsCrossed, Activity, User } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'assistant', label: 'Assistant', href: '/assistant', icon: Activity },
  { id: 'plans', label: 'Plans', href: '/dashboard', icon: UtensilsCrossed },
  { id: 'profile', label: 'Profile', href: '/dashboard', icon: User },
]

export function TopNavigationTabs() {
  const pathname = usePathname()
  const router = useRouter()
  const activeTab = tabs.find(tab => pathname.startsWith(tab.href)) || tabs[0]

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="relative flex items-center gap-2 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab.id === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'text-gray-900 bg-zinc-100'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-zinc-100 -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

