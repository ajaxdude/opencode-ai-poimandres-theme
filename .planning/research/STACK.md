# Technology Stack

**Domain:** JSON-based theme variant creation for OpenCode
**Researched:** 2026-02-09
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|----------------|
| **JSON Schema** | Draft-07 | Theme structure validation and IDE autocomplete | Industry standard for JSON validation. Provides schema validation in VS Code and other IDEs, catches typos and errors early. Enables real-time validation, tooltips, and inline documentation. Required by WordPress theme.json and VS Code color theme schemas for proper tooling support. |
| **JSON with Comments (JSONC)** | — | Theme file format for OpenCode | Allows comments in theme files for better maintainability and user understanding. OpenCode supports both JSON and JSONC formats, giving developers flexibility. Improves DX by enabling documentation directly in theme files. |
| **CSS Variables** | Modern browsers (2024+) | Theme variable definitions and runtime switching | Browser-native approach using custom properties (--var-name) for theming. Enables dynamic theme switching without page reload. Best practice for 2025 with widespread support. Integrates with media queries (prefers-color-scheme) for automatic light/dark mode detection. |

### Color Palette Generation

| Library | Version | Purpose | When to Use |
|----------|---------|---------|----------------|
| **@palettebro/generator** | 2.0.5 | Full-featured palette generator with OKLCH color space and APCA accessibility | Use when creating multiple theme variants with accessibility validation. Automatically generates light and dark themes, supports Material You patterns, dynamic AI palettes. Built-in color contrast validation with APCA (Accessibly Perceivable Contrast Algorithm) - superior to WCAG for modern accessibility. |
| **@martinlaxenaire/color-palette-generator** | 2.0.1 | Lightweight palette generation from base colors | Use for simple palette generation from 1-3 base colors. Creates hue-shifted base palettes and lighter/darker variants by manipulating saturation and brightness. Good for generating harmonious color families from brand colors. |
| **@14ch/color-palette-generator** | 1.0.2 | Multi-hue palette generation with tone balancing | Use when creating multi-color systems with similar visual weight. Uses OKLCH color space for perceptual uniformity. Ensures colors at same brightness level have similar intensity across different hues. |
| **tailwindcss-palette-generator** | 2.0.0 | Tailwind CSS v4 palette extension | Use specifically for Tailwind CSS v4 projects. Generates complete palettes from single base color with shade levels (50-900). Auto-generates CSS variables format. |

### Validation Tools

| Tool | Purpose | When to Use |
|------|---------|----------------|
| **Ajv (Another JSON Schema Validator)** | Latest | Production-ready JSON schema validation for Node.js | Use for automated validation in build pipelines and CI/CD. Fastest JSON Schema validator in JavaScript. High performance suitable for production applications. |
| **Zod** | Latest | TypeScript-first runtime validation | Use when you need compile-time type safety and runtime validation. Integrates seamlessly with TypeScript. Better error messages and developer experience compared to raw JSON Schema. |
| **JSONLint (jsonlint.com)** | — | Quick online validation and formatting | Use for ad-hoc validation during development. Validates and formats JSON, supports JSON Schema validation, real-time error highlighting. Free and browser-based. |

### Accessibility Testing Tools

| Tool | Purpose | When to Use |
|------|---------|----------------|
| **WebAIM Contrast Checker** | Latest | Manual color contrast validation against WCAG 2.2 | Use for checking specific color pairs. Enter hex colors, instant pass/fail for AA/AAA. Shows lightness slider for color adjustment. Best for design review and checking specific UI combinations. |
| **WAVE (WebAIM)** | Latest | Automated WCAG accessibility evaluation of rendered pages | Use for scanning deployed themes for contrast issues. Visual representation of contrast errors, shows which elements fail. Best for comprehensive accessibility audit of actual rendered output. |
| **Colour Contrast Analyser (CCA)** | Latest | Desktop app with eyedropper and WCAG checking | Use for testing color contrast across any application. Eyedropper for any screen color, WCAG compliance checking, color blindness simulation. Best for desktop application testing. |
| **EqualWeb Accessibility Checker** | Latest | Automated real-time contrast detection | Use for AI-powered automated accessibility testing. Scans entire domains for WCAG violations including contrast. Provides detailed recommendations for fixes. |
| **axe DevTools** | Latest | Browser extension for developer-integrated accessibility testing | Use for real-time accessibility checking during development. Integrates with Chrome DevTools, shows WCAG violations directly in browser. Good for iterative development workflow. |
| **Google Lighthouse** | Latest | Built-in Chrome DevTools accessibility audit | Use for comprehensive performance and accessibility audit. Built into Chrome DevTools (Lighthouse tab). Checks semantic markup, color contrast, ARIA, and screen reader compatibility. |

## Installation

```bash
# Core - JSON Schema validation
npm install ajv json-schema

# TypeScript-first validation
npm install zod

# Color palette generation
npm install @palettebro/generator
npm install @martinlaxenaire/color-palette-generator

# Lightweight palette from base colors
npm install @14ch/color-palette-generator

# Tailwind CSS specific (if using Tailwind)
npm install -D tailwindcss-palette-generator
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-----------------------|
| JSON Schema with $schema reference | Plain JSON validation without schema | When you don't need IDE autocomplete or real-time validation. Schema-less validation is simpler but loses tooling benefits (no validation, no tooltips, no autocomplete). |
| CSS Variables with data-theme attribute | CSS variables without prefers-color-scheme | When you need user-controlled theme toggles instead of system preference. Media query approach is automatic but offers no user control. data-theme allows manual switching and localStorage persistence. |
| @palettebro/generator | Manual color palette calculation | When you need complete control or have complex palette requirements. Manual calculation is more work but offers unlimited flexibility. Automated generators follow best practices and ensure consistency. |
| Ajv (production) | JSONLint (online only) | For quick ad-hoc validation during development. JSONLint is great for one-off checks but lacks automation capabilities for CI/CD pipelines. |
| Zod (TypeScript-first) | Ajv with JSON Schema | When you need maximum performance or are in pure JavaScript environment. Zod has better DX but Ajv is faster and more mature for pure validation scenarios. |

## What NOT to Use

| Avoid | Why | Use Instead |
|--------|-----|---------------|
| **Plain JSON without $schema reference** | No IDE support, no autocomplete, harder to catch typos | Always include `"https://opencode.ai/theme.json"` schema reference at top of theme files. Enables validation, tooltips, and autocomplete in VS Code and other editors. |
| **Deprecated JSON Schema versions** | Older versions may not validate properly, missing features | Use current Draft-07 (https://json-schema.org/draft-07/schema#). Draft-07 is latest and widely supported. Avoid draft-04 or draft-06 as they're outdated. |
| **Manual color contrast calculations** | Error-prone, doesn't account for perceptual contrast | Use automated tools with APCA or OKLCH color spaces. WCAG contrast ratios (4.5:1) are minimum baseline. APCA is superior for modern accessibility standards as it accounts for perceptual lightness. |
| **Single CSS files for all themes** | Hard to maintain, no theme switching support | Use CSS variables (custom properties) with separate files or data attributes. CSS variables enable dynamic theme switching without page reload. Modern browsers (2024+) have excellent support. |
| **Hardcoded color values** | Difficult to update, can't create variants | Use CSS variables or JSON token references. Define colors once in defs section, reference by name throughout theme. Enables palette updates in one place. |

## Stack Patterns by Variant

**If creating Turquoise-expanded variant:**
- Use @martinlaxenaire/color-palette-generator to create a hue-shifted palette from poimandres turquoise (#00CED1)
- Generate 6-8 shades by shifting hue ±30° from base
- Because: Creates harmonious color family while maintaining brand identity
- Then: Update def entries with new turquoise shade names (poimandresTurquoiseLight, poimandresTurquoiseMedium, etc.)

**If creating Light theme variant:**
- Use CSS variable inversion or manually design accessible light palette
- Invert background (#1b1e28 → #e4f0fb) and text colors with careful contrast checking
- Because: Direct inversion often fails WCAG. Use palette generator to ensure 4.5:1 minimum contrast ratio
- Then: Update all theme color references to use light variants while maintaining semantic meaning

**If using Tailwind CSS:**
- Use tailwindcss-palette-generator plugin
- Define base colors in CSS: `@plugin "tailwindcss-palette-generator" { primary: #00CED1; secondary: #5DE4c7; }`
- Because: Automatically generates 50-900 shade scale, compatible with Tailwind v4
- Then: Use generated palette values in theme definitions

**If implementing variant switching:**
- Use data-theme attribute: `<html data-theme="turquoise">` or `<html data-theme="light">`
- Define CSS variables for each theme: `--bg: var(--theme-bg-turquoise)`
- Because: Enables instant switching without page reload, persists with localStorage
- Alternatively: Use prefers-color-scheme media query for automatic detection: `@media (prefers-color-scheme: dark)`

## Version Compatibility

| Package | Compatible With | Notes |
|---------|----------------|-------|
| ajv | JSON Schema Draft-07 | Recommended version. Supports all Draft-07 features including recursive references, conditional validation. |
| zod | TypeScript 4.1+ | For optimal type inference. Works with older TS versions but requires more type annotations. |
| @palettebro/generator | Node.js 16+, browsers (via bundler) | Uses Culori and @material/material-color-utilities. Bundle size ~32KB. |
| tailwindcss-palette-generator | Tailwind CSS v4+ | Specifically designed for Tailwind v4. Not compatible with v3 without modifications. |
| VS Code JSON Schema support | All versions (built-in) | `$schema` property enables validation in VS Code, WebStorm, and other modern editors without plugins. |

## Standard Theme Structure (OpenCode)

```json
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "colorName": "#hexvalue",
    // Color definitions - semantic names with hex values
  },
  "theme": {
    "element": {
      "dark": "colorName",
      "light": "colorName"
      // Each UI element supports dark/light modes
    }
  }
}
```

## File Naming Conventions

Based on industry best practices and VS Code/WordPress standards:

### Variant Naming Pattern
```
{basename}-{variant}.json
{basename}-{variant}.jsonc
```

**Examples:**
- `poimandres.json` (base/default)
- `poimandres-turquoise-expanded.json` (variant)
- `poimandres-light.json` (variant)
- `poimandres-light.jsonc` (JSONC with comments)

### Semantic Naming
- **Light/Dark variants**: Use `-light` or `-dark` suffix
- **Color-specific variants**: Use color name as suffix (e.g., `-turquoise`, `-blue`)
- **Functional variants**: Use descriptive suffixes (e.g., `-high-contrast`, `-minimal`)

### Versioning Pattern
- Use semantic versioning: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`, `1.1.0`)
- MAJOR: Breaking changes (schema changes, removed colors)
- MINOR: New features (new color definitions, new theme sections)
- PATCH: Bug fixes (typo corrections, hex value fixes)

### Directory Structure
```
.opencode/
├── themes/
│   ├── poimandres.json           # Base theme
│   ├── poimandres-turquoise.json  # Turquoise variant
│   ├── poimandres-light.json       # Light theme variant
│   └── poimandres-light.jsonc    # JSONC version with comments
├── opencode.json                   # Project config
└── package.json                    # Dependencies
```

## Validation Workflow

### Development Phase
1. **Write theme file with schema reference** (MEDIUM confidence - OpenCode docs verify)
   ```json
   {
     "$schema": "https://opencode.ai/theme.json",
     ...
   }
   ```
2. **Use IDE validation**: VS Code/WebStorm will validate against schema automatically
3. **Manual validation**: Run `ajv validate -s theme.json opencode/themes/poimandres.json`

### Pre-Release Phase
1. **Color contrast check**: Use WebAIM Contrast Checker for all text/background pairs
2. **WCAG compliance**: Verify minimum 4.5:1 ratio for normal text, 3:1 for large text
3. **Test with accessibility tools**: WAVE, axe DevTools, or Lighthouse
4. **Test color blindness**: Use Colour Contrast Analyser with simulation

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
name: Validate Theme
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install ajv
      - run: npx ajv validate -s opencode/themes/*.json --data=opencode/themes/*.json
```

## Sources

- **https://opencode.ai/docs/themes/** — OpenCode theme documentation (HIGH confidence - official)
- **https://opencode.ai/docs/config/** — OpenCode JSON config format (HIGH confidence - official)
- **https://opencode.ai/theme.json** — OpenCode theme JSON schema (HIGH confidence - official schema)
- **https://json-schema.org/** — JSON Schema specification (HIGH confidence - official)
- **https://jsonlint.com/** — Online JSON validation (MEDIUM confidence - industry standard)
- **https://webaim.org/resources/contrastchecker/** — WCAG contrast checker (MEDIUM confidence - accessibility standard)
- **https://www.npmjs.com/package/@palettebro/generator** — Palette generator with OKLCH (MEDIUM confidence - npm registry)
- **https://www.npmjs.com/package/@martinlaxenaire/color-palette-generator** — Lightweight palette generator (MEDIUM confidence - npm registry)
- **https://www.npmjs.com/package/@14ch/color-palette-generator** — Tone-balanced palette generator (MEDIUM confidence - npm registry)
- **https://code.visualstudio.com/api/extension-guides/color-theme** — VS Code theme extension API (MEDIUM confidence - official docs)
- **https://developer.wordpress.org/themes/global-settings-and-styles/introduction-to-theme.json** — WordPress theme.json best practices (MEDIUM confidence - official docs)
- **https://www.designtokens.org/TR/2025.10/resolver/** — Design Tokens resolver specification (LOW confidence - emerging standard, 2025.10)

---
*Stack research for: JSON-based theme variant creation*
*Researched: 2026-02-09*
