<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';
  import { queryClient } from '../lib/orpc';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authClient } from '../lib/auth-client';

  const { children } = $props();
  const sessionQuery = authClient.useSession();

  // Handle root redirects based on auth state
  $effect(() => {
    if ($sessionQuery.isPending) return;

    const path = $page.url.pathname;

    // If on root and not authenticated, redirect to login
    if (path === '/' && !$sessionQuery.data?.user) {
      goto('/login');
    }
    // If on root and authenticated, redirect to app
    else if (path === '/' && $sessionQuery.data?.user) {
      goto('/app/chat');
    }
  });
</script>

<!-- ModeWatcher must be at root level for global theme tracking -->
<ModeWatcher defaultMode="dark" />
<QueryClientProvider client={queryClient}>
  {@render children()}
  <SvelteQueryDevtools />
</QueryClientProvider>
