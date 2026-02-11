# Architecture Patterns

**Domain:** JSON theme variant systems for OpenCode.ai
**Researched:** February 9, 2026
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Theme Discovery Layer                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ File Scanner │  │   Validator   │  │  Variant ID  │ │
│  │ (glob *.json)│  │ (schema check) │  │  Extractor   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 Theme Registry                         │
│   ┌───────────────────────────────────────────────┐    │
│   │  Available: poimandres, poimandres-  │    │
│   │  turquoise, poimandres-light              │    │
│   └───────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
          │
          ▼ (user selection)
┌─────────────────────────────────────────────────────────────┐
│              Theme Application Layer                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Color Lookup │  │   Reference   │  │   Fallback   │ │
│  │ (def resolve)│  │ (expand refs) │  │ (ansi/none) │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘ │
└─────────┼──────────────────┼───────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│            UI Rendering (OpenCode.ai)                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **File Scanner** | Discover theme JSON files in theme directory | `glob("*.json")` in `/themes/` |
| **Schema Validator** | Verify files conform to `https://opencode.ai/theme.json` | JSON Schema validation against official schema |
| **Variant Extractor** | Parse theme name from filename (e.g., "poimandres-light" → "Light" variant) | String manipulation or pattern matching |
| **Theme Registry** | Maintain list of available themes and active theme | In-memory map: `{ "poimandres-light": {...} }` |
| **Color Lookup** | Resolve references in `theme.*` (e.g., `"primary": "poimandresMint"`) | First check `theme.*` dict, then fallback to `defs.*` |
| **Reference Expander** | Expand color references to actual hex/ansi values | Recursive resolution with cycle detection |
| **Fallback Handler** | Handle `"none"` enum or missing definitions | Use terminal default for `"none"` |

### Data Flow

```
[User runs /theme poimandres-turquoise]
    ↓
[File Scanner] → Finds poimandres-turquoise.json
    ↓
[Schema Validator] → Validates against opencode.ai schema
    ↓
[Variant Extractor] → Parses "turquoise" from filename
    ↓
[Theme Registry] → Registers theme, extracts `defs` and `theme`
    ↓
[OpenCode Runtime] → User selects theme
    ↓
[Color Lookup] → Component requests "primary" color
    ↓
[Reference Expander] → "primary": "poimandresTurquoise" → resolves to `defs.poimandresTurquoise`
    ↓
[UI Renderer] → Applies #5DE4C7 to UI element
```

## Recommended Project Structure

```
.opencode/themes/
├── poimandres.json              # Base theme (current file)
├── poimandres-turquoise.json   # Turquoise variant
├── poimandres-light.json        # Light variant
└── poimandres-high-contrast.json # High-contrast variant (optional)
```

### Structure Rationale

**Flat file structure (recommended):**
- **Discovery simplicity:** All themes in one directory → single `glob("*.json")`
- **Self-contained:** Each variant includes all `defs` and `theme` data
- **No inheritance:** OpenCode.ai schema doesn't support `extends` field
- **Build simplicity:** No merge/inherit logic needed at runtime

**Naming convention:**
- Base: `poimandres.json`
- Variants: `poimandres-{variant-name}.json`
- Variant name: extracted from hyphenated suffix (e.g., "turquoise" from "poimandres-turquoise.json")

## Architectural Patterns

### Pattern 1: Standalone Theme Files (Recommended)

**What:** Each variant is a complete, self-contained JSON file with its own `defs` and `theme` sections.

**When to use:**
- Theme schema doesn't support inheritance (like OpenCode.ai)
- Small to medium number of variants (2-10)
- Variants share most colors but have significant differences

**Trade-offs:**
- ✅ Pros: Simple, no runtime merging, self-contained, easy to discover
- ❌ Cons: Duplicates shared definitions (e.g., base colors repeated)

**Example:**
```json
// poimandres.json
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "poimandresBg": "#1b1e28",
    "poimandresFocus": "#303340",
    "poimandresGray": "#a6accd",
    "poimandresBrightMint": "#5DE4c7",
    // ... 20 more colors
  },
  "theme": {
    "primary": {
      "dark": "poimandresBrightMint",
      "light": "poimandresBrightMint"
    },
    // ... 50+ theme mappings
  }
}
```

```json
// poimandres-turquoise.json
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": {
    "poimandresBg": "#1b1e28",
    "poimandresFocus": "#303340",
    "poimandresGray": "#a6accd",
    "poimandresBrightMint": "#00CED1", // Changed from #5DE4c7
    "poimandresTurquoise": "#40E0D0", // New color
    // ... other colors same as base
  },
  "theme": {
    "primary": {
      "dark": "poimandresTurquoise", // Changed reference
      "light": "poimandresTurquoise"
    },
    "accent": {
      "dark": "poimandresTurquoise", // Changed reference
      "light": "poimandresTurquoise"
    },
    // ... rest of theme same as base
  }
}
```

### Pattern 2: Inheritance-Based Variants

**What:** Base theme with variants that override only changed values using an `extends` field.

**When to use:**
- Schema supports inheritance (WordPress: `extends: "parent-theme"`)
- Many variants (10+) with minimal differences
- Frequent additions of new variants

**Trade-offs:**
- ✅ Pros: DRY, single source of truth, easy to add variants
- ❌ Cons: Requires merge logic at runtime, more complex discovery

**Example:**
```json
// themes/base/poimandres.json
{
  "$schema": "https://opencode.ai/theme.json",
  "defs": { /* all 23 base colors */ },
  "theme": { /* all 50+ theme mappings */ }
}

// themes/poimandres-turquoise.json
{
  "$schema": "https://opencode.ai/theme.json",
  "extends": "base/poimandres",
  "defs": {
    "poimandresBrightMint": "#00CED1", // Override only
    "poimandresTurquoise": "#40E0D0" // New color
  },
  "theme": {
    "primary": {
      "dark": "poimandresTurquoise",
      "light": "poimandresTurquoise"
    }
    // Rest inherited from base
  }
}
```

**Why NOT recommended for OpenCode.ai:**
- Official schema doesn't define `extends` field
- No evidence of runtime merging in existing implementations
- All examples (anomalyco/opencode, folke/tokyonight, etc.) use standalone files

### Pattern 3: Design Token Inheritance

**What:** Three-layer token system: primitives → semantic → brand/theme

**When to use:**
- Design system supporting many brands
- Web frameworks with CSS variables
- Need programmatic theme generation

**Trade-offs:**
- ✅ Pros: Maximum flexibility, shared base tokens, programmatic generation
- ❌ Cons: Overkill for 2-5 variants, build step required

**Example:**
```json
// tokens/primitives.json
{
  "colors": {
    "blue50": "#EFF6FF",
    "blue500": "#3B82F6",
    "blue600": "#2563EB"
  }
}

// tokens/semantic.json
{
  "extends": "primitives",
  "color": {
    "brand-primary": "blue600",
    "brand-secondary": "gray600"
  }
}

// themes/poimandres.json
{
  "extends": "semantic",
  "overrides": {
    "color": {
      "brand-primary": "poimandresMint"
    }
  }
}
```

**Why NOT recommended for this project:**
- OpenCode.ai uses direct JSON, not CSS variables
- No build step in current architecture
- Adds unnecessary complexity for theme distribution

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 2-5 variants | **Standalone files** — Simple file copying, no build step |
| 5-10 variants | **Standalone files + shared defs extraction** (optional) — Extract common `defs` to base file, copy to variants during build |
| 10+ variants | **Inheritance system** (if schema supports) — Consider custom schema extension or build-time merging |

### Scaling Priorities

1. **First bottleneck:** File duplication → Create build script to generate variants from base template
2. **Second bottleneck:** Adding new variants → Extract color palette to separate YAML/JSON, generate all themes programmatically

**Build-time generation example (for 10+ variants):**
```javascript
// build-themes.js
const baseTheme = require('./poimandres.json');
const variants = [
  { name: 'turquoise', colors: { brightMint: '#00CED1' } },
  { name: 'light', colors: { bg: '#e4f0fb' } },
  { name: 'ocean', colors: { brightMint: '#4FD1C5' } },
];

variants.forEach(variant => {
  const theme = JSON.parse(JSON.stringify(baseTheme)); // Deep copy
  theme.defs = { ...theme.defs, ...variant.colors };
  theme.theme.primary = { dark: variant.colors.brightMint, light: variant.colors.brightMint };
  fs.writeFileSync(`poimandres-${variant.name}.json`, JSON.stringify(theme, null, 2));
});
```

## Anti-Patterns

### Anti-Pattern 1: Deep Nesting without References

**What people do:** Inline hex colors everywhere instead of using `defs`

```json
// ❌ BAD: Hardcoded colors
{
  "defs": { "poimandresBg": "#1b1e28" },
  "theme": {
    "background": { "dark": "#1b1e28", "light": "#e4f0fb" },
    "text": { "dark": "#a6accd", "light": "#506477" },
    "border": { "dark": "#506477", "light": "#767c9d" }
  }
}
```

**Why it's wrong:**
- Duplication makes color updates error-prone
- Changing "background" color requires updating 3 places
- Defeats purpose of `defs` section

**Do this instead:**
```json
// ✅ GOOD: Use references
{
  "defs": {
    "poimandresBg": "#1b1e28",
    "poimandresGray": "#a6accd",
    "poimandresBluishGray": "#506477"
  },
  "theme": {
    "background": { "dark": "poimandresBg", "light": "poimandresOffWhite" },
    "text": { "dark": "poimandresGray", "light": "poimandresBluishGray" },
    "border": { "dark": "poimandresBluishGray", "light": "poimandresDarkerGray" }
  }
}
```

### Anti-Pattern 2: Inconsistent Naming

**What people do:** Mix naming conventions like `poimandres_bg` vs `poimandresBg`

```json
// ❌ BAD: Inconsistent casing
{
  "defs": {
    "poimandresBg": "#1b1e28",
    "poimandres_gray": "#a6accd",
    "poimandres-Bright-Mint": "#5DE4c7"
  }
}
```

**Why it's wrong:**
- Reference typos hard to catch (`poimandresBrightMint` vs `poimandres-Bright-Mint`)
- Reduces code readability
- Makes manual editing error-prone

**Do this instead:**
```json
// ✅ GOOD: Consistent camelCase
{
  "defs": {
    "poimandresBg": "#1b1e28",
    "poimandresGray": "#a6accd",
    "poimandresBrightMint": "#5DE4c7",
    "poimandresStrongTurquoise": "#00CED1"
  }
}
```

### Anti-Pattern 3: Reference Cycles

**What people do:** Create circular references that can't be resolved

```json
// ❌ BAD: Circular reference
{
  "defs": {
    "poimandresPrimary": "poimandresAccent",
    "poimandresAccent": "poimandresPrimary"
  },
  "theme": {
    "primary": { "dark": "poimandresPrimary" } // Infinite loop!
  }
}
```

**Why it's wrong:**
- Causes infinite loops during reference resolution
- Runtime hangs or crashes theme loader
- Impossible to determine actual color

**Do this instead:**
```json
// ✅ GOOD: DAG (Directed Acyclic Graph)
{
  "defs": {
    "poimandresPrimary": "#5DE4c7",
    "poimandresAccent": "#00CED1"
  },
  "theme": {
    "primary": { "dark": "poimandresPrimary" },
    "accent": { "dark": "poimandresAccent" }
  }
}
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **N/A** | Standalone JSON files | Theme files are self-contained, no external dependencies |
| **Distribution (GitHub)** | Raw file serving | Distribute via `raw.githubusercontent.com` URL for easy installation |
| **Schema Registry** | Validation at load time | OpenCode.ai validates against `https://opencode.ai/theme.json` schema |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Theme Scanner ↔ Variant Extractor** | File path → variant name | Parse `poimandres-{variant}.json` → extract `{variant}` |
| **Variant Extractor ↔ Theme Registry** | Variant name → theme metadata | Store display name from filename for UI |
| **Theme Registry ↔ Color Lookup** | Theme selection → color resolution | User selects theme → lookup `theme.primary.dark` |
| **Color Lookup ↔ Reference Expander** | Reference string → hex/ansi | `"poimandresMint"` → check `defs`, expand to `#5DE4c7` |

## Variant Discovery Mechanism

### Automatic Discovery

**Pattern:** Flat file glob with naming convention

```javascript
// Pseudocode for theme discovery
function discoverThemes(themesDirectory) {
  const files = glob(`${themesDirectory}/*.json`);
  const themes = {};

  files.forEach(file => {
    const basename = path.basename(file, '.json');
    const [base, variant] = basename.split('poimandres-');

    if (!variant) {
      themes['poimandres'] = loadTheme(file); // Base theme
    } else {
      themes[basename] = loadTheme(file); // Variant
    }
  });

  return themes;
}
```

**Result:**
```javascript
{
  "poimandres": { /* base theme */ },
  "poimandres-turquoise": { /* variant */ },
  "poimandres-light": { /* variant */ }
}
```

### Build Order Implications

**Standalone files (recommended):**
1. **Base theme first** — Validate `poimandres.json` works
2. **Add variants one-by-one** — Each variant is independent
3. **No dependencies** — `poimandres-turquoise.json` doesn't require `poimandres.json`
4. **Parallel builds possible** — Can create multiple variants simultaneously

**If using build-time generation (for 10+ variants):**
1. **Extract color palette** — Create shared palette file
2. **Define variant overrides** — List color changes per variant
3. **Generate all themes** — Build script creates all JSON files
4. **Validate output** — Run schema validator on all generated files

**Example build order:**
```bash
# Phase 1: Validate base
npm run validate-theme poimandres.json

# Phase 2: Create variants (parallel)
npm run build:variant turquoise
npm run build:variant light

# Phase 3: Validate all
npm run validate:all-themes

# Phase 4: Test discovery
npm run test:theme-discovery
```

## Sources

- [OpenCode.ai Theme Schema](https://opencode.ai/theme.json) — HIGH confidence, official schema documentation
- [GitHub: anomalyco/opencode themes](https://github.com/anomalyco/opencode/blob/dev/themes/deltarune.json) — HIGH confidence, real-world implementations
- [GitHub: folke/tokyonight.nvim opencode.lua](https://github.com/folke/tokyonight.nvim/blob/main/lua/tokyonight/extra/opencode.lua) — HIGH confidence, theme generation patterns
- [WordPress Style Variations Documentation](https://developer.wordpress.org/themes/global-settings-and-styles/style-variations) — MEDIUM confidence, inheritance pattern comparison
- [Design Tokens & Theming Material UI](https://materialui.co/blog/design-tokens-and-theming-scalable-ui-2025) — MEDIUM confidence, token inheritance patterns
- [Theming Architecture Multi-Brand](https://robertcelt95.medium.com/theming-architecture-multi-brand-design-systems-that-actually-work-ad7ed8445fed) — MEDIUM confidence, layered token systems
- [Carbon Design System Themes](https://carbondesignsystem.com/elements/themes/overview) — LOW confidence, enterprise theme architecture patterns

---
*Architecture research for: OpenCode.ai JSON theme variant systems*
*Researched: February 9, 2026*
