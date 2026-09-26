# OPS Logistics Frontend

A modern, responsive landing page for OPS Logistics - delivering excellence in global shipping and logistics.

## Overview

This is a static HTML/CSS website showcasing OPS Logistics' core services:
- Real-time shipment tracking
- Shipping quotes and pricing
- Business account management
- Tariff advisory services

## Project Structure

```
.
├── index.html          # Main landing page
├── styles.css          # Styling and responsive design
├── package.json        # Project metadata
├── PRODUCT.md          # Product requirements and positioning
├── DESIGN.md           # Design system and visual guidelines
└── README.md           # This file
```

## Design System

**Colors:**
- Primary Blue: `#0055CC` (CTAs and key actions)
- Dark Blue: `#003A70` (Brand foundation)
- Light Gray: `#F5F5F5` (Backgrounds)
- Text Dark: `#1a1a1a` (Body text)
- Text Light: `#666` (Secondary text)

**Typography:**
- System font stack for optimal rendering
- Hierarchy: 3.5rem (H1) → 2rem (H2) → 1.25rem (H3)
- 1rem body text at 1.6 line height

**Components:**
- Buttons with hover effects and shadows
- Feature cards with top border accent
- Responsive navigation
- Mobile-first design

## Getting Started

### View the Site

1. Open `index.html` in a web browser, or
2. Run a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Features

### Hero Section
- Large, prominent headline
- Tracking number search input
- Clear primary CTA

### Features Section
- Three value proposition cards
- "Ship Now", "Get a Quote", "Request Business Account"
- Hover effects for interactivity

### Trade Advisory
- Expert positioning content
- Tariff navigation guidance
- Call-to-action button

### Navigation
- Sticky header
- Brand logo
- Main navigation menu
- Customer portal login

## Responsive Design

Fully responsive across:
- Mobile (<768px) — Single column, full-width controls
- Tablet (768px-1024px) — Two-column layouts
- Desktop (>1024px) — Three-column layouts, optimized spacing

## Accessibility

- Semantic HTML structure
- WCAG AA color contrast compliance
- Focus states on all interactive elements
- Proper form labels
- Touch-friendly button sizes (min 44px)

## Design Philosophy (Impeccable)

This project follows the design principles from [Impeccable](https://impeccable.style):
- Clear information hierarchy
- Purposeful use of color and typography
- Professional, trustworthy appearance
- No anti-patterns (avoid gray on color, nested cards, etc.)
- Emphasis on conversion and clarity

## Next Steps

To enhance this design further:
1. Add high-quality photography for hero section
2. Implement real tracking functionality
3. Add form handling for quotes
4. Integrate with backend API
5. Add animations and micro-interactions
6. Implement analytics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
