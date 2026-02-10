# External Integrations

**Analysis Date:** 2026-02-09

## APIs & External Services

**Theme Distribution:**
- GitHub (raw.githubusercontent.com) - Static file hosting for theme downloads
  - Purpose: CDN for direct theme installation via curl
  - Endpoint: `https://raw.githubusercontent.com/ajaxdude/opencode-ai-poimandres-theme/main/.opencode/themes/poimandres.json`
  - Auth: None (public repository)
  - Usage: Documented in installation instructions

## Data Storage

**Databases:**
- None - Theme configuration is static JSON

**File Storage:**
- Local filesystem only - Theme files installed to `~/.config/opencode/themes/`

**Caching:**
- None - No caching layer required

## Authentication & Identity

**Auth Provider:**
- None - Public theme with no authentication requirements

## Monitoring & Observability

**Error Tracking:**
- None - No monitoring implemented

**Logs:**
- None - Theme operates silently within OpenCode

## CI/CD & Deployment

**Hosting:**
- GitHub - Source code repository and raw file CDN
  - Repository: `ajaxdude/opencode-ai-poimandres-theme`
  - Distribution: Direct file download from GitHub raw content

**CI Pipeline:**
- None detected - No GitHub Actions or other CI configuration present

## Environment Configuration

**Required env vars:**
- None - Theme does not require environment variables

**Secrets location:**
- Not applicable - No secrets used

## Webhooks & Callbacks

**Incoming:**
- None - Theme does not receive webhooks

**Outgoing:**
- None - Theme makes no external HTTP requests

## Platform-Specific Integrations

**OpenCode.ai:**
- Theme system integration via `@opencode-ai/plugin` SDK
- Schema: Follows `https://opencode.ai/theme.json` specification
- Activation: Via `/theme` command or `opencode.json` config
- Semantic colors: Maps to OpenCode UI elements and syntax highlighting

**Terminal Integration:**
- Truecolor terminals (24-bit color support)
- Environment variable: `COLORTERM` (set to `truecolor` or `24bit` for optimal display)

---

*Integration audit: 2026-02-09*
