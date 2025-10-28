'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function DashboardAIWidget({ userId, context }: { userId: string, context: any }) {
  const router = useRouter()

  const handleGetRecommendations = () => {
    // Route to /assistant and seed the session with context
    try {
      sessionStorage.setItem('assistant_seed', JSON.stringify({ userId, context }))
    } catch {}
    router.push('/assistant')
  }

  return (
    <Button 
      onClick={handleGetRecommendations}
      className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      Get AI Recommendations
    </Button>
  )
}


