<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';
  import '@sambung-chat/ui/styles.css';
  import { queryClient } from '../lib/orpc';
  import { Header } from '@sambung-chat/ui';
  import { authClient } from '../lib/auth-client';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // Dynamic import components for client-side only rendering
  import { onMount } from 'svelte';
  let ToasterComponent = $state<any>(null);
  let AuthUserMenuComponent = $state<any>(null);

  onMount(async () => {
    const [{ Toaster }, { AuthUserMenu }] = await Promise.all([
      import('@sambung-chat/ui'),
      import('@sambung-chat/ui'),
    ]);
    ToasterComponent = Toaster;
    AuthUserMenuComponent = AuthUserMenu;
  });

  const { children } = $props();

  const sessionQuery = authClient.useSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/todos', '/ai'];

  // Redirect to login if accessing protected route without session
  $effect(() => {
    if ($sessionQuery.isPending) return;

    const isProtectedRoute = protectedRoutes.some((route) => $page.url.pathname.startsWith(route));

    if (isProtectedRoute && !$sessionQuery.data?.user) {
      goto('/login');
    }
  });

  async function handleSignIn() {
    await authClient.signIn.social({ provider: 'keycloak', callbackURL: '/' });
  }

  async function handleSignOut() {
    await authClient.signOut();
    goto('/login');
  }
</script>

<!-- ModeWatcher must be at root level for global theme tracking -->
<ModeWatcher defaultMode="dark" />

<QueryClientProvider client={queryClient}>
  <div class="grid h-svh grid-rows-[auto_1fr]">
    <header
      class="fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4"
    >
      <Header class="h-full border-0" />
      {#if AuthUserMenuComponent}
        {@const AuthUserMenu = AuthUserMenuComponent}
        <AuthUserMenu
          user={$sessionQuery.data?.user}
          isLoadingUser={$sessionQuery.isPending}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
      {/if}
    </header>
    <main class="overflow-y-auto pt-[60px]">
      {@render children()}
    </main>
  </div>
  <SvelteQueryDevtools />
  {#if ToasterComponent}
    {@const Toaster = ToasterComponent}
    <Toaster />
  {/if}
</QueryClientProvider>
