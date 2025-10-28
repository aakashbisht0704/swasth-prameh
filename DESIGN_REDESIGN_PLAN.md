# SwasthPrameh Design Redesign Plan

## 🎨 Design Specifications from Image

### Color Palette:
- **Primary Green**: `#1F7A4C` (main brand color)
- **Secondary Accent**: `#4EBE74` (lighter green for accents)
- **Background Light**: `#F9FAF8` (off-white for light mode)
- **Background Dark**: `#0F1B14` (dark neutral for dark mode)
- **Card Background**: White with subtle shadows

### Homepage Design:
1. **Layout Structure:**
   - Left side: Scrollable content (hero, features, CTA buttons)
   - Right side: Sticky image/illustration that stays fixed while left scrolls
   - Maintain clean, minimal, modern design
   - Buttons use subtle shadows (`shadow-md`), soft rounded corners (`rounded-xl`)

2. **Hero Section (Left):**
   - Title: "SwasthPrameh" - Large, bold green font
   - Subtitle: "AI-Enhanced Ayurvedic Care" - Smaller, bold black
   - Description: Paragraph explaining app purpose
   - CTA Buttons:
     - "Get Started" (filled green, `rounded-xl`, `shadow-md`)
     - "Use Our AI" (outlined gray, `rounded-xl`, `shadow-md`)

3. **Features Section:**
   - Title: "Why Choose SwasthaPrameh?"
   - Subtitle: "Experience the perfect blend..."
   - 6 Feature Cards (3x2 grid):
     - Icons: 📊 📈 👨‍⚕️ and more
     - Title + description
     - Rounded corners, subtle shadows

4. **Right Side Sticky Image:**
   - Cartoon illustration: Doctor + patient + desk + computer
   - Light green background
   - Stays fixed while left content scrolls

### Dashboard Design:
1. **Sidebar (Left):**
   - Fixed sidebar with icons and labels
   - Active tab: Green background + green vertical bar on left
   - Tabs: "Overview", "Meal Logging", "Yoga Videos"
   - Light gray/white background

2. **Overview Tab:**
   - Welcome message with user name
   - 4 info cards in grid:
     - Prakriti Constitution (pie chart)
     - Lifestyle (diet, exercise, sleep)
     - Ashtvidha Pariksha (Nadi, Mutra, Mala, Jiwha)
     - AI System (green "Get AI Recommendations" button)
   - Cards: White background, rounded corners, shadows

3. **Meal Logging Tab:**
   - "Log Your Meal" form:
     - Meal Type dropdown
     - Quantity input
     - Food Items input
     - Notes input
     - "Log Meal" button
   - Food image grid (3x3 circular images)
   - Recent meals list below

4. **Yoga Videos Tab:**
   - Title: "Yoga videos"
   - Category filters: "All", "Morning", "Evening", "Therapeutic", "Flow", "Breathing"
   - Video cards (3 columns):
     - Thumbnail image
     - Title
     - Description
     - Difficulty + Duration tags
     - "Start Now!!!" button (green, rounded-xl)

### Global Styling:
- **Typography**: Modern sans-serif, clean fonts
- **Rounded Corners**: `rounded-xl` for cards/buttons
- **Shadows**: `shadow-md` for depth
- **Spacing**: Consistent padding/margins
- **Transitions**: Smooth hover effects
- **Responsive**: Mobile-first, stacked on small screens

## 📋 Implementation Checklist

### Completed:
- ✅ Updated globals.css with green theme
- ✅ Analyzed design specifications

### In Progress:
- 🔄 Redesigning homepage with left-scroll/right-sticky layout

### Pending:
- ⏳ Update Dashboard Overview page
- ⏳ Update Meal Logging page
- ⏳ Update Yoga Videos page
- ⏳ Update Dashboard sidebar
- ⏳ Apply theme to auth/onboarding pages

## 🎯 Key Changes Needed

1. **Homepage (`src/app/page.tsx`):**
   - Convert to split layout (left scrollable, right sticky)
   - Move illustration to right side with `sticky top-0`
   - Update button styles to match design
   - Add feature cards grid

2. **Dashboard (`src/app/dashboard/page.tsx`):**
   - Update Overview cards to match design
   - Fix card styling with proper backgrounds/shadows
   - Update card grid layout

3. **Sidebar (`src/components/DashboardSidebar.tsx`):**
   - Update active tab styling (green background + left bar)
   - Add proper icons (SVG or emoji)
   - Match design colors

4. **Meal Logging (`src/components/MealLogging.tsx`):**
   - Update form styling
   - Add food image grid
   - Improve card layouts

5. **Yoga Videos (`src/components/YogaVideos.tsx`):**
   - Update video card design
   - Improve category filter buttons
   - Add proper thumbnails

6. **Navbar (`src/components/navbar.tsx`):**
   - Already styled correctly
   - Minor adjustments if needed

7. **Global Styles (`src/app/globals.css`):**
   - Update color variables
   - Ensure proper light/dark mode support

## 🚀 Next Steps

1. Start with homepage redesign
2. Move to dashboard components
3. Update styling across all pages
4. Test responsiveness
5. Polish animations and transitions

