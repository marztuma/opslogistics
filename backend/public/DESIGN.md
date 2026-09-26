# Design

## Visual World

**Brand Identity:** Professional, trustworthy, and modern. Navy blue primary color conveys stability and expertise. Clean typography and generous spacing create confidence.

**Color System:**
- Primary: `#0055CC` (Bright Blue) — CTAs, key interactions
- Dark Blue: `#003A70` — Brand foundation, headers
- Neutral Gray: `#F5F5F5` — Backgrounds, subtle contrast
- Text Dark: `#1a1a1a` — Body text
- Text Light: `#666` — Secondary text

**Typography:**
- **Primary Font:** Source Sans Pro (Adobe) — professional, distinctive, open-source
- **Weights Used:** 400 (regular), 600 (semibold), 700 (bold)
- **Fallback:** System font stack (-apple-system, Segoe UI, Roboto)
- **Heading Hierarchy:** 3.5rem (H1) → 2.8rem (H2) → 2.2rem (section) → 1.25rem (H3)
- **Body:** 1rem at 1.6 line-height for readability
- **Letter Spacing:** Tight (-0.5px to -0.8px) on large headings; 0.5-1px on labels
- **Why Source Sans Pro:** Professional corporate font used by major logistics companies; avoids overused Web fonts (Inter, Plus Jakarta Sans)

**Component Library:**
- Buttons: Solid blue (primary) or dark blue (secondary), hover state with lift and enhanced shadow
- Cards: White with subtle shadow, hover lift effect and border accent
- Feature Items: Numbered cards (01-04) with dark blue number badges
- Badges: Yellow accent badges (#FDB913) for section labels
- Search Input: Full-width responsive, right-aligned button
- Navigation: Sticky header with logo, menu, and login button
- Two-column Sections: Grid layout with responsive stacking

## Visitor Mode

**Persuade** — Design is the product. Homepage converts visitors to shippers and customers. The value proposition must be immediately clear: fast tracking, reliable service, business support.

## Information Architecture

1. **Navigation:** Track, Ship, Services, Customer Service, Portal Login
2. **Hero Section:** Tagline, primary CTA (tracking search)
3. **Value Prop Cards:** Three key actions (Ship Now, Get Quote, Business Account)
4. **Trade Advisory:** Educational content positioning OPS as expert tariff guide
5. **Shipping Containers Section:** Two-column layout with product description and numbered features
6. **Document & Parcel Shipping:** White card section with services grid and CTA
7. **Footer:** Legal links, company info

## Responsive Breakpoints

- **Mobile:** < 768px — Stack layout, full-width inputs/buttons
- **Tablet:** 768px - 1024px — Two-column layouts
- **Desktop:** > 1024px — Full three-column layouts

## Motion & Interaction

- Hover states: Subtle color shift and transform
- Transitions: 0.3s easing on interactive elements
- No heavy animations on load — fast, accessible experience

## Accessibility

- Color contrast meets WCAG AA standards
- Semantic HTML (header, nav, section, footer)
- Form inputs clearly labeled
- Mobile-friendly touch targets (min 44px)
