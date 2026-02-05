# Pocket Marketer Builder Context

## Current State
AI-powered website builder for Pocket Marketer ecosystem. Fork of bolt.diy customized for marketing sites.

**What's Built:**
- Full builder workflow at `/builder` route
- 9-question Discovery flow with marketing psychology
- 4 templates: landing, sales, lead-magnet, coming-soon
- Claude Sonnet 4 AI generation & editing
- Device preview switching (desktop/tablet/mobile)
- PM dark navy + blue theme applied
- Marketing skill loaders (AIDA, PAS, CRO frameworks)
- Cloudflare Pages deploy (mock mode)
- 189 tests passing, TypeScript clean, build succeeds

**Deployed:** Not yet (waiting on Cloudflare credentials)

## Backlog (Priority Order)
1. Get Cloudflare credentials from Daniel - size S
2. Test full Discovery → Generate → Deploy flow with real AI - size M
3. Coordinate with Suhail on PM API integration - size M
4. Add template preview thumbnails - size S
5. Wire real PM context (BrandDNA) pre-filling - size L
6. Add E2E tests with Playwright - size M
7. Custom domain support (CNAME + SSL) - size S

## Blockers
- **Cloudflare credentials** - Need API token + account ID from Daniel for real deploys
- **PM API endpoints** - Need Suhail to provide API URL/key for brand context

## Success Criteria
- Users can: Answer questions → Generate page → Preview → Deploy to Cloudflare
- Marketing frameworks visibly improve copy quality
- Live before affiliate program launch (Feb 10, 2026)

## Key Files
```
app/routes/builder.tsx              # Main builder UI
app/components/pm/Discovery.tsx     # 9-question flow
app/routes/api.pm-generate.ts       # AI generation endpoint
app/routes/api.pm-edit.ts           # AI editing endpoint
app/routes/api.cloudflare-deploy.ts # Deploy API
app/templates/index.ts              # Template registry
app/lib/skills/index.ts             # Marketing frameworks
app/lib/pm/client.ts                # PM API client (mock)
.env.local                          # Secrets
STATE.md                            # Current working state
HANDOFF.md                          # Full context doc
```

---
*Last updated: 2026-02-04*
