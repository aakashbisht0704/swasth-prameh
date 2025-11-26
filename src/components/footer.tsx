'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Approach', href: '#approach' },
    { label: 'Services', href: '#services' },
    { label: 'Contact Us', href: '#contact' },
  ],
  resources: [
    { label: 'FAQs', href: '#faq' },
    { label: 'Patient Portal', href: '/dashboard' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="container flex flex-col gap-8 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-3 text-sm text-muted-foreground">
          <h3 className="text-lg font-semibold text-foreground">SwasthPrameh</h3>
          <p>
            Personalized Ayurvedic diabetes management platform combining traditional wisdom with modern AI technology.
            Get your customized 15-day diet and lifestyle plan based on your unique Prakriti.
          </p>
          <p className="text-xs">
            © {new Date().getFullYear()} SwasthPrameh Collective. All rights reserved.
          </p>
        </div>
        <div className="grid gap-8 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground mb-3">Company</p>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-3">Resources</p>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-3">Legal</p>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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