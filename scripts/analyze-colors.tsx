#!/usr/bin/env tsx

/**
 * Quick color analysis script for Task 1
 * Generates color adjustment proposals for WCAG compliance
 */

import * as fs from 'fs';

/**
 * Parse hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return { r: 0, g: 0, b: 0 };

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}

/**
 * Calculate relative luminance according to WCAG 2.2 formula
 */
function calculateLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;

  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const l1 = calculateLuminance(rgb1);
  const l2 = calculateLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r / 255:
        h = ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g / 255:
        h = ((b / 255 - r / 255) / d + 2) / 6;
        break;
      case b / 255:
        h = ((r / 255 - g / 255) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const r: number[] = [];
  const g: number[] = [];
  const b: number[] = [];

  if (s === 0) {
    r[0] = g[0] = b[0] = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r[0] = hue2rgb(p, q, h + 1/3);
    g[0] = hue2rgb(p, q, h);
    b[0] = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return {
    r: parseInt(toHex(r[0]), 16),
    g: parseInt(toHex(g[0]), 16),
    b: parseInt(toHex(b[0]), 16)
  };
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Adjust lightness while preserving hue and saturation
 */
function adjustLightness(hex: string, delta: number): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let newL = hsl.l + delta;
  newL = Math.max(5, Math.min(95, newL));

  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Calculate required lightness adjustment
 */
function calculateRequiredAdjustment(
  foreground: string,
  background: string,
  targetRatio: number,
  minL: number = 5,
  maxL: number = 95
): { newHex: string; adjustment: number; actualRatio: number } {
  const currentRatio = calculateContrastRatio(foreground, background);

  if (currentRatio >= targetRatio) {
    return { newHex: foreground, adjustment: 0, actualRatio: currentRatio };
  }

  const fgLum = calculateLuminance(hexToRgb(foreground));
  const bgLum = calculateLuminance(hexToRgb(background));
  const isFgLighter = fgLum > bgLum;

  // Binary search for appropriate lightness adjustment
  let low = isFgLighter ? 0 : -90;
  let high = isFgLighter ? 90 : 0;
  let best = foreground;
  let bestRatio = currentRatio;
  let bestAdjustment = 0;

  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    const testColor = adjustLightness(foreground, mid);
    const testRatio = calculateContrastRatio(testColor, background);

    if (testRatio >= targetRatio) {
      best = testColor;
      bestRatio = testRatio;
      bestAdjustment = mid;
      if (isFgLighter) {
        high = mid;
      } else {
        low = mid;
      }
    } else {
      if (isFgLighter) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  return { newHex: best, adjustment: bestAdjustment, actualRatio: bestRatio };
}

interface FailingPair {
  name: string;
  foreground: string;
  background: string;
  currentRatio: number;
  targetRatio: number;
}

const darkModeFailures: FailingPair[] = [
  {
    name: 'textMuted.dark on background.dark',
    foreground: '#767c9d',
    background: '#1b1e28',
    currentRatio: 4.07,
    targetRatio: 4.5
  },
  {
    name: 'textMuted.dark on backgroundPanel.dark',
    foreground: '#767c9d',
    background: '#303340',
    currentRatio: 3.07,
    targetRatio: 4.5
  },
  {
    name: 'error.dark on backgroundPanel.dark',
    foreground: '#d0679d',
    background: '#303340',
    currentRatio: 3.65,
    targetRatio: 4.5
  },
  {
    name: 'border.dark on background.dark',
    foreground: '#506477',
    background: '#1b1e28',
    currentRatio: 2.72,
    targetRatio: 3.0
  }
];

const lightModeFailures: FailingPair[] = [
  {
    name: 'primary.light on background.light',
    foreground: '#5de4c7',
    background: '#e4f0fb',
    currentRatio: 1.36,
    targetRatio: 4.5
  },
  {
    name: 'secondary.light on background.light',
    foreground: '#91b4d5',
    background: '#e4f0fb',
    currentRatio: 1.87,
    targetRatio: 4.5
  },
  {
    name: 'accent.light on background.light',
    foreground: '#00ced1',
    background: '#e4f0fb',
    currentRatio: 1.69,
    targetRatio: 4.5
  },
  {
    name: 'textMuted.light on background.light',
    foreground: '#506477',
    background: '#e4f0fb',
    currentRatio: 3.53,
    targetRatio: 4.5
  },
  {
    name: 'text.light on backgroundPanel.light',
    foreground: '#506477',
    background: '#7390aa',
    currentRatio: 1.84,
    targetRatio: 4.5
  },
  {
    name: 'textMuted.light on backgroundPanel.light',
    foreground: '#506477',
    background: '#7390aa',
    currentRatio: 1.84,
    targetRatio: 4.5
  },
  {
    name: 'error.light on backgroundPanel.light',
    foreground: '#d0679d',
    background: '#7390aa',
    currentRatio: 1.03,
    targetRatio: 4.5
  },
  {
    name: 'warning.light on backgroundPanel.light',
    foreground: '#fffac2',
    background: '#7390aa',
    currentRatio: 3.13,
    targetRatio: 4.5
  },
  {
    name: 'inputCursor.light on inputBackground.light',
    foreground: '#00ced1',
    background: '#e4f0fb',
    currentRatio: 1.69,
    targetRatio: 3.0
  }
];

console.log('# Color Adjustment Strategy for WCAG AA Compliance\n');

console.log('## Dark Mode Adjustments\n');
darkModeFailures.forEach(pair => {
  const rgb = hexToRgb(pair.foreground);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const result = calculateRequiredAdjustment(pair.foreground, pair.background, pair.targetRatio);
  const newRgb = hexToRgb(result.newHex);
  const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);

  console.log(`### ${pair.name}`);
  console.log(`- **Original**: ${pair.foreground} (HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`);
  console.log(`- **Current ratio**: ${pair.currentRatio.toFixed(2)}:1`);
  console.log(`- **Target ratio**: ${pair.targetRatio.toFixed(1)}:1`);
  console.log(`- **Proposed**: ${result.newHex} (HSL: ${newHsl.h}°, ${newHsl.s}%, ${newHsl.l}%)`);
  console.log(`- **Adjustment**: ${result.adjustment > 0 ? '+' : ''}${result.adjustment.toFixed(1)}% lightness`);
  console.log(`- **Expected ratio**: ${result.actualRatio.toFixed(2)}:1`);
  console.log('');
});

console.log('## Light Mode Adjustments\n');
lightModeFailures.forEach(pair => {
  const rgb = hexToRgb(pair.foreground);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const result = calculateRequiredAdjustment(pair.foreground, pair.background, pair.targetRatio);
  const newRgb = hexToRgb(result.newHex);
  const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);

  console.log(`### ${pair.name}`);
  console.log(`- **Original**: ${pair.foreground} (HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`);
  console.log(`- **Current ratio**: ${pair.currentRatio.toFixed(2)}:1`);
  console.log(`- **Target ratio**: ${pair.targetRatio.toFixed(1)}:1`);
  console.log(`- **Proposed**: ${result.newHex} (HSL: ${newHsl.h}°, ${newHsl.s}%, ${newHsl.l}%)`);
  console.log(`- **Adjustment**: ${result.adjustment > 0 ? '+' : ''}${result.adjustment.toFixed(1)}% lightness`);
  console.log(`- **Expected ratio**: ${result.actualRatio.toFixed(2)}:1`);
  console.log('');
});

console.log('## Validation Criteria');
console.log('- Saturation: 60-100% (avoid washed out or neon)');
console.log('- Lightness: 5-95% (avoid pure black/white)');
console.log('- Hue: ±10° from original (preserve color character)');
console.log('- All pairs must meet WCAG AA minimums');
