# PRD-002: Marketing Template Library

**Project:** Website Builder (Pocket Marketer)  
**Priority:** P2 (Completion)  
**Scope:** Medium (4h)  
**Status:** Ready (after PRD-001)

---

## Objective

Build a library of pre-made marketing-focused templates that users can start from, accelerating the website building process.

---

## Background

Current builder starts blank. Marketing agencies need quick starts:
- Landing pages (lead gen, webinar, product launch)
- Agency portfolio sites
- Local business sites (restaurant, clinic, gym)
- Service business sites

---

## Tasks

### Phase 1: Template Structure (1h)
- [ ] Define template format (HTML + Tailwind, no framework deps)
- [ ] Create `templates/` directory
- [ ] Build template metadata schema (name, category, preview image)
- [ ] Create template loader utility

### Phase 2: Core Templates (2h)
- [ ] **Lead Gen Landing Page** - Hero, benefits, form, testimonials
- [ ] **Agency Portfolio** - About, services, case studies, contact
- [ ] **Local Business** - Hero, services, hours, map, reviews
- [ ] **SaaS Marketing** - Features, pricing, FAQ, CTA

### Phase 3: Template Picker UI (1h)
- [ ] Create template gallery component
- [ ] Show previews/thumbnails
- [ ] "Start from Template" vs "Start Blank"
- [ ] Load template into editor on selection

---

## Success Criteria

- [ ] 4+ templates available
- [ ] Users can preview templates before selecting
- [ ] Selected template loads into editor
- [ ] Templates are well-designed and mobile-responsive
- [ ] Build passes with no errors

---

## Technical Notes

- Templates: Pure HTML + Tailwind (no React components)
- Store in `public/templates/` or import as strings
- Preview: Screenshot PNGs or live iframe
- Reference: `app/components/pm/` for existing PM components

---

*Created: 2026-01-28 by SYNTHIOS 🦞*
