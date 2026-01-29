# Changelog

## [2026-01-28] - Beast Mode Night

### Fixed
- **Remix Build** (c27a2aa) - Build configuration verified
  - Ran `pnpm install` to restore node_modules
  - Verified `pnpm build` completes successfully
  - Dev server starts on localhost:5174

### Added
- **Template Library** (d172d5f) - 6 templates with gallery UI
  - Templates: landing-page, sales-page, lead-magnet, coming-soon, agency-portfolio, local-business
  - Enhanced TemplateSelector with grid view
  - Category filtering (Lead Gen, Sales, Launch, Portfolio, Local)
  - Preview modal with section indicators
  - "Start from Scratch" option

### Known Issues
- Pre-existing TypeScript errors in RecentProjects.tsx, LoadingScreen.tsx, AutoSaveIndicator.tsx (unrelated to tonight's work)

---

*Updated by SYNTHIOS*
