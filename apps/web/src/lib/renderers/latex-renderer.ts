/**
 * LaTeX Renderer with KaTeX Support
 *
 * Handles LaTeX math rendering with lazy-loaded KaTeX
 * Provides detection, protection, and rendering of LaTeX expressions
 */

import { loadKatex, loadKatexCss } from '$lib/utils/lazy-load';

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Cache for lazy-loaded KaTeX module
 */
let cachedKatex: typeof import('katex') | null = null;
let katexLoadInProgress: Promise<typeof import('katex')> | null = null;

/**
 * Render LaTeX math to HTML using KaTeX
 * Note: This function will trigger lazy-loading of KaTeX on first call if not already loaded.
 * For better performance, call ensureLoaded() before rendering.
 */
export async function renderLatex(latex: string, displayMode: boolean): Promise<string> {
  try {
    // Load katex if not cached
    if (!cachedKatex) {
      if (katexLoadInProgress) {
        // Wait for existing load to complete
        cachedKatex = await katexLoadInProgress;
      } else {
        // Start new load
        katexLoadInProgress = loadKatex();
        cachedKatex = await katexLoadInProgress;
      }
    }

    if (!cachedKatex) {
      throw new Error('KaTeX failed to load');
    }

    return cachedKatex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      macros: {
        '\\R': '\\mathbb{R}',
      },
    });
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return `<span class="text-red-500" title="LaTeX error: ${error instanceof Error ? error.message : 'Unknown error'}">\\(${latex}\\)</span>`;
  }
}

/**
 * Synchronous fallback for rendering LaTeX (used if KaTeX not pre-loaded)
 * Returns the raw LaTeX string with a warning
 */
export function renderLatexSync(latex: string, displayMode: boolean): string {
  if (cachedKatex) {
    try {
      return cachedKatex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
        macros: {
          '\\R': '\\mathbb{R}',
        },
      });
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      return `<span class="text-red-500" title="LaTeX error: ${error instanceof Error ? error.message : 'Unknown error'}">\\(${latex}\\)</span>`;
    }
  }

  // KaTeX not loaded yet - return placeholder
  console.warn('KaTeX not loaded. Call ensureLoaded() before rendering.');
  return `<span class="text-yellow-600 dark:text-yellow-400" title="LaTeX not loaded - call ensureLoaded() first">\\(${latex}\\)</span>`;
}

/**
 * Protect LaTeX delimiters before markdown parsing
 * Returns: { processed: string, map: Map<string, {latex: string, displayMode: boolean}> }
 */
export function protectLatexDelimiters(text: string): {
  processed: string;
  latexMap: Map<string, { latex: string; displayMode: boolean }>;
} {
  const latexMap = new Map<string, { latex: string; displayMode: boolean }>();
  let processed = text;
  let placeholderIndex = 0;

  // Protect block math ($$...$$)
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_match, latex) => {
    const placeholder = `%%%LATEX_BLOCK_${placeholderIndex}%%%`;
    latexMap.set(placeholder, { latex: latex.trim(), displayMode: true });
    placeholderIndex++;
    return placeholder;
  });

  // Protect inline math ($...$) but not when preceded by backslash (escaped $)
  processed = processed.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (match, latex) => {
    // Skip if this looks like currency (short, no spaces around, or ends with currency-like patterns)
    if (latex.length <= 2 && !/[0-9]/.test(latex)) {
      return match; // Keep original for currency-like patterns
    }
    const placeholder = `%%%LATEX_INLINE_${placeholderIndex}%%%`;
    latexMap.set(placeholder, { latex: latex.trim(), displayMode: false });
    placeholderIndex++;
    return placeholder;
  });

  return { processed, latexMap };
}

/**
 * Restore LaTeX placeholders with rendered KaTeX HTML
 * Note: Uses renderLatexSync() which requires KaTeX to be pre-loaded via ensureLoaded()
 */
export function restoreLatexPlaceholders(
  html: string,
  latexMap: Map<string, { latex: string; displayMode: boolean }>
): string {
  let restored = html;

  for (const [placeholder, { latex, displayMode }] of latexMap) {
    const rendered = renderLatexSync(latex, displayMode);
    restored = restored.replace(placeholder, rendered);
  }

  return restored;
}

/**
 * Detect if text contains LaTeX expressions
 */
export function detectLatex(text: string): boolean {
  // Check for block math ($$...$$)
  if (/\$\$[\s\S]*?\$\$/.test(text)) {
    return true;
  }

  // Check for inline math ($...$) - exclude currency patterns
  const inlineMathRegex = /(?<!\\)\$([^$\n]+?)(?<!\\)\$/g;
  const matches = text.match(inlineMathRegex);
  if (matches) {
    // Filter out currency-like patterns
    for (const match of matches) {
      const latex = match.replace(/\$/g, '');
      if (latex.length > 2 || /[0-9]/.test(latex)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Ensure KaTeX is loaded
 * Pre-loads KaTeX and CSS to avoid lazy-loading during rendering
 */
export async function ensureLoaded(): Promise<void> {
  try {
    // Load KaTeX and CSS if not already loaded
    if (!cachedKatex && !katexLoadInProgress) {
      katexLoadInProgress = loadKatex();
      try {
        cachedKatex = await katexLoadInProgress;
      } finally {
        // Always clear the in-progress flag, even on failure
        katexLoadInProgress = null;
      }
    } else if (katexLoadInProgress) {
      // Wait for existing load to complete
      try {
        cachedKatex = await katexLoadInProgress;
      } catch {
        // If load failed and initiator didn't clean up, reset for retry
        katexLoadInProgress = null;
        throw new Error('KaTeX load failed');
      }
    }

    // Load KaTeX CSS (using static import)
    await loadKatexCss();
  } catch (error) {
    console.error('Failed to load KaTeX:', error);
    throw error;
  }
}

/**
 * Check if KaTeX is currently loaded
 */
export function isLoaded(): boolean {
  return cachedKatex !== null;
}

/**
 * Get KaTeX instance (returns null if not loaded)
 */
export function getKatex(): typeof import('katex') | null {
  return cachedKatex;
}
