# Pocket Marketer Builder — State

**Last Updated:** 2026-02-03 09:30 CST
**Channel:** #pocket-marketer

---

## 🎯 Current Focus
Matching PM theme and building enhanced Discovery flow with marketing skill integration.

---

## ✅ What's Working

| Component | Status | Location |
|-----------|--------|----------|
| Builder UI | ✅ Full workflow | `/builder` route |
| Discovery Flow | ✅ NEW - 9 guided questions | `app/components/pm/Discovery.tsx` |
| Template Selector | ✅ 4 templates | `app/templates/` |
| AI Generation | ✅ Claude Sonnet 4 | `api.pm-generate.ts` |
| Skill Loaders | ✅ Marketing frameworks | `app/lib/skills/index.ts` |
| AI Editing | ✅ Chat-based | `api.pm-edit.ts` |
| Preview | ✅ Device switching | `PreviewFrame.tsx` |
| Cloudflare Deploy | ✅ Ready (mock mode) | `api.cloudflare-deploy.ts` |
| PM Theme | ✅ Dark navy + blue | `pm-theme.scss` |
| PM Context Docs | ✅ NEW | `docs/PM-APP-CONTEXT.md` |

---

## 🚧 Today's Progress

- [x] Received PM app screenshots (20 PDFs)
- [x] Converted to PNGs for reference
- [x] Documented PM app structure in `docs/PM-APP-CONTEXT.md`
- [x] Cleaned "Bolt" branding from user-visible text
- [x] Created Discovery.tsx with enhanced marketing questions
- [x] Integrated Discovery flow into builder route
- [x] Added goal → template recommendation logic
- [ ] Test full Discovery → Generate flow
- [ ] Fine-tune PM theme matching

---

## 📋 Discovery Flow Logic

```
User enters /builder
        ↓
Check for PM context (API call - stubbed for now)
        ↓
    Has context?
   ┌─── NO ───┴─── YES ───┐
   ↓                       ↓
Discovery Flow      Pre-fill from PM
(9 questions)       Interview data
   ↓                       ↓
   └───── Template Selection ─────┘
                ↓
         (Goal-based recommendation)
                ↓
     Styling → Brand → Generate → Deploy
```

---

## 🧠 Discovery Questions (Enhanced with Skills)

| # | Question | Maps To | Skill Context |
|---|----------|---------|---------------|
| 1 | What's the ONE thing you want this website to accomplish? | mainGoal + template | Marketing Domination: Single focus |
| 2 | What does your business do? | businessDescription | Clear = sharp messaging |
| 3 | Who is your ideal customer? | idealCustomer | Customer Avatar Tool |
| 4 | What problem do you solve? | problemSolved | PAS Framework |
| 5 | What transformation do they want? | desiredTransformation | Sell transformation, not process |
| 6 | What are you selling? | offering | Offer Architect |
| 7 | Why choose you? | differentiators | Big Idea / Unique mechanism |
| 8 | What should they do? | callToAction | CRO: Action-oriented CTAs |
| 9 | Any social proof? | socialProof | 15-30% conversion boost |

---

## 🔴 Still Needed

| Item | Owner | Notes |
|------|-------|-------|
| PM API Integration | Suhail | Real context from PM app |
| Cloudflare credentials | Daniel | For real deploys (can wait) |
| Template preview images | TBD | Visual selection |

---

## 📂 Key Files

```
pocket-marketer-builder/
├── app/
│   ├── components/pm/
│   │   ├── Discovery.tsx      ← NEW: Enhanced discovery flow
│   │   ├── TemplateSelector.tsx
│   │   └── PreviewFrame.tsx
│   ├── routes/
│   │   └── builder.tsx        ← Updated with Discovery integration
│   ├── lib/
│   │   └── skills/index.ts    ← Marketing frameworks per template
│   └── styles/
│       └── pm-theme.scss      ← PM dark navy theme
├── docs/
│   ├── PM-APP-CONTEXT.md      ← NEW: Full PM app documentation
│   └── pm-reference/          ← NEW: PM screenshots (PDFs + PNGs)
├── STATE.md
├── SPECS.md
└── CLAUDE.md
```

---

## 🧪 Test Instructions

1. Open http://localhost:5100/builder
2. Should start in Discovery mode
3. Answer 9 questions
4. Should recommend template based on goal
5. Continue through Styling → Brand → Generate

---

*Updated by SYNTHIOS*
