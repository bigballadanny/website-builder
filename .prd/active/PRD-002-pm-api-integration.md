# PRD-002: Pocket Marketer API Integration

**Created:** 2026-02-04
**Priority:** P2 (Important for UX, not launch blocker)
**Size:** M (2-4 hours)
**Owner:** Suhail (API) + SYNTHIOS (integration)

---

## Objective

Wire up real BrandDNA data from the main Pocket Marketer app so generated websites are pre-personalized with user's business info.

## Background

Currently `app/lib/pm/client.ts` returns mock data. When a user completes the Discovery questionnaire in PM main app, that data should flow into the website builder to pre-fill context.

## Requirements

### From Suhail
- [ ] PM API endpoint URL
- [ ] Authentication method (API key, JWT, etc.)
- [ ] BrandDNA schema documentation
- [ ] Test account credentials

### Implementation
1. Update `app/lib/pm/client.ts` with real API calls
2. Add API credentials to `.env.local`
3. Wire BrandDNA into generation prompts
4. Handle API errors gracefully (fallback to questionnaire)
5. Add loading states while fetching context

## BrandDNA Expected Schema

```typescript
interface BrandDNA {
  businessName: string;
  industry: string;
  targetAudience: string;
  valueProposition: string;
  tone: 'professional' | 'casual' | 'bold' | 'friendly';
  colors?: {
    primary: string;
    secondary: string;
  };
  painPoints: string[];
  solutions: string[];
}
```

## Success Criteria

- [ ] User logs in → BrandDNA auto-loads
- [ ] Generated pages include user's actual business info
- [ ] Graceful fallback if API unavailable
- [ ] No hardcoded mock data in production

## Verification Steps

```bash
# 1. Test PM API connection
curl -H "Authorization: Bearer $PM_API_KEY" \
  https://api.pocketmarketer.ai/v1/brand-dna

# 2. Check integration in builder
# Load builder → verify context panel shows real data

# 3. Generate page → verify business name appears
```

## Dependencies

- Suhail to provide API documentation
- PM API must be stable and accessible
