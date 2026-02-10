# Poimandres Theme Variants

## What This Is

A theme customization for OpenCode based on the Poimandres color scheme, providing enhanced semantic color mapping and multiple color variants. The theme is shared on GitHub for community use.

## Core Value

Theme provides visually consistent, accessible color variants that maintain the Poimandres aesthetic while improving UI element coverage.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Turquoise-expanded variant with enhanced turquoise color scale
- [ ] Light theme variant with inverted color scheme
- [ ] Improved semantic color mapping for better UI coverage
- [ ] Maintain existing poimandres.json without modifications
- [ ] Ensure variants follow the same JSON structure as current theme

### Out of Scope

- Modifying the existing poimandres.json file
- Creating variants beyond turquoise-expanded and light theme
- Dynamic theme switching (variants are separate files)

## Context

- Existing theme: poimandres.json (250 lines, covers backgrounds, accents, syntax, UI elements)
- Current palette uses mint (#5DE4c7), turquoise (#00CED1), and desaturated blue (#91B4D5)
- Theme is active and shared on GitHub
- User wants to explore more turquoise usage and a proper light theme

## Constraints

- **File Format**: Must match existing poimandres.json structure for compatibility
- **Compatibility**: Variants must work with OpenCode's theming system
- **Non-destructive**: Do not modify existing poimandres.json
- **Consistency**: Maintain Poimandres aesthetic across variants

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep poimandres.json unchanged | Users may rely on existing theme | — Pending |
| Create separate variant files | Allows users to choose between variants | — Pending |

---
*Last updated: 2025-02-09 after initialization*
