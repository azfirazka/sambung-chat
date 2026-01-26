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

      // Update marketplace count (use actual count from API response)
      categories.update((cats) =>
        cats.map((cat) =>
          cat.id === 'marketplace' ? { ...cat, count: transformedPrompts.length } : cat
        )
      );
    } else {
      // Load user's own prompts
      const data = await orpc.prompt.getAll();
      const transformedPrompts = (data || []).map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));

      prompts.set(transformedPrompts);

      // Update my-prompts count
      categories.update((cats) =>
        cats.map((cat) =>
          cat.id === 'my-prompts' ? { ...cat, count: transformedPrompts.length } : cat
        )
      );
    }
  } catch (error) {
    console.error('Failed to load prompts:', error);
    throw error;
  } finally {
    loading.set(false);
  }
}

// Load initial counts - optimized to fetch both categories in parallel
export async function loadCounts() {
  try {
    // Load counts in parallel for better performance
    const [myPrompts, marketplacePrompts] = await Promise.all([
      orpc.prompt.getAll(),
      orpc.prompt.getPublicTemplates({ limit: 1000, offset: 0 }),
    ]);

    categories.update((cats) =>
      cats.map((cat) => {
        if (cat.id === 'my-prompts') {
          return { ...cat, count: myPrompts?.length || 0 };
        }
        if (cat.id === 'marketplace') {
          return { ...cat, count: marketplacePrompts?.length || 0 };
        }
        return cat;
      })
    );
  } catch (error) {
    console.error('Failed to load counts:', error);
  }
}
