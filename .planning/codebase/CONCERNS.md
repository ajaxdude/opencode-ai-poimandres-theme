# Codebase Concerns

**Analysis Date:** 2026-02-09

## Tech Debt

**Unused Color Definitions:**
- Issue: Five colors defined in `defs` section but never referenced in the theme
- Files: `.opencode/themes/poimandres.json`
- Impact: Cluttered color definitions, potential confusion for maintainers, wasted storage
- Fix approach: Remove unused colors or add them to theme properties:
  - `poimandresBlack`
  - `poimandresWhite`
  - `poimandresSelection`
  - `poimandresLightBlue`
  - `poimandresLowerBlue`

**Hardcoded Hex Colors:**
- Issue: Four theme properties use hardcoded hex values instead of referencing named colors from `defs`
- Files: `.opencode/themes/poimandres.json`
- Impact: Inconsistent pattern, harder to maintain, defeats purpose of having named color definitions
- Fix approach: Replace hardcoded values with references:
  - `diffAddedBg.dark`: Replace `#303340` with `poimandresFocus`
  - `diffRemovedBg.dark`: Replace `#303340` with `poimandresFocus`
  - `diffAddedLineNumberBg.dark`: Replace `#303340` with `poimandresFocus`
  - `diffRemovedLineNumberBg.dark`: Replace `#303340` with `poimandresFocus`
  - Same properties for light mode: Replace `#e4f0fb` with `poimandresOffWhite`

**Light Theme Incomplete:**
- Issue: 37 out of 58 theme properties have identical values for both light and dark modes
- Files: `.opencode/themes/poimandres.json`
- Impact: Light theme may not be properly designed, poor contrast in light mode
- Fix approach: Review and customize light theme colors for better visibility and contrast

## Known Bugs

**None detected** - No bugs or runtime issues identified.

## Security Considerations

**No secrets exposure detected** - No secrets or credentials in the repository.

**Schema Validation:**
- Risk: Theme file contains properties not defined in the official schema, may cause issues with theme loaders
- Files: `.opencode/themes/poimandres.json`
- Current mitigation: None - theme loads successfully in OpenCode but uses non-standard properties
- Recommendations: Validate theme file against `https://opencode.ai/theme.json` schema, remove or document non-standard properties

## Performance Bottlenecks

**Large Image File:**
- Problem: `assets/dots.png` is 74KB for a simple color palette visualization
- Files: `assets/dots.png`
- Cause: PNG format with high resolution (1111 x 1389 pixels)
- Improvement path: Optimize image size using compression tools or convert to more efficient format for documentation purposes

**No performance issues detected** - Theme loads quickly, minimal processing required.

## Fragile Areas

**Schema Compliance:**
- Files: `.opencode/themes/poimandres.json`
- Why fragile: Theme contains 6 properties not defined in official schema (`InputBorder`, `InputBorderActive`, `inputBackground`, `inputCursor`, `inputPrompt`, `inputText`)
- Safe modification: Check schema before adding new properties, validate existing properties against `https://opencode.ai/theme.json`
- Test coverage: No automated schema validation tests

**Manual Color Management:**
- Files: `.opencode/themes/poimandres.json`
- Why fragile: Color changes require manual updates across multiple theme properties, no validation of color references
- Safe modification: Use consistent color referencing pattern, validate all references after changes
- Test coverage: No tests to verify color consistency or detect broken references

## Scaling Limits

**Not applicable** - Theme is static JSON configuration with no scaling concerns.

## Dependencies at Risk

**@opencode-ai/plugin:**
- Risk: Version pinning (1.1.53) may miss compatibility updates or schema changes
- Impact: Theme may break if OpenCode introduces breaking changes to theme system
- Migration plan: Monitor OpenCode releases, test theme with newer SDK versions, update when necessary

## Missing Critical Features

**Schema Validation:**
- Problem: No automated validation of theme file against official schema
- Blocks: Detection of non-compliant properties, early error detection
- Fix approach: Add GitHub Action or npm script to validate theme JSON against schema

**CI/CD Pipeline:**
- Problem: No automated testing or validation on commits/PRs
- Blocks: Automated quality checks, pre-merge validation
- Fix approach: Add GitHub Actions workflow with JSON schema validation and syntax checks

**Theme Testing:**
- Problem: No visual testing or validation of theme appearance
- Blocks: Verification of color correctness, contrast checks, light/dark mode validation
- Fix approach: Create automated visual tests or screenshot comparison tests

## Test Coverage Gaps

**No Testing Framework:**
- What's not tested: All functionality - no tests present in the repository
- Files: All files (no test files exist)
- Risk: Changes can break theme without detection, no validation of schema compliance
- Priority: High - Critical for maintainability and preventing regressions

**Schema Validation:**
- What's not tested: Theme file compliance with official `https://opencode.ai/theme.json` schema
- Files: `.opencode/themes/poimandres.json`
- Risk: Theme may use non-standard properties or invalid structure, may fail in future OpenCode versions
- Priority: High - Essential for long-term compatibility

**Color Reference Integrity:**
- What's not tested: All color references in theme are valid and point to defined colors
- Files: `.opencode/themes/poimandres.json`
- Risk: Invalid references may cause undefined behavior or fallback colors
- Priority: Medium - Would catch maintenance errors

**Unused Color Detection:**
- What's not tested: Unused color definitions in `defs` section
- Files: `.opencode/themes/poimandres.json`
- Risk: Accumulation of unused colors over time, maintenance burden
- Priority: Low - Nice to have for code cleanliness

---

*Concerns audit: 2026-02-09*
