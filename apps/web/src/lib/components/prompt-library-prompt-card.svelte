<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import EditIcon from '@lucide/svelte/icons/edit';
  import Trash2Icon from '@lucide/svelte/icons/trash-2';
  import CopyIcon from '@lucide/svelte/icons/copy';
  import TagIcon from '@lucide/svelte/icons/tag';
  import EyeIcon from '@lucide/svelte/icons/eye';
  import Badge from '$lib/components/ui/badge/badge.svelte';

  /**
   * Prompt data structure
   */
  export interface PromptData {
    id: string;
    name: string;
    content: string;
    variables: string[];
    category: string;
    isPublic: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
  }

  /**
   * Props for the prompt card component
   */
  interface Props {
    /** Prompt data to display */
    prompt: PromptData;
    /** Callback when edit is clicked */
    onedit?: (id: string) => void;
    /** Callback when delete is clicked */
    ondelete?: (id: string) => void;
    /** Callback when copy is clicked */
    oncopy?: (content: string) => void;
    /** Callback when view is clicked */
    onview?: (id: string) => void;
    /** Maximum length of content preview */
    contentPreviewLength?: number;
  }

  let {
    prompt,
    onedit,
    ondelete,
    oncopy,
    onview,
    contentPreviewLength = 150,
  }: Props = $props();

  /**
   * Get category color class
   */
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      general: 'bg-slate-500',
      coding: 'bg-blue-500',
      writing: 'bg-purple-500',
      analysis: 'bg-emerald-500',
      creative: 'bg-pink-500',
      business: 'bg-orange-500',
      custom: 'bg-gray-500',
    };
    return colors[category] || 'bg-slate-500';
  }

  /**
   * Format date for display
   */
  function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  }

  /**
   * Truncate content for preview
   */
  function truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
</script>

<Card class={prompt.isPublic ? '' : ''}>
  <CardHeader>
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <div
          class="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white shrink-0 {getCategoryColor(
            prompt.category
          )}"
        >
          {prompt.category.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          <CardTitle class="text-base truncate">
            {prompt.name}
          </CardTitle>
        </div>
      </div>
      {#if onedit || ondelete || oncopy}
        <DropdownMenu.DropdownMenu>
          <DropdownMenu.DropdownMenuTrigger
            class="hover:bg-accent rounded p-1 shrink-0"
            onclick={(e) => e.stopPropagation()}
          >
            <EditIcon class="size-4" />
          </DropdownMenu.DropdownMenuTrigger>
          <DropdownMenu.DropdownMenuContent>
            {#if onview}
              <DropdownMenu.DropdownMenuItem onclick={() => onview?.(prompt.id)}>
                <EyeIcon class="mr-2 size-4" />
                View
              </DropdownMenu.DropdownMenuItem>
            {/if}
            {#if onedit}
              <DropdownMenu.DropdownMenuItem onclick={() => onedit?.(prompt.id)}>
                <EditIcon class="mr-2 size-4" />
                Edit
              </DropdownMenu.DropdownMenuItem>
            {/if}
            {#if oncopy}
              <DropdownMenu.DropdownMenuItem onclick={() => oncopy?.(prompt.content)}>
                <CopyIcon class="mr-2 size-4" />
                Copy to Clipboard
              </DropdownMenu.DropdownMenuItem>
            {/if}
            {#if ondelete}
              <DropdownMenu.DropdownMenuItem
                onclick={() => ondelete?.(prompt.id)}
                class="text-destructive focus:text-destructive"
              >
                <Trash2Icon class="mr-2 size-4" />
                Delete
              </DropdownMenu.DropdownMenuItem>
            {/if}
          </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
      {/if}
    </div>
    <CardDescription class="text-xs flex items-center gap-2">
      <Badge variant="outline" class="text-xs">
        {prompt.category}
      </Badge>
      {#if prompt.isPublic}
        <Badge variant="secondary" class="text-xs">
          Public
        </Badge>
      {/if}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div class="space-y-3">
      <div class="text-sm text-muted-foreground">
        {truncateContent(prompt.content, contentPreviewLength)}
      </div>

      {#if prompt.variables && prompt.variables.length > 0}
        <div class="flex items-center gap-1 flex-wrap">
          <TagIcon class="size-3 text-muted-foreground shrink-0" />
          {#each prompt.variables as variable}
            <Badge variant="outline" class="text-xs font-mono">
              {`{${variable}}`}
            </Badge>
          {/each}
        </div>
      {/if}

      <div class="text-muted-foreground text-xs">
        Created {formatDate(prompt.createdAt)}
        {prompt.updatedAt !== prompt.createdAt
          ? ` · Updated ${formatDate(prompt.updatedAt)}`
          : ''}
      </div>
    </div>
  </CardContent>
</Card>
