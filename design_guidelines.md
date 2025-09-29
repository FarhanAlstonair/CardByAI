# Design Guidelines: AI Business Card SaaS Platform

## Design Approach: Stitch by Google Inspired
**Selected Approach**: Reference-based design inspired by Google's Stitch design language
**Justification**: User specifically requested "Stitch by Google UI/UX style (modern, minimal, intuitive)" for this SaaS platform

## Core Design Principles
- **Minimal & Clean**: Embrace whitespace and reduce visual clutter
- **Intuitive Navigation**: Clear information hierarchy with subtle visual cues
- **Functional Beauty**: Every design element serves a purpose
- **Consistent Interactions**: Predictable user experience across all features

## Color Palette

### Light Mode
- **Primary**: 25 85% 47% (Google Blue inspired)
- **Secondary**: 220 15% 25% (Dark charcoal for text)
- **Background**: 0 0% 98% (Off-white background)
- **Surface**: 0 0% 100% (Pure white cards/panels)
- **Border**: 220 10% 85% (Subtle borders)
- **Success**: 140 65% 42% (Green for confirmations)
- **Warning**: 35 85% 55% (Orange for alerts)

### Dark Mode
- **Primary**: 25 85% 65% (Lighter blue for contrast)
- **Secondary**: 220 15% 85% (Light gray text)
- **Background**: 220 15% 12% (Dark background)
- **Surface**: 220 15% 16% (Elevated dark surfaces)
- **Border**: 220 10% 25% (Dark borders)

## Typography
- **Primary Font**: Inter (Google Fonts) - Clean, readable, modern
- **Accent Font**: JetBrains Mono (for technical elements like API keys)
- **Scale**: 
  - Headings: text-4xl, text-2xl, text-xl, text-lg
  - Body: text-base, text-sm
  - Captions: text-xs

## Layout System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, 8, 12, 16, 24
- **Container margins**: p-6, p-8, p-12
- **Component spacing**: gap-4, gap-6, gap-8
- **Element padding**: p-2, p-4, p-6

## Component Library

### Navigation
- **Top Navigation**: Clean white background with subtle shadow, Google-style logo placement
- **Sidebar**: Minimal icons with subtle hover states, collapsible on mobile
- **Breadcrumbs**: Subtle text with chevron separators

### Buttons
- **Primary**: Filled background with primary color, rounded-lg corners
- **Secondary**: Outlined style with subtle borders
- **Ghost**: Text-only buttons for less important actions
- **Icon Buttons**: Circular with subtle hover backgrounds

### Cards & Panels
- **Card Container**: White background, subtle shadow (shadow-sm), rounded-xl corners
- **Panel Headers**: Clean typography with optional action buttons
- **Dividers**: Subtle lines using border color palette

### Forms
- **Input Fields**: Clean borders, focus states with primary color
- **Labels**: Consistent text-sm weight-medium styling
- **Validation**: Inline error states with warning colors

### Data Display
- **Tables**: Clean rows with subtle hover states, proper spacing
- **Grid Views**: Card-based layouts for business cards with 4-column desktop grid
- **Stats Cards**: Minimal design with large numbers and subtle icons

### Drag & Drop Editor
- **Canvas Area**: Clean white background with subtle grid overlay
- **Tool Panels**: Sidebar with grouped controls, minimal icons
- **Element Handles**: Subtle drag indicators that appear on hover
- **Property Panel**: Right sidebar with clean form controls

### Admin Dashboard
- **Metrics Cards**: Clean numerical displays with subtle trend indicators
- **User Tables**: Clean rows with actions dropdown
- **Charts**: Subtle styling with primary color accents

## Animations
**Minimal Use**: 
- Subtle fade-in transitions for modals (duration-200)
- Smooth hover states for interactive elements
- Loading states with simple fade effects
- Avoid complex animations to maintain professional feel

## Visual Hierarchy
- **Primary Actions**: Prominent placement with primary button styling
- **Secondary Content**: Subtle text colors and smaller sizing
- **Status Indicators**: Color-coded with subtle backgrounds
- **Navigation**: Clear active states with primary color accents

## Responsive Design
- **Desktop**: Full sidebar navigation, 4-column card grids
- **Tablet**: Collapsible sidebar, 2-column grids
- **Mobile**: Bottom navigation, single-column layouts

## Images
### Hero Section (Dashboard)
- **Large hero banner** showcasing AI-generated business card examples
- **Placement**: Top of main dashboard after navigation
- **Style**: Clean background with sample cards floating/arranged attractively
- **CTA Overlay**: Prominent "Create Your Card" button with blurred background (variant="outline")

### Card Gallery
- **Thumbnail previews** of generated business cards in grid layout
- **Hover states** with subtle elevation and preview options
- **Empty states** with friendly illustrations encouraging first card creation

### Admin Analytics
- **Simple charts and graphs** with primary color styling
- **User avatars** from Google OAuth in clean circular frames
- **No heavy imagery** - focus on clean data visualization

This design system ensures a professional, intuitive experience that aligns with modern SaaS expectations while maintaining the clean, functional aesthetic of Google's design philosophy.