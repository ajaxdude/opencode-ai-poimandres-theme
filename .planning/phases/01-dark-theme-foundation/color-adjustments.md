# Color Adjustment Strategy for WCAG AA Compliance

## Dark Mode Adjustments

### textMuted.dark on background.dark
- **Original**: #767c9d (HSL: 231°, 17%, 54%)
- **Current ratio**: 4.07:1
- **Target ratio**: 4.5:1
- **Proposed**: #7e84a3 (HSL: 230°, 17%, 57%)
- **Adjustment**: +2.7% lightness
- **Expected ratio**: 4.53:1

### textMuted.dark on backgroundPanel.dark
- **Original**: #767c9d (HSL: 231°, 17%, 54%)
- **Current ratio**: 3.07:1
- **Target ratio**: 4.5:1
- **Proposed**: #959ab4 (HSL: 230°, 17%, 65%)
- **Adjustment**: +10.4% lightness
- **Expected ratio**: 4.52:1

### error.dark on backgroundPanel.dark
- **Original**: #d0679d (HSL: 329°, 53%, 61%)
- **Current ratio**: 3.65:1
- **Target ratio**: 4.5:1
- **Proposed**: #d87fac (HSL: 330°, 53%, 67%)
- **Adjustment**: +6.1% lightness
- **Expected ratio**: 4.51:1

### border.dark on background.dark
- **Original**: #506477 (HSL: 209°, 20%, 39%)
- **Current ratio**: 2.72:1
- **Target ratio**: 3.0:1
- **Proposed**: #556b7f (HSL: 209°, 20%, 42%)
- **Adjustment**: +2.5% lightness
- **Expected ratio**: 3.01:1

## Light Mode Adjustments

### primary.light on background.light
- **Original**: #5de4c7 (HSL: 167°, 71%, 63%)
- **Current ratio**: 1.36:1
- **Target ratio**: 4.5:1
- **Proposed**: #157a64 (HSL: 167°, 71%, 28%)
- **Adjustment**: -34.9% lightness
- **Expected ratio**: 4.54:1

### secondary.light on background.light
- **Original**: #91b4d5 (HSL: 209°, 45%, 70%)
- **Current ratio**: 1.87:1
- **Target ratio**: 4.5:1
- **Proposed**: #3d70a1 (HSL: 209°, 45%, 44%)
- **Adjustment**: -26.5% lightness
- **Expected ratio**: 4.50:1

### accent.light on background.light
- **Original**: #00ced1 (HSL: 181°, 100%, 41%)
- **Current ratio**: 1.69:1
- **Target ratio**: 4.5:1
- **Proposed**: #00797c (HSL: 181°, 100%, 24%)
- **Adjustment**: -16.8% lightness
- **Expected ratio**: 4.51:1

### textMuted.light on background.light
- **Original**: #506477 (HSL: 209°, 20%, 39%)
- **Current ratio**: 3.53:1
- **Target ratio**: 4.5:1
- **Proposed**: #506477 (HSL: 209°, 20%, 39%)
- **Adjustment**: 0.0% lightness
- **Expected ratio**: 5.29:1

### text.light on backgroundPanel.light
- **Original**: #506477 (HSL: 209°, 20%, 39%)
- **Current ratio**: 1.84:1
- **Target ratio**: 4.5:1
- **Proposed**: #1f272f (HSL: 210°, 21%, 15%)
- **Adjustment**: -23.6% lightness
- **Expected ratio**: 4.53:1

### textMuted.light on backgroundPanel.light
- **Original**: #506477 (HSL: 209°, 20%, 39%)
- **Current ratio**: 1.84:1
- **Target ratio**: 4.5:1
- **Proposed**: #1f272f (HSL: 210°, 21%, 15%)
- **Adjustment**: -23.6% lightness
- **Expected ratio**: 4.53:1

### error.light on backgroundPanel.light
- **Original**: #d0679d (HSL: 329°, 53%, 61%)
- **Current ratio**: 1.03:1
- **Target ratio**: 4.5:1
- **Proposed**: #44152e (HSL: 328°, 53%, 17%)
- **Adjustment**: -43.4% lightness
- **Expected ratio**: 4.52:1

### warning.light on backgroundPanel.light
- **Original**: #fffac2 (HSL: 55°, 100%, 88%)
- **Current ratio**: 3.13:1
- **Target ratio**: 4.5:1
- **Proposed**: #fffac2 (HSL: 55°, 100%, 88%)
- **Adjustment**: 0.0% lightness
- **Expected ratio**: 3.13:1

### inputCursor.light on inputBackground.light
- **Original**: #00ced1 (HSL: 181°, 100%, 41%)
- **Current ratio**: 1.69:1
- **Target ratio**: 3.0:1
- **Proposed**: #00999c (HSL: 181°, 100%, 31%)
- **Adjustment**: -10.4% lightness
- **Expected ratio**: 3.01:1

## Validation Criteria
- Saturation: 60-100% (avoid washed out or neon)
- Lightness: 5-95% (avoid pure black/white)
- Hue: ±10° from original (preserve color character)
- All pairs must meet WCAG AA minimums
