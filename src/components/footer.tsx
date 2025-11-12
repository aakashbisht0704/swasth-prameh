'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

const footerLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="container flex flex-col gap-8 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-3 text-sm text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground">SwasthPrameh</h3>
          <p>
            Student-built platform for preventive diabetes care combining Ayurvedic wisdom and AI.
            Currently piloting with partner clinics in Kerala & Maharashtra.
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} SwasthPrameh Collective. All rights reserved.
          </p>
        </div>
        <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Connect with us</p>
          <div className="flex items-center gap-3">
            <a
              href="mailto:hello@swasthprameh.ai"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-primary hover:text-primary"
              aria-label="Email SwasthPrameh"
            >
              <Mail className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="https://github.com/swasthprameh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-primary hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="https://www.linkedin.com/company/swasthprameh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition hover:border-primary hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" aria-hidden />
            </a>
          </div>
          <p className="text-xs">
            SwasthPrameh is not a medical device. Review our{' '}
            <Link href="/terms" className="underline transition hover:text-primary">
              terms of use
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline transition hover:text-primary">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}