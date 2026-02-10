# Project Research Summary

**Project:** OpenCode AI Poimandres Theme Variant System
**Domain:** JSON-based theme variant creation for OpenCode
**Researched:** 2026-02-09
**Confidence:** HIGH

## Executive Summary

This is a theme variant system for OpenCode.ai that builds semantic JSON theme files supporting multiple visual styles (dark, light, color variants). Industry approach uses standalone JSON files with schema validation, semantic color tokens, and automated accessibility checking. Recommended stack: JSON Schema Draft-07 for validation, CSS variables for runtime theming, and palette generation tools (@palettebro/generator) for color system creation.

The recommended approach follows OpenCode.ai's standard architecture: standalone theme files in `.opencode/themes/` directory, each with `defs` (color definitions) and `theme` (semantic mappings) sections. Variants use consistent semantic slots while changing color values. No inheritance model—each file is self-contained since OpenCode schema doesn't support `extends`. Build automation and schema validation prevent errors during variant creation.

Key risks: inconsistent contrast across variants (especially dark mode), color mapping conflicts in JSON structure, and maintenance overhead with multiple variants. Mitigation: automated contrast checking (WCAG AA), JSON schema validation, and build-time generation from source-of-truth palette. Avoid manual JSON editing for variants beyond 1-2 files.

## Key Findings

### Recommended Stack

Core technologies: JSON Schema Draft-07 for theme validation and IDE autocomplete, CSS variables for dynamic theme switching, and color palette generators (@palettebro/generator with OKLCH/APCA for accessibility). For validation: Ajv (production) or Zod (TypeScript-first) for JSON schema validation, WebAIM Contrast Checker for WCAG compliance.

**Core technologies:**
- **JSON Schema Draft-07** — Theme structure validation and IDE autocomplete — Industry standard, enables real-time validation in VS Code, catches typos early
- **JSON with Comments (JSONC)** — Theme file format — Allows inline documentation for maintainability, OpenCode supports both JSON/JSONC
- **CSS Variables** — Theme variable definitions and runtime switching — Browser-native approach for 2025, enables dynamic switching without reload
- **@palettebro/generator** — Palette generation with APCA accessibility validation — Superior to WCAG for modern accessibility, generates light/dark themes automatically

### Expected Features

**Must have (table stakes):**
- Dark & Light variants — Users expect theme switching, most popular themes offer both
- Semantic color tokens (primary, secondary, accent, error, warning, success) — Modern design systems standard, enables consistency
- Background & foreground colors (text, backgrounds, panels) — Fundamental theme element for readability
- Syntax highlighting colors (keywords, functions, variables, strings, types) — Core purpose of code editor themes
- Input field colors, markdown styling, diff colors — Essential UI elements for development workflow

**Should have (competitive):**
- Extended color palette (more shades of base colors) — Enables better visual hierarchy, nuanced design
- High contrast variant — Improves accessibility, differentiator for enterprise adoption
- Accessibility compliance certification (WCAG AA) — Increasingly important for enterprise
- Color palette documentation — Developers want to understand and customize theme system

**Defer (v2+):**
- Semantic token support (beyond TextMate grammars) — Requires language server integration, OpenCode platform support unclear
- Theme preview/switching UI — Requires OpenCode SDK features, not essential for launch
- Additional variants beyond dark/light/high-contrast — Wait for user demand

### Architecture Approach

Standard architecture: Theme Discovery Layer (file scanner, validator, variant extractor) → Theme Registry (available themes) → Theme Application Layer (color lookup, reference expansion) → UI Rendering. Recommended pattern: Standalone theme files (no inheritance) in flat `.opencode/themes/` directory. Each variant (poimandres-turquoise.json, poimandres-light.json) is self-contained with its own `defs` and `theme` sections. OpenCode resolves color references at runtime (e.g., `"primary": "poimandresBrightMint"` → look up in `defs` → apply `#5DE4c7`).

**Major components:**
1. **File Scanner** — Discovers theme JSON files in `.opencode/themes/` via glob pattern
2. **Schema Validator** — Verifies files conform to `https://opencode.ai/theme.json` schema
3. **Variant Extractor** — Parses variant name from filename (e.g., "poimandres-light" → "Light" variant)
4. **Theme Registry** — Maintains list of available themes and active theme selection
5. **Color Lookup & Reference Expander** — Resolves semantic color references to hex/ansi values

### Critical Pitfalls

1. **Inconsistent contrast across variants** — Use automated contrast checking tools (WCAG 2.2 compliance) for every color combination in every variant; implement contrast guard system; test both variants early as equal design systems
2. **Color mapping conflicts in JSON structure** — Use build/generation script instead of hand-editing JSON; implement JSON schema validation with `$schema` reference; add post-generation linting; every distinct color should have one named definition
3. **Inherited token pollution across variants** — Separate shared from variant-specific definitions; use build pipeline that imports base and applies overrides; document inheritance model; version variants together (regenerate all when updating shared colors)
4. **Pure black/white backgrounds in dark/light modes** — Use dark grays (#121212 to #1f1f1f range) not pure black for dark themes; use off-white (#f4f4fb, #e4f0fb) not pure #FFFFFF for light themes; leverage existing palette references (poimandresBg, poimandresOffWhite)
5. **Semantic slot misalignment across variants** — Preserve semantic relationships (e.g., all syntax tokens use primary accent family); maintain semantic invariant; document role of each semantic slot; test with real code across all variants

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Color System Foundation
**Rationale:** Research shows inconsistent contrast and color mapping conflicts are critical pitfalls. Establishing automated validation and a clean color system before creating variants prevents these issues. Accessibility compliance (WCAG AA) is required for enterprise adoption and must be built in from start.
**Delivers:** Complete dark variant color palette, automated contrast validation pipeline, JSON schema validation, color naming conventions
**Addresses:** Dark & Light variants (FEATURES.md P1), WCAG AA contrast validation (FEATURES.md P1), Semantic color tokens (FEATURES.md table stakes)
**Avoids:** Inconsistent contrast across variants (PITFALLS.md #1), Color mapping conflicts (PITFALLS.md #2), Pure black/white backgrounds (PITFALLS.md #4)

### Phase 2: Light Variant Generation
**Rationale:** Light variant is the second MVP requirement. Use build pipeline from Phase 1 to generate light theme from dark theme with validated contrast ratios. Research shows manual editing leads to errors—automated generation ensures semantic consistency.
**Delivers:** Complete light variant with semantic tokens, validated contrast ratios, "looks done" completeness (all UI states, syntax highlighting, markdown, diffs)
**Uses:** Automated contrast checking tools (WebAIM, WAVE), palette generation (@martinlaxenaire/color-palette-generator for light palette), CSS variable testing
**Implements:** Theme Application Layer (color lookup, reference expansion), variant discovery mechanism

### Phase 3: Variant Generation System (Turquoise + High Contrast)
**Rationale:** Once dark and light variants are validated and tested, add differentiator variants. Research shows inherited token pollution becomes a maintenance nightmare—Phase 3 builds a generation system to avoid this. Turquoise expands the color palette (FEATURES.md differentiator), high contrast improves accessibility (FEATURES.md differentiator).
**Delivers:** Turquoise variant, high contrast variant, build pipeline for variant generation from source-of-truth palette, semantic specification document
**Uses:** @palettebro/generator with OKLCH/APCA for accessibility, build-time generation scripts, inheritance-aware generation
**Implements:** Build pipeline architecture, semantic invariants enforcement

### Phase 4: Documentation & Distribution
**Rationale:** Color palette documentation is P2 priority (FEATURES.md). Users need to understand theme system to create customizations. Distribution via GitHub raw URLs is standard pattern (STACK.md).
**Delivers:** README documenting all tokens and hex values, variant switching commands, CI/CD pipeline for theme validation
**Uses:** GitHub Actions for automated testing, JSONLint for validation

### Phase Ordering Rationale

- Phase 1 (Foundation) → Phase 2 (Light Variant): Cannot build light variant without validated color system and contrast checking. Research shows manual contrast validation leads to inconsistent results—Phase 1 establishes automation first.
- Phase 2 (Light) → Phase 3 (Additional Variants): Light variant validates the generation pipeline. Only after core dark/light work should we expand to turquoise/high-contrast (differentiators, not MVP).
- Phase 3 (Generation System) → Phase 4 (Distribution): Build pipeline must be in place before distribution automation. Cannot generate variants at scale without the system from Phase 3.
- Grouping: Phases 1-2 focus on MVP (dark + light validated), Phase 3-4 add differentiators and tooling. This follows research showing most themes launch with 2-3 variants, then expand.
- Pitfall avoidance: Each phase addresses critical pitfalls from research. Phase 1 prevents contrast/mapping errors. Phase 2 prevents "looks done but isn't" issues. Phase 3 prevents inherited token pollution.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Light Variant Generation):** Color theory for light theme adaptation—research suggests hue shifts and saturation adjustments for light mode, but specific techniques need validation with real code
- **Phase 3 (High Contrast Variant):** APCA contrast algorithm research—superior to WCAG for modern accessibility but may require color palette redesign (not just darkening)

Phases with standard patterns (skip research-phase):
- **Phase 1 (Color System Foundation):** Well-documented patterns from VS Code theme API, WCAG guidelines, and OpenCode schema (HIGH confidence sources)
- **Phase 4 (Documentation & Distribution):** GitHub Actions and JSON validation are standard tooling with established patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official OpenCode schema (https://opencode.ai/theme.json), JSON Schema Draft-07 spec, and established npm packages |
| Features | MEDIUM | VS Code theme API and marketplace analysis provide clear feature expectations, but OpenCode-specific variants may differ slightly |
| Architecture | HIGH | OpenCode schema and existing implementations (anomalyco/opencode, folke/tokyonight) confirm standalone file pattern |
| Pitfalls | HIGH | WCAG guidelines and accessibility research are well-established; community consensus on JSON theme errors |

**Overall confidence:** HIGH

### Gaps to Address

- **OpenCode-specific variant discovery mechanism:** Research assumes standard file glob pattern, but OpenCode may have custom theme loading logic—validate with platform docs during Phase 1
- **Light theme color adaptation techniques:** Research suggests general principles (off-whites, saturation adjustments), but specific Poimandres-to-light conversion needs validation during Phase 2
- **Semantic token support feasibility:** OpenCode may not support semantic tokens (language server knowledge) like VS Code—confirm during Phase 1 before considering for v2

## Sources

### Primary (HIGH confidence)
- **https://opencode.ai/theme.json** — OpenCode theme JSON schema (official)
- **https://opencode.ai/docs/themes/** — OpenCode theme documentation (official)
- **https://opencode.ai/docs/config/** — OpenCode JSON config format (official)
- **https://json-schema.org/** — JSON Schema specification (official)
- **https://code.visualstudio.com/api/extension-guides/color-theme** — VS Code theme extension API (official)
- **https://code.visualstudio.com/api/references/theme-color** — VS Code theme color reference (official)
- **https://www.w3.org/WAI/WCAG21/Understanding/contrast-ratios** — WCAG 2.2 contrast guidelines (official)
- **https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast** — MDN color contrast (official)

### Secondary (MEDIUM confidence)
- **https://marketplace.visualstudio.com/items?itemName=pmndrs.pmndrs** — Poimandres theme marketplace (verified source)
- **https://marketplace.visualstudio.com/items?itemName=ryanolsonx.poimandres-contrast** — Poimandres-contrast variant (verified source)
- **https://marketplace.visualstudio.com/items?itemName=AlexLi.vibecolors** — VibeColors with 15 variants (verified source)
- **https://webaim.org/resources/contrastchecker/** — WCAG contrast checker (industry standard)
- **https://developer.wordpress.org/themes/global-settings-and-styles/introduction-to-theme.json** — WordPress theme.json best practices (official docs, similar patterns)
- **https://www.npmjs.com/package/@palettebro/generator** — Palette generator with OKLCH (npm registry)
- **https://www.npmjs.com/package/@martinlaxenaire/color-palette-generator** — Lightweight palette generator (npm registry)
- **https://github.com/anomalyco/opencode** — OpenCode theme implementations (verified source)
- **https://github.com/folke/tokyonight.nvim** — Theme generation patterns (verified source)

### Tertiary (LOW confidence)
- **https://theme-ui.com/guides/variants** — Theme UI variants guide (websearch only, needs validation for OpenCode context)
- Various theme comparison blog posts and community discussions — Not verified against official sources

---

*Research completed: 2026-02-09*
*Ready for roadmap: yes*
