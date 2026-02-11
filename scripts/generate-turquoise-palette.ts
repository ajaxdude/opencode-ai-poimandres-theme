#!/usr/bin/env tsx
/**
 * Generate extended turquoise color palette for Poimandres theme
 *
 * Generates 7 shades of turquoise from base color #00CED1 (Strong Turquoise)
 * using lightness adjustment in HSL color space for perceptual uniformity.
 */

// Color type definitions
type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl({ r, g, b }: RGB): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb({ h, s, l }: HSL): RGB {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert RGB to hex
 */
function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate turquoise palette from base color
 */
function generateTurquoisePalette(baseColor: string): Record<string, string> {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb);

  // Base color analysis: #00CED1 → RGB(0, 206, 209) → HSL(179°, 100%, 41%)
  // Preserve original saturation to maintain Poimandres aesthetic
  const targetSaturation = hsl.s;

  // Lightness values for 7 shades (lightest to darkest)
  // Ensuring ≥10% difference between adjacent shades for visual distinction
  const lightnessLevels: Record<string, number> = {
    '50': 90,   // Lightest
    '100': 80,  // Very light (diff: 10%)
    '300': 60,  // Light (diff: 20%)
    '400': 41,  // Base (original) (diff: 19%)
    '500': 31,  // Dark (diff: 10%)
    '700': 21,  // Very dark (diff: 10%)
    '900': 11,  // Darkest (diff: 10%)
  };

  const palette: Record<string, string> = {};

  for (const [scale, lightness] of Object.entries(lightnessLevels)) {
    const hslAdjusted: HSL = {
      h: hsl.h,
      s: targetSaturation,
      l: lightness,
    };

    const rgb = hslToRgb(hslAdjusted);
    const hex = rgbToHex(rgb);

    const key = `poimandresTurquoise${scale}`;
    palette[key] = hex;
  }

  return palette;
}

// Generate palette
const baseColor = '#00CED1';
const palette = generateTurquoisePalette(baseColor);

// Output as JSON
console.log(JSON.stringify(palette, null, 2));
