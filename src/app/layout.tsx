import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Providers } from './providers'
import { ToastProvider } from '@/components/ToastProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://swasthprameh.ai'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'SwasthPrameh - AI-Enhanced Ayurvedic Care for Diabetes',
  description: 'Personalized Ayurvedic treatment plans and monitoring for diabetes management.',
  keywords: [
    'SwasthPrameh',
    'Ayurveda',
    'diabetes care',
    'personalized health plans',
    'AI healthcare',
    'Prakriti assessment',
  ],
  authors: [{ name: 'SwasthPrameh Collective' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'SwasthPrameh | Personalized Ayurvedic Diabetes Care',
    description:
      'Blend Prakriti insights, machine learning, and community care into one adaptive diabetes management platform.',
    siteName: 'SwasthPrameh',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Community health workers using SwasthPrameh platform with patients',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwasthPrameh - AI + Ayurveda for Diabetes Care',
    description:
      'Discover a 15-day adaptive plan powered by Ayurvedic expertise, machine learning insights, and CHW collaboration.',
    images: ['https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <ToastProvider />
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
