<script lang="ts">
  import { AppLayout } from '@sambung-chat/ui';
  import { ChatList } from '@sambung-chat/ui';
  import type { Workspace } from '@sambung-chat/ui';
  import { authClient } from '../../lib/auth-client';
  import { orpc } from '../../lib/orpc';
  import { createQuery } from '@tanstack/svelte-query';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // Props from SvelteKit
  let { children } = $props();

  // Session state
  const sessionQuery = authClient.useSession();

  // Fetch chats using TanStack Query
  const chatsQuery = createQuery(orpc.chat.getAll.queryOptions());

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

  // Protected routes that require authentication
  const protectedRoutes = ['/app/chat', '/app/chats', '/app/settings'];

  // Redirect to login if accessing protected route without session
  $effect(() => {
    if ($sessionQuery.isPending) return;

    const isProtectedRoute = protectedRoutes.some((route) => $page.url.pathname.startsWith(route));

    if (isProtectedRoute && !$sessionQuery.data?.user) {
      goto('/login');
    }
  });

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

{#if $sessionQuery.data?.user}
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
{:else}
  <!-- Loading state -->
  <div class="flex h-screen items-center justify-center">
    <div class="text-center">
      <div class="animate-spin mb-4 text-4xl">⏳</div>
      <p class="text-muted-foreground">Loading...</p>
    </div>
  </div>
{/if}
