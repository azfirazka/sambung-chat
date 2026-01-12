/* Color Tokens - TypeScript Constants */

export const COLORS = {
  // Backgrounds
  bgPrimary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
  bgSecondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
  bgTertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
  bgHover: 'rgb(var(--color-bg-hover) / <alpha-value>)',

  // Text
  textPrimary: 'rgb(var(--color-text-primary) / <alpha-value>)',
  textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
  textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
  textDisabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',

  // Primary
  primary: 'rgb(var(--color-primary) / <alpha-value>)',
  primaryHover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
  primaryActive: 'rgb(var(--color-primary-active) / <alpha-value>)',

  // Semantic
  success: 'rgb(var(--color-success) / <alpha-value>)',
  successHover: 'rgb(var(--color-success-hover) / <alpha-value>)',

  error: 'rgb(var(--color-error) / <alpha-value>)',
  errorHover: 'rgb(var(--color-error-hover) / <alpha-value>)',
  errorBg: 'rgb(var(--color-error-bg) / <alpha-value>)',

  warning: 'rgb(var(--color-warning) / <alpha-value>)',
  warningHover: 'rgb(var(--color-warning-hover) / <alpha-value>)',

  info: 'rgb(var(--color-info) / <alpha-value>)',
  infoHover: 'rgb(var(--color-info-hover) / <alpha-value>)',

  // Border
  borderDefault: 'rgb(var(--color-border-default) / <alpha-value>)',
  borderFocus: 'rgb(var(--color-border-focus) / <alpha-value>)',
  borderError: 'rgb(var(--color-border-error) / <alpha-value>)',
} as const;

export type ColorToken = keyof typeof COLORS;
