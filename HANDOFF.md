# Pocket Marketer Website Builder - Handoff

**Last Updated:** 2026-02-03
**Discord Channel:** #pocket-marketer
**Status:** 🟢 Active Development

---

## What This Is

AI-powered website builder for Pocket Marketer users. A fork of bolt.diy customized to generate marketing websites (landing pages, sales pages, lead magnets) using Claude Sonnet 4, pre-filled with user's brand context from the main PM app.

**Business Context:**
- Part of Pocket Marketer ecosystem ($8.6k/mo revenue)
- Partnership with Chris Rhine (Midnight Oil)
- Cost: ~$4/user/month AI cost at $147/mo price point (97% margin)
- **Affiliate Program Launch: Feb 10, 2026** ← upcoming deadline

---

## Who is Chris?

**Chris Rhine** — Business partner at Midnight Oil, co-creator of Pocket Marketer
- Handles: prompts, marketing tools, icon designs, business strategy
- Working with "marketing buddy" for testimonials
- Heavy PM user (good for catching bugs)
- Seeking UI/UX person (Daniel thinks AI handles this now)
- Contact: chris@pocketmarketer.ai

**Weekly Meeting:** Mondays 12pm CST via Google Meet (daniel@toolsavants.com calendar)

---

## Current State

### ✅ Working
- **Builder UI** — Full workflow at `/builder` route
- **Template Selector** — 4 templates (landing, sales, lead-magnet, coming-soon)
- **AI Generation** — Claude Sonnet 4 generates HTML pages
- **AI Editing** — Chat-based page refinement
- **Preview** — Device switching (desktop/tablet/mobile)
- **PM Theme** — Dark navy + blue accent matching PM app
- **Cloudflare Deploy** — Ready (mock mode until credentials added)
- **Skill Loaders** — Marketing frameworks in `app/lib/skills/index.ts`

### 🔄 In Progress
- Testing generation with marketing frameworks injected
- Skill → Template wiring verification

### 🔴 Blocked
| Blocker | Owner | Notes |
|---------|-------|-------|
| Cloudflare credentials | Daniel | Need API token + account ID for real deploys |
| PM API integration | Suhail | Need real BrandDNA data from PM app |

---

## Recent Context (from Omi/meetings)

### From 2026-01-27 Suhail Meeting:
- Bolt DIY framework being used (forkable like Lovable)
- Using Anthropic Sonnet 4, Cloudflare for hosting
- 25 messages/day/user = ~$4/month cost
- Suhail implemented summarization system for token limits
- Recommendation: "No limits" messaging + silent cap (100-200/day)

### From 2026-01-31 Omi Transcripts:
- Affiliate program targeting Feb 10 launch
- Five-day email campaign recruiting affiliates
- Multi-tier structure via FirstPromoter
- Expecting hundreds of sign-ups
- Weekly training calls: Tuesdays 1pm ET
- Mobile/iOS fixes needed (currently unusable on iPhone) — Jeremy handling
- War Room feature development ongoing

### Key People:
- **Chris Rhine**: prompts, marketing tools, business
- **Suhail**: backend integration, PM API
- **Jeremy**: mobile fixes, war room, weekly training
- **Chelsea**: icon/branding finalization

---

## Key Files

| File | Purpose |
|------|---------|
| `app/routes/builder.tsx` | Main builder UI |
| `app/routes/api.pm-generate.ts` | AI generation endpoint |
| `app/routes/api.pm-edit.ts` | AI editing endpoint |
| `app/routes/api.cloudflare-deploy.ts` | Deploy to Cloudflare Pages |
| `app/templates/index.ts` | Template registry (4 templates) |
| `app/lib/pm/client.ts` | PM API client (mock) |
| `app/lib/pm/context-aggregator.ts` | Aggregates brand context |
| `app/lib/skills/index.ts` | Marketing skill loaders |
| `app/styles/pm-theme.scss` | PM color scheme |
| `.env.local` | Environment variables |
| `CLAUDE.md` | AI context & design system |
| `STATE.md` | Current working state |
| `SPECS.md` | Requirements & specs |

---

## Tech Stack

- **Framework:** Remix + Vite (forked from bolt.diy)
- **Runtime:** Cloudflare Workers (wrangler)
- **AI:** Claude Sonnet 4 via `@anthropic-ai/sdk`
- **Styling:** UnoCSS + Tailwind (generated pages use Tailwind CDN)
- **UI:** Radix UI + Lucide icons
- **Deploy:** Cloudflare Pages API
- **Dev Server:** Port 5100 (configured in pre-start.cjs)

---

## Credentials & Secrets

| Secret | Location | Status |
|--------|----------|--------|
| `ANTHROPIC_API_KEY` | `.env.local` | ✅ Configured |
| `ANTHROPIC_MODEL` | `.env.local` | ✅ claude-sonnet-4-20250514 |
| `CLOUDFLARE_API_TOKEN` | `.env.local` | ❌ Needs setup |
| `CLOUDFLARE_ACCOUNT_ID` | `.env.local` | ❌ Needs setup |
| `PM_API_URL` | `.env.local` | ❌ Waiting on Suhail |
| `PM_API_KEY` | `.env.local` | ❌ Waiting on Suhail |

---

## GitHub Repository

| Field | Value |
|-------|-------|
| Repo | `bigballadanny/website-builder` |
| URL | https://github.com/bigballadanny/website-builder |
| Branch | `main` |
| Latest commit | `7ffdf38` — feat: Add marketing skill loaders |

---

## Marketing Skills Integration

### Skill Sources (~/clawd/skills/)
| Source | Location | Size |
|--------|----------|------|
| Marketing Domination | `pocket-marketer/references/MARKETING-DOMINATION-PROMPT.md` | 106KB |
| PM Library | `pocket-marketer/references/PM-Library.txt` | 120KB |
| Pocket Copywriter | `pocket-marketer/references/Pocket-Copywriter-Prompt.txt` | 7KB |
| marketing-mode | `marketing-mode/SKILL.md` | 23 skills |

### Template → Skill Mapping
```
Landing Page  → page-cro + hooks + customer-avatar (AIDA, social proof)
Sales Page    → copywriting + offer-architect (PAS, long-form)
Lead Magnet   → hooks + email-sequence (value-first, opt-in)
Coming Soon   → brand + social-content (anticipation, scarcity)
```

---

## Commands

```bash
# Install
pnpm install

# Development (runs on port 5100)
pnpm run dev

# Build
pnpm run build

# Preview production build
pnpm run preview

# Type checking
pnpm run typecheck
```

---

## Next Actions (Priority Order)

1. **[HIGH]** Test skill-informed generation
   - Verify marketing frameworks are injected
   - Test all 4 templates with skill context
   - Validate copy quality matches frameworks (PAS, AIDA, etc.)

2. **[HIGH]** Get Cloudflare credentials from Daniel
   - Need API token with Pages permission
   - Need account ID
   - Test real deploy flow

3. **[MEDIUM]** PM API integration (coordinate with Suhail)
   - Get API endpoints and auth
   - Replace mock client in `app/lib/pm/client.ts`
   - Pull real Interview/KB/Copy data

4. **[MEDIUM]** Template preview images
   - Generate thumbnails for each template
   - Add to `/public/templates/`

5. **[LOW]** Custom domain support
   - CNAME setup instructions
   - SSL provisioning via Cloudflare

---

## What's Ready to Work On

**Immediate (no blockers):**
- Test the skill → template generation pipeline
- Verify marketing frameworks are being applied to generated copy
- Run dev server (`pnpm run dev`) and test all 4 templates
- Add template preview thumbnails

**Needs input:**
- Cloudflare credentials (ask Daniel)
- PM API details (ask Suhail)

---

## Recent Git History

```
7ffdf38 feat: Add marketing skill loaders and project framework
36a133f Remove workflows (will add back via web UI)
d765ca3 Initial commit: Pocket Marketer Website Builder
374850f feat: Complete PM website builder prototype
5fdc80d fix: Add package version constraints
e460185 feat: add Pocket Marketer logos from Drive
ad8e917 chore: rebrand to Pocket Marketer
```

---

## Weekly Standup

**When:** Mondays 12pm CST
**Where:** Google Meet (via daniel@toolsavants.com calendar)
**With:** Chris Rhine

---

*For SYNTHIOS: Load this file when working on Pocket Marketer Builder. Update after each session.*
