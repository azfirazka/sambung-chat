// Class name utility for conditional className merging
// Using clsx for conditional classes and tailwind-merge to handle Tailwind conflicts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
