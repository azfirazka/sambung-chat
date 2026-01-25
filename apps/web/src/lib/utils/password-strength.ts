/**
 * Password strength utility for SambungChat
 * Provides real-time password strength calculation and feedback
 */

/**
 * Password strength levels
 */
export type PasswordStrengthLevel = 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';

/**
 * Password strength result with score, level, and feedback
 */
export interface PasswordStrengthResult {
  /** Score from 0-4 (0=very weak, 4=very strong) */
  score: number;
  /** Human-readable strength level */
  level: PasswordStrengthLevel;
  /** Percentage score for UI progress bars (0-100) */
  percentage: number;
  /** Array of suggestions to improve password strength */
  suggestions: string[];
  /** Whether password meets minimum requirements */
  meetsRequirements: boolean;
}

/**
 * Password requirement check result
 */
export interface PasswordRequirement {
  /** Requirement description */
  label: string;
  /** Whether the requirement is met */
  met: boolean;
}

/**
 * Calculate password strength based on entropy, character variety, and patterns
 * @param password - The password to analyze
 * @returns PasswordStrengthResult object with score and feedback
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  // Empty password
  if (!password) {
    return {
      score: 0,
      level: 'very_weak',
      percentage: 0,
      suggestions: ['Enter a password'],
      meetsRequirements: false,
    };
  }

  const suggestions: string[] = [];
  let score = 0;

  // 1. Length check (0-1 point)
  const length = password.length;
  if (length >= 12) {
    score += 1;
  } else if (length >= 8) {
    score += 0.5;
  } else {
    suggestions.push('Use at least 8 characters');
  }

  // 2. Character variety checks (0-2 points)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[\]!@#$%^&*()_+\-=[{};':"\\|,.<>/?]/.test(password);

  const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;

  if (varietyCount >= 3) {
    score += 2;
  } else if (varietyCount === 2) {
    score += 1;
  } else {
    if (!hasLowercase) suggestions.push('Add lowercase letters');
    if (!hasUppercase) suggestions.push('Add uppercase letters');
    if (!hasNumbers) suggestions.push('Add numbers');
    if (!hasSpecial) suggestions.push('Add special characters (!@#$%^&*)');
  }

  // 3. Entropy bonus (0-1 point)
  const entropy = calculateEntropy(password);
  if (entropy > 60) {
    score += 1;
  } else if (entropy > 40) {
    score += 0.5;
  } else {
    suggestions.push('Avoid common patterns or repeated characters');
  }

  // Cap score at 4
  score = Math.min(score, 4);

  // Determine level based on score
  let level: PasswordStrengthLevel;
  if (score < 1) level = 'very_weak';
  else if (score < 2) level = 'weak';
  else if (score < 3) level = 'medium';
  else if (score < 4) level = 'strong';
  else level = 'very_strong';

  // Calculate percentage for UI (0-100)
  const percentage = Math.round((score / 4) * 100);

  // Check if meets minimum requirements
  // Must be at least 8 characters AND have at least 3 of the 4 character types
  // OR be at least 8 characters AND meet at least 3 of the 5 total requirements
  const requirementsMet = getPasswordRequirements(password).filter((r) => r.met).length;
  const meetsRequirements = length >= 8 && requirementsMet >= 3;

  return {
    score,
    level,
    percentage,
    suggestions,
    meetsRequirements,
  };
}

/**
 * Calculate the entropy of a password (measure of randomness)
 * @param password - The password to analyze
 * @returns Entropy value in bits
 */
function calculateEntropy(password: string): number {
  const length = password.length;

  // Determine character set size
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[\]!@#$%^&*()_+\-=[{};':"\\|,.<>/?]/.test(password)) charsetSize += 32;

  if (charsetSize === 0) return 0;

  // Entropy = length * log2(charsetSize)
  return length * Math.log2(charsetSize);
}

/**
 * Get password requirements checklist
 * @param password - The password to check
 * @returns Array of requirement check results
 */
export function getPasswordRequirements(password: string): PasswordRequirement[] {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Contains number',
      met: /\d/.test(password),
    },
    {
      label: 'Contains special character',
      met: /[\]!@#$%^&*()_+\-=[{};':"\\|,.<>/?]/.test(password),
    },
  ];

  return requirements;
}

/**
 * Check if password meets minimum requirements
 * @param password - The password to validate
 * @returns true if password meets minimum requirements
 */
export function meetsMinimumRequirements(password: string): boolean {
  return password.length >= 8 && getPasswordRequirements(password).filter((r) => r.met).length >= 3;
}
