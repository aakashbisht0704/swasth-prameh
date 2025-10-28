import { OnboardingForm } from '@/components/onboarding-form'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-xl p-8 bg-zinc-900 rounded-lg shadow flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Welcome to SwasthPrameh</h1>
        <OnboardingForm />
      </div>
    </div>
  )
}