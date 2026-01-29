# PRD-003: Visual Editor Improvements

**Project:** Website Builder (Pocket Marketer)  
**Priority:** P1 (Core UX)  
**Scope:** Large (6-8h)  
**Status:** In Progress  
**Quality Bar:** As intuitive as Webflow or Framer

---

## Objective

Transform the code-centric editor into a visual-first editing experience with real-time preview, drag-and-drop components, style controls, and robust undo/redo.

---

## Background

Current state:
- Three-way slider (Code | Diff | Preview) - not side-by-side
- No component palette for quick building
- No visual style controls
- Device preview exists ✓
- No undo/redo system
- No autosave indicator

Target state (Webflow/Framer parity):
- Split pane: Editor | Live Preview (simultaneous)
- Component palette with draggable sections
- Visual style panel (colors, fonts, spacing)
- Responsive preview toggle
- Full undo/redo with keyboard shortcuts
- Autosave indicator with status

---

## Tasks

### Phase 1: Split Pane Preview (2h)
- [x] Replace slider with resizable split pane
- [x] Editor on left, live preview on right
- [x] Sync changes in real-time
- [x] Collapse/expand preview panel
- [x] Remember user's panel size preference

### Phase 2: Component Palette (2h)
- [x] Create ComponentPalette sidebar
- [x] Define section types (Hero, Features, CTA, Testimonials, etc.)
- [x] Drag-and-drop from palette to preview
- [x] Insert at cursor position or drop zone
- [x] Component thumbnails/icons

### Phase 3: Style Controls (1.5h)
- [x] StylePanel component
- [x] Color picker for text/background
- [x] Font family selector
- [x] Font size / line height / spacing
- [x] Apply to selected element

### Phase 4: Undo/Redo System (1h)
- [x] History store with state snapshots
- [x] Ctrl+Z for undo
- [x] Ctrl+Shift+Z for redo
- [x] Visual undo/redo buttons in toolbar
- [x] History panel (optional)

### Phase 5: Autosave Indicator (0.5h)
- [x] Track save state (saved | saving | unsaved)
- [x] Visual indicator in header
- [x] "Last saved X mins ago" tooltip
- [x] Auto-save on idle (5s debounce)

---

## Success Criteria

- [x] Split pane shows code + preview simultaneously
- [x] Can drag components from palette into preview (via copy to clipboard)
- [x] Can modify styles visually (via style panel + clipboard)
- [x] Ctrl+Z / Ctrl+Shift+Z work smoothly
- [x] Clear indication of save status
- [ ] Feels as polished as Webflow/Framer (needs user testing)

---

## Technical Design

### Split Pane
```tsx
// Use react-resizable-panels (already in deps)
<PanelGroup direction="horizontal">
  <Panel minSize={30}><EditorPanel /></Panel>
  <PanelResizeHandle />
  <Panel minSize={30}><Preview /></Panel>
</PanelGroup>
```

### Component Palette
```tsx
// Components stored as snippets
const COMPONENT_LIBRARY = [
  { id: 'hero', name: 'Hero Section', html: '...', icon: '📸' },
  { id: 'features', name: 'Features Grid', html: '...', icon: '⚡' },
  // ...
];
// Use dnd-kit for drag and drop
```

### History Store
```tsx
// Nanostores-based history
const historyStore = {
  past: [],      // Previous states
  present: {},   // Current state
  future: [],    // Redo stack
  canUndo: computed(...),
  canRedo: computed(...),
  pushState(state),
  undo(),
  redo(),
};
```

### Autosave
```tsx
// Debounced save with status tracking
const saveStatus = atom<'saved' | 'saving' | 'unsaved'>('saved');
const lastSaved = atom<Date | null>(null);
// Auto-trigger save on file change with 5s debounce
```

---

## Files to Create/Modify

**New files:**
- `app/components/workbench/SplitEditor.tsx`
- `app/components/workbench/ComponentPalette.tsx`
- `app/components/workbench/StylePanel.tsx`
- `app/lib/stores/history.ts`
- `app/lib/stores/autosave.ts`
- `app/components/ui/AutosaveIndicator.tsx`

**Modified files:**
- `app/components/workbench/Workbench.client.tsx`
- `app/components/workbench/EditorPanel.tsx`

---

## Out of Scope (Future)

- AI-assisted styling
- Component marketplace
- Collaborative editing
- Version history timeline

---

*Created: 2026-01-28 by SYNTHIOS 🦞*
