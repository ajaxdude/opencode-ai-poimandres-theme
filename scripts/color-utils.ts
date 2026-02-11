#!/usr/bin/env node

/**
 * Utility functions for color manipulation and contrast calculations
 * Based on WCAG 2.1 specification
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert hex to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
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
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
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

  return `#${toHex(r[0])}${toHex(g[0])}${toHex(b[0])}`;
}

/**
 * Calculate relative luminance (WCAG 2.0)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRGB(hex);
  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex to RGB array
 */
function hexToRGB(hex: string): number[] {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}

/**
 * Calculate contrast ratio (WCAG 2.0)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Adjust lightness while preserving hue and saturation
 */
export function adjustLightness(hex: string, delta: number): string {
  const hsl = hexToHSL(hex);
  let newL = hsl.l + delta;

  // Clamp to reasonable range
  newL = Math.max(5, Math.min(95, newL));

  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Find minimum lightness adjustment to reach target contrast
 */
export function findLightnessAdjustment(
  foreground: string,
  background: string,
  targetRatio: number
): { newHex: string; adjustment: number; actualRatio: number } | null {
  const currentRatio = getContrastRatio(foreground, background);

  if (currentRatio >= targetRatio) {
    return { newHex: foreground, adjustment: 0, actualRatio: currentRatio };
  }

  const fgLum = getLuminance(foreground);
  const bgLum = getLuminance(background);
  const isFgLighter = fgLum > bgLum;

  // Binary search for appropriate lightness adjustment
  let low = isFgLighter ? 5 : -90;
  let high = isFgLighter ? 90 : -5;
  let best = foreground;
  let bestRatio = currentRatio;
  let bestAdjustment = 0;

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const testColor = adjustLightness(foreground, mid);
    const testRatio = getContrastRatio(testColor, background);

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

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'hsl') {
  const hex = args[1];
  const hsl = hexToHSL(hex);
  console.log(`${hex} → HSL(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`);
} else if (command === 'contrast') {
  const hex1 = args[1];
  const hex2 = args[2];
  const ratio = getContrastRatio(hex1, hex2);
  console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`);
} else if (command === 'adjust') {
  const foreground = args[1];
  const background = args[2];
  const targetRatio = parseFloat(args[3]);

  const result = findLightnessAdjustment(foreground, background, targetRatio);
  if (result) {
    const oldHsl = hexToHSL(foreground);
    const newHsl = hexToHSL(result.newHex);
    console.log(`Original: ${foreground} (HSL: ${oldHsl.h}°, ${oldHsl.s}%, ${oldHsl.l}%)`);
    console.log(`New: ${result.newHex} (HSL: ${newHsl.h}°, ${newHsl.s}%, ${newHsl.l}%)`);
    console.log(`Adjustment: ${result.adjustment > 0 ? '+' : ''}${result.adjustment.toFixed(1)}% lightness`);
    console.log(`Contrast: ${result.actualRatio.toFixed(2)}:1`);
  } else {
    console.log('Could not find adjustment');
  }
}
