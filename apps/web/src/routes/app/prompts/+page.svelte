<script lang="ts">
  import { Sparkles, Plus, Search } from '@lucide/svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sambung-chat/ui';
  import { cn } from '@sambung-chat/ui';

  // TODO: Load prompts from API
  const prompts = [
    {
      id: '1',
      title: 'Code Review Assistant',
      description: 'Helps review code for best practices, bugs, and optimizations',
      category: 'Development',
      tags: ['code', 'review', 'best-practices'],
    },
    {
      id: '2',
      title: 'Writing Helper',
      description: 'Assists with writing, editing, and improving text content',
      category: 'Writing',
      tags: ['writing', 'editing', 'content'],
    },
    {
      id: '3',
      title: 'Data Analyst',
      description: 'Analyzes data and provides insights and visualizations',
      category: 'Analysis',
      tags: ['data', 'analysis', 'insights'],
    },
  ];

  let searchQuery = $state('');
  let selectedCategory = $state<string | null>(null);

  const categories = $derived(['All', ...new Set(prompts.map((p) => p.category))]);

  const filteredPrompts = $derived(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        !searchQuery ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory || selectedCategory === 'All' || prompt.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });
</script>

<div class="container max-w-6xl mx-auto py-8">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-primary/10 rounded-lg">
        <Sparkles class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 class="text-2xl font-semibold">Prompts</h1>
        <p class="text-muted-foreground text-sm">Manage and use custom AI prompts</p>
      </div>
    </div>
    <button
      class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      <Plus class="w-4 h-4" />
      <span>New Prompt</span>
    </button>
  </div>

  <!-- Search and Filters -->
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search prompts..."
        class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
    <div class="flex gap-2">
      {#each categories as category}
        <button
          class={cn(
            'px-4 py-2 rounded-md text-sm transition-colors',
            selectedCategory === category || (!selectedCategory && category === 'All')
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
          onclick={() => (selectedCategory = selectedCategory === category ? null : category)}
        >
          {category}
        </button>
      {/each}
    </div>
  </div>

  <!-- Prompts Grid -->
  {#if filteredPrompts().length === 0}
    <div class="text-center py-12">
      <Sparkles class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-medium mb-2">No prompts found</h3>
      <p class="text-muted-foreground">Try adjusting your search or create a new prompt</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each filteredPrompts() as prompt (prompt.id)}
        <Card class="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div class="flex items-start justify-between">
              <CardTitle class="text-lg">{prompt.title}</CardTitle>
              <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {prompt.category}
              </span>
            </div>
            <CardDescription>{prompt.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              {#each prompt.tags as tag}
                <span class="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                  {tag}
                </span>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>
