# Pocket Marketer Builder — State

**Last Updated:** 2026-02-03 09:20 CST
**Channel:** #pocket-marketer

---

## 🎯 Current Focus
Wiring skill → template connections so AI generation uses proper marketing frameworks.

---

## ✅ What's Working

| Component | Status | Location |
|-----------|--------|----------|
| Builder UI | ✅ Full workflow | `/builder` route |
| Template Selector | ✅ 4 templates | `app/templates/` |
| AI Generation | ✅ Claude Sonnet 4 | `api.pm-generate.ts` |
| AI Editing | ✅ Chat-based | `api.pm-edit.ts` |
| Preview | ✅ Device switching | `PreviewFrame.tsx` |
| Cloudflare Deploy | ✅ Ready (mock mode) | `api.cloudflare-deploy.ts` |
| PM Theme | ✅ Dark navy + blue | `pm-theme.scss` |

---

## 🚧 In Progress

- [x] Create PROJECT-FRAMEWORK.md (system-wide)
- [x] Create STATE.md (this file)
- [x] Create SPECS.md
- [x] Wire skill loaders → template prompts
- [ ] Test generation with marketing frameworks

---

## 🔴 Blocked / Needs Input

| Blocker | Owner | Notes |
|---------|-------|-------|
| Cloudflare credentials | Daniel | Need API token + account ID for real deploys |
| PM API integration | Suhail | Real BrandDNA data from PM app |

---

## 📋 Next Up (Queue)

1. **Skill → Template Wiring** ← NOW
   - Add skill loaders in `app/lib/skills/`
   - Connect to generation prompts
   
2. **Template Preview Images**
   - Generate preview thumbnails
   - Add to `/public/templates/`

3. **Full Flow Test**
   - Generate → Preview → Deploy with real Cloudflare
   
4. **PM API Integration** (with Suhail)
   - Replace mock client
   - Pull Interview/KB/Copy data

---

## 🧠 Context for Next Session

### Key Decisions Made
- **No Agents SDK for now** — Current request/response is sufficient for MVP
- **Skills already allocated** — Marketing Domination (106KB), PM Library (120KB), marketing-mode (23 skills)
- **Template strategy** — 4 templates (landing, sales, lead-magnet, coming-soon) each mapped to specific skills

### Skill → Template Mapping
```
Landing Page  → page-cro + hooks + customer-avatar
Sales Page    → copywriting + offer-architect + big-idea
Lead Magnet   → hooks + email-sequence
Coming Soon   → brand + social-content
```

### File Locations
- Project: `~/Documents/cowork/pocket-marketer-builder/`
- Skills: `~/clawd/skills/pocket-marketer/references/`
- Marketing Mode: `~/clawd/skills/marketing-mode/SKILL.md`

---

*Updated by SYNTHIOS*
