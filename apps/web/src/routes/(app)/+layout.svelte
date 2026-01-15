<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import { ModeWatcher } from 'mode-watcher';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import '../../app.css';
  import { queryClient } from '../../lib/orpc';
  import { authClient } from '../../lib/auth-client';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { onMount } from 'svelte';

  const { children } = $props();
  const sessionQuery = authClient.useSession();

  // Redirect to login if not authenticated
  $effect(() => {
    if (!$sessionQuery.isPending && !$sessionQuery.data?.user) {
      goto('/login');
    }
  });
</script>

<ModeWatcher defaultMode="dark" />
<QueryClientProvider client={queryClient}>
  <Sidebar.Provider style="--sidebar-width: 350px;">
    <AppSidebar />
    <Sidebar.Inset>
      {@render children()}
    </Sidebar.Inset>
  </Sidebar.Provider>
  <SvelteQueryDevtools />
</QueryClientProvider>
