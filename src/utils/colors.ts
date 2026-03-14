type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  const raw = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null;

  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((char) => char + char)
      .join("")}`.toUpperCase();
  }

  return `#${raw}`.toUpperCase();
}

function hexToRgb(value: string): Rgb | null {
  const normalized = normalizeHexColor(value);
  if (!normalized) return null;

  const hex = normalized.slice(1);
  const int = parseInt(hex, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex({ r, g, b }: Rgb) {
  const toHex = (channel: number) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case red:
        h = ((green - blue) / delta) % 6;
        break;
      case green:
        h = (blue - red) / delta + 2;
        break;
      default:
        h = (red - green) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hue < 60) {
    rPrime = c;
    gPrime = x;
  } else if (hue < 120) {
    rPrime = x;
    gPrime = c;
  } else if (hue < 180) {
    gPrime = c;
    bPrime = x;
  } else if (hue < 240) {
    gPrime = x;
    bPrime = c;
  } else if (hue < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
  };
}

export function buildShadeScale(baseColor: string) {
  const rgb = hexToRgb(baseColor) ?? hexToRgb("#2D5B22")!;
  const { h, s } = rgbToHsl(rgb);

  const saturation = clamp(s, 0, 1);
  const boostedSaturation = saturation < 0.18 ? saturation : clamp(Math.max(saturation, 0.55), 0, 1);
  const lightnessStops = [1, 0.9, 0.78, 0.6, 0.42];

  return lightnessStops.map((l, index) => {
    if (index === 0) return "#FFFFFF";
    return rgbToHex(hslToRgb({ h, s: boostedSaturation, l }));
  });
}

export function isValidHexColor(value: string) {
  return normalizeHexColor(value) !== null;
}

export function toNormalizedHexColor(value: string) {
  return normalizeHexColor(value);
}

