# poimandres theme for opencode.ai

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

The theme uses the poimandres color scheme:

- **Background**: `#1b1e28` (dark blue-gray)
- **Primary**: `#ADD7FF` (light blue)
- **Accent**: `#5DE4c7` (bright mint)
- **Error**: `#d0679d` (hot red)
- **Warning**: `#fffac2` (bright yellow)
- **Success**: `#5DE4c7` (bright mint)

## Theme Structure

```
.opencode/themes/
└── poimandres.json    # Main theme file
```

The theme follows the opencode.ai JSON theme format with:
- Color definitions in the `defs` section
- Dark/light variants for all colors
- Semantic color mapping for UI elements and syntax highlighting

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on [poimandres](https://github.com/drcmda/poimandres-theme) by Paul Henschel
- Originally inspired by [blueberry](https://github.com/peymanslh/vscode-blueberry-dark-theme) theme