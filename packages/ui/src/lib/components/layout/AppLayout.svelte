<script lang="ts">
  import { cn } from '../../utils';
  import type { Snippet } from 'svelte';
  import Header from './Header.svelte';
  import NavigationRail from './NavigationRail.svelte';
  import type { Workspace } from './UserMenu.svelte';

  export interface AppLayoutProps {
    children: Snippet;
    sidebarContent?: Snippet;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    currentWorkspace?: Workspace;
    teams?: Array<{
      id: string;
      name: string;
      slug: string;
      memberCount?: number;
      onlineCount?: number;
      avatar?: string;
    }>;
    onSwitchWorkspace?: (workspace: Workspace) => void;
    onAccountSettings?: () => void;
    onLogout?: () => void;
    onCreateTeam?: () => void;
    onNavigate?: (path: string) => void;
    onOpenDocs?: () => void;
    onOpenHelp?: () => void;
    currentPath?: string;
    workspaceType?: 'personal' | 'team';
    class?: string;
  }

  let {
    children,
    sidebarContent,
    user,
    currentWorkspace,
    teams = [],
    onSwitchWorkspace,
    onAccountSettings,
    onLogout,
    onCreateTeam,
    onNavigate,
    onOpenDocs,
    onOpenHelp,
    currentPath = '/',
    workspaceType = 'personal',
    class: className,
  }: AppLayoutProps = $props();

  // Responsive breakpoint detection
  let isMobile = $state(false);
  let isTablet = $state(false);

  $effect(() => {
    const checkBreakpoint = () => {
      if (typeof window === 'undefined') return;
      isMobile = window.innerWidth < 768;
      isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  });
</script>

<div class={cn('flex h-screen overflow-hidden bg-background', className)}>
  <!-- Fixed Header (60px) -->
  <Header class="fixed top-0 left-0 right-0 h-[60px] z-50" />

  <!-- Navigation Rail (64px, below header) -->
  {#if !isMobile}
    <div class="fixed left-0 top-[60px] bottom-0 w-16 z-40">
      <NavigationRail
        {currentPath}
        {workspaceType}
        {user}
        currentWorkspace={currentWorkspace || {
          type: 'personal',
          id: 'personal',
          name: 'Personal',
        }}
        {teams}
        {onSwitchWorkspace}
        {onNavigate}
        {onAccountSettings}
        {onLogout}
        {onCreateTeam}
        {onOpenDocs}
        {onOpenHelp}
      />
    </div>
  {/if}

  <!-- Main Content Area (offset for header and nav rail) -->
  <div
    class={cn(
      'flex flex-1 overflow-hidden',
      // Offset for fixed header
      'mt-[60px]',
      // Offset for nav rail on desktop
      !isMobile && 'ml-16'
    )}
  >
    <!-- Secondary Sidebar (280px, collapsible) -->
    {#if !isMobile && sidebarContent}
      <div
        class={cn(
          'border-r border-border transition-all duration-300',
          isTablet ? 'w-12' : 'w-[280px]'
        )}
      >
        {@render sidebarContent()}
      </div>
    {/if}

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      {@render children()}
    </main>
  </div>

  <!-- Mobile Bottom Navigation (56px) -->
  {#if isMobile}
    <div class="fixed bottom-0 left-0 right-0 h-[56px] bg-card border-t border-border z-50">
      <!-- TODO: Implement mobile bottom nav -->
      <div class="flex items-center justify-around h-full px-4">
        <button
          class="flex flex-col items-center gap-1 text-xs"
          onclick={() => onNavigate?.('/chat')}
        >
          <span class="text-lg">💬</span>
          <span>Chat</span>
        </button>
        <button
          class="flex flex-col items-center gap-1 text-xs"
          onclick={() => onNavigate?.('/prompts')}
        >
          <span class="text-lg">✨</span>
          <span>Prompts</span>
        </button>
        <button
          class="flex flex-col items-center gap-1 text-xs"
          onclick={() => onNavigate?.('/settings')}
        >
          <span class="text-lg">⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Hide scrollbar but keep functionality */
  :global(.overflow-y-auto) {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.3) hsl(var(--muted) / 0.1);
  }

  :global(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background-color: hsl(var(--muted-foreground) / 0.3);
    border-radius: 3px;
  }

  :global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background-color: hsl(var(--muted-foreground) / 0.5);
  }
</style>
