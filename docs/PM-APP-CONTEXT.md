# Pocket Marketer App Context

> Reference document for Website Builder integration with PM app.
> Screenshots saved in `docs/pm-reference/`

---

## PM App Structure

### Navigation Flow (Top Bar)
```
Project Setup → Interview → Knowledge Base → Project Hub → Tools → Project Threads → Copy Vault → ...
```

### Left Sidebar
- Dashboard
- Projects
- History
- AI Tools
- Copy Vault
- Tutorials & Prompts
- Advanced Training
- Call Calendar

---

## Key Sections

### 1. Project Setup
**Purpose:** Basic project configuration

**Fields captured:**
- Project Name
- Client/Company Name
- Website URL
- Description
- Project Manager
- Company Logo (upload)

**Screenshot:** `screencapture-...-09_11_04.png`

---

### 2. Interview
**Purpose:** Discovery questions to understand the business

**Core Discovery Questions (12):**
1. What does your business do, in one sentence?
2. Who is your ideal customer?
3. What specific problem do you solve for them?
4. What result or transformation do they want most?
5. What exactly are you selling them?
6. Why should they choose you over someone else?
7. How do customers usually find you?
8. What do you want them to do when they find you? (Book call, buy, etc.)
9. How do you usually make the sale? (Call, form, website, in person?)
10. What makes people hesitate or say "no"?
11. Do you have any reviews, testimonials, or proof?
12. What's your biggest goal right now?

**Additional features:**
- Question Bank with different templates
- Upload/Record/Paste transcript options
- Browse Previous Transcripts

**Screenshot:** `screencapture-...-09_11_16.png`

---

### 3. Knowledge Base
**Purpose:** Asset storage and organization

**Features:**
- Knowledge Base Coach (AI chat)
- File uploads (drag & drop)
- Storage for logos, images, docs

**Screenshot:** `screencapture-...-09_11_28.png`

---

### 4. Project Hub
**Purpose:** Central creative workspace with guided prompts

**Entry Points (pick what feels true):**
- Not Sure Where to Start → "Show Me My Best First Move"
- Craft an Upgraded Big Idea → "Build My Big Idea"
- I Need Help With My Offer → "Improve My Offer"
- I Need to Generate Leads → "Build a Lead Campaign"
- I've Hit a Marketing Plateau → "Break Through the Plateau"
- My Messaging Isn't Converting → "Fix My Messaging"
- I Want a Quick Win → "Get a Quick Win"

**Prompt Categories (159 prompts):**
- Messaging & Copy
- Ads & Traffic
- Local Marketing
- Diagnosis & Decision-Making
- Planning & Clarity
- Customer Psychology
- Website Strategy
- Funnel Strategy
- Offers & Conversion
- Video & VSL
- Email Marketing
- Marketing Strategy
- Vendor / Agency Handoffs

**Screenshot:** `screencapture-...-09_11_38.png`

---

### 5. AI Tools
**Purpose:** Specialized AI assistants for specific tasks

**Core Tools:**
- Pocket Marketer (all-in-one)
- Pocket Growth Strategist
- Pocket Copywriter
- **Website & Funnel Builder** ← COMING SOON (this is what we're building!)

**Specialty AI Tools:**
- Big Idea Generator
- Offer Architect
- Email Follow-Up & Nurture Sequence
- VSL & Sales Letter Coach
- Customer Avatar Research Coach
- Conversion Rate Optimization
- Paid Ad Strategist Coach
- Social Media Content Coach
- Sales Coach & Strategist
- Funnel Hacker Tool (coming soon)
- Ad Creative & Social Media Asset Creator (coming soon)

**Screenshot:** `screencapture-...-09_10_11.png`

---

## Website Builder Integration

### Data to Pull from PM

```typescript
interface PMProjectContext {
  // From Project Setup
  projectName: string;
  companyName: string;
  website?: string;
  description?: string;
  logoUrl?: string;

  // From Interview (mapped to our BrandDNA)
  businessDescription: string;      // Q1: What does your business do
  idealCustomer: string;            // Q2: Who is your ideal customer
  problemSolved: string;            // Q3: What problem do you solve
  desiredTransformation: string;    // Q4: What result do they want
  offering: string;                 // Q5: What are you selling
  differentiators: string;          // Q6: Why choose you
  customerAcquisition: string;      // Q7: How do customers find you
  callToAction: string;             // Q8: What do you want them to do
  salesProcess: string;             // Q9: How do you make the sale
  objections: string;               // Q10: What makes people hesitate
  socialProof: string;              // Q11: Reviews/testimonials/proof
  mainGoal: string;                 // Q12: Biggest goal right now

  // From Knowledge Base
  assets: {
    logo?: string;
    images?: string[];
    documents?: string[];
  };

  // From Copy Vault (if available)
  copyAssets?: {
    headlines?: string[];
    testimonials?: string[];
    offers?: string[];
  };
}
```

### User Flow Decision Tree

```
User clicks "Website & Funnel Builder" in Tools
                    ↓
         Has PM Project Context?
                    │
    ┌───── YES ─────┴───── NO ─────┐
    ↓                              ↓
Pre-fill all fields          Run Discovery Flow
Show quick review            (our guided questions)
    ↓                              ↓
Select Template              Build context
    ↓                              ↓
    └──────────────┬───────────────┘
                   ↓
           Generate Website
                   ↓
           Preview & Edit
                   ↓
              Deploy
```

---

## API Integration (For Suhail)

### Endpoints Needed

```
GET /api/project/:id/context
→ Returns PMProjectContext

GET /api/project/:id/assets
→ Returns asset URLs from Knowledge Base

GET /api/project/:id/interview
→ Returns interview responses (Q1-Q12)

GET /api/project/:id/copy-vault
→ Returns saved copy assets
```

### Auth
- Share session/token between PM app and Website Builder
- Or use iframe with postMessage

---

## UI/UX Notes

### PM Design System (Match This)
- Dark theme: Navy background (#0a1628)
- Card backgrounds: Darker navy (#132743)
- Accent: Blue (#3b82f6)
- Text: White + gray variants
- Rounded corners on cards
- Blue "COMING SOON" badges
- Consistent sidebar navigation

### Tone
- Friendly, encouraging
- "Let's Create Something Great Together"
- Progress-oriented ("Pick Up Where You Left Off")
- Quick wins available

---

*Generated by SYNTHIOS from PM Screenshots — 2026-02-03*
