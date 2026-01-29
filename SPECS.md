# Pocket Marketer Builder — Specifications

---

## Overview

AI-powered website builder for Pocket Marketer users. Generates marketing websites (landing pages, sales pages, lead magnets) using Claude, pre-filled with user's brand context from the main PM app.

**Business Context:**
- Part of Pocket Marketer ecosystem ($8.6k/mo revenue)
- Partnership with Chris Rhine (Midnight Oil)
- Cost: ~$4/user/month AI cost at $147/mo price point (97% margin)

---

## Target Users

**Primary:** Pocket Marketer subscribers who need marketing websites
- Small business owners
- Coaches/consultants
- Local service providers
- Course creators

**User Need:** Generate professional marketing pages without coding, using their existing PM brand data (interview responses, knowledge base, copy vault).

---

## Core Requirements

### Must Have (MVP)

- [x] **Template Selection** — 4 templates covering main use cases
  - Landing page (lead gen)
  - Sales page (long-form)
  - Lead magnet page (opt-in)
  - Coming soon (pre-launch)

- [x] **Brand Info Input** — Form to capture:
  - Business name
  - What they do
  - Ideal customer
  - Problem solved
  - Transformation offered
  - Call to action

- [x] **AI Generation** — Claude Sonnet 4 generates complete HTML
  - Acceptance: Generates valid, styled HTML in <10 seconds

- [x] **Live Preview** — See generated page before deploy
  - Desktop/tablet/mobile views
  - Acceptance: Renders correctly in all viewports

- [x] **Chat Editing** — Refine via natural language
  - "Make the headline bigger"
  - "Change the CTA to blue"
  - Acceptance: Edits apply without breaking page

- [x] **Cloudflare Deploy** — One-click publish
  - Acceptance: Returns live URL user can share

- [ ] **Skill-Informed Generation** — Use marketing frameworks
  - Templates use relevant PM/marketing-mode skills
  - Acceptance: Generated copy follows proven frameworks (PAS, AIDA, etc.)

### Should Have (v1.1)

- [ ] **PM API Integration** — Pull real user data
  - Interview responses auto-fill brand info
  - Knowledge base assets (logo, images) available
  - Copy vault headlines/testimonials suggested

- [ ] **Template Preview Images** — Visual selection
  - Thumbnail for each template
  - Shows example output

- [ ] **Custom Domain Support** — Use own domain
  - CNAME setup instructions
  - SSL provisioning

- [ ] **Version History** — Restore previous versions
  - Save snapshots on major edits
  - One-click restore

### Won't Have (Out of Scope for MVP)

- Multi-page sites (single page only)
- E-commerce / checkout
- CMS / content management
- Custom code editing
- Analytics dashboard (use external)
- A/B testing (future)

---

## Technical Constraints

### Stack
- **Framework:** Remix + Vite (inherited from bolt.diy)
- **AI:** Claude Sonnet 4 via Anthropic API
- **Styling:** Tailwind CSS (CDN in generated pages)
- **Hosting:** Cloudflare Pages API
- **Base:** Fork of stackblitz-labs/bolt.diy

### Integration Requirements
- Must accept PM BrandDNA format (see CLAUDE.md)
- Must match PM visual theme (dark navy, blue accent)
- Generated pages must be mobile-first responsive

### Performance Targets
- Generation time: <10 seconds
- Preview load: <2 seconds
- Deploy time: <30 seconds

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Generation success rate | >95% | Valid HTML returned |
| User satisfaction | >4/5 | Post-generation survey |
| Deploy success rate | >99% | Cloudflare API success |
| Time to live page | <2 minutes | From start to published URL |

---

## Definition of Done

MVP is complete when:

- [x] All 4 templates generate valid pages
- [x] Preview works on all device sizes
- [x] Chat editing modifies pages correctly
- [x] Cloudflare deploy returns live URL
- [ ] Skill loaders inject marketing frameworks
- [ ] Full flow tested end-to-end with real credentials
- [ ] Documentation updated (README, CLAUDE.md)

---

## Marketing Skill Integration

### Hierarchy (from Marketing Domination)

```
1. Customer Avatar (WHO) ← Required foundation
2. Core Offer Framework (WHAT) ← Build on avatar
3. Big Idea (WHY different) ← Differentiation
4. Campaign Framework (HOW) ← Journey mapping
5. Hooks Library (WHAT stops scroll) ← Messaging
```

### Template → Skill Mapping

| Template | Primary Skills | Frameworks |
|----------|---------------|------------|
| Landing Page | page-cro, hooks, avatar | AIDA, social proof |
| Sales Page | copywriting, offer-architect | PAS, long-form structure |
| Lead Magnet | hooks, email-sequence | Value-first, opt-in psychology |
| Coming Soon | brand, social-content | Anticipation, scarcity |

### Skill Sources

| Source | Location | Size |
|--------|----------|------|
| Marketing Domination | `~/clawd/skills/pocket-marketer/references/MARKETING-DOMINATION-PROMPT.md` | 106KB |
| PM Library | `~/clawd/skills/pocket-marketer/references/PM-Library.txt` | 120KB |
| Pocket Copywriter | `~/clawd/skills/pocket-marketer/references/Pocket-Copywriter-Prompt.txt` | 7KB |
| marketing-mode | `~/clawd/skills/marketing-mode/SKILL.md` | 23 skills |

---

*Specs v1.0 — SYNTHIOS*
