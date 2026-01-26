import { writable, get } from 'svelte/store';
import { orpc } from '$lib/orpc';
import type { PromptData } from '$lib/components/prompt-library.svelte';

export interface PromptCategory {
  id: string;
  label: string;
  type: 'personal' | 'marketplace';
  count: number;
  defaultOpen: boolean;
}

export type CategoryType = 'my-prompts' | 'marketplace';

// State stores
export const selectedCategory = writable<CategoryType>('my-prompts');
export const searchQuery = writable('');
export const prompts = writable<PromptData[]>([]);
export const loading = writable(false);
export const submitting = writable(false);

// Categories with counts
export const categories = writable<PromptCategory[]>([
  {
    id: 'my-prompts',
    label: 'My Prompts',
    type: 'personal',
    count: 0,
    defaultOpen: true,
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    type: 'marketplace',
    count: 0,
    defaultOpen: false,
  },
]);

// Load counts only - optimized with dedicated endpoint
export async function loadCounts() {
  try {
    const counts = await orpc.prompt.getCounts();

    categories.update((cats) =>
      cats.map((cat) => {
        if (cat.id === 'my-prompts') {
          return { ...cat, count: counts.myPrompts };
        }
        if (cat.id === 'marketplace') {
          return { ...cat, count: counts.marketplace };
        }
        return cat;
      })
    );
  } catch (error) {
    console.error('Failed to load counts:', error);
  }
}

// Load prompts based on current category and search query
export async function loadPrompts() {
  try {
    loading.set(true);

    const category = get(selectedCategory);
    const query = get(searchQuery);

    if (category === 'marketplace') {
      // Load public prompts from marketplace
      const data = await orpc.prompt.getPublicTemplates({
        limit: 50,
        offset: 0,
        query: query || undefined,
      });

      // Transform to include author info
      const transformedPrompts = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        content: p.content,
        variables: p.variables,
        category: p.category,
        isPublic: p.isPublic,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        author: {
          id: p.authorId,
          name: p.authorName || 'Unknown',
        },
      }));

      prompts.set(transformedPrompts);
    } else {
      // Load user's own prompts
      const data = await orpc.prompt.getAll();
      const transformedPrompts = (data || []).map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));

      prompts.set(transformedPrompts);
    }
  } catch (error) {
    console.error('Failed to load prompts:', error);
    throw error;
  } finally {
    loading.set(false);
  }
}
