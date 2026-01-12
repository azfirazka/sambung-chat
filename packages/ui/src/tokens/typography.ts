/* Typography Tokens - TypeScript Constants */

export const FONT_SIZE = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  base: 'var(--font-size-base)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
} as const;

export const FONT_WEIGHT = {
  normal: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
} as const;

export const LINE_HEIGHT = {
  tight: 'var(--line-height-tight)',
  normal: 'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
} as const;

export type FontSizeToken = keyof typeof FONT_SIZE;
export type FontWeightToken = keyof typeof FONT_WEIGHT;
export type LineHeightToken = keyof typeof LINE_HEIGHT;
