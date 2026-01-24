/**
 * Markdown Renderer with Syntax Highlighting, Mermaid, and LaTeX Support
 *
 * Main orchestrator that combines LaTeX and Mermaid renderers
 * Uses marked for parsing and basic code formatting
 */

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import {
  escapeHtml as escapeHtmlLatex,
  protectLatexDelimiters,
  restoreLatexPlaceholders,
  detectLatex,
  ensureLoaded as ensureKatexLoaded,
  isLoaded as isKatexLoaded,
} from '$lib/renderers/latex-renderer';
import {
  renderMermaidCode,
  detectMermaid,
  ensureLoaded as ensureMermaidLoaded,
  isLoaded as isMermaidLoaded,
} from '$lib/renderers/mermaid-renderer';

// Re-export escapeHtml for convenience (use latex version)
export const escapeHtml = escapeHtmlLatex;

/**
 * Configure marked renderer with basic code styling
 */
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Custom renderer for code blocks
const renderer = new marked.Renderer();

renderer.code = function (code: { text: string; lang?: string; escaped?: boolean }) {
  const validLanguage = code.lang || 'text';

  // Check if this is a mermaid diagram
  if (validLanguage === 'mermaid') {
    return renderMermaidCode(code.text, code.escaped);
  }

  // For other code blocks, escape HTML to prevent XSS
  const escapedCode = code.escaped ? code.text : escapeHtml(code.text);
  const escapedLanguage = escapeHtml(validLanguage);

  // Create styled code block with language label
  return `
    <div class="relative group my-4">
      <div class="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-t-lg border-b border-border">
        <span class="text-xs font-mono text-muted-foreground">${escapedLanguage}</span>
      </div>
      <pre class="overflow-x-auto p-4 rounded-b-lg bg-muted/30"><code class="language-${escapedLanguage}">${escapedCode}</code></pre>
    </div>
  `;
};

marked.setOptions({ renderer });

/**
 * Ensure all markdown rendering dependencies are loaded
 * This function pre-loads KaTeX and Mermaid to avoid lazy-loading during rendering
 * Call this before rendering markdown with LaTeX or Mermaid diagrams
 * @returns Promise that resolves when all dependencies are loaded
 */
export async function ensureMarkdownDependencies(): Promise<void> {
  try {
    // Load KaTeX if not already loaded
    if (!isKatexLoaded()) {
      await ensureKatexLoaded();
    }

    // Load Mermaid if not already loaded
    if (!isMermaidLoaded()) {
      await ensureMermaidLoaded();
    }
  } catch (error) {
    console.error('Failed to load markdown dependencies:', error);
    throw error;
  }
}

/**
 * Detect what rendering features are needed in the text
 */
export function detectMarkdownFeatures(text: string): {
  hasLatex: boolean;
  hasMermaid: boolean;
} {
  return {
    hasLatex: detectLatex(text),
    hasMermaid: detectMermaid(text),
  };
}

/**
 * Conditionally load dependencies based on content
 * Only loads what's needed for the given markdown text
 */
export async function ensureDependenciesForContent(text: string): Promise<void> {
  const features = detectMarkdownFeatures(text);

  if (features.hasLatex && !isKatexLoaded()) {
    await ensureKatexLoaded();
  }

  if (features.hasMermaid && !isMermaidLoaded()) {
    await ensureMermaidLoaded();
  }
}

/**
 * Render markdown to HTML (synchronous)
 * Supports LaTeX math rendering with KaTeX and Mermaid diagrams
 * Note: marked.parse returns Promise in v17+, but we use marked.lexer/parser for backward compat
 */
export function renderMarkdownSync(markdown: string): string {
  if (!markdown) return '';

  try {
    // Step 1: Protect LaTeX delimiters before markdown parsing
    const { processed: protectedMarkdown, latexMap } = protectLatexDelimiters(markdown);

    // Step 2: Parse markdown to HTML
    const tokens = marked.lexer(protectedMarkdown);
    let html = marked.parser(tokens);

    // Step 3: Restore LaTeX placeholders with rendered KaTeX (before sanitize)
    html = restoreLatexPlaceholders(html, latexMap);

    // Step 4: Sanitize HTML to prevent XSS
    // Use default tags + add KaTeX specific tags and Mermaid SVG tags
    return DOMPurify.sanitize(html, {
      // Keep all default DOMPurify tags, and add KaTeX/Mermaid specific ones
      ADD_TAGS: [
        'math',
        'semantics',
        'mrow',
        'mi',
        'mn',
        'mo',
        'mtext',
        'mspace',
        'mpadded',
        'mfrac',
        'msqrt',
        'mroot',
        'mstyle',
        'msub',
        'msup',
        'msubsup',
        'munder',
        'mover',
        'munderover',
        'mtable',
        'mtr',
        'mtd',
        'annotation',
        'mglyph',
        'none',
        'foreignObject', // For Mermaid SVG text content
      ],
      // Add KaTeX specific attributes
      ADD_ATTR: [
        'class',
        'style',
        'xmlns',
        'viewBox',
        'width',
        'height',
        'd',
        'stroke',
        'fill',
        'stroke-width',
        'x1',
        'y1',
        'x2',
        'y2',
        'encoding',
        'x',
        'y',
        'textlength',
        'id',
        'data-mermaid',
        'role',
        'rx',
        'ry',
        'cx',
        'cy',
        'r',
        'transform',
        'font-family',
        'font-size',
        'font-weight',
        'text-anchor',
        'dominant-baseline',
        'alignment-baseline',
        'points',
        'pathLength',
      ],
      // Allow data:* attributes for KaTeX
      ALLOW_DATA_ATTR: true,
      // Allow unknown protocols for data URIs
      ALLOW_UNKNOWN_PROTOCOLS: true,
    });
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return `<p>${escapeHtml(markdown)}</p>`;
  }
}

// Re-export Mermaid functions for backward compatibility
export {
  initMermaidDiagrams,
  reinitMermaidDiagrams,
  setupMermaidThemeObserver,
} from '$lib/renderers/mermaid-renderer';
