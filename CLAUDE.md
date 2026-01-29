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

## 🚀 Marketing Skills & Tools

### Pocket Marketer Tool Suite (10 Tools)

Load from `~/clawd/skills/pocket-marketer/`:

| Tool | Purpose | Reference File |
|------|---------|----------------|
| **Marketing Domination** | Strategic orchestrator | `MARKETING-DOMINATION-PROMPT.md` |
| **Customer Avatar** | Deep audience profiling | Part of orchestrator |
| **Offer Architect** | Offer positioning + Big Idea | Part of orchestrator |
| **Pocket Copywriter** | Direct response copywriting | `Pocket-Copywriter-Prompt.txt` |
| **Campaign Architect** | Customer journey mapping | Part of orchestrator |
| **Hooks & Headlines** | Messaging library (10-20 angles) | Part of orchestrator |
| **Paid Ad Builder** | 18-27 ad variations | Separate tool |
| **VSL Architect** | Video/sales letter scripts | Separate tool |
| **Intimate Letter** | Email sequences | Separate tool |
| **Growth Consultant** | Scaling strategy | Separate tool |
| **CRO Coach** | Conversion optimization | Separate tool |

### Marketing Foundation Hierarchy

```
1. Customer Avatar (WHO) ← REQUIRED FIRST
   ↓
2. Core Offer Framework (WHAT) ← Build on avatar
   ↓
3. Big Idea (WHY different) ← Differentiation
   ↓
4. Campaign Framework (HOW) ← Journey mapping
   ↓
5. Hooks Library (WHAT stops scroll) ← Messaging
   ↓
6. TACTICAL EXECUTION ← Ads, emails, VSLs, pages
```

### Reference Materials (GDrive)

Knowledge base: `daniel@toolsavants.com` Drive
- Great Leads
- Copywriting Secrets - Jim Edwards
- E5 Method - Todd Brown
- Agora Black Book
- Ultimate Sales Letter
- Big Idea Book - Todd Brown
- $100M Offers - Alex Hormozi
- Autoresponder Madness
- 16 Word Sales Letter

### Additional Skills (~/clawd/skills/)

| Skill | Use For |
|-------|---------|
| `marketing-mode` | 23 marketing playbooks |
| `marketing-skills/references/copywriting` | AIDA, PAS frameworks |
| `marketing-skills/references/seo-audit` | Technical SEO |
| `marketing-skills/references/page-cro` | Landing page optimization |
| `marketing-skills/references/email-sequence` | Email campaigns |
| `marketing-skills/references/paid-ads` | Google/Meta/LinkedIn |
| `frontend-design` | Production-grade UI |
| `vercel-react-best-practices` | React patterns |

### Prompt Files Location

```
~/clawd/skills/pocket-marketer/references/
├── MARKETING-DOMINATION-PROMPT.md  (104KB - full system)
├── PM-Library.txt                   (117KB - categorized prompts)
├── PM-Prompts-Updates.txt           (766KB - extended collection)
├── Marketing-GPT-Bank.txt           (169KB - GPT configs)
└── Pocket-Copywriter-Prompt.txt     (new - copywriter tool)
```

### Integration Decision Tree

```
User Request Arrives
↓
Have foundations? (Avatar, Offer, Big Idea)
├─ NO → Build foundations FIRST
│   ├─ No Avatar → Customer Avatar Tool
│   └─ No Offer → Offer Architect
│
└─ YES → Strategic or Tactical?
    ├─ Strategic → Marketing Domination
    └─ Tactical → Route to specialist
        ├─ Copy → Pocket Copywriter
        ├─ Ads → Paid Ad Builder
        ├─ Emails → Intimate Letter
        ├─ VSL → VSL Architect
        ├─ Headlines → Hooks Builder
        └─ Optimize → CRO Coach
```

---

*Part of Pocket Marketer ecosystem*
*Updated 2026-01-28 — Marketing skills integrated*
