<script lang="ts">
  import { AppLayout } from '@sambung-chat/ui';
  import { ChatList } from '@sambung-chat/ui';
  import type { Workspace } from '@sambung-chat/ui';
  import { authClient } from '../../lib/auth-client';
  import { orpc } from '../../lib/orpc';
  import { createQuery } from '@tanstack/svelte-query';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import type { LayoutData } from './$types';

  // Props from SvelteKit
  let { children, data }: { children: any; data: LayoutData } = $props();

  // Session state from server (for SSR) with client-side sync
  // Note: useSession() doesn't accept arguments in Better Auth Svelte
  // We rely on client-side session verification since cookies don't work across ports
  const sessionQuery = authClient.useSession();

  // Track if component is mounted on client to prevent hydration mismatch
  // IMPORTANT: Always starts as false to ensure server/client consistency
  let mounted = $state(false);

  // Set mounted to true only after client-side hydration is complete
  onMount(() => {
    mounted = true;
  });

  // Derive enabled state reactively (client-side only after mount)
  const isEnabled = $derived(mounted && !!$sessionQuery.data?.user);

  // Add logging for debugging
  $effect(() => {
    if (typeof window !== 'undefined') {
      console.log('[APP LAYOUT] State:', {
        mounted,
        isPending: $sessionQuery.isPending,
        hasUser: !!$sessionQuery.data?.user,
        user: $sessionQuery.data?.user,
        pathname: $page.url.pathname,
      });
    }
  });

  // Redirect to login if not authenticated (client-side only after mount)
  // Use a flag to prevent infinite redirects
  let hasRedirected = $state(false);

  $effect(() => {
    // Only redirect after component is mounted and session check is complete
    if (mounted && !$sessionQuery.isPending && !hasRedirected) {
      if (!$sessionQuery.data?.user) {
        console.log('[APP LAYOUT] No session found, redirecting to login');
        hasRedirected = true;
        const redirectTo = $page.url.pathname;
        goto(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      } else {
        console.log('[APP LAYOUT] Session found, showing app');
      }
    }
  });

  // Fetch chats using TanStack Query - only enabled on client when authenticated
  // This prevents fetch calls during SSR
  const chatsQuery = createQuery({
    ...orpc.chat.getAll.queryOptions(),
    get enabled() {
      return isEnabled;
    },
  });

  // Workspace state (personal mode)
  let currentWorkspace = $state<Workspace>({
    type: 'personal',
    id: 'personal',
    name: 'Personal',
  });

  // Current chat ID from URL
  let currentChatId = $state<string | undefined>(undefined);

  // Navigation handler
  function handleNavigate(path: string) {
    goto(`/app${path}`);
  }

  // Auth handlers
  async function handleSignIn() {
    await authClient.signIn.social({ provider: 'keycloak', callbackURL: '/app/chat' });
  }

  async function handleSignOut() {
    await authClient.signOut();
    goto('/login');
  }

  function handleAccountSettings() {
    goto('/app/settings');
  }

  function handleCreateTeam() {
    // TODO: Implement team creation
    console.log('Create team');
  }

  function handleOpenDocs() {
    window.open('https://github.com/your-repo/sambung-chat', '_blank');
  }

  function handleOpenHelp() {
    window.open('https://github.com/your-repo/sambung-chat/issues', '_blank');
  }

  // Chat handlers
  function handleNewChat() {
    goto('/app/chat');
  }

  function handleSelectChat(chatId: string) {
    goto(`/app/chats/${chatId}`);
  }

  // Get current path for navigation highlighting
  $effect(() => {
    currentPath = $page.url.pathname;
  });

  let currentPath = $state('/app/chat');

  // Extract current chat ID from URL
  $effect(() => {
    const match = $page.url.pathname.match(/^\/app\/chats\/(\d+)$/);
    currentChatId = match ? match[1] : undefined;
  });
</script>

{#snippet sidebarContent()}
  <ChatList
    workspaceType="personal"
    chats={$chatsQuery.data?.map((chat) => ({
      id: chat.id.toString(),
      title: chat.title,
      updatedAt: new Date(chat.updatedAt).toLocaleDateString(),
    })) || []}
    folders={[]}
    onNewChat={handleNewChat}
    onSelectChat={handleSelectChat}
    {currentChatId}
  />
{/snippet}

{#if mounted && $sessionQuery.data?.user}
  <div class="app-layout-wrapper" style="background: lightgreen; min-height: 100vh;">
    <div style="padding: 20px; background: yellow;">
      <h1>✅ APP LAYOUT LOADED - User: {$sessionQuery.data.user.name || 'Unknown'}</h1>
      <p>Path: {$page.url.pathname}</p>
      <p>You should see the AppLayout below...</p>
    </div>
    <AppLayout
      user={$sessionQuery.data.user}
      {currentWorkspace}
      teams={[]}
      onSwitchWorkspace={(workspace) => {
        currentWorkspace = workspace;
        if (workspace.type === 'team') {
          goto(`/team/${workspace.id}/chat`);
        } else {
          goto('/app/chat');
        }
      }}
      onAccountSettings={handleAccountSettings}
      onLogout={handleSignOut}
      onCreateTeam={handleCreateTeam}
      onNavigate={handleNavigate}
      onOpenDocs={handleOpenDocs}
      onOpenHelp={handleOpenHelp}
      {currentPath}
      workspaceType="personal"
      {sidebarContent}
    >
      {@render children()}
    </AppLayout>
  </div>
{:else}
  <!-- Loading state - shows during SSR and until mount + session check -->
  <div class="flex h-screen items-center justify-center" style="background: lightcoral;">
    <div class="text-center">
      <div class="animate-spin mb-4 text-4xl">⏳</div>
      <p class="text-muted-foreground">Loading... (Checking session)</p>
      <p class="text-xs text-muted-foreground mt-2">
        mounted: {mounted}<br />
        isPending: {$sessionQuery.isPending}<br />
        hasUser: {!!$sessionQuery.data?.user}
      </p>
    </div>
  </div>
{/if}
