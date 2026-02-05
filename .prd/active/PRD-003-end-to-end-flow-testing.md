# PRD-003: End-to-End Flow Testing

**Created:** 2026-02-04
**Priority:** P1 (Must complete before launch)
**Size:** M (2-3 hours)
**Owner:** Daniel (manual testing) + SYNTHIOS (fixes)

---

## Objective

Verify the complete user journey works flawlessly: Discovery → Template Selection → AI Generation → Preview → Edit → Deploy.

## Test Scenarios

### Scenario 1: New User Flow
1. Navigate to `/builder`
2. Complete 9-question Discovery
3. Select "Landing Page" template
4. Click "Generate"
5. Wait for AI generation (~10-15s)
6. Preview on desktop/tablet/mobile
7. Make an edit via chat ("Change the headline to X")
8. Deploy to Cloudflare
9. Visit deployed URL

**Expected:** All steps complete without errors

### Scenario 2: Template Variations
Repeat Scenario 1 with each template:
- [ ] Landing Page
- [ ] Sales Page
- [ ] Lead Magnet
- [ ] Coming Soon

### Scenario 3: Edit Flow
1. Generate a page
2. Request 3 different edits:
   - "Make the CTA button red"
   - "Add a testimonial section"
   - "Change the tone to be more casual"
3. Verify each edit applies correctly

### Scenario 4: Error Handling
1. Test with invalid API key → graceful error
2. Test with network disconnect → retry option
3. Test with very long content → handles gracefully

## Success Criteria

- [ ] All 4 templates generate valid HTML
- [ ] Preview renders correctly on all devices
- [ ] Edits apply without breaking layout
- [ ] Deploy completes in <60 seconds
- [ ] No console errors in browser
- [ ] No unhandled exceptions

## Verification Commands

```bash
# Build passes
pnpm build

# Tests pass
pnpm test

# Dev server runs
pnpm dev

# No TypeScript errors
pnpm typecheck
```

## Bug Tracking

| Bug | Severity | Status | Fix |
|-----|----------|--------|-----|
| (discovered during testing) | | | |

---

## Notes

Daniel will do hands-on testing. SYNTHIOS fixes any bugs found.
