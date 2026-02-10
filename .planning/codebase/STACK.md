# Technology Stack

**Analysis Date:** 2026-02-09

## Languages

**Primary:**
- JSON - Theme configuration (`.opencode/themes/poimandres.json`)

**Secondary:**
- JavaScript - Package metadata (`.opencode/package.json`)
- Markdown - Documentation (`README.md`)

## Runtime

**Environment:**
- Node.js (via Bun runtime)

**Package Manager:**
- Bun - Lockfile present (`bun.lock`)
- No lockfile: Not applicable (lockfile present)

## Frameworks

**Core:**
- @opencode-ai/plugin 1.1.53 - OpenCode plugin system integration

**Testing:**
- Not applicable - No testing framework present

**Build/Dev:**
- Not applicable - No build process (static JSON theme)

## Key Dependencies

**Critical:**
- @opencode-ai/plugin 1.1.53 - Provides plugin SDK for OpenCode theme system
  - Transitive dependencies:
    - @opencode-ai/sdk 1.1.53 - Core SDK for OpenCode
    - zod 4.1.8 - Schema validation

**Infrastructure:**
- None - Pure configuration plugin

## Configuration

**Environment:**
- No environment configuration required
- Static JSON theme file
- Theme referenced by name in user's `opencode.json`

**Build:**
- No build configuration
- No bundlers or transpilers
- Direct JSON theme file distribution

## Platform Requirements

**Development:**
- Bun runtime (for package installation)
- Text editor with JSON support

**Production:**
- OpenCode.ai application (version 1.1.53+)
- Terminal with truecolor support (24-bit color)

---

*Stack analysis: 2026-02-09*
