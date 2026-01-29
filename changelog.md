# Changelog

## [2026-01-28] - Agent SDK & Copywriting Night

### Added
- **Claude Agent SDK Integration** (058468e)
  - Streaming responses via Anthropic API or OpenRouter
  - Model selection: Sonnet 4 (standard) / Opus 4 (premium)
  - 5-step workflow: understand → structure → copy → code → refine
  - AgentPanel chat interface with streaming
  - AgentProgressBar with visual progress
  - RefinementCommands: shorter, longer, urgent, simpler, emotional
  - AIBuildButton floating action
  - Token counting & cost estimation
  - nanostores-based state management

---

## [2026-01-28] - Beast Mode Night

### Fixed
- **Remix Build** (c27a2aa) - Build configuration verified
  - Ran `pnpm install` to restore node_modules
  - Verified `pnpm build` completes successfully
  - Dev server starts on localhost:5174

### Added
- **AI Copywriting Assistant** - Generate compelling marketing copy with AI
  - **AI Write Button** - Opens modal to generate headlines, subheadlines, body copy, and CTAs
  - **Tone Selection** - Professional, Casual, Bold, Friendly options
  - **Section-Aware** - Contextual copy for Hero, Features, CTA, About, Testimonials, etc.
  - **3 Headline Variations** - Pick from multiple options
  - **Improve This Feature** - Refine selected text (Make shorter, longer, persuasive, simpler, urgent, emotional)
  - Uses Gemini API for fast, cost-effective generation
  - New files: AICopywritingModal.tsx, TextImprovementPopover.tsx, api.pm-copywriting.ts

- **Visual Editor Improvements** (PRD-003) - Webflow/Framer-style editing
  - **Split View Mode** - Code + Preview side-by-side with resizable panels
  - **Component Palette** - 10+ drag-and-drop components (Hero, Features, CTA, Testimonials, Pricing, Footer)
  - **Style Panel** - Visual controls for colors, fonts, spacing
  - **Responsive Preview Toggle** - Desktop/Tablet/Mobile viewport switching
  - **Undo/Redo System** - Ctrl+Z / Ctrl+Shift+Z with history store
  - **Autosave Indicator** - Real-time save status (Saved/Saving/Unsaved)
  - New files: SplitEditor.tsx, ComponentPalette.tsx, StylePanel.tsx, history.ts, autosave.ts

- **Template Library** (d172d5f) - 6 templates with gallery UI
  - Templates: landing-page, sales-page, lead-magnet, coming-soon, agency-portfolio, local-business
  - Enhanced TemplateSelector with grid view
  - Category filtering (Lead Gen, Sales, Launch, Portfolio, Local)
  - Preview modal with section indicators
  - "Start from Scratch" option

### Known Issues
- Pre-existing TypeScript errors in RecentProjects.tsx, LoadingScreen.tsx (unrelated to tonight's work)

---

*Updated by SYNTHIOS*
