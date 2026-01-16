<script lang="ts">
  import type { Component } from 'svelte';
  import * as Sidebar from '../../ui/sidebar';
  import { Button } from '../../ui/button';
  import { cn } from '../../../utils';
  import { Sparkles, Plus, Star, TrendingUp, Clock } from '@lucide/svelte';

  export interface PromptCategory {
    id: string;
    name: string;
    icon?: Component;
    count: number;
  }

  export interface PromptsCategoriesProps {
    workspaceType?: 'personal' | 'team';
    myPromptsCount?: number;
    categories?: PromptCategory[];
    onCreatePrompt?: () => void;
    onSelectCategory?: (categoryId: string) => void;
    selectedCategory?: string;
    showMarketplace?: boolean;
    class?: string;
  }

  let {
    myPromptsCount = 0,
    categories = [],
    onCreatePrompt,
    onSelectCategory,
    selectedCategory,
    showMarketplace = true,
    class: className,
  }: PromptsCategoriesProps = $props();
</script>

<Sidebar.Content class={cn('gap-0', className)}>
  <!-- Create Prompt Button -->
  <div class="p-4">
    <Button variant="default" class="w-full justify-start gap-2" onclick={onCreatePrompt}>
      <Plus class="w-4 h-4" />
      <span>Create Prompt</span>
    </Button>
  </div>

  <Sidebar.Separator />

  <!-- My Prompts -->
  <Sidebar.Group>
    <Sidebar.GroupLabel>My Prompts</Sidebar.GroupLabel>
    <Sidebar.GroupContent>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton
            isActive={selectedCategory === 'all'}
            onclick={() => onSelectCategory?.('all')}
          >
            <Sparkles class="w-4 h-4" />
            <span>All My Prompts</span>
            <span class="ml-auto text-xs text-muted-foreground">
              {myPromptsCount}
            </span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>

        {#each categories as category (category.id)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={selectedCategory === category.id}
              onclick={() => onSelectCategory?.(category.id)}
            >
              {#if category.icon}
                {@const Icon = category.icon}
                <Icon class="w-4 h-4" />
              {:else}
                <Sparkles class="w-4 h-4" />
              {/if}
              <span>{category.name}</span>
              <span class="ml-auto text-xs text-muted-foreground">
                {category.count}
              </span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
    </Sidebar.GroupContent>
  </Sidebar.Group>

  {#if showMarketplace}
    <Sidebar.Separator />

    <!-- Marketplace -->
    <Sidebar.Group>
      <Sidebar.GroupLabel>Marketplace</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={selectedCategory === 'trending'}
              onclick={() => onSelectCategory?.('trending')}
            >
              <TrendingUp class="w-4 h-4" />
              <span>Trending</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>

          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={selectedCategory === 'featured'}
              onclick={() => onSelectCategory?.('featured')}
            >
              <Star class="w-4 h-4" />
              <span>Featured</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>

          <Sidebar.MenuItem>
            <Sidebar.MenuButton
              isActive={selectedCategory === 'new'}
              onclick={() => onSelectCategory?.('new')}
            >
              <Clock class="w-4 h-4" />
              <span>New This Week</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <!-- Contribute CTA -->
    <div class="p-4">
      <div class="rounded-lg bg-muted p-3 text-center">
        <p class="text-xs font-medium">Have a great prompt?</p>
        <p class="text-xs text-muted-foreground mt-1">Share it with the community</p>
      </div>
    </div>
  {/if}
</Sidebar.Content>
