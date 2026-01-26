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
  import {
    categories,
    selectedCategory,
    searchQuery,
    loading,
    loadPrompts,
    loadCounts,
  } from '$lib/stores/prompts.js';
  import { onMount } from 'svelte';

  // Load initial data
  onMount(async () => {
    await loadCounts();
    await loadPrompts();
  });

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery.set(target.value);
    loadPrompts();
  }

  function handleCategorySelect(categoryId: string) {
    selectedCategory.set(categoryId as any);
    loadPrompts();
  }

  function getCategoryIcon(categoryId: string) {
    if (categoryId === 'my-prompts') return SparklesIcon;
    if (categoryId === 'marketplace') return StoreIcon;
    if (categoryId === 'shared') return UsersIcon;
    return SparklesIcon;
  }
</script>

<div class="flex h-full flex-col">
  <!-- Header -->
  <div class="border-b px-4 py-3">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-foreground text-sm font-semibold">Prompts</h2>
    </div>

    <div class="relative">
      <SearchIcon class="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <input
        type="text"
        placeholder="Search prompts..."
        value={$searchQuery}
        oninput={handleSearchInput}
        class="border-input placeholder:text-muted-foreground focus:border-ring focus:ring-ring h-9 w-full rounded-md border bg-transparent pr-3 pl-9 text-sm outline-none focus:ring-1"
      />
    </div>
  </div>

  <!-- Categories -->
  <nav class="flex-1 space-y-1 overflow-y-auto p-2">
    {#each $categories as category}
      {@const CategoryIcon = getCategoryIcon(category.id)}
      {@const isOpen = $selectedCategory === category.id}

      <button
        class={cn(
          'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isOpen ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
        )}
        onclick={() => handleCategorySelect(category.id)}
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
