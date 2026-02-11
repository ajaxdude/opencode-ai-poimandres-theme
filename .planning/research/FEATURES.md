# Feature Landscape

**Domain:** Theme Variant Systems for Code Editors
**Researched:** February 9, 2026
**Confidence:** MEDIUM

## Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dark & Light variants | Most popular themes offer both variants (e.g., Dracula, Tokyo Night, VibeColors). Users expect to switch between modes. | LOW | Already scaffolded in current OpenCode theme. Light variant needs color palette completion. |
| Semantic color tokens (primary, secondary, accent, error, warning, success, info) | Modern design systems and popular themes (Poimandres, Dracula) use semantic naming. Enables consistency across UI components. | LOW | Already scaffolded in OpenCode theme. Just needs color values. |
| Background & foreground colors (text, backgrounds, panels) | Fundamental theme element. Code editors require readable text on appropriate backgrounds. | LOW | Already scaffolded: background, backgroundPanel, backgroundElement, text, textMuted |
| Border colors (active, inactive, subtle) | Essential for UI hierarchy and focus states. Users expect visual distinction. | LOW | Already scaffolded: border, borderActive, borderSubtle |
| Syntax highlighting colors (keywords, functions, variables, strings, types, operators, punctuation, comments) | Core purpose of code editor themes. Different token types must be distinguishable. | LOW | Already scaffolded: syntaxComment, syntaxKeyword, syntaxFunction, syntaxVariable, syntaxString, syntaxNumber, syntaxType, syntaxOperator, syntaxPunctuation |
| Input field colors (background, border, cursor, prompt, text) | Forms are essential UI. Users expect styled input fields that match theme aesthetic. | LOW | Already scaffolded: inputBackground, inputBorder, inputBorderActive, inputPrompt, inputCursor, inputText |
| Markdown styling (text, headings, links, code, blockquotes, lists, images, emphasis) | Code editors display markdown. Readers expect styled markdown rendering. | MEDIUM | Already scaffolded: markdownText, markdownHeading, markdownLink, markdownLinkText, markdownCode, markdownBlockQuote, markdownEmph, markdownStrong, markdownHorizontalRule, markdownListItem, markdownListEnumeration, markdownImage, markdownImageText, markdownCodeBlock |
| Diff colors (added, removed, context, hunk header, line numbers) | Version control is core to development. Users expect colored diffs. | MEDIUM | Already scaffolded: diffAdded, diffRemoved, diffContext, diffHunkHeader, diffHighlightAdded, diffHighlightRemoved, diffAddedBg, diffRemovedBg, diffContextBg, diffLineNumber, diffAddedLineNumberBg, diffRemovedLineNumberBg |

## Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Extended color palette (more shades of base colors) | Enables better visual hierarchy and nuanced design. Current palette has limited turquoise shades (strongTurquoise, brightMint, lowerMint). Expanding creates more semantic opportunities (e.g., turqoise-soft, turquoise-muted). | MEDIUM | Requires careful color theory work to maintain brand identity while expanding options. |
| High contrast variant | Improves accessibility and readability. Users with low vision or bright environments need higher contrast (WCAG AA: 4.5:1 ratio). Competitor "poimandres-contrast" exists for this reason. | MEDIUM | Requires rigorous contrast checking against WCAG standards. May require rethinking color relationships. |
| Semantic token support (beyond TextMate grammars) | Enables richer syntax highlighting using language server knowledge (e.g., distinguishing readonly vs mutable variables). VS Code supports semantic tokens, and modern languages increasingly use them. | HIGH | Requires language server integration. Not all themes implement this. Could be a differentiator if Poimandres adopts it. |
| Consistent color language across all UI elements | Creates cohesive experience. Many themes mix semantic tokens with direct hex colors, creating inconsistency. Using only defined tokens ensures uniformity. | MEDIUM | Audit current theme: some properties (diffAddedBg) use direct hex instead of tokens. Should convert to token references. |
| Multi-theme switching UI | Ability to preview and switch between variants (dark, light, high-contrast) without reloading. Modern theme extensions offer this as standard (e.g., VibeColors with 15 variants). | HIGH | Requires command palette integration and theme metadata. May need OpenCode SDK support. |
| Color palette documentation | Developers want to understand theme's color system and create customizations. Good themes document their semantic tokens and hex values. | LOW | Simple addition: add markdown or README with color definitions. |
| Accessibility compliance certification | WCAG AA/AAA compliance is increasingly important for enterprise adoption. Themes that demonstrate compliance have competitive edge. | MEDIUM | Requires testing with contrast checkers and color blindness simulators. |

## Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Infinite/random color generation | Users want variety and customization. | Unpredictable colors break brand identity, create poor accessibility, overwhelm users. VibeColors offers this but it's niche. | Provide curated variant set (3-6 carefully designed themes) with semantic consistency. |
| Per-element color customization (every token independently configurable) | Power users want full control. | Creates maintenance nightmare, breaks design system principles, results in inconsistent themes. VS Code's `workbench.colorCustomizations` already provides this for workbench colors. | Document color system and provide token-based overrides. Let power users customize tokens, not raw values. |
| Complex color interpolation (generating 50 shades from 2 base colors) | Sounds sophisticated, enables smooth transitions. | Mathematically generated colors often fail perceptual uniformity (hue shifts, brightness inconsistencies). Requires color science expertise. | Manually design 5-7 shades per base color using color theory. Test in UI. |
| Animated/transitional color effects | Looks fancy, modern feel. | Performance overhead, accessibility issues (motion sensitivity), distracting in coding environment. | Static, well-chosen colors. Focus on semantic meaning over animation. |
| Non-semantic color systems (direct hex everywhere) | Simpler to implement initially. | Harder to maintain, impossible to create variants consistently, breaks design principles. | Semantic token system with definitions file. Reuse tokens across all properties. |
| Single theme without variants | Faster to ship one polished theme. | Users expect variants (light/dark at minimum). Limits adoption. Always ship 2+ variants (dark + light minimum). |

## Feature Dependencies

```
[Semantic color token definitions]
    └──requires──> [Dark variant completion]
                        └──requires──> [Light variant completion]
                                           └──requires──> [WCAG contrast validation]

[High contrast variant]
    └──requires──> [Extended color palette]
                        └──enhances──> [Accessibility compliance]

[Theme switching UI]
    └──requires──> [Multiple variants (dark, light, high contrast)]
                        └──enhances──> [User experience]

[Semantic token support]
    └──conflicts──> [TextMate-only grammar highlighting]
                        └──requires──> [Language server integration]
```

### Dependency Notes

- **Semantic color token definitions requires Dark & Light variant completion:** Tokens must have values for both modes. Already scaffolded, but light variant needs color values.
- **High contrast variant requires Extended color palette:** Can't just darken existing colors—needs careful contrast-optimized palette design.
- **Extended color palette enhances Accessibility compliance:** More shades enable better contrast ratios for different text sizes/backgrounds.
- **Theme switching UI requires Multiple variants:** Can't have switching with only one theme.
- **Semantic token support conflicts with TextMate-only grammar highlighting:** Themes can support both, but semantic tokens override TextMate colors when available.
- **Semantic token support requires Language server integration:** This is on VS Code's side—theme just enables it.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Dark variant with complete semantic tokens** — Already scaffolded. Colors need finalization.
- [ ] **Light variant with complete semantic tokens** — Scaffolded, needs color palette completion.
- [ ] **WCAG AA contrast validation** — Test all color pairs (text/background, foreground/background) meet 4.5:1 minimum ratio.
- [ ] **Syntax highlighting for major languages** — JavaScript, TypeScript, Python, etc. Current tokens should work.

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **High contrast variant** — If users request better readability or accessibility.
- [ ] **Extended turquoise palette** — 3-5 additional shades for visual hierarchy if color theory supports it.
- [ ] **Color palette documentation** — README documenting all tokens and hex values.
- [ ] **Theme switching commands** — Command palette shortcuts to switch between variants.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Semantic token support** — Only if OpenCode platform supports it and users request richer syntax highlighting.
- [ ] **Theme preview/switching UI** — Requires OpenCode SDK features. Nice-to-have but not essential.
- [ ] **Additional variants beyond dark/light/high-contrast** — Only if users demand more options.
- [ ] **Custom color picker for tokens** — Power user feature. Anti-feature risk: breaks design system.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|--------------|---------------------|----------|
| Complete light variant (fill in semantic token colors) | HIGH | LOW | P1 |
| WCAG AA contrast validation (all color pairs) | HIGH | LOW | P1 |
| Complete dark variant colors (finalize existing scaffold) | HIGH | LOW | P1 |
| Syntax highlighting test across languages | HIGH | MEDIUM | P1 |
| High contrast variant | MEDIUM | MEDIUM | P2 |
| Extended turquoise palette | LOW | MEDIUM | P2 |
| Color palette documentation | MEDIUM | LOW | P2 |
| Theme switching commands | MEDIUM | MEDIUM | P2 |
| Semantic token support | MEDIUM | HIGH | P3 |
| Theme preview UI | LOW | HIGH | P3 |
| Additional variants (beyond 3) | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Poimandres (original) | Poimandres-contrast (variant) | Tokyo Night | Dracula | Our Approach |
|---------|-------------------|-------------------------------|-------------|---------|-------------|
| Dark + Light variants | No | No | Yes | Yes | Yes (light variant scaffolded, needs completion) |
| Semantic color tokens | Yes | Yes | Limited | Yes | Yes (already scaffolded) |
| High contrast variant | No | Yes (explicit) | No | No (has separate theme) | P2 (consider after validation) |
| WCAG accessibility focus | Minimal | Yes (uses VS Code high contrast colors) | Not explicit | Yes (explicit) | P1 (validate all colors) |
| Semantic token support | No | No | No (TextMate-only) | No | P3 (if OpenCode supports) |
| Extended palette | Limited (one turquoise) | Same | Rich palette | Multiple purples | P2 (expand if color theory supports) |
| Theme switching UI | No | No | No | No | P2 (if OpenCode SDK allows) |

## Sources

### HIGH Confidence (Context7/Official Docs)
- Visual Studio Code Color Theme API - https://code.visualstudio.com/api/extension-guides/color-theme (accessed 2026-02-09)
- Visual Studio Code Semantic Highlight Guide - https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide (accessed 2026-02-09)
- Visual Studio Code Theme Color Reference - https://code.visualstudio.com/api/references/theme-color (accessed 2026-02-09)

### MEDIUM Confidence (Multiple Sources Agree)
- VS Code Theme Documentation (Official) - https://code.visualstudio.com/docs/configure/themes (accessed 2026-02-09)
- VibeColors Theme Marketplace (15 variants feature) - https://marketplace.visualstudio.com/items?itemName=AlexLi.vibecolors (accessed 2026-02-09)
- Poimandres Theme Marketplace - https://marketplace.visualstudio.com/items?itemName=pmndrs.pmndrs (accessed 2026-02-09)
- Poimandres-contrast Theme Marketplace - https://marketplace.visualstudio.com/items?itemName=ryanolsonx.poimandres-contrast (accessed 2026-02-09)
- "20 Best VS Code Themes in 2026" - Jit.io - https://www.jit.io/blog/best-vs-code-themes-2023 (accessed 2026-02-09)
- WCAG Contrast Guidelines (UCLA Brand) - https://brand.ucla.edu/fundamentals/accessibility/color-type (accessed 2026-02-09)
- "WCAG Compliant Color Contrast" - Skynet Technologies - https://www.skynettechnologies.com/blog/wcag-compliant-color-contrast-tips-tools-and-best-practices (accessed 2026-02-09)

### LOW Confidence (WebSearch Only)
- "Theme UI Variants Guide" - https://theme-ui.com/guides/variants (accessed 2026-02-09) - WebSearch only, not verified against official docs
- Various theme comparison blog posts - Not verified against official sources, treated as LOW confidence

---
*Feature research for: Theme Variant Systems*
*Researched: February 9, 2026*
