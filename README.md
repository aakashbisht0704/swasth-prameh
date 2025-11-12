## Overview

SwasthPrameh is a Next.js platform combining Ayurvedic expertise, machine learning, and community health worker tooling to deliver adaptive diabetes care plans. The redesigned landing page lives at `src/app/page.tsx` and showcases the product story using Tailwind, shadcn/ui, and Framer Motion micro-interactions.

### Landing Page Quickstart

- Hero copy lives in `src/components/home/HeroText.tsx`. Update the headline, subheading, CTAs, and trust badges here.
- Carousel content is in `src/components/home/HeroCarousel.tsx`. Replace the placeholder Unsplash URLs with project-approved assets and adjust captions as needed.
- Section content for About, Features, How It Works, Sample Plan, Testimonials, and FAQ can be customized in their respective files under `src/components/home/`.
- Images can be swapped by uploading to `/public/images/home/` and pointing the components to the new paths, or by updating the remote URLs.
- The medical disclaimer near the hero CTAs should remain visible; update the copy instead of removing it if legal language changes.

### Replacing Hero Images

1. Drop new assets into `public/images/home/` (recommended sizes: 1200×1500 for hero slides, 800×800 for illustrations).
2. Update the `image.src` values in `HeroCarousel.tsx` (local paths can start with `/images/home/...`).
3. Adjust alt text for accessibility—keep it descriptive and concise.
4. Regenerate responsive metadata if using external URLs (OG/Twitter images defined in `src/app/layout.tsx`).

### Suggested PR Template

Use `docs/landing-page-pr-template.md` for landing page updates. The template includes screenshot reminders and checklists for accessibility, responsiveness, and asset verification.

### Continuous Deployment

- GitHub Actions workflow `.github/workflows/deploy.yml` redeploys the Hostinger VPS on every push to `main`.
- Configure repository secrets `VPS_HOST`, `VPS_SSH_PORT`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`, `VPS_PROJECT_PATH`, and `VPS_REPO_URL`.
- Server-side script `deploy/deploy.sh` performs `git reset`, Docker rebuilds, restarts, and runs the integrated health check.

## Getting Started

First, run the development server:

```bash
npm run dev
```

This will start both the Next.js web server (port 3000) and the LLM server (port 8002) concurrently.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Servers Separately

If you need to run the servers separately:

```bash
# Run only Next.js web server
npm run dev:web

# Run only LLM server
npm run dev:llm
```

## Production

For production, use:

```bash
npm run build
npm start
```

This will start both servers in production mode.

## Important Note for Vercel Deployment

Vercel uses serverless functions and doesn't support long-running processes. The LLM server (Express) needs to be converted to Next.js API routes for Vercel deployment, or deployed separately. For traditional VPS/hosting platforms, the current setup works fine.

## Google OAuth Configuration

For Google OAuth to work in production (especially on Vercel), you need to configure:

1. **Google Cloud Console** - Set up OAuth credentials and authorized redirect URIs
2. **Supabase** - Configure Google provider with Client ID and Secret
3. **Vercel Environment Variables** - Set `NEXT_PUBLIC_SITE_URL` to your production URL

See **[GOOGLE_OAUTH_VERCEL_SETUP.md](./GOOGLE_OAUTH_VERCEL_SETUP.md)** for detailed step-by-step instructions.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
