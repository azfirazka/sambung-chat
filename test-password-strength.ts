/**
 * Manual Testing Script for Password Strength Indicator
 * This script tests various password scenarios and edge cases
 */

import { calculatePasswordStrength, getPasswordRequirements, meetsMinimumRequirements } from './apps/web/src/lib/utils/password-strength.ts';

interface TestCase {
  name: string;
  password: string;
  expectedLevel: string;
  expectedMinScore: number;
  expectedMaxScore: number;
  description: string;
}

const testCases: TestCase[] = [
  // Weak passwords
  {
    name: 'Empty password',
    password: '',
    expectedLevel: 'very_weak',
    expectedMinScore: 0,
    expectedMaxScore: 0,
    description: 'Should return very weak with "Enter a password" suggestion'
  },
  {
    name: 'Single character',
    password: 'a',
    expectedLevel: 'very_weak',
    expectedMinScore: 0,
    expectedMaxScore: 0.5,
    description: 'Very short single character'
  },
  {
    name: 'Numeric only - short',
    password: '123',
    expectedLevel: 'very_weak',
    expectedMinScore: 0,
    expectedMaxScore: 0.5,
    description: 'Common weak numeric password'
  },
  {
    name: 'All lowercase - short',
    password: 'abc',
    expectedLevel: 'very_weak',
    expectedMinScore: 0,
    expectedMaxScore: 0.5,
    description: 'Very short lowercase password'
  },
  {
    name: 'Common word lowercase',
    password: 'password',
    expectedLevel: 'very_weak',
    expectedMinScore: 0,
    expectedMaxScore: 1,
    description: 'Common dictionary word'
  },

  // Medium passwords
  {
    name: 'Mixed case - short',
    password: 'Pass123',
    expectedLevel: 'weak',
    expectedMinScore: 1,
    expectedMaxScore: 2,
    description: 'Good variety but too short'
  },
  {
    name: '8 chars - lowercase only',
    password: 'password',
    expectedLevel: 'weak',
    expectedMinScore: 0.5,
    expectedMaxScore: 1.5,
    description: 'Meets length but lacks variety'
  },
  {
    name: 'Mixed case and numbers - 8 chars',
    password: 'Pass1234',
    expectedLevel: 'medium',
    expectedMinScore: 2,
    expectedMaxScore: 3,
    description: 'Good length with variety'
  },
  {
    name: 'Lowercase + special - 8 chars',
    password: 'p@ssw0rd',
    expectedLevel: 'medium',
    expectedMinScore: 2,
    expectedMaxScore: 3,
    description: 'Good variety mix'
  },

  // Strong passwords
  {
    name: '12 chars - all varieties',
    password: 'P@ssw0rd!123',
    expectedLevel: 'strong',
    expectedMinScore: 3,
    expectedMaxScore: 4,
    description: 'Strong password with all character types'
  },
  {
    name: '16 chars - good entropy',
    password: 'MyP@ssw0rd!1234',
    expectedLevel: 'very_strong',
    expectedMinScore: 3.5,
    expectedMaxScore: 4,
    description: 'Very strong password'
  },
  {
    name: 'Phrase with special chars',
    password: 'C0rrect-H0rse-Battery-Staple',
    expectedLevel: 'very_strong',
    expectedMinScore: 3.5,
    expectedMaxScore: 4,
    description: 'Long passphrase format'
  },

  // Edge cases
  {
    name: 'Very long password',
    password: 'A'.repeat(100) + '1!aB',
    expectedLevel: 'very_strong',
    expectedMinScore: 3.5,
    expectedMaxScore: 4,
    description: '100+ character password'
  },
  {
    name: 'Unicode characters',
    password: 'Pàsswørd!123€',
    expectedLevel: 'strong',
    expectedMinScore: 3,
    expectedMaxScore: 4,
    description: 'Password with Unicode characters'
  },
  {
    name: 'All special characters',
    password: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    expectedLevel: 'medium',
    expectedMinScore: 2,
    expectedMaxScore: 3,
    description: 'Only special characters'
  },
  {
    name: 'Repeated pattern',
    password: 'Ab1Ab1Ab1Ab1',
    expectedLevel: 'medium',
    expectedMinScore: 2,
    expectedMaxScore: 3,
    description: 'Repeated pattern (lower entropy)'
  },
  {
    name: 'Keyboard pattern',
    password: 'qwerty123!@#',
    expectedLevel: 'medium',
    expectedMinScore: 2,
    expectedMaxScore: 3,
    description: 'Keyboard pattern (detectable via low entropy)'
  },

  // Special character edge cases
  {
    name: 'Edge special chars',
    password: 'Test]_[Test123',
    expectedLevel: 'strong',
    expectedMinScore: 3,
    expectedMaxScore: 4,
    description: 'Includes bracket and underscore characters'
  },
  {
    name: 'Backslash and pipe',
    password: 'Test|\\Pipe123',
    expectedLevel: 'strong',
    expectedMinScore: 3,
    expectedMaxScore: 4,
    description: 'Includes backslash and pipe'
  },

  // Minimum requirements edge cases
  {
    name: 'Exactly 8 chars - 3 varieties',
    password: 'Pass123!',
    expectedLevel: 'medium',
    expectedMinScore: 2,
    expectedMaxScore: 3,
    description: 'Minimum length with 3 character types'
  },
  {
    name: '7 chars - good variety',
    password: 'Pass1!',
    expectedLevel: 'weak',
    expectedMinScore: 1.5,
    expectedMaxScore: 2,
    description: 'Too short despite good variety'
  },
];

console.log('='.repeat(80));
console.log('PASSWORD STRENGTH INDICATOR - MANUAL TESTING RESULTS');
console.log('='.repeat(80));
console.log();

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Description: ${testCase.description}`);
  console.log(`Password: "${testCase.password.substring(0, 20)}${testCase.password.length > 20 ? '...' : ''}"`);

  const result = calculatePasswordStrength(testCase.password);
  const requirements = getPasswordRequirements(testCase.password);
  const meetsMin = meetsMinimumRequirements(testCase.password);

  console.log(`Result:`);
  console.log(`  Level: ${result.level}`);
  console.log(`  Score: ${result.score}`);
  console.log(`  Percentage: ${result.percentage}%`);
  console.log(`  Meets Requirements: ${result.meetsRequirements}`);
  console.log(`  Suggestions: ${result.suggestions.length > 0 ? result.suggestions.join(', ') : 'None'}`);

  // Check requirements checklist
  console.log(`  Requirements Checklist:`);
  requirements.forEach(req => {
    console.log(`    ${req.met ? '✓' : '✗'} ${req.label}`);
  });

  // Validation
  const levelMatch = result.level === testCase.expectedLevel;
  const scoreInRange = result.score >= testCase.expectedMinScore && result.score <= testCase.expectedMaxScore;
  const success = levelMatch && scoreInRange;

  if (success) {
    console.log(`  ✅ PASS`);
    passed++;
  } else {
    console.log(`  ❌ FAIL`);
    if (!levelMatch) {
      console.log(`     Expected level: ${testCase.expectedLevel}, got: ${result.level}`);
    }
    if (!scoreInRange) {
      console.log(`     Expected score range: ${testCase.expectedMinScore}-${testCase.expectedMaxScore}, got: ${result.score}`);
    }
    failed++;
  }

  console.log('-'.repeat(80));
  console.log();
});

// Performance testing
console.log('='.repeat(80));
console.log('PERFORMANCE TESTING');
console.log('='.repeat(80));
console.log();

const performanceTests = [
  { name: 'Short password', password: 'Test123!' },
  { name: 'Medium password', password: 'MyP@ssw0rd!123' },
  { name: 'Long password', password: 'A'.repeat(100) + '1!aB' },
];

performanceTests.forEach(test => {
  const iterations = 10000;
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    calculatePasswordStrength(test.password);
  }
  const end = performance.now();
  const avgTime = (end - start) / iterations;
  console.log(`${test.name}:`);
  console.log(`  ${iterations} calculations in ${(end - start).toFixed(2)}ms`);
  console.log(`  Average: ${avgTime.toFixed(4)}ms per calculation`);
  console.log();
});

// Summary
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests: ${testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
console.log();

if (failed === 0) {
  console.log('✅ ALL TESTS PASSED');
} else {
  console.log(`❌ ${failed} TESTS FAILED`);
  process.exit(1);
}
