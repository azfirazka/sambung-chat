<script lang="ts" module>
  // @ts-nocheck - bits-ui builder prop has unknown type - known library limitation
  import * as DropdownMenu from '../ui/dropdown-menu';
  import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
  import { cn } from '../../utils';

  export interface Team {
    id: string;
    name: string;
    slug: string;
    memberCount?: number;
    onlineCount?: number;
    avatar?: string;
  }

  export interface Workspace {
    type: 'personal' | 'team';
    id: string;
    name: string;
    slug?: string;
  }

  export interface UserMenuProps {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    currentWorkspace: Workspace;
    teams?: Team[];
    onSwitchWorkspace?: (workspace: Workspace) => void;
    onAccountSettings?: () => void;
    onLogout?: () => void;
    onCreateTeam?: () => void;
    class?: string;
  }
</script>

<script lang="ts">
  // @ts-nocheck - bits-ui builder prop has unknown type - known library limitation
  interface Team {
    id: string;
    name: string;
    slug: string;
    memberCount?: number;
    onlineCount?: number;
    avatar?: string;
  }

  interface Workspace {
    type: 'personal' | 'team';
    id: string;
    name: string;
    slug?: string;
  }

  interface UserMenuProps {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    currentWorkspace: Workspace;
    teams?: Team[];
    onSwitchWorkspace?: (workspace: Workspace) => void;
    onAccountSettings?: () => void;
    onLogout?: () => void;
    onCreateTeam?: () => void;
    class?: string;
  }

  let {
    user,
    currentWorkspace,
    teams = [],
    onSwitchWorkspace,
    onAccountSettings,
    onLogout,
    onCreateTeam,
    class: className,
  }: UserMenuProps = $props();

  function switchToPersonal() {
    onSwitchWorkspace?.({
      type: 'personal',
      id: 'personal',
      name: 'Personal',
    });
  }

  function switchToTeam(team: Team) {
    onSwitchWorkspace?.({
      type: 'team',
      id: team.id,
      name: team.name,
      slug: team.slug,
    });
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={cn('outline-none', className)}>
    <button
      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-12 w-12 p-0"
    >
      {#if user.avatar}
        <Avatar class="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      {:else}
        <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="text-xs font-medium text-primary">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      {/if}
    </button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content side="top" class="w-56" align="end">
    <!-- User Info Header -->
    <div class="px-2 py-1.5">
      <p class="text-sm font-medium">{currentWorkspace.name}</p>
      <p class="text-xs text-muted-foreground">{user.email}</p>
    </div>

    <DropdownMenu.Separator />

    <!-- Workspace Switcher -->
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <button class="inline-flex items-center gap-2 px-2 py-1.5 text-sm outline-none">
          <span>Switch Workspace</span>
        </button>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent class="w-48">
        <DropdownMenu.Item onclick={switchToPersonal} class="cursor-pointer">
          <div class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-xs font-medium text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-medium">Personal</span>
              <span class="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenu.Item>

        {#if teams.length > 0}
          <DropdownMenu.Separator />
          {#each teams as team (team.id)}
            <DropdownMenu.Item onclick={() => switchToTeam(team)} class="cursor-pointer">
              <div class="flex items-center gap-2">
                {#if team.avatar}
                  <Avatar class="h-6 w-6">
                    <AvatarImage src={team.avatar} alt={team.name} />
                    <AvatarFallback>
                      {team.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                {:else}
                  <div class="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-xs font-medium text-primary">
                      {team.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                {/if}
                <div class="flex flex-col">
                  <span class="text-sm font-medium">{team.name}</span>
                  {#if team.onlineCount !== undefined}
                    <span class="text-xs text-muted-foreground">{team.onlineCount} online</span>
                  {/if}
                </div>
              </div>
            </DropdownMenu.Item>
          {/each}
        {/if}

        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={onCreateTeam} class="cursor-pointer">
          <div class="flex items-center gap-2">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </span>
            <span class="text-sm">Create New Team</span>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>

    <DropdownMenu.Separator />

    <!-- Account Settings -->
    <DropdownMenu.Item onclick={onAccountSettings} class="cursor-pointer">
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Account Settings</span>
      </div>
    </DropdownMenu.Item>

    <DropdownMenu.Separator />

    <!-- Logout -->
    <DropdownMenu.Item onclick={onLogout} class="cursor-pointer">
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
        <span>Logout</span>
      </div>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
