# Pitfalls Research

**Domain:** JSON Theme Variant Systems
**Researched:** 2025-02-09
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Inconsistent Contrast Across Variants

**What goes wrong:**
Theme variants (especially dark mode) fail WCAG accessibility standards because colors are manually adjusted without proper contrast validation. Light variants may work, but dark variants have text/background contrast ratios below 4.5:1, making them unreadable.

**Why it happens:**
Developers treat dark mode as a simple color inversion or manually pick dark colors without understanding that contrast ratios behave differently on dark backgrounds. They rely on visual inspection rather than measurable contrast ratios. Dark mode requires specific desaturation techniques - simply using the brand colors at the same saturation values causes poor readability.

**How to avoid:**
1. **Use automated contrast checking tools** (WCAG 2.2 compliance) for every color combination in every variant
2. **Implement a contrast guard system**: Use tools like color.js or a build step that validates all color pairs meet minimum ratios (4.5:1 for text, 3:1 for large text/UI elements)
3. **Document all color relationships**: Create a "contrast grid" showing which foreground colors pair with which backgrounds across all variants
4. **Test both variants early**: Don't build the light theme first and "just tweak" the dark theme later - design them as equal design systems

**Warning signs:**
- Visual inspection passes but automated contrast checkers flag combinations
- Dark variant feels "too bright" or causes eye strain
- Users report readability issues specifically in one variant
- Manual color adjustments are made without documenting contrast ratios

**Phase to address:**
Phase 1 (Color System Foundation) - Must establish automated contrast validation before creating any variants

---

### Pitfall 2: Color Mapping Conflicts In JSON Structure

**What goes wrong:**
Different semantic color slots (e.g., `syntaxVariable`, `syntaxString`, `primary`) accidentally reference the same hex value, or critical slots reference values that don't exist in the `defs` section. This causes runtime errors when OpenCode parses the theme file.

**Why it happens:**
JSON theme files use indirect references (pointers to named color definitions rather than inline hex values). When copy-pasting or manually editing, developers forget to update all references when modifying the palette, or they introduce typos in property names. The current poimandres.json has 21 definitions in `defs` and 60+ semantic mappings - a large surface area for human error.

**How to avoid:**
1. **Use a build/generation script**: Instead of hand-editing JSON, generate theme files from a source of truth (e.g., a palette definition file) using a script
2. **Implement JSON schema validation**: Use the `$schema` reference to a schema file that validates all references in `theme` section exist in `defs`
3. **Add post-generation linting**: Create a test that parses the theme file and checks all references are valid
4. **Don't duplicate hex values**: Every distinct color should have one named definition - if multiple semantic slots use the same hex, reference the same definition

**Warning signs:**
- Theme loads but colors don't display as expected
- OpenCode logs show "undefined color reference" errors
- Manual JSON validation passes but theme doesn't render correctly
- Copy-pasting color mappings from one variant to another causes failures

**Phase to address:**
Phase 1 (Color System Foundation) - Build automated generation pipeline with schema validation

---

### Pitfall 3: Inherited Token Pollution Across Variants

**What goes wrong:**
When creating theme variants (e.g., `poimandres-turquoise.json`, `poimandres-light.json`), developers duplicate the entire `defs` and `theme` sections instead of inheriting shared colors and only overriding variant-specific ones. This leads to token bloat, inconsistency, and maintenance nightmare.

**Why it happens:**
JSON doesn't support native inheritance, so developers copy the entire base theme file and make modifications manually. Without a strategy for "shared vs. variant-specific" colors, every variant ends up with 250+ lines of duplicated content. When the base theme needs an update, all 3-5 variants must be manually updated.

**How to avoid:**
1. **Separate shared from variant-specific definitions**: Create a `base.json` with colors that never change (brand core, semantic structure)
2. **Use a build pipeline**: Each variant imports base and applies variant-specific overrides using a script
3. **Document the inheritance model**: Maintain a matrix showing which colors are shared vs. variant-specific
4. **Version variants together**: When updating shared colors, all variants should be regenerated in one operation

**Warning signs:**
- Making a color fix requires editing 5+ files
- Variants have different versions of the "same" semantic color
- File sizes grow exponentially with each new variant
- Merge conflicts when working on multiple variants simultaneously

**Phase to address:**
Phase 2 (Variant Generation System) - Build inheritance-aware generation pipeline before creating more than 1 variant

---

### Pitfall 4: Pure Black/White Backgrounds in Dark/Light Modes

**What goes wrong:**
Dark theme uses `#000000` (pure black) as background, or light theme uses `#FFFFFF` (pure white). This causes eye strain, "halo effect" (blurry text), and poor depth perception. Pure white backgrounds with black text at 21:1 contrast are also problematic.

**Why it happens:**
Developers equate "dark mode" with "black background" and "light mode" with "white background" as the simplest implementation. They don't understand that dark gray backgrounds (#121212, #1b1e28) reduce eye strain while maintaining the dark aesthetic. Similarly, off-white backgrounds (#f4f4fb, #e4f0fb) prevent glare while staying true to light mode.

**How to avoid:**
1. **Follow Material Design guidance**: Use dark grays, not pure black (recommended: #121212 to #1f1f1f range for backgrounds)
2. **Use off-white for light themes**: Backgrounds should be #f4f4fb or similar, not pure #FFFFFF
3. **Leverage existing palette references**: The current poimandres.json already uses `poimandresBg: #1b1e28` and `poimandresOffWhite: #e4f0fb` - these patterns should be maintained across variants
4. **Test for eye strain**: Have users provide feedback on prolonged usage, not just visual inspection

**Warning signs:**
- Dark theme feels "harsh" or causes fatigue after extended use
- Light theme causes glare in bright environments
- Users complain about "muddy" colors or text blurring
- Contrast ratios pass but readability complaints persist

**Phase to address:**
Phase 1 (Color System Foundation) - Define background color strategy before variant generation

---

### Pitfall 5: Semantic Slot Misalignment Across Variants

**What goes wrong:**
Variant themes change which semantic slot maps to which color. For example, `poimandres-strong-turquoise` is used for `syntaxVariable` in the base theme, but a variant maps `syntaxVariable` to a different color entirely. This breaks code recognition patterns users have built.

**Why it happens:**
When manually editing variant JSON files, developers think "turquoise variant should use more turquoise everywhere" and globally replace colors. However, code syntax highlighting relies on consistent semantic mapping - `syntaxVariable` should always have the same functional relationship to `syntaxKeyword`, even if the actual hex values change.

**How to avoid:**
1. **Preserve semantic relationships**: Define rules like "all syntax tokens use the primary accent family" and apply variants within those rules
2. **Maintain a semantic invariant**: If `syntaxVariable` uses the accent color in base theme, all variants should use a variant of the accent color, not switch to an entirely different family
3. **Document the role of each semantic slot**: Maintain a "semantic specification" that describes what each slot should accomplish
4. **Test with real code**: Use identical code samples across all variants to ensure syntax highlighting feels consistent

**Warning signs:**
- Users say "the colors are totally different" when switching themes
- Code structure recognition becomes harder in one variant
- Reviewers point out "this doesn't look like a variant of the same theme"
- Color relationships (foreground/background, accent/primary) break in one variant

**Phase to address:**
Phase 2 (Variant Generation System) - Document and enforce semantic invariants before creating multiple variants

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|---------------|-----------------|
| Hand-editing JSON theme files | Fast for one-off changes | Every new variant = 250+ lines of manual editing; high error rate | Never - use generation scripts |
| Reusing hex values by copy-paste | Quick to implement | Breaks reference model; updates require hunting down all copies | Never - always use named defs |
| Creating dark theme by "inverting" colors | Instant dark mode | Poor accessibility; broken contrast; semantic meaning lost | Never - dark theme requires deliberate design |
| Skipping contrast validation | Saves setup time | Inaccessible themes blocked by OpenCode/app store reviews | Only for internal prototypes (warn explicitly) |
| Manually maintaining 5+ variant files | No tooling overhead | Any update requires editing all 5 files; merge conflicts | Only if using proper build pipeline with inheritance |
| Hardcoding values instead of defs | Simpler JSON structure | Can't scale; can't create systematic variants | Never for theme files |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|------------|----------------|------------------|
| OpenCode theme system | Missing `$schema` reference or wrong schema URL | Include `"https://opencode.ai/theme.json"` in root; validate against schema before testing |
| Variant file management | Naming conflicts like `poimandres.json` and `poimandres-turquoise.json` in same directory | Use clear naming: `poimandres-base.json`, `poimandres-turquoise.json`; ensure only one is loaded at a time |
| Dark mode toggle | Hardcoding theme switch in application code instead of using OpenCode's theming system | Use OpenCode's `theme` setting in `opencode.json`; let user choose via settings |
| Design token synchronization | Updating colors in Figma/design tool but not regenerating theme JSON | Set up CI pipeline: Figma export → token generation → theme.json build → auto-update |
| File locations | Theme JSON in project root but OpenCode looks in `.opencode/themes/` | Place all theme JSON files in `.opencode/themes/` directory as per OpenCode structure |
| Color conflicts | Multiple variants loaded simultaneously, causing unexpected color overrides | OpenCode loads one theme at a time; ensure config references only one theme file |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Theme file bloat (250+ lines per variant) | Slow loading; difficult to edit; merge conflicts | At 3+ variants - switch to inheritance model |
| No contrast validation automation | Manually testing each color pair; missed combinations | At 2+ variants - implement automated contrast checker in build pipeline |
| Copy-paste duplication | Same hex in 5+ places; inconsistencies across variants | At 3+ semantic slots - generate from single source of truth |
| Manual regeneration of all variants | Updating base theme takes hours; human error risk | At 1 update to base - implement automated variant generator |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Theme files execute arbitrary code (if OpenCode adds plugin system) | Code injection attacks | Validate theme JSON against strict schema; never `eval()` theme content |
| User-generated theme uploads without validation | Malformed JSON crashes application | Parse theme in sandboxed environment; provide clear error messages |
| Version conflicts in distributed themes | Users stuck with incompatible theme | Include required OpenCode version in theme metadata; warn on mismatch |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| "Looks Done But Isn't" - Missing accent colors for all states | Buttons/links have no hover/active states; confusing interaction | Define complete state system: default, hover, active, disabled for every interactive element |
| Inconsistent depth cues across variants | One variant uses shadows, another uses borders | Maintain same depth strategy (elevation vs. borders) across all variants |
| Poor transition between themes | Jarring switch when user toggles; feels like different app | Preserve semantic color family relationships even when changing hue/saturation |
| Missing visual hierarchy indicators | User can't distinguish primary/secondary actions | Use consistent visual weight: primary > secondary > tertiary across variants |
| No fallback colors | Missing definition causes UI element to disappear | Every semantic slot must have definition in both light and dark modes |

---

## "Looks Done But Isn't" Checklist

- [ ] **Syntax highlighting**: All syntax tokens (keyword, string, variable, function, etc.) have valid color references in both light and dark modes — verify by checking each language's grammar colors across variants
- [ ] **UI states**: Every interactive element (button, input, link) has definitions for default, hover, active, focus, and disabled states — verify by manual test of all interactive components
- [ ] **Depth consistency**: Panels, modals, and elevated elements use consistent background/foreground relationships across variants — verify by comparing elevation hierarchy
- [ ] **Accessibility compliance**: All text/background combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text) — verify with automated contrast checker
- [ ] **Diff viewer**: All diff colors (added, removed, context, hunk header) are defined and maintain contrast in both modes — verify with sample diff
- [ ] **Markdown rendering**: All markdown token types (heading, link, code, emphasis, strong) have valid references — verify by rendering sample markdown
- [ ] **Form elements**: Input backgrounds, borders, prompts, cursors are defined and accessible — verify with form component test
- [ ] **No orphaned references**: Every color value referenced in `theme` section has a corresponding definition in `defs` — verify with schema validation tool

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Inherited token pollution | HIGH | 1. Identify shared colors across all variants. 2. Extract to base template. 3. Rebuild variants with inheritance model. 4. Add schema validation to prevent recurrence. |
| Contrast failures in shipped variant | MEDIUM | 1. Use automated contrast checker to identify all failing pairs. 2. Systematically adjust to meet WCAG AA. 3. Test with accessibility users. 4. Release hotfix. |
| Semantic slot drift | LOW | 1. Create semantic specification document. 2. Map each semantic slot to its role. 3. Audit all variants against spec. 4. Fix misaligned slots. |
| JSON structure corruption (bad edit) | LOW | 1. Restore from git history. 2. Implement automated schema validation to prevent future corruption. 3. Add pre-commit hook for JSON validation. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Inconsistent contrast across variants | Phase 1: Color System Foundation | Automated contrast checker validates all color pairs pass WCAG AA before any variant generation |
| Color mapping conflicts in JSON structure | Phase 1: Color System Foundation | Schema validation script confirms all references in `theme` section exist in `defs` |
| Inherited token pollution across variants | Phase 2: Variant Generation System | Build pipeline regenerates all variants from shared base; audit shows <10% code duplication |
| Pure black/white backgrounds | Phase 1: Color System Foundation | Color specification defines acceptable background ranges; automated check prevents pure #000000/#FFFFFF |
| Semantic slot misalignment | Phase 2: Variant Generation System | Semantic specification defines invariant relationships; automated test checks code recognition consistency |
| File bloat and performance issues | Phase 2: Variant Generation System | Build pipeline measures variant sizes; inheritance model ensures all variants <100KB |
| Manual editing errors | Phase 2: Variant Generation System | All theme files generated from source; manual JSON editing blocked by CI checks |
| Accessibility failures | Phase 1: Color System Foundation | Contrast checker integrated into build; failing build blocks variant release |

---

## Sources

### Primary (HIGH confidence)
- [WCAG 2.2 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-ratios) — Contrast ratios for accessibility
- [MDN - Color Contrast](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast) — Web accessibility standards
- [MDN - light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) — CSS color function for theming
- [MDN - prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) — Detecting theme preferences
- [OpenCode Theme Documentation](https://opencode.ai/docs/themes/) — Theme structure and requirements
- [OpenCode Schema](https://opencode.ai/config.json) — Config schema validation

### Secondary (MEDIUM confidence)
- [Dark Mode UI: Essential Tips for Color Palettes and Accessibility](https://www.wildnetedge.com/blogs/dark-mode-ui-essential-tips-for-color-palettes-and-accessibility) — Dark mode design patterns
- [Common mistakes with using colour in accessibility](https://www.a11y-collective.com/blog/common-mistakes-with-using-colour-in-accessibility/) — Accessibility color pitfalls
- [Designing Accessible Dark Themes for All Users](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/) — Inclusive dark mode design
- [Designing for Dark Mode: Best Practices and Considerations](https://www.site123.com/learn/designing-for-dark-mode-best-practices-and-considerations) — Dark mode implementation
- [Design Token Naming Best Practices](https://www.netguru.com/blog/design-token-naming-best-practices) — Token naming standards
- [A new approach to naming design tokens](https://samiamdesigns.substack.com/p/a-new-approach-to-naming-design-tokens) — Token naming architecture
- [Theme.json color options](https://fullsiteediting.com/lessons/theme-json-color-options/) — WordPress theme.json structure (similar patterns apply)
- [Common JSON Mistakes](https://jsonlint.com/common-mistakes-in-json-and-how-to-avoid-them) — JSON syntax errors

### Tertiary (LOW confidence)
- [Yellow, Purple, and the Myth of "Accessibility Limits Color..."](https://stephaniewalter.design/blog/yellow-purple-and-the-myth-of-accessibility-limits-color-palettes/) — Color palette accessibility (needs validation for code context)
- [JSON Formatting: The Complete Developer Guide](https://toolslab.dev/blog/json-formatting-complete-guide) — JSON best practices (general, not theme-specific)
- Various community discussions on theme variants — Need validation with real-world testing

---

*Pitfalls research for: JSON Theme Variant Systems*
*Researched: 2025-02-09*
