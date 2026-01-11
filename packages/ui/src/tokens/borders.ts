/* Border Radius Tokens - TypeScript Constants */

export const BORDER_RADIUS = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  full: 'var(--radius-full)',
} as const;

export const TRANSITIONS = {
  fast: 'var(--transition-fast)',
  normal: 'var(--transition-normal)',
  slow: 'var(--transition-slow)',
} as const;

export const SHADOWS = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const;

export type BorderRadiusToken = keyof typeof BORDER_RADIUS;
export type TransitionToken = keyof typeof TRANSITIONS;
export type ShadowToken = keyof typeof SHADOWS;
