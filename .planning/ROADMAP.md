# Roadmap: Poimandres Theme Variants

## Overview

Create a complete, accessible theme variant system for OpenCode based on the Poimandres color scheme. Deliver dark theme foundation with validated contrast and color palette, then add light variant with user switching capability and comprehensive documentation.

## Phases

**Phase Numbering:**
- Integer phases (1, 2): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Dark Theme Foundation** - Establish color system with validated contrast and palette
- [ ] **Phase 2: Light Theme & UX** - Create light variant and enable theme switching

## Phase Details

### Phase 1: Dark Theme Foundation

**Goal**: Complete dark theme with validated accessibility and extended color palette

**Depends on**: Nothing (first phase)

**Requirements**: THEME-02, THEME-03, THEME-04, SYNTAX-01

**Success Criteria** (what must be TRUE):
  1. Dark theme variant works correctly with extended turquoise palette
  2. All text and UI elements meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
  3. Turquoise palette provides 5-7 distinct shades for visual hierarchy (darkest to lightest)
  4. Theme variant file follows poimandres.json structure for OpenCode compatibility

**Plans**: 3

Plans:
- [ ] 01-01: Generate extended turquoise palette with 5-7 shades and validation scripts
- [ ] 01-02: Create turquoise-expanded theme variant file with integrated palette
- [ ] 01-03: Validate WCAG AA compliance and generate contrast report

### Phase 2: Light Theme & UX

**Goal**: Light variant with complete semantic tokens and user-accessible theme switching

**Depends on**: Phase 1

**Requirements**: THEME-01, UX-01, DOCS-01

**Success Criteria** (what must be TRUE):
  1. Light theme variant works correctly with complete semantic token colors
  2. Users can switch between dark and light variants via command palette
  3. README documents all color tokens with hex values and usage examples
  4. Both variants maintain consistent Poimandres aesthetic

**Plans**: TBD

Plans:
- [ ] 02-01: [Brief description of first plan]
- [ ] 02-02: [Brief description of second plan]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dark Theme Foundation | 0/3 | Ready to execute | - |
| 2. Light Theme & UX | 0/2 | Not started | - |
