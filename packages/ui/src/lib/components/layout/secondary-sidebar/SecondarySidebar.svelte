<script lang="ts">
  import * as Sidebar from '../../ui/sidebar';
  import { cn } from '../../../utils';

  export interface SecondarySidebarProps {
    currentPage?: 'chat' | 'prompts' | 'settings' | 'members';
    workspaceType?: 'personal' | 'team';
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    currentPage = 'chat',
    // workspaceType - reserved for future use
    class: className,
    children,
  }: SecondarySidebarProps = $props();

  // Hide sidebar on settings page
  const isVisible = $derived(currentPage !== 'settings');
</script>

{#if isVisible}
  <Sidebar.Provider style="--sidebar-width: 17.5rem; --sidebar-width-mobile: 18rem;">
    <Sidebar.Root collapsible="icon" side="left" class={cn('border-r border-border', className)}>
      <Sidebar.Content>
        {#if children}
          {@render children()}
        {:else}
          <!-- Default content placeholder -->
          <div class="flex flex-col gap-4 p-4">
            <p class="text-sm text-muted-foreground">No content</p>
          </div>
        {/if}
      </Sidebar.Content>
      <Sidebar.Rail />
    </Sidebar.Root>
  </Sidebar.Provider>
{/if}
