# Landing Page Redesign - Implementation Notes

## Overview
Complete redesign of the public-facing landing page based on specifications. The page is now modern, image-heavy, mobile-responsive, and follows the exact section order specified.

## Section Order (Implemented)
1. ✅ Header (sticky, transparent→solid on scroll)
2. ✅ Hero (with carousel)
3. ✅ Intro / What is SwasthPrameh?
4. ✅ About Us (with team, mission, vision, values)
5. ✅ Our Approach (4-step flow + comparison)
6. ✅ Services (Diet/Lifestyle + Consultation)
7. ✅ 15-Day Sample Plan Preview
8. ✅ Testimonials
9. ✅ Blog/Resources
10. ✅ FAQ (with accordion)
11. ✅ Contact (with form + topic dropdown)
12. ✅ Footer

## Content Files Created
All content is centralized in `/src/content/` for easy updates:

- `src/content/faq.ts` - FAQ questions and answers (TODO: Replace with PDF content)
- `src/content/team.ts` - Team members, mission, vision, values (TODO: Replace with PDF content)
- `src/content/intro.ts` - Intro content, problem statements, Prakriti explanation (TODO: Replace with PDF content)
- `src/content/approach.ts` - 4-step approach flow and comparison (TODO: Replace with PDF content)
- `src/content/sample-plan.json` - Sample 15-day plan data

## Components Created/Updated

### New Components
- `src/components/landing/HeroCarousel.tsx` - Image carousel for hero section
- `src/components/landing/PlanPreview.tsx` - 15-day sample plan preview with day selector
- `src/components/landing/FAQ.tsx` - FAQ section with accordion

### Updated Components
- `src/components/landing/Hero.tsx` - Updated subheading and CTAs
- `src/components/landing/Intro.tsx` - Added problem statements and Prakriti explanation
- `src/components/landing/About.tsx` - Updated to use team content from content files
- `src/components/landing/Approach.tsx` - Updated to use approach content from content files
- `src/components/landing/Contact.tsx` - Added topic dropdown, connected to API
- `src/components/navbar.tsx` - Updated navigation links and smooth scrolling
- `src/app/page.tsx` - Updated section order

## API Endpoints
- `src/app/api/contact/route.ts` - Contact form submission endpoint (saves to Supabase `contact` table)

## Image Placeholders
All images currently use Unsplash placeholders. **TODO: Replace with actual assets**

Images used:
- Hero carousel: Ayurvedic lifestyle, herbs, yoga, healthy meals
- Team photos: Placeholder professional photos
- Service cards: Diet and consultation images
- All images have proper `alt` attributes for accessibility

## Content Updates Required
⚠️ **IMPORTANT**: The content files contain placeholder text that should be replaced with actual content from `ABOUt..pdf`:

1. **FAQ Content** (`src/content/faq.ts`):
   - Replace all FAQ questions/answers with content from PDF
   - Ensure medical disclaimer and data usage FAQs are included

2. **Team Content** (`src/content/team.ts`):
   - Update team member names, roles, credentials, bios
   - Replace with Dr. Konica Gera, Dr. Abhilasha Bhardwaj info from PDF
   - Update mission, vision, values from PDF

3. **Intro Content** (`src/content/intro.ts`):
   - Update mission statement
   - Replace problem statements with exact copy from PDF
   - Update Prakriti/dosha descriptions with PDF content

4. **Approach Content** (`src/content/approach.ts`):
   - Update 4-step flow descriptions with PDF roadmap
   - Update comparison block with PDF content

## Testing Checklist

### Desktop
- [ ] All sections render correctly
- [ ] Navigation links scroll smoothly to sections
- [ ] Hero carousel auto-advances and manual controls work
- [ ] Plan preview day selector works
- [ ] FAQ accordion expands/collapses
- [ ] Contact form submits successfully
- [ ] All CTAs link to correct pages

### Mobile
- [ ] Responsive layout works on mobile
- [ ] Hero carousel stacks properly on mobile
- [ ] Mobile menu opens/closes correctly
- [ ] All sections are readable and accessible
- [ ] Touch targets are adequate size

### SEO & Accessibility
- [ ] Meta title and description updated
- [ ] All images have alt text
- [ ] Semantic HTML structure
- [ ] Keyboard navigation works
- [ ] ARIA labels on interactive elements

### Performance
- [ ] Images lazy load
- [ ] Smooth scroll animations
- [ ] No console errors
- [ ] Lighthouse score > 90

## Deployment Notes

### Local Testing
```bash
npm install
npm run dev
```

### Content Editing
- Edit copy: Update files in `src/content/`
- Replace images: Update image URLs in component files
- Update team photos: Replace placeholder URLs in `src/content/team.ts`

### Database Setup
Ensure the `contact` table exists in Supabase:
```sql
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Next Steps
1. Replace all placeholder content with PDF content
2. Replace Unsplash images with actual brand assets
3. Test payment gateway integration for booking CTAs
4. Add analytics tracking
5. Set up email notifications for contact form submissions

## Medical Disclaimer
The medical disclaimer is included in:
- FAQ section footer
- Should be added to footer component (TODO)

## Notes
- All components use shadcn UI components
- Framer Motion used for animations
- Green/off-white color palette maintained (#1F7A4C primary)
- Mobile-first responsive design
- All CTAs route to appropriate pages (onboarding, dashboard, contact)

