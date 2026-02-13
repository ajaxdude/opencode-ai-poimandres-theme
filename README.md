# Poimandres Theme for OpenCode AI

A minimal, frameless dark theme for OpenCode AI inspired by the [poimandres](https://github.com/drcmda/poimandres-theme) VS Code theme.

![Color Palette](assets/dots-small.png)

## Features

- Semantic color coding (errors in red, types darker, etc.)
- Minimal visual noise for better focus
- Optimized for truecolor terminals
- Based on the poimandres color palette
- Multiple variants for different needs (original, turquoise-expanded, accessible)

## Installation

### Global Installation

1. Create the themes directory:
```bash
mkdir -p ~/.config/opencode/themes
```

2. Download the theme files:
```bash
# Original theme
curl -o ~/.config/opencode/themes/poimandres.json https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres.json

# Turquoise-expanded variant
curl -o ~/.config/opencode/themes/poimandres-turquoise-expanded.json https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres-turquoise-expanded.json

# Accessible variant
curl -o ~/.config/opencode/themes/poimandres-accessible.json https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres-accessible.json
```

That's it! The themes are now available globally in OpenCode AI.

## Usage

### Using the Theme

1. Open OpenCode AI
2. Type `/theme` and select a theme variant
3. Or add it to your `opencode.json` config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "theme": "poimandres"
}
```

### Terminal Requirements

For best results, ensure your terminal supports **truecolor** (24-bit color):

- Check support: `echo $COLORTERM` (should output `truecolor` or `24bit`)
- Enable if needed: `export COLORTERM=truecolor`

Most modern terminals (iTerm2, Alacritty, Kitty, Windows Terminal, GNOME Terminal) support this by default.

## Theme Variants

This theme is available in multiple variants with different trade-offs:

### poimandres.json (Original)

The original Poimandres theme for OpenCode AI — a faithful dark mode adaptation of the VS Code theme.

| Aspect | Details |
|--------|---------|
| **Color Palette** | 19 base colors from the original Poimandres palette |
| **Mode** | Dark mode optimized (uses dark colors for both dark/light settings) |
| **WCAG AA Compliance** | ~50% (12/24 critical color pairs pass) |
| **Aesthetic Fidelity** | 100% faithful to original Poimandres |
| **Use When** | Visual fidelity is the priority, dark mode only usage |

**Color Mapping Strategy:**
- Both `dark` and `light` mode settings use the same dark Poimandres colors
- Syntax highlighting uses the classic Poimandres color scheme
- Primary: bright mint (#5DE4c7)
- Secondary: strong turquoise (#00CED1)
- Accent: strong turquoise (#00CED1)

### poimandres-turquoise-expanded.json

Extended palette variant that adds 7 new turquoise shades for more color variety in dark mode.

| Aspect | Details |
|--------|---------|
| **Color Palette** | 29 colors (19 base + 7 turquoise shades) |
| **New Colors** | turquoise-50, turquoise-100, turquoise-300, turquoise-400, turquoise-500, turquoise-700, turquoise-900 |
| **Mode** | Dark mode with expanded turquoise range |
| **WCAG AA Compliance** | ~50% (12/24 critical color pairs pass) |
| **Aesthetic Fidelity** | 100% faithful to original Poimandres |
| **Use When** | Need more turquoise color variety in dark mode, visual fidelity is priority |

**Key Differences from Original:**
- `primary` uses turquoise-400 (#00ced1) instead of bright mint
- `accent`, `success`, `syntaxVariable`, `syntaxString`, `syntaxType` use turquoise-400/500 variants
- `info`, `markdownHeading`, `syntaxFunction` use turquoise-300 (#33fcff)
- Added 7 new turquoise shade definitions for expanded palette

### poimandres-accessible.json ⭐ Recommended

Fully WCAG AA compliant variant that ensures accessibility for all users.

| Aspect | Details |
|--------|---------|
| **Color Palette** | 42 colors (19 base + 7 turquoise + 16 accessible variants) |
| **Mode** | True dark/light mode support |
| **WCAG AA Compliance** | 100% (24/24 critical color pairs pass) |
| **Aesthetic Fidelity** | ~90% (minimal dark mode changes, moderate light mode changes) |
| **Use When** | Accessibility is required, light mode is used, professional/corporate environments |

**Key Differences:**
- Dark mode: Adjusted border and text-muted colors for better contrast
- Light mode: Uses specially calculated accessible dark colors for all semantic roles
- Primary (light): #157a64 (dark teal - 6.3:1 contrast)
- Secondary (light): #7AC6B6 (desaturated green - 4.5:1 contrast)
- Error (light): #44152e (dark maroon - 7.2:1 contrast)
- Warning (light): #3f1538 (dark maroon - 4.58:1 contrast)

## Color Palette

### Core Colors (All Variants)

| Color Name | Hex | Description |
|------------|-----|-------------|
| poimandresBg | #1b1e28 | Dark blue-gray background |
| poimandresFocus | #303340 | Medium gray-blue for panels |
| poimandresGray | #a6accd | Light gray for primary text |
| poimandresDarkerGray | #767c9d | Darker gray for muted text |
| poimandresBluishGray | #506477 | Blue-gray for borders |
| poimandresOffWhite | #e4f0fb | Very light blue for backgrounds |
| poimandresBrightMint | #5DE4c7 | Bright mint (primary) |
| poimandresStrongTurquoise | #00CED1 | Vibrant teal (secondary/accent) |
| poimandresLowerMint | #5fb3a1 | Muted teal for active states |
| poimandresLightBlue | #ADD7FF | Light blue for highlights |
| poimandresLowerBlue | #89ddff | Sky blue for links |
| poimandresDesaturatedGreen | #7AC6B6 | Muted green for secondary light mode |
| poimandresHotRed | #d0679d | Hot red for errors |
| poimandresPink | #f087bd | Soft pink for numbers |
| poimandresBrightYellow | #fffac2 | Bright yellow for warnings |

### Additional Colors (turquoise-expanded)

| Color Name | Hex | Description |
|------------|-----|-------------|
| poimandresTurquoise50 | #ccfeff | Lightest turquoise |
| poimandresTurquoise100 | #99fdff | Light turquoise |
| poimandresTurquoise300 | #33fcff | Bright turquoise |
| poimandresTurquoise400 | #00ced1 | Standard turquoise |
| poimandresTurquoise500 | #009b9e | Darker turquoise |
| poimandresTurquoise700 | #00696b | Dark turquoise |
| poimandresTurquoise900 | #003738 | Darkest turquoise |

### Accessible Variants (accessible only)

| Color Name | Hex | Purpose |
|------------|-----|---------|
| poimandresGrayAccessibleLight | #1f272f | Gray for light mode text |
| poimandresPrimaryAccessibleLight | #157a64 | Primary for light mode (6.3:1) |
| poimandresAccentAccessibleLight | #00797c | Accent for light mode |
| poimandresErrorAccessibleLight | #44152e | Error for light mode (7.2:1) |
| poimandresWarningAccessibleLight | #3f1538 | Warning for light mode (4.58:1) |
| poimandresInputCursorAccessibleLight | #00999c | Input cursor for light mode |
| poimandresErrorAccessibleDark | #d87fac | Error for dark mode |
| poimandresBorderAccessibleDark | #556b7f | Border for dark mode |

## Theme Token Mapping Comparison

### Dark Mode

| Token | Original | Turquoise-Expanded | Accessible |
|-------|----------|-------------------|------------|
| primary | poimandresBrightMint | poimandresTurquoise400 | poimandresTurquoise400 |
| secondary | poimandresStrongTurquoise | poimandresStrongTurquoise | poimandresStrongTurquoise |
| accent | poimandresStrongTurquoise | poimandresTurquoise500 | poimandresTurquoise500 |
| error | poimandresHotRed | poimandresHotRed | poimandresErrorAccessibleDark |
| warning | poimandresBrightYellow | poimandresBrightYellow | poimandresBrightYellow |
| success | poimandresStrongTurquoise | poimandresTurquoise500 | poimandresTurquoise500 |
| info | poimandresBrightMint | poimandresTurquoise300 | poimandresTurquoise300 |

### Light Mode

| Token | Original | Turquoise-Expanded | Accessible |
|-------|----------|-------------------|------------|
| primary | poimandresBrightMint | poimandresBrightMint | poimandresPrimaryAccessibleLight |
| secondary | poimandresDesaturatedGreen | poimandresDesaturatedGreen | poimandresDesaturatedGreen |
| accent | poimandresStrongTurquoise | poimandresStrongTurquoise | poimandresAccentAccessibleLight |
| error | poimandresHotRed | poimandresHotRed | poimandresErrorAccessibleLight |
| warning | poimandresBrightYellow | poimandresBrightYellow | poimandresWarningAccessibleLight |
| success | poimandresStrongTurquoise | poimandresStrongTurquoise | poimandresStrongTurquoise |

## WCAG AA Compliance

### Contrast Ratios (Critical Color Pairs)

| Variant | Dark Mode | Light Mode | Overall |
|---------|-----------|------------|---------|
| Original | 64% (7/11) | 38% (5/13) | 50% |
| Turquoise-Expanded | 64% (7/11) | 38% (5/13) | 50% |
| Accessible | 100% (11/11) | 100% (13/13) | 100% |

### Recommendation

- **Default/Personal Use**: `poimandres.json` or `poimandres-turquoise-expanded.json` — best visual fidelity
- **Production/Professional**: `poimandres-accessible.json` — ensures WCAG AA compliance for accessibility

## Theme Structure

```
.opencode/themes/
├── poimandres.json                    # Original theme (100% aesthetic, 50% WCAG)
├── poimandres-turquoise-expanded.json # Expanded palette (100% aesthetic, 50% WCAG)
└── poimandres-accessible.json         # Accessible variant (90% aesthetic, 100% WCAG) ⭐
```

## Theme Switching

Type `/theme` in OpenCode AI and select from the available variants:
- `poimandres` — Original dark theme
- `poimandres-turquoise-expanded` — Expanded turquoise palette
- `poimandres-accessible` — WCAG AA compliant (recommended)

Theme selections persist across OpenCode AI sessions.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on [poimandres](https://github.com/drcmda/poimandres-theme) by Paul Henschel
- Originally inspired by [blueberry](https://github.com/peymanslh/vscode-blueberry-dark-theme) theme
