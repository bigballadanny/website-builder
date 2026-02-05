# PRD-001: Cloudflare Deploy Integration

**Created:** 2026-02-04
**Priority:** P1 (Blocker for launch)
**Size:** S (1-2 hours once credentials obtained)
**Owner:** Daniel (credentials) + SYNTHIOS (implementation)

---

## Objective

Enable real Cloudflare Pages deployment from the website builder, replacing mock mode.

## Background

The builder currently has mock deploy functionality. Users can generate pages but can't actually deploy to live URLs. This is the #1 blocker for the Feb 10 affiliate launch.

## Requirements

### Credentials Needed (Daniel Action)
- [ ] `CLOUDFLARE_API_TOKEN` - API token with Pages write access
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Account ID from dashboard

### Implementation (After Credentials)
1. Add credentials to `.env.local`
2. Update `app/routes/api.cloudflare-deploy.ts` to use real API
3. Test deploy flow end-to-end
4. Verify deployed page loads correctly
5. Add error handling for common failures (rate limits, auth errors)

## Success Criteria

- [ ] User clicks "Deploy" → Page goes live within 30 seconds
- [ ] Deployed URL is displayed to user
- [ ] Error states are handled gracefully
- [ ] Works with all 4 templates

## Verification Steps

```bash
# 1. Verify credentials are set
grep CLOUDFLARE .env.local

# 2. Test deploy API directly
curl -X POST http://localhost:5173/api/cloudflare-deploy \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Test</h1>", "projectName": "test-deploy"}'

# 3. Verify deployed URL loads
curl -I https://test-deploy.pages.dev
```

## Dependencies

- Cloudflare account with Pages enabled
- Daniel to complete OAuth flow (link in #pocket-marketer)

---

## Notes

Cloudflare OAuth was started but not completed. Daniel needs to click the auth link and log in.
