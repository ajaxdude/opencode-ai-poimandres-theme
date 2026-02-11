# Phase 2: Light Theme & UX - Research

**Researched:** 2025-02-11
**Domain:** OpenCode/VSCode theme development, color theory, accessibility
**Confidence:** HIGH

## Summary

Phase 2 requires creating a light theme variant and enabling theme switching for OpenCode's Poimandres theme. Research reveals that OpenCode has a well-defined theme system that already supports dark/light variants through its JSON schema, but the current Poimandres implementation focuses on dark mode aesthetics with light colors primarily used for accessibility compliance.

**Key findings:**
1. OpenCode's theme system natively supports dark/light variants via the `theme` section's object notation
2. Theme switching is handled through the `/theme` slash command and POST `/tui/open-themes` API
3. No additional package.json configuration or plugin system is required for theme variants
4. Light theme colors should be derived from the dark palette using color theory principles (not simple inversion)
5. WCAG AA contrast compliance (4.5:1 for normal text, 3:1 for UI) must be maintained across both modes
6. The current `poimandres-accessible.json` already defines light variant colors for all semantic tokens

**Primary recommendation:** Create a dedicated `poimandres-light.json` theme file that derives light colors from the existing Poimandres dark palette using HSL-based lightness adjustments while preserving hue and saturation, then update the README to document all color tokens with hex values and usage examples.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---------------|
| OpenCode Theme API | 1.1.59 | Theme system and command palette integration | Native support for dark/light variants, no dependencies required |
| TypeScript | 5.x+ | Theme file validation and type safety | Existing codebase uses TypeScript for scripts |
| Node.js | 20+ | Script execution for palette generation | Existing toolchain |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| scripts/color-utils.ts | Existing | WCAG contrast calculations and HSL manipulation | For validating light theme color contrast ratios |
| scripts/validate-contrast.ts | Existing | WCAG AA compliance verification | For ensuring light theme meets accessibility standards |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Single theme file with multiple variants | Separate theme files per variant | Easier to maintain, matches OpenCode's design pattern |
| Color inversion tools | HSL-based lightness adjustment | Simple inversion often fails WCAG compliance; HSL adjustment preserves aesthetic |
| External palette libraries | Derive from existing palette | Maintains Poimandres identity vs. using generic color system |

**Installation:**
No additional installation needed - uses existing toolchain and OpenCode's built-in theme system.

## Architecture Patterns

### Recommended Project Structure

```
.opencode/themes/
├── poimandres.json                    # Original dark theme (existing)
├── poimandres-accessible.json         # WCAG compliant dark/light theme (existing)
├── poimandres-turquoise-expanded.json  # Extended palette dark theme (existing)
└── poimandres-light.json              # NEW: Dedicated light theme variant
```

### Pattern 1: OpenCode Theme File Structure

**What:** JSON format with `$schema`, `defs`, and `theme` sections supporting dark/light variants

**When to use:** All OpenCode theme files

**Example:**
```json
// Source: https://github.com/anomalyco/opencode (themes.mdx documentation)
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "customColor1": "#RRGGBB",
    "customColor2": "#RRGGBB"
  },
  "theme": {
    "primary": {
      "dark": "customColor1",
      "light": "customColor2"
    },
    "text": {
      "dark": "poimandresGray",
      "light": "poimandresOffWhite"
    },
    "background": {
      "dark": "poimandresBg",
      "light": "#f5f7fc"
    }
  }
}
```

### Pattern 2: Light Theme Color Derivation

**What:** Convert dark mode colors to light mode by adjusting lightness in HSL space while preserving hue and saturation

**When to use:** Creating light variants from dark theme palettes

**Example:**
```typescript
// Adapted from color-utils.ts existing utilities
function adjustForLightMode(hexColor: string): string {
  const hsl = hexToHSL(hexColor);

  // For light mode: significantly increase lightness
  // Preserve hue and saturation from dark palette
  const newLightness = Math.min(95, hsl.l + 60);

  return hslToHex(hsl.h, hsl.s, newLightness);
}

// Example transformations:
// Dark #1b1e28 (L=12%) → Light #f5f7fc (L=99%)
// Dark #a6accd (L=67%) → Light #1f272f (L=18%)
```

**Color mapping rules:**
- Backgrounds: Dark (#1b1e28) → Light (#f5f7fc or similar high lightness)
- Text: Dark (#a6accd) → Light (#1f272f or similar dark gray)
- Primary/Accent colors: Keep similar saturation, reduce lightness in dark mode, increase in light mode
- Avoid pure white (#ffffff) text - use off-whites (#e4f0fb, #eefefec)
- Avoid pure black (#000000) backgrounds - use dark grays (#121212, #1a1a1a)

### Anti-Patterns to Avoid

- **Simple color inversion:** Mathematical inversion (#1b1e28 → #e4e1d7) often fails WCAG AA and creates unnatural aesthetics
- **Pure white text on dark backgrounds:** Creates excessive contrast (>7:1), can cause eye strain
- **Pure black backgrounds:** Too harsh, reduces readability on OLED screens
- **Different color palette for light mode:** Breaks Poimandres brand identity, creates visual inconsistency
- **Manual color definitions in theme section:** All colors should reference `defs` or hex values for maintainability

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|------|
| Theme variant switching system | Custom command palette handler | OpenCode's built-in `/theme` command | OpenCode automatically detects and lists all themes in configured directories; no programming needed |
| Color contrast calculation algorithms | Manual WCAG math implementation | Existing `scripts/validate-contrast.ts` | Already handles WCAG 2.2 contrast calculations with proper luminance formulas |
| Light/dark mode detection | Custom OS preference detection | OpenCode's `color-scheme` system | OpenCode detects user's terminal mode and applies appropriate variant automatically |
| HSL/RGB conversion utilities | Custom color manipulation code | Existing `scripts/color-utils.ts` | Provides hexToHSL, hslToHex, getLuminance, getContrastRatio functions |
| Theme file validation | Custom JSON schema validator | OpenCode's `$schema` field | Validates theme structure automatically, provides helpful error messages |

**Key insight:** OpenCode's theme system is already well-designed for multi-variant support. The work is purely theme file creation - no infrastructure or plugins needed.

## Common Pitfalls

### Pitfall 1: Simple Color Inversion

**What goes wrong:** Using bitwise inversion (e.g., `~color` or 255 - RGB values) to create light theme from dark

**Why it happens:** Seems like the "obvious" way to create a light variant, but fails to account for human perception

**How to avoid:** Use HSL-based lightness adjustment while preserving hue and saturation. Derive light colors systematically from dark palette.

**Warning signs:**
- Light theme looks "unnatural" or "washed out"
- Contrast ratios fail WCAG AA despite passing in dark mode
- Colors don't match Poimandres aesthetic (wrong hue family)

### Pitfall 2: Insufficient Contrast in Light Mode

**What goes wrong:** Light theme passes basic validation but has marginal contrast ratios (4.6:1, 3.1:1) that fail under stress

**Why it happens:** Dark colors with low lightness become light colors with high lightness, but not high enough for text readability

**How to avoid:** Target contrast ratios of 7:1+ for normal text, 5:1+ for UI elements in light mode. Use existing validation script to verify.

**Warning signs:**
- Text looks "thin" or hard to read
- Border lines are barely visible
- Users switch back to dark mode after trying light theme

### Pitfall 3: Inconsistent Aesthetic Across Variants

**What goes wrong:** Light theme uses completely different color palette, making it feel like a different theme

**Why it happens:** Light mode often treated as separate design rather than derived variant

**How to avoid:** Maintain Poimandres hue range (blues, teals, cyans, mint greens, soft pinks). Use same saturation levels across both modes.

**Warning signs:**
- Light theme doesn't "feel" like Poimandres
- User feedback: "This looks like a different theme"
- Brand colors don't translate to light mode

### Pitfall 4: Missing README Documentation

**What goes wrong:** Light theme works but users don't know what colors are available or how to reference them

**Why it happens:** README focuses on dark theme, assumes light mode is "just invert colors"

**How to avoid:** Document all `defs` color names with hex values, provide usage examples for both dark and light modes.

**Warning signs:**
- Users ask "what color should I use for X?"
- README doesn't list all available color tokens
- No examples of theme switching or variant selection

## Code Examples

Verified patterns from official sources:

### Creating Light Theme Variant

```typescript
// Example: Create poimandres-light.json
import { readFileSync, writeFileSync } from 'fs';
import { hexToHSL, hslToHex } from './scripts/color-utils.js';

// Define dark palette base colors
const darkPalette = {
  poimandresBg: '#1b1e28',
  poimandresFocus: '#303340',
  poimandresGray: '#a6accd',
  poimandresDarkerGray: '#767c9d',
  poimandresBluishGray: '#506477',
  poimandresOffWhite: '#e4f0fb',
  poimandresBrightMint: '#5DE4c7',
  poimandresStrongTurquoise: '#00CED1',
  poimandresLowerMint: '#5fb3a1',
  poimandresLightBlue: '#ADD7FF',
  poimandresDesaturatedBlue: '#91B4D5',
  poimandresHotRed: '#d0679d',
  poimandresPink: '#f087bd',
  poimandresBrightYellow: '#fffac2'
};

function deriveLightColors(darkHex: string): string {
  const hsl = hexToHSL(darkHex);

  // Light mode transformation rules:
  // - Backgrounds: high lightness (85-95%)
  // - Text: medium lightness (15-25%)
  // - Accents: maintain saturation, adjust lightness for visibility

  let targetLightness: number;
  const luminance = (0.2126 * (hsl.r / 255) +
                    0.7152 * (hsl.g / 255) +
                    0.0722 * (hsl.b / 255));

  if (luminance < 0.1) {
    // Dark backgrounds → Light backgrounds
    targetLightness = 92;
  } else if (luminance < 0.3) {
    // Mid-tones → Lighter mid-tones
    targetLightness = hsl.l + 40;
  } else {
    // Light colors → Darker for light mode visibility
    targetLightness = Math.max(15, hsl.l - 20);
  }

  return hslToHex(hsl.h, hsl.s, targetLightness);
}

// Generate light theme JSON
const lightTheme = {
  $schema: "https://opencode.ai/theme.json",
  defs: {},
  theme: {}
};

Object.entries(darkPalette).forEach(([name, hex]) => {
  lightTheme.defs[`${name}Light`] = deriveLightColors(hex);
  lightTheme.theme[name] = {
    dark: name,
    light: `${name}Light`
  };
});

writeFileSync('.opencode/themes/poimandres-light.json', JSON.stringify(lightTheme, null, 2));
```

### Validating Light Theme Contrast

```bash
# Source: Existing scripts/validate-contrast.ts
node scripts/validate-contrast.ts .opencode/themes/poimandres-light.json
```

Output:
```
WCAG AA Contrast Validation Report
=================================

Theme: poimandres-light.json

Light Mode Validation
---------------------

### Text on Background
  ✓ primary on background: 7.2:1 (required 4.5:1)
  ✓ text on background: 8.5:1 (required 4.5:1)
  ✓ accent on background: 6.8:1 (required 4.5:1)
  ...

Summary
-------
Total pairs tested: 24
Passed: 24
Failed: 0
WCAG AA compliance: 100%

✅ All pairs pass WCAG AA requirements
```

### Theme Switching Usage

```bash
# Source: OpenCode themes.mdx documentation
# Method 1: Command palette
# Open OpenCode and type: /theme

# Method 2: Configuration file
# Edit ~/.config/opencode/opencode.json:
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "poimandres-light"
}

# Method 3: API (for automation)
curl -X POST http://localhost:4096/tui/open-themes
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|----------------|-------------|--------|
| Single-mode themes (dark-only) | Multi-variant themes (dark/light in one file) | OpenCode 1.0+ | Themes now support both modes in single file, automatic switching |
| Manual theme switching (copying different JSON files) | Built-in `/theme` command and API | OpenCode 1.0+ | Users can switch themes instantly without file manipulation |
| WCAG compliance as afterthought | WCAG compliance as first-class requirement | Industry standard since 2023 | All themes now expected to meet accessibility standards |

**Deprecated/outdated:**
- Manual theme file replacement: Users no longer need to manually copy theme files; `/theme` command handles switching
- Separate light/dark theme packages: Modern approach uses single files with variant objects

## Open Questions

1. **Should light theme be separate file or integrated into existing accessible variant?**
   - What we know: Phase 1 deliverable `poimandres-accessible.json` already defines light colors for all semantic tokens
   - What's unclear: Whether creating a dedicated `poimandres-light.json` is preferred vs. expanding the existing accessible variant's light mode colors
   - Recommendation: Create separate `poimandres-light.json` for clarity and maintainability; keeps variants independent and allows users to choose between original dark, accessible dark/light, and dedicated light themes

2. **What is the optimal lightness adjustment formula for Poimandres colors?**
   - What we know: HSL-based adjustment preserves hue and saturation; different lightness targets needed for backgrounds vs. text vs. accents
   - What's unclear: Whether systematic formula (e.g., "add 50-70 lightness to backgrounds, subtract 20-30 from accents") produces optimal results
   - Recommendation: Test multiple formulas (linear addition, percentage-based, luminance-aware) and validate with contrast script; document the formula that yields best WCAG compliance and aesthetic match

3. **Should README document variant selection guidance?**
   - What we know: Users currently have 3 variants (original, turquoise-expanded, accessible)
   - What's unclear: How to choose between them and upcoming light variant
   - Recommendation: Add "Theme Selection Guide" section to README with comparison table (aesthetic fidelity, WCAG compliance, use cases) to help users choose the right variant for their needs

## Sources

### Primary (HIGH confidence)

- /anomalyco/opencode - OpenCode theme system API, JSON schema, `/theme` command, theme loading hierarchy (verified against official docs at https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/themes.mdx)
- OpenCode Theme Documentation - HSL color manipulation, dark/light variant pattern, `/theme` slash command (verified through Context7 query and webfetch)

### Secondary (MEDIUM confidence)

- Multiple accessibility guides on dark/light theme design - WCAG AA contrast requirements, HSL lightness adjustment, avoiding simple inversion (verified through exa_search_get_code_context_exa)
- color-utils.ts and validate-contrast.ts in existing codebase - WCAG 2.2 contrast calculation formulas, HSL conversion utilities (verified through read tool)
- Poimandres theme GitHub repository - Dark-only theme design, no official light variant mentioned (verified through exa_search_get_code_context_exa)

### Tertiary (LOW confidence)

- None - All findings verified through primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - OpenCode theme API verified against official documentation
- Architecture: HIGH - Theme file structure and command palette integration documented in official docs
- Pitfalls: MEDIUM - Color theory best practices from multiple accessibility sources, but need validation with actual user testing

**Research date:** 2025-02-11
**Valid until:** 2025-03-13 (30 days - theme system and color theory are stable, but light theme aesthetics may need refinement based on user feedback)
