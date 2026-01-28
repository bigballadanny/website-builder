# Pocket Marketer Website Builder

## What This Is
A fork of bolt.diy customized for Pocket Marketer users. Generates marketing websites (landing pages, sales pages, lead magnets) using AI, pre-filled with user's brand context.

## Design System (Match Pocket Marketer)

### Colors
```css
/* PM Primary Colors */
--pm-bg-primary: #0a1628;      /* Dark navy background */
--pm-bg-secondary: #0d1f35;    /* Slightly lighter navy */
--pm-bg-card: #132743;         /* Card backgrounds */
--pm-accent: #3b82f6;          /* Blue accent (buttons, links) */
--pm-accent-hover: #2563eb;    /* Blue hover state */
--pm-text-primary: #ffffff;    /* White text */
--pm-text-secondary: #94a3b8;  /* Gray text */
--pm-text-muted: #64748b;      /* Muted text */
--pm-border: #1e3a5f;          /* Border color */
--pm-success: #22c55e;         /* Green */
--pm-warning: #f59e0b;         /* Orange/Yellow */
```

### Typography
- Font: System UI stack (same as PM)
- Headings: Bold, white
- Body: Regular, gray-300

### UI Patterns
- Dark theme only (matches PM)
- Rounded corners (8px cards, 4px buttons)
- Subtle borders
- Blue accent color for CTAs
- Chat-based interface

## Target Templates

### 1. Landing Page (Lead Gen)
- Hero with headline + CTA
- Pain points section
- Benefits section
- Social proof
- Final CTA

### 2. Sales Page
- Long-form structure
- Problem → Agitation → Solution
- Features + Benefits
- Testimonials
- Pricing/Offer
- FAQ
- Multiple CTAs

### 3. Lead Magnet Page
- Simple hero
- What they'll get
- Opt-in form
- Thank you redirect

### 4. Coming Soon
- Logo
- Headline
- Email capture
- Social links

## Integration Points (For Suhail)

### Data to Pull from PM
```typescript
interface PMProjectContext {
  // From Interview
  businessDescription: string;
  idealCustomer: string;
  problemSolved: string;
  desiredTransformation: string;
  offering: string;
  differentiators: string;
  callToAction: string;
  
  // From Knowledge Base
  logo?: string;
  brandColors?: string[];
  productImages?: string[];
  
  // From Copy Vault
  headlines?: string[];
  testimonials?: string[];
}
```

### API Endpoints Needed
```
GET /api/project/:id/context → PMProjectContext
GET /api/project/:id/assets → Asset[]
```

## Commands

```bash
pnpm install        # Install dependencies
pnpm run dev        # Start dev server
pnpm run build      # Production build
```

## AI Configuration

Using Claude Sonnet 4 as primary model.
Set `ANTHROPIC_API_KEY` in `.env.local`

## File Structure

```
app/
├── components/     # UI components
├── lib/           # Business logic
│   ├── ai/        # Claude integration
│   └── pm/        # PM API client
├── routes/        # Page routes
├── styles/        # PM-themed styles
└── templates/     # Marketing templates
```

## Brand Enforcement

All generated code MUST:
1. Use PM color variables
2. Be mobile-first responsive
3. Include proper meta tags
4. Use semantic HTML
5. Follow PM typography scale

---

*Part of Pocket Marketer ecosystem*
