# poimandres theme for opencode.ai

![Color Palette](assets/dots-small.png)

A minimal, frameless dark theme for opencode.ai inspired by the [poimandres](https://github.com/drcmda/poimandres-theme) VS Code theme.

## Features

- Semantic color coding (errors in red, types darker, etc.)
- Minimal visual noise for better focus
- Optimized for truecolor terminals
- Based on the poimandres color palette

## Installation

### Global Installation

1. Create the themes directory:
```bash
mkdir -p ~/.config/opencode/themes
```

2. Download the theme file:
```bash
curl -o ~/.config/opencode/themes/poimandres.json https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres.json
```

That's it! The theme is now available globally in opencode.ai.

## Usage

### Using the theme

1. Open opencode.ai
2. Type `/theme` and select `poimandres`
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

## Color Palette

The theme uses the poimandres color scheme with comprehensive color definitions:

### Core Colors
- **Background**: `#1b1e28` (dark blue-gray)
- **Focus/Panel**: `#303340` (medium gray-blue)
- **Primary**: `#ADD7FF` (light blue)
- **Accent**: `#5DE4c7` (bright mint)
- **Strong Turquoise**: `#00CED1` (vibrant teal)

### Semantic Colors
- **Error**: `#d0679d` (hot red)
- **Warning**: `#fffac2` (bright yellow)
- **Success**: `#00CED1` (strong turquoise)
- **Info**: `#5DE4c7` (bright mint)

### Text Colors
- **Primary Text**: `#a6accd` (light gray)
- **Muted Text**: `#767c9d` (darker gray)
- **Off White**: `#e4f0fb` (very light blue)

### Additional Colors
- **Pink**: `#f087bd` (soft pink)
- **Desaturated Blue**: `#91B4D5` (muted blue)
- **Bluish Gray**: `#506477` (blue-gray)
- **Selection**: `#717cb425` (transparent blue)

## Theme Variants

This theme is available in multiple variants with different trade-offs:

### poimandres.json (Original)
- **Compliance**: 50% WCAG AA (12/24 pairs)
- **Aesthetic**: 100% faithful to original Poimandres
- **Use when**: Visual fidelity is priority, dark mode only usage

### poimandres-turquoise-expanded.json
- **Compliance**: 50% WCAG AA (12/24 pairs)
- **Aesthetic**: 100% faithful to original with expanded turquoise palette
- **Use when**: Visual fidelity is priority, need more turquoise shades in dark mode

### poimandres-accessible.json ⭐ Recommended
- **Compliance**: 100% WCAG AA (24/24 pairs)
- **Aesthetic**: ~90% faithful (minimal dark mode changes, moderate light mode changes)
- **Use when**: Accessibility is required, light mode used, professional/corporate environments

**Recommendation**: Use `poimandres-accessible.json` for production environments where WCAG AA compliance is important.

## Theme Structure

```
.opencode/themes/
├── poimandres.json                   # Original theme
├── poimandres-turquoise-expanded.json # Expanded palette (50% WCAG AA)
└── poimandres-accessible.json          # Accessible variant (100% WCAG AA) ⭐
```

The theme follows opencode.ai JSON theme format with:
- Color definitions in `defs` section
- Dark/light variants for all colors
- Semantic color mapping for UI elements and syntax highlighting

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on [poimandres](https://github.com/drcmda/poimandres-theme) by Paul Henschel
- Originally inspired by [blueberry](https://github.com/peymanslh/vscode-blueberry-dark-theme) theme