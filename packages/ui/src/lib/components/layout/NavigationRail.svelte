<script lang="ts" module>
  // @ts-nocheck - bits-ui builder prop has unknown type - known library limitation
  import { cn } from '../../utils';
  import * as Tooltip from '../ui/tooltip';
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import { MessageSquare, Sparkles, Settings, Users, Book, HelpCircle } from '@lucide/svelte';
  import UserMenu from './UserMenu.svelte';
  import type { Team, Workspace } from './UserMenu.svelte';

  export interface NavigationRailProps {
    currentPath?: string;
    workspaceType?: 'personal' | 'team';
    onNavigate?: (path: string) => void;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    currentWorkspace?: Workspace;
    teams?: Team[];
    onSwitchWorkspace?: (workspace: Workspace) => void;
    onAccountSettings?: () => void;
    onLogout?: () => void;
    onCreateTeam?: () => void;
    onOpenDocs?: () => void;
    onOpenHelp?: () => void;
    class?: string;
  }
</script>

<script lang="ts">
  // @ts-nocheck - bits-ui builder prop has unknown type - known library limitation
  interface NavigationRailProps {
    currentPath?: string;
    workspaceType?: 'personal' | 'team';
    onNavigate?: (path: string) => void;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    currentWorkspace?: {
      type: 'personal' | 'team';
      id: string;
      name: string;
      slug?: string;
    };
    teams?: Array<{
      id: string;
      name: string;
      slug: string;
      memberCount?: number;
      onlineCount?: number;
      avatar?: string;
    }>;
    onSwitchWorkspace?: (workspace: {
      type: 'personal' | 'team';
      id: string;
      name: string;
      slug?: string;
    }) => void;
    onAccountSettings?: () => void;
    onLogout?: () => void;
    onCreateTeam?: () => void;
    onOpenDocs?: () => void;
    onOpenHelp?: () => void;
    class?: string;
  }

  let {
    currentPath = '/',
    workspaceType = 'personal',
    onNavigate,
    user,
    currentWorkspace,
    teams = [],
    onSwitchWorkspace,
    onAccountSettings,
    onLogout,
    onCreateTeam,
    onOpenDocs,
    onOpenHelp,
    class: className,
  }: NavigationRailProps = $props();

  const navItems = $derived(
    workspaceType === 'team'
      ? ([
          { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
          { id: 'prompts', label: 'Prompts', icon: Sparkles, path: '/prompts' },
          { id: 'members', label: 'Members', icon: Users, path: '/members' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ] as const)
      : ([
          { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/chat' },
          { id: 'prompts', label: 'Prompts', icon: Sparkles, path: '/prompts' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ] as const)
  );

  function isActive(path: string): boolean {
    return currentPath === path || currentPath.startsWith(path + '/');
  }
</script>

<TooltipPrimitive.Provider>
  <nav
    class={cn('w-16 bg-card border-r border-border flex flex-col h-screen py-4 gap-1', className)}
  >
    <!-- Navigation Items (Top) -->
    <div class="flex-1 flex flex-col items-center gap-1 w-full">
      {#each navItems as item (item.id)}
        {@const Icon = item.icon}
        <Tooltip.Root delayDuration={200}>
          <Tooltip.Trigger
            type="button"
            class={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              'w-12 h-12 relative',
              isActive(item.path)
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
            onclick={() => onNavigate?.(item.path)}
            aria-label={item.label}
          >
            <Icon class="w-5 h-5" />
          </Tooltip.Trigger>
          <Tooltip.Content side="right">
            {item.label}
          </Tooltip.Content>
        </Tooltip.Root>
      {/each}
    </div>

    <!-- Separator -->
    <div class="w-8 h-px bg-border my-1"></div>

    <!-- Utility Icons (Bottom) - from bottom to top -->
    <div class="flex flex-col items-center gap-1">
      <!-- User Menu (bottom-most) -->
      {#if user}
        <UserMenu
          {user}
          currentWorkspace={currentWorkspace || {
            type: 'personal',
            id: 'personal',
            name: 'Personal',
          }}
          {teams}
          {onSwitchWorkspace}
          {onAccountSettings}
          {onLogout}
          {onCreateTeam}
        />
      {:else}
        <!-- Fallback when user not loaded -->
        <div class="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
      {/if}

      <!-- Help -->
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger
          type="button"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-12 h-12"
          onclick={onOpenHelp}
          aria-label="Help"
        >
          <HelpCircle class="w-5 h-5" />
        </Tooltip.Trigger>
        <Tooltip.Content side="right">Help</Tooltip.Content>
      </Tooltip.Root>

      <!-- Documentation -->
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger
          type="button"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-12 h-12"
          onclick={onOpenDocs}
          aria-label="Documentation"
        >
          <Book class="w-5 h-5" />
        </Tooltip.Trigger>
        <Tooltip.Content side="right">Documentation</Tooltip.Content>
      </Tooltip.Root>
    </div>
  </nav>
</TooltipPrimitive.Provider>
