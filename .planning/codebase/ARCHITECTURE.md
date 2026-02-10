# Architecture

**Analysis Date:** 2026-02-09

## Pattern Overview

**Overall:** Static Configuration

**Key Characteristics:**
- Declarative theme definition through JSON configuration
- No runtime code execution or data processing
- Schema-driven configuration with semantic color mapping
- Dark/light variant support for all UI elements

## Layers

**Configuration Layer:**
- Purpose: Define color palette and theme mappings
- Location: `.opencode/themes/poimandres.json`
- Contains: Color definitions, semantic mappings, UI element styling
- Depends on: opencode.ai theme schema
- Used by: opencode.ai application (external consumer)

**Asset Layer:**
- Purpose: Visual documentation and representation
- Location: `assets/`
- Contains: PNG images for theme preview
- Depends on: None
- Used by: Documentation (README.md)

**Documentation Layer:**
- Purpose: User-facing installation and usage instructions
- Location: `README.md`
- Contains: Installation steps, color palette reference, usage examples
- Depends on: None
- Used by: End users

## Data Flow

**Theme Loading Flow:**

1. User installs theme via manual download or git clone
2. Theme file `poimandres.json` placed in `~/.config/opencode/themes/`
3. opencode.ai application reads theme JSON file
4. opencode.ai validates against theme schema (`https://opencode.ai/theme.json`)
5. Application parses color definitions and applies them to UI elements

**Theme Application Flow:**

1. opencode.ai loads theme configuration
2. Parses `defs` section for base color definitions
3. Maps semantic colors from `theme` section to UI elements
4. Resolves dark/light variants based on terminal setting
5. Renders terminal with applied colors

## Key Abstractions

**Color Definition:**
- Purpose: Named color tokens for reusability
- Examples: `.opencode/themes/poimandres.json` (lines 4-22)
- Pattern: Declarative JSON object with hex color values

**Semantic Mapping:**
- Purpose: Map UI concepts to color tokens
- Examples: `.opencode/themes/poimandres.json` (lines 24-248)
- Pattern: Nested object structure with theme -> element -> variant -> color token reference

**Theme Variant:**
- Purpose: Support both dark and light modes
- Examples: `.opencode/themes/poimandres.json` (line 26-27)
- Pattern: Each theme property contains `dark` and `light` variants

## Entry Points

**Theme Entry Point:**
- Location: `.opencode/themes/poimandres.json`
- Triggers: Manual installation by user or opencode.ai startup
- Responsibilities: Declare all color definitions and semantic mappings

**Documentation Entry Point:**
- Location: `README.md`
- Triggers: User visits repository or views theme listing
- Responsibilities: Explain installation, usage, and color palette

## Error Handling

**Strategy:** Schema validation (external to this codebase)

**Patterns:**
- Theme file must conform to `https://opencode.ai/theme.json` schema
- Invalid theme definitions will be rejected by opencode.ai
- No runtime error handling within this codebase (static configuration only)

## Cross-Cutting Concerns

**Logging:** Not applicable (static configuration)

**Validation:** Handled by opencode.ai theme schema validator (external)

**Authentication:** Not applicable (no user interaction or data access)

---

*Architecture analysis: 2026-02-09*
