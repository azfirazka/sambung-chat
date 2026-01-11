import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type { VariantProps };
export { tv };
