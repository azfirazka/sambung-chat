/**
 * Markdown Renderer with Syntax Highlighting and Mermaid Support
 *
 * Uses marked for parsing and basic code formatting
 * Supports Mermaid diagrams for flowcharts, sequence diagrams, etc.
 */

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Configure marked renderer with basic code styling
 */
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Counter for unique mermaid diagram IDs
let mermaidCounter = 0;

// Custom renderer for code blocks
const renderer = new marked.Renderer();

renderer.code = function (code: { text: string; lang?: string; escaped?: boolean }) {
  const validLanguage = code.lang || 'text';
  const escapedLanguage = escapeHtml(validLanguage);
  const escapedCode = code.escaped ? code.text : escapeHtml(code.text);

  // Check if this is a mermaid diagram
  if (validLanguage === 'mermaid') {
    const diagramId = `mermaid-diagram-${mermaidCounter++}`;
    return `
      <div class="relative group my-4">
        <div class="flex items-center justify-between px-4 py-2 bg-purple-500/10 rounded-t-lg border-b border-purple-500/20">
          <span class="text-xs font-mono text-purple-400">Mermaid Diagram</span>
        </div>
        <div class="p-4 rounded-b-lg bg-muted/30 flex justify-center">
          <pre class="mermaid ${diagramId}" style="background: transparent;">${escapedCode}</pre>
        </div>
      </div>
    `;
  }

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
 * Initialize Mermaid diagrams after rendering
 * This should be called after the DOM is updated
 */
export function initMermaidDiagrams() {
  if (typeof window !== 'undefined' && (window as any).mermaid) {
    const mermaid = (window as any).mermaid;
    // Initialize mermaid if not already initialized
    if (!mermaid.isInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });
      mermaid.isInitialized = true;
    }
    // Render all mermaid diagrams
    mermaid.run();
  }
}

/**
 * Render markdown to HTML (synchronous)
 * Note: marked.parse returns Promise in v17+, but we use marked.parse() for backward compat
 */
export function renderMarkdownSync(markdown: string): string {
  if (!markdown) return '';

  try {
    // Use marked.parse() - marked v17 returns Promise but we handle it synchronously
    // For better performance, we use lexer and parser directly
    const tokens = marked.lexer(markdown);
    const html = marked.parser(tokens);
    // Sanitize HTML to prevent XSS
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return `<p>${escapeHtml(markdown)}</p>`;
  }
}
