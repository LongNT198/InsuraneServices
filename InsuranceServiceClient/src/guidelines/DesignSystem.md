# 🎨 Insurance Service Design System

## Color Palette

### Primary Colors
- **Primary Blue**: `#2563eb` (blue-600) - Main brand color for primary actions, links, and emphasis
- **Primary Dark**: `#1e40af` (blue-700) - Hover states for primary elements
- **Primary Light**: `#eff6ff` (blue-50) - Backgrounds, subtle highlights

### Semantic Colors
- **Success Green**: `#16a34a` (green-600) - Success states, confirmations, positive outcomes
- **Warning Amber**: `#f59e0b` (amber-500) - Warnings, cautions, attention needed
- **Error Red**: `#dc2626` (red-600) - Errors, destructive actions, critical alerts
- **Info Blue**: `#0284c7` (sky-600) - Informational messages, tips, guidance

### Neutral Colors
- **Gray Scale**: Use gray-50 through gray-900 for backgrounds, borders, and text
- **White**: `#ffffff` - Card backgrounds, main content areas
- **Black**: `#030213` - Primary text color

## Component Styles

### Cards & Containers
```css
/* Default Card */
bg-white border border-gray-200 rounded-xl p-6 shadow-sm

/* Highlighted Card */
bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md

/* Selected Card */
bg-blue-50 border-2 border-blue-600 rounded-xl p-6 shadow-lg ring-2 ring-blue-300

/* Disabled Card */
bg-gray-100 border border-gray-300 rounded-xl p-6 opacity-50
```

### Buttons
```css
/* Primary Button */
bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 shadow-md

/* Secondary Button */
bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-semibold rounded-lg px-6 py-3

/* Success Button */
bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-3 shadow-md

/* Outline Button */
border-2 border-gray-300 hover:border-gray-400 bg-transparent text-gray-700 rounded-lg px-6 py-3
```

### Alerts & Messages
```css
/* Info Alert */
bg-blue-50 border border-blue-200 text-blue-900

/* Success Alert */
bg-green-50 border border-green-200 text-green-900

/* Warning Alert */
bg-amber-50 border border-amber-200 text-amber-900

/* Error Alert */
bg-red-50 border border-red-200 text-red-900
```

### Badges & Tags
```css
/* Success Badge */
bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full

/* Warning Badge */
bg-amber-100 text-amber-700 border border-amber-300 px-3 py-1 rounded-full

/* Info Badge */
bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded-full

/* Error Badge */
bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded-full
```

## Typography

### Headings
- **H1**: `text-3xl font-bold text-gray-900`
- **H2**: `text-2xl font-bold text-gray-900`
- **H3**: `text-xl font-semibold text-gray-900`
- **H4**: `text-lg font-semibold text-gray-900`

### Body Text
- **Primary**: `text-base text-gray-900`
- **Secondary**: `text-sm text-gray-600`
- **Muted**: `text-xs text-gray-500`

## Spacing & Sizing

### Padding
- **Small**: `p-3`
- **Medium**: `p-5`
- **Large**: `p-8`

### Gaps
- **Small**: `gap-2`
- **Medium**: `gap-4`
- **Large**: `gap-6`

## Effects & Animations

### Shadows
- **Subtle**: `shadow-sm`
- **Normal**: `shadow-md`
- **Elevated**: `shadow-lg`
- **High**: `shadow-xl`

### Transitions
- **Quick**: `transition-all duration-200`
- **Normal**: `transition-all duration-300`
- **Smooth**: `transition-all duration-500`

### Hover Effects
- Scale: `hover:scale-[1.02]`
- Lift: `hover:-translate-y-1 hover:shadow-lg`

## DO's and DON'Ts

### ✅ DO
- Use consistent color palette across all components
- Maintain proper contrast ratios for accessibility
- Use semantic colors (green for success, red for errors)
- Apply consistent spacing and sizing
- Use shadows to create hierarchy
- Keep gradients subtle and purposeful

### ❌ DON'T
- Mix multiple gradient colors unnecessarily
- Use bright, saturated colors everywhere
- Create visual clutter with too many effects
- Use inconsistent border styles
- Apply excessive animations
- Override theme colors with random values

## Insurance-Specific Guidelines

### Plan Cards
- Use white background with subtle border
- Highlight selected plans with blue-50 background and blue-600 border
- Show eligibility with green badges for eligible, red for not eligible
- Keep premium displays prominent but not overwhelming

### Status Indicators
- **Excellent/Good**: Green (green-600)
- **Fair/Moderate**: Amber (amber-500)
- **Poor/High Risk**: Red (red-600)
- **Neutral/Info**: Blue (blue-600)

### Forms
- Use white/gray-50 backgrounds
- Blue-600 for focus states
- Red-600 for error states
- Green-600 for success validation

### Progress Indicators
- Primary color: Blue-600
- Completed: Green-600
- Current: Blue-600 with ring
- Pending: Gray-300
