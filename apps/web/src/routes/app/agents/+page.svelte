<script lang="ts">
  import { Bot, Plus, Search } from '@lucide/svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sambung-chat/ui';
  import { cn } from '@sambung-chat/ui';

  // TODO: Load agents from API
  const agents = [
    {
      id: '1',
      name: 'Code Assistant',
      description: 'Specialized in code generation, debugging, and explanations',
      model: 'claude-3.5-sonnet',
      category: 'Development',
      icon: '💻',
      capabilities: ['Code Generation', 'Debugging', 'Code Review', 'Documentation'],
    },
    {
      id: '2',
      name: 'Creative Writer',
      description: 'Creative content generation for various writing tasks',
      model: 'gpt-4o',
      category: 'Writing',
      icon: '✍️',
      capabilities: ['Blog Posts', 'Stories', 'Marketing Copy', 'Social Media'],
    },
    {
      id: '3',
      name: 'Data Analyst',
      description: 'Data analysis and visualization assistance',
      model: 'claude-3-opus',
      category: 'Analysis',
      icon: '📊',
      capabilities: ['Data Analysis', 'Visualization', 'Statistics', 'Reports'],
    },
    {
      id: '4',
      name: 'Research Assistant',
      description: 'Research and information gathering helper',
      model: 'gpt-4-turbo',
      category: 'Research',
      icon: '🔬',
      capabilities: ['Literature Review', 'Fact Checking', 'Summarization', 'Citations'],
    },
  ];

  let searchQuery = $state('');
  let selectedCategory = $state<string | null>(null);

  const categories = $derived(['All', ...new Set(agents.map((a) => a.category))]);

  const filteredAgents = $derived(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        !searchQuery ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.capabilities.some((cap) => cap.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory || selectedCategory === 'All' || agent.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });
</script>

<div class="container max-w-6xl mx-auto py-8">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-primary/10 rounded-lg">
        <Bot class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 class="text-2xl font-semibold">AI Agents</h1>
        <p class="text-muted-foreground text-sm">Specialized AI agents for different tasks</p>
      </div>
    </div>
    <button
      class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      <Plus class="w-4 h-4" />
      <span>Create Agent</span>
    </button>
  </div>

  <!-- Search and Filters -->
  <div class="flex flex-col sm:flex-row gap-4 mb-6">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search agents..."
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

  <!-- Agents Grid -->
  {#if filteredAgents().length === 0}
    <div class="text-center py-12">
      <Bot class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-medium mb-2">No agents found</h3>
      <p class="text-muted-foreground">Try adjusting your search or create a new agent</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {#each filteredAgents() as agent (agent.id)}
        <Card class="hover:shadow-md transition-shadow">
          <CardHeader>
            <div class="flex items-start gap-4">
              <div class="text-4xl">{agent.icon}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <CardTitle class="text-lg">{agent.name}</CardTitle>
                  <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {agent.category}
                  </span>
                </div>
                <CardDescription class="mt-1">{agent.description}</CardDescription>
                <p class="text-xs text-muted-foreground mt-2">
                  Model: {agent.model}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="mb-4">
              <p class="text-sm font-medium mb-2">Capabilities</p>
              <div class="flex flex-wrap gap-2">
                {#each agent.capabilities as capability}
                  <span class="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                    {capability}
                  </span>
                {/each}
              </div>
            </div>
            <button
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Bot class="w-4 h-4" />
              Start Chat
            </button>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>
