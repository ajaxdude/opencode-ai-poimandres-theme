#!/usr/bin/env node

/**
 * WCAG AA Contrast Validation Script
 *
 * Validates theme color pairs against WCAG 2.2 accessibility standards:
 * - Normal text: 4.5:1 contrast ratio required
 * - Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio required
 * - UI components (icons, borders): 3:1 contrast ratio required
 *
 * Usage:
 *   node scripts/validate-contrast.js <theme-file>
 *
 * Exit codes:
 *   0: All pairs pass WCAG AA
 *   1: At least one pair fails WCAG AA
 *   2: Invalid input or error
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse hex color to RGB values
 */
function hexToRgb(hex) {
  // Handle 3-digit hex
  if (/^#?([a-f\d])([a-f\d])([a-f\d])$/i.test(hex)) {
    return {
      r: parseInt(hex[1] + hex[1], 16),
      g: parseInt(hex[2] + hex[2], 16),
      b: parseInt(hex[3] + hex[3], 16),
    };
  }

  // Handle 6-digit hex
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

/**
 * Calculate relative luminance according to WCAG 2.2 formula
 */
function calculateLuminance(rgb) {
  const { r, g, b } = rgb;

  // Convert to sRGB values
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Linearize RGB values
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const l1 = calculateLuminance(rgb1);
  const l2 = calculateLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Resolve color reference to hex value
 */
function resolveColor(theme, colorRef, mode) {
  // Direct color reference in defs
  if (theme.defs[colorRef]) {
    return theme.defs[colorRef];
  }

  // Theme reference (e.g., "text.dark")
  const [category, colorMode] = colorRef.split('.');
  if (category && colorMode && theme.theme[category]) {
    const ref = theme.theme[category];
    if (ref && ref[mode]) {
      const resolved = ref[mode];
      if (theme.defs[resolved]) {
        return theme.defs[resolved];
      }
      return resolved; // Direct hex
    }
  }

  return null;
}

/**
 * Validate color pair
 */
function validatePair(theme, pairName, foregroundRef, backgroundRef, mode, requiredRatio) {
  const foreground = resolveColor(theme, foregroundRef, mode);
  const background = resolveColor(theme, backgroundRef, mode);

  if (!foreground || !background) {
    return null;
  }

  const ratio = calculateContrastRatio(foreground, background);
  if (ratio === null) return null;

  const passes = ratio >= requiredRatio;

  return {
    name: `${pairName} (${mode})`,
    foreground: foregroundRef.startsWith('#') ? foregroundRef : foreground,
    background: backgroundRef.startsWith('#') ? backgroundRef : background,
    ratio: Number(ratio.toFixed(2)),
    requiredRatio,
    passes,
  };
}

/**
 * Get recommendation for failing pair
 */
function getRecommendation(pair) {
  const ratio = pair.ratio;
  const required = pair.requiredRatio;

  if (ratio >= required) return '';

  const shortfall = required - ratio;

  if (ratio < 2) {
    return 'Critical: Increase foreground brightness or darken background significantly';
  } else if (ratio < required * 0.9) {
    return 'Adjust foreground or background to improve contrast by at least ' + shortfall.toFixed(1) + ':1';
  } else {
    return 'Minor adjustment needed: increase contrast by ' + shortfall.toFixed(1) + ':1';
  }
}

/**
 * Print validation report
 */
function printReport(themeFile, allPairs) {
  const themeName = path.basename(themeFile);
  const passed = allPairs.filter(p => p.passes).length;
  const failed = allPairs.filter(p => !p.passes).length;
  const total = allPairs.length;
  const compliance = ((passed / total) * 100).toFixed(0);

  console.log('WCAG AA Contrast Validation Report');
  console.log('=================================\n');
  console.log(`Theme: ${themeName}\n`);

  // Group by mode
  const darkPairs = allPairs.filter(p => p.name.includes('(dark)'));
  const lightPairs = allPairs.filter(p => p.name.includes('(light)'));

  // Dark Mode Validation
  console.log('Dark Mode Validation');
  console.log('-------------------');

  const darkTextOnBg = darkPairs.filter(p =>
    p.name.includes('text on background') ||
    p.name.includes('primary on background') ||
    p.name.includes('secondary on background') ||
    p.name.includes('accent on background')
  );

  const darkTextOnPanel = darkPairs.filter(p => p.name.includes('on panel'));
  const darkUi = darkPairs.filter(p => p.name.includes('UI'));

  if (darkTextOnBg.length > 0) {
    console.log('\n### Text on Background');
    darkTextOnBg.forEach(pair => {
      const status = pair.passes ? '✓' : '✗';
      console.log(`  ${status} ${pair.name}: ${pair.ratio}:1 (required ${pair.requiredRatio}:1)`);
    });
  }

  if (darkTextOnPanel.length > 0) {
    console.log('\n### Text on Panel');
    darkTextOnPanel.forEach(pair => {
      const status = pair.passes ? '✓' : '✗';
      console.log(`  ${status} ${pair.name}: ${pair.ratio}:1 (required ${pair.requiredRatio}:1)`);
    });
  }

  if (darkUi.length > 0) {
    console.log('\n### UI Elements');
    darkUi.forEach(pair => {
      const status = pair.passes ? '✓' : '✗';
      console.log(`  ${status} ${pair.name}: ${pair.ratio}:1 (required ${pair.requiredRatio}:1)`);
    });
  }

  // Light Mode Validation
  console.log('\n\nLight Mode Validation');
  console.log('---------------------');

  const lightTextOnBg = lightPairs.filter(p =>
    p.name.includes('text on background') ||
    p.name.includes('primary on background') ||
    p.name.includes('secondary on background') ||
    p.name.includes('accent on background')
  );

  const lightTextOnPanel = lightPairs.filter(p => p.name.includes('on panel'));
  const lightUi = lightPairs.filter(p => p.name.includes('UI'));

  if (lightTextOnBg.length > 0) {
    console.log('\n### Text on Background');
    lightTextOnBg.forEach(pair => {
      const status = pair.passes ? '✓' : '✗';
      console.log(`  ${status} ${pair.name}: ${pair.ratio}:1 (required ${pair.requiredRatio}:1)`);
    });
  }

  if (lightTextOnPanel.length > 0) {
    console.log('\n### Text on Panel');
    lightTextOnPanel.forEach(pair => {
      const status = pair.passes ? '✓' : '✗';
      console.log(`  ${status} ${pair.name}: ${pair.ratio}:1 (required ${pair.requiredRatio}:1)`);
    });
  }

  if (lightUi.length > 0) {
    console.log('\n### UI Elements');
    lightUi.forEach(pair => {
      const status = pair.passes ? '✓' : '✗';
      console.log(`  ${status} ${pair.name}: ${pair.ratio}:1 (required ${pair.requiredRatio}:1)`);
    });
  }

  // Summary
  console.log('\n\nSummary');
  console.log('-------');
  console.log(`Total pairs tested: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`WCAG AA compliance: ${compliance}%`);

  // Failing pairs
  const failingPairs = allPairs.filter(p => !p.passes);
  if (failingPairs.length > 0) {
    console.log('\n\nFailing Pairs');
    console.log('-------------');

    failingPairs.forEach(pair => {
      const fgHex = pair.foreground.startsWith('#') ? pair.foreground : theme.defs[pair.foreground] || pair.foreground;
      const bgHex = pair.background.startsWith('#') ? pair.background : theme.defs[pair.background] || pair.background;

      console.log(`- ${pair.name}: ${pair.ratio}:1 < ${pair.requiredRatio}:1`);
      console.log(`  Foreground: ${fgHex}`);
      console.log(`  Background: ${bgHex}`);
      const recommendation = getRecommendation(pair);
      if (recommendation) {
        console.log(`  Recommendation: ${recommendation}`);
      }
      console.log('');
    });
  } else {
    console.log('\n\n✅ All pairs pass WCAG AA requirements');
  }

  // Exit code
  process.exit(failed > 0 ? 1 : 0);
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: Theme file path required');
    console.error('Usage: node scripts/validate-contrast.js <theme-file>');
    process.exit(2);
  }

  const themeFile = args[0];

  if (!fs.existsSync(themeFile)) {
    console.error(`Error: Theme file not found: ${themeFile}`);
    process.exit(2);
  }

  let theme;
  try {
    const content = fs.readFileSync(themeFile, 'utf-8');
    theme = JSON.parse(content);
  } catch (error) {
    console.error(`Error: Failed to parse theme file: ${error}`);
    process.exit(2);
  }

  // Define color pairs to validate
  const pairs = [
    // Text on Background (4.5:1)
    { name: 'primary on background', fg: 'primary.dark', bg: 'background.dark', required: 4.5 },
    { name: 'primary on background', fg: 'primary.light', bg: 'background.light', required: 4.5 },
    { name: 'secondary on background', fg: 'secondary.dark', bg: 'background.dark', required: 4.5 },
    { name: 'secondary on background', fg: 'secondary.light', bg: 'background.light', required: 4.5 },
    { name: 'accent on background', fg: 'accent.dark', bg: 'background.dark', required: 4.5 },
    { name: 'accent on background', fg: 'accent.light', bg: 'background.light', required: 4.5 },
    { name: 'text on background', fg: 'text.dark', bg: 'background.dark', required: 4.5 },
    { name: 'text on background', fg: 'text.light', bg: 'background.light', required: 4.5 },
    { name: 'textMuted on background', fg: 'textMuted.dark', bg: 'background.dark', required: 4.5 },
    { name: 'textMuted on background', fg: 'textMuted.light', bg: 'background.light', required: 4.5 },

    // Text on Panel (4.5:1)
    { name: 'text on panel', fg: 'text.dark', bg: 'backgroundPanel.dark', required: 4.5 },
    { name: 'text on panel', fg: 'text.light', bg: 'backgroundPanel.light', required: 4.5 },
    { name: 'textMuted on panel', fg: 'textMuted.dark', bg: 'backgroundPanel.dark', required: 4.5 },
    { name: 'textMuted on panel', fg: 'textMuted.light', bg: 'backgroundPanel.light', required: 4.5 },
    { name: 'error on panel', fg: 'error.dark', bg: 'backgroundPanel.dark', required: 4.5 },
    { name: 'error on panel', fg: 'error.light', bg: 'backgroundPanel.light', required: 4.5 },
    { name: 'warning on panel', fg: 'warning.dark', bg: 'backgroundPanel.dark', required: 4.5 },
    { name: 'warning on panel', fg: 'warning.light', bg: 'backgroundPanel.light', required: 4.5 },

    // UI Elements (3:1)
    { name: 'UI: border on background', fg: 'border.dark', bg: 'background.dark', required: 3.0 },
    { name: 'UI: border on background', fg: 'border.light', bg: 'background.light', required: 3.0 },
    { name: 'UI: borderActive on background', fg: 'borderActive.dark', bg: 'background.dark', required: 3.0 },
    { name: 'UI: borderActive on background', fg: 'borderActive.light', bg: 'background.light', required: 3.0 },
    { name: 'UI: inputCursor on inputBackground', fg: 'inputCursor.dark', bg: 'inputBackground.dark', required: 3.0 },
    { name: 'UI: inputCursor on inputBackground', fg: 'inputCursor.light', bg: 'inputBackground.light', required: 3.0 },
  ];

  // Validate all pairs
  const allPairs = [];

  for (const pair of pairs) {
    const mode = pair.fg.includes('.dark') ? 'dark' : 'light';
    const validated = validatePair(theme, pair.name, pair.fg, pair.bg, mode, pair.required);
    if (validated) {
      allPairs.push(validated);
    }
  }

  printReport(themeFile, allPairs);
}

// Run main if executed directly
if (require.main === module) {
  main();
}

module.exports = { calculateLuminance, calculateContrastRatio, validatePair, printReport };
