# Pocket Marketer Website Builder

## Status: Working Prototype ✅

This is a fork of [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) customized for Pocket Marketer.

### ✅ What's Complete

1. **Builder Route** (`/builder`)
   - Full workflow: Template → Brand Info → Generate → Preview → Deploy
   - Step indicator UI
   - Error handling

2. **4 Templates**
   - Landing Page (lead gen focused)
   - Sales Page (long-form, 12 sections)
   - Lead Magnet Page (opt-in forms)
   - Coming Soon Page (pre-launch)

3. **AI Generation**
   - Claude Sonnet 4 integration
   - Template-specific prompts
   - Edit with natural language

4. **Preview System**
   - Device switching (desktop/tablet/mobile)
   - Live HTML preview in iframe
   - Tailwind CSS via CDN

5. **Cloudflare Deployment**
   - API route for Pages deployment
   - Mock mode for development
   - Real deployment when credentials configured

6. **PM Integration (Mock)**
   - BrandDNA type mapping
   - Context aggregator
   - Ready for real PM API

---

## Quick Start

### 1. Add your API key
Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Install & Run
```bash
pnpm install
pnpm dev
```

### 3. Open Builder
Go to: http://localhost:5173/builder

---

## Project Structure

```
pocket-marketer-builder/
├── app/
│   ├── routes/
│   │   ├── builder.tsx           # Main builder UI
│   │   ├── api.pm-generate.ts    # AI generation endpoint
│   │   ├── api.pm-edit.ts        # AI edit endpoint
│   │   └── api.cloudflare-deploy.ts  # Deployment endpoint
│   │
│   ├── components/pm/
│   │   ├── TemplateSelector.tsx  # Template picker UI
│   │   └── PreviewFrame.tsx      # Live preview with device switching
│   │
│   ├── templates/
│   │   ├── index.ts              # Template registry
│   │   ├── landing-page/         # Lead gen template
│   │   ├── sales-page/           # Long-form sales
│   │   ├── lead-magnet/          # Opt-in pages
│   │   └── coming-soon/          # Pre-launch pages
│   │
│   ├── lib/
│   │   ├── pm/
│   │   │   ├── types.ts          # PM data types
│   │   │   ├── client.ts         # PM API client (mock)
│   │   │   └── context-aggregator.ts
│   │   └── ai/
│   │       └── generation-service.ts
│   │
│   └── styles/
│       └── pm-theme.scss         # PM brand colors
```

---

## Deployment Configuration

### Cloudflare Pages (Optional)
Add to `.env.local`:
```
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

Without these, deployment returns mock URLs for development.

---

## User Flow

```
1. User visits /builder
        ↓
2. Selects template (landing page, sales page, etc.)
        ↓
3. Fills out brand info form
   - Business name
   - What they do
   - Ideal customer
   - Problem solved
   - Transformation
   - CTA
        ↓
4. AI generates complete HTML page
        ↓
5. Preview with device switching
        ↓
6. Edit via chat ("make headline bigger")
        ↓
7. Deploy to Cloudflare Pages
        ↓
8. Live URL! 🎉
```

---

## Next Steps

### To Complete MVP
- [ ] Add Cloudflare credentials for real deployment
- [ ] Test full generation → deploy flow
- [ ] Add template preview images
- [ ] Polish mobile UI

### PM Integration (Needs Suhail)
- [ ] Replace mock client with real PM API
- [ ] Share auth between PM and builder
- [ ] Pull Interview/KB/Copy data

### Nice to Have
- [ ] Custom domain support
- [ ] Version history
- [ ] A/B test variations
- [ ] Analytics integration

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Remix + Vite |
| AI | Claude Sonnet 4 (Anthropic) |
| Styling | Tailwind CSS |
| Preview | iframe + Tailwind CDN |
| Deployment | Cloudflare Pages API |
| Base | bolt.diy fork |

---

## Cost Analysis

At $147/mo user price:
- AI cost: ~$4/user/month (unlimited use)
- Hosting: ~$0.10/user/month
- **Margin: 97%**

---

*Last updated: 2026-01-28*
*Built by SYNTHIOS 🦞*
