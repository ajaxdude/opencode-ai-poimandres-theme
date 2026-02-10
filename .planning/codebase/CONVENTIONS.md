# Coding Conventions

**Analysis Date:** 2026-02-09

## Naming Patterns

**Files:**
- `kebab-case` for theme files: `poimandres.json`
- `README.md` for project documentation
- `.gitignore` for git exclusions
- `LICENSE` for legal information

**Directories:**
- `.opencode/` - theme and package metadata directory
- `.opencode/themes/` - theme files location
- `assets/` - static image assets

## Code Style

**Formatting:**
- No automated formatting configured
- Manual JSON formatting with 2-space indentation
- Theme file follows opencode.ai schema format

**Linting:**
- Not configured

**Project Structure:**
- Minimal configuration - theme package only
- No source code or build process
- Static asset delivery

## Import Organization

**Not applicable** - No code imports present in this theme package

## Error Handling

**Not applicable** - No runtime code in this package

## Logging

**Not applicable** - No runtime code in this package

## Comments

**Theme Documentation:**
- Color definitions use descriptive names (e.g., `poimandresBrightMint`)
- Schema `$schema` field present at top of theme file for validation

**README.md:**
- Follows standard markdown documentation structure
- Includes installation instructions, usage examples, color palette documentation

## Function Design

**Not applicable** - No functions present

## Module Design

**Exports:**
- Theme file exported as JSON asset
- No JavaScript/TypeScript module exports

**Package.json:**
- Minimal dependency: `@opencode-ai/plugin: 1.1.53`
- No build scripts or entry points

## Theme Conventions

**Color Naming:**
- Prefix all color names with `poimandres` (e.g., `poimandresBg`, `poimandresGray`)
- Use descriptive suffixes: `BrightMint`, `StrongTurquoise`, `DarkerGray`, etc.

**Theme Structure:**
- `defs` section for color definitions
- `theme` section with semantic mappings
- Each color has `dark` and `light` variants
- Consistent mapping across UI elements

**Theme Categories:**
- Core UI: `primary`, `secondary`, `accent`
- Semantic: `error`, `warning`, `success`, `info`
- Typography: `text`, `textMuted`
- Layout: `background`, `backgroundPanel`, `backgroundElement`
- Borders: `border`, `borderActive`, `borderSubtle`
- Diff colors: `diffAdded`, `diffRemoved`, `diffContext`, etc.
- Markdown: `markdownText`, `markdownHeading`, `markdownLink`, etc.
- Syntax highlighting: `syntaxComment`, `syntaxKeyword`, `syntaxFunction`, etc.
- Input fields: `inputBackground`, `InputBorder`, `inputPrompt`, etc.

---

*Convention analysis: 2026-02-09*
