<script lang="ts">
  import { cn } from '$lib/utils.js';
  import {
    SparklesIcon,
    StoreIcon,
    UsersIcon,
    ChevronRightIcon,
    PlusIcon,
    SearchIcon,
  } from '@lucide/svelte/icons';

  export interface PromptCategory {
    id: string;
    label: string;
    type: 'personal' | 'marketplace' | 'shared';
    icon?: typeof SparklesIcon;
    count?: number;
    defaultOpen?: boolean;
    emptyMessage?: string;
  }

  interface Props {
    categories: PromptCategory[];
    selectedCategory: string;
    loading?: boolean;
    onselect: (categoryId: string) => void;
    oncreate?: () => void;
    searchQuery?: string;
    onsearch?: (query: string) => void;
  }

  let {
    categories,
    selectedCategory,
    loading = false,
    onselect,
    oncreate,
    searchQuery = '',
    onsearch,
  }: Props = $props();

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    onsearch?.(target.value);
  }

  function getCategoryIcon(category: PromptCategory) {
    if (category.id === 'my-prompts') return SparklesIcon;
    if (category.id === 'marketplace') return StoreIcon;
    if (category.id === 'shared') return UsersIcon;
    return SparklesIcon;
  }
</script>

<div class="flex h-full flex-col">
  <!-- Header -->
  <div class="border-b px-4 py-3">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-foreground text-sm font-semibold">Prompts</h2>
      {#if oncreate}
        <button
          class="bg-primary hover:bg-primary/90 text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md p-0 transition-colors"
          onclick={oncreate}
          type="button"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      {/if}
    </div>

    {#if onsearch}
      <div class="relative">
        <SearchIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <input
          type="text"
          placeholder="Search prompts..."
          bind:value={searchQuery}
          oninput={handleSearchInput}
          class="border-input placeholder:text-muted-foreground focus:border-ring focus:ring-ring h-9 w-full rounded-md border bg-transparent pr-3 pl-9 text-sm outline-none focus:ring-1"
        />
      </div>
    {/if}
  </div>

  <!-- Categories -->
  <nav class="flex-1 space-y-1 overflow-y-auto p-2">
    {#each categories as category}
      {@const CategoryIcon = getCategoryIcon(category)}
      {@const isOpen = selectedCategory === category.id}

      <button
        class={cn(
          'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isOpen ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
        )}
        onclick={() => onselect(category.id)}
      >
        <CategoryIcon class="h-4 w-4 flex-shrink-0" />
        <span class="flex-1 text-left">{category.label}</span>
        {#if category.count !== undefined}
          <span class="text-muted-foreground text-xs">{category.count}</span>
        {/if}
        <ChevronRightIcon class={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-90' : '')} />
      </button>
    {/each}
  </nav>
</div>
