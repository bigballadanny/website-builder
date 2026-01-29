# PRD-001: Remix Build Configuration Fix

**Project:** Website Builder (Pocket Marketer)  
**Priority:** P1 (Broken)  
**Scope:** Small (1h)  
**Status:** Ready

---

## Objective

Fix the build system so `npm run build` (or `pnpm build`) works correctly without "remix: command not found" error.

---

## Background

Build fails with:
```
> remix vite:build
sh: remix: command not found
```

The `remix` CLI isn't available globally. Needs to use npx or properly installed local binary.

---

## Tasks

### Phase 1: Diagnose (15min)
- [ ] Check if `@remix-run/dev` is in devDependencies
- [ ] Verify `node_modules/.bin/remix` exists
- [ ] Check pnpm vs npm usage (project uses pnpm)

### Phase 2: Fix Scripts (30min)
- [ ] Update `package.json` scripts to use proper paths:
  ```json
  "build": "npx remix vite:build",
  "dev": "npx remix vite:dev"
  ```
  OR ensure pnpm runs binaries correctly
- [ ] Run `pnpm install` to ensure deps present
- [ ] Test `pnpm build` succeeds

### Phase 3: Verify (15min)
- [ ] Full build completes without errors
- [ ] `dist/` folder created with assets
- [ ] Dev server starts correctly

---

## Success Criteria

- [ ] `pnpm build` or `npm run build` succeeds
- [ ] No "command not found" errors
- [ ] Build outputs production assets
- [ ] Dev server starts with `pnpm dev`

---

## Technical Notes

- Project uses Remix + Vite
- Package manager: pnpm (see lockfile)
- May need: `pnpm add -D @remix-run/dev`

---

*Created: 2026-01-28 by SYNTHIOS 🦞*
