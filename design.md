# SciStudy Egypt - Design System

## Design Philosophy

### Cultural Fusion
- **Modern Arabic Aesthetics**: Clean geometric patterns inspired by Islamic art, combined with contemporary digital design principles
- **Educational Focus**: Professional, academic atmosphere that inspires learning and scientific curiosity
- **Egyptian Identity**: Subtle incorporation of local cultural elements without overwhelming the scientific theme

### Color Palette
- **Primary**: Deep Teal (#0F4C75) - Represents knowledge and stability
- **Secondary**: Warm Amber (#F8B500) - Inspired by Egyptian heritage, represents enlightenment
- **Accent**: Soft Coral (#FF6B6B) - Adds warmth and energy
- **Neutral**: Charcoal Gray (#2C3E50) - Professional text and backgrounds
- **Background**: Off-white (#FAFAFA) - Clean, readable base

### Typography
- **Display Font**: "Cairo" - Modern Arabic-inspired sans-serif for headings
- **Body Font**: "Inter" - Clean, highly readable for content
- **Arabic Font**: "Amiri" - Traditional yet readable Arabic typeface
- **Monospace**: "JetBrains Mono" - For code and technical terms

### Visual Language
- **Geometric Patterns**: Subtle Islamic geometric patterns as background elements
- **Scientific Icons**: Clean, minimalist icons representing different scientific disciplines
- **Grid System**: 12-column responsive grid with consistent spacing
- **Border Radius**: 8px for cards, 4px for buttons (modern but not overly rounded)

## Visual Effects & Animations

### Used Libraries
- **Anime.js**: Smooth micro-interactions and state transitions
- **Splitting.js**: Text animation effects for headings
- **Typed.js**: Typewriter effect for key terms
- **ECharts.js**: Progress visualization and study analytics
- **p5.js**: Interactive background patterns and visual elements

### Animation Effects
- **Text Reveal**: Split-by-letter stagger animation for main headings
- **Card Hover**: Subtle 3D tilt effect with shadow depth
- **Progress Bars**: Smooth fill animations with easing
- **Flashcard Flip**: 3D card flip animation for flashcard interactions
- **Timer Pulse**: Breathing animation for active timer state

### Background Effects
- **Geometric Pattern**: Subtle animated Islamic geometric pattern using p5.js
- **Particle System**: Floating particles representing knowledge transfer
- **Gradient Flow**: Soft animated gradient background

### Interactive Elements
- **Button Hover**: Color morphing with subtle glow effect
- **Input Focus**: Border animation with color transition
- **Card Selection**: Highlight with expanding border
- **Progress Indicators**: Animated fill with milestone markers

## Header & Navigation Effects
- **Sticky Navigation**: Smooth background blur effect on scroll
- **Logo Animation**: Subtle rotation on page load
- **Menu Transitions**: Slide-in animation for mobile menu
- **Active State**: Underline animation for current page

## Component Styling

### Cards
- **Shadow**: Soft drop shadow (0 4px 12px rgba(0,0,0,0.1))
- **Border**: 1px solid border with subtle color
- **Hover State**: Elevated shadow and slight scale increase
- **Content Padding**: 24px internal spacing

### Buttons
- **Primary**: Teal background with white text
- **Secondary**: Amber background with dark text
- **Ghost**: Transparent with colored border
- **Hover**: Darken background by 10%

### Forms
- **Input Fields**: Clean borders with focus states
- **Labels**: Positioned above inputs with clear hierarchy
- **Validation**: Color-coded feedback (green/red)
- **Arabic Support**: RTL text direction for Arabic inputs

## Responsive Design
- **Mobile First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: 
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- **Touch Targets**: Minimum 44px for mobile interactions
- **Arabic Text**: Optimized font sizes for Arabic readability

## Accessibility
- **Color Contrast**: Minimum 4.5:1 ratio for all text
- **Focus Indicators**: Clear visual focus states
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Arabic Support**: Proper RTL layout and text direction