/**
 * glTF colour factors are linear, while design colours (swatches, the option
 * values in src/data/planning.js) are sRGB. Convert before handing a colour to
 * the 3D renderer, otherwise dark tones come out washed out.
 */
export function srgbToLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

/** [r, g, b] in sRGB 0–1 → [r, g, b] linear, rounded to 4 decimals. */
export function srgbToLinearRgb(rgb) {
  return rgb.map((channel) => Math.round(srgbToLinear(channel) * 10000) / 10000)
}
