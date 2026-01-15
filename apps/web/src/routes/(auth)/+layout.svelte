<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import { ModeWatcher } from 'mode-watcher';
  import '../../app.css';
  import { queryClient } from '../../lib/orpc';

  const { children } = $props();
</script>

<!-- ModeWatcher for global theme tracking on auth pages -->
<ModeWatcher defaultMode="dark" />

<QueryClientProvider client={queryClient}>
  <div class="bg-background flex min-h-screen items-center justify-center p-4">
    {@render children()}
  </div>
  <SvelteQueryDevtools />
</QueryClientProvider>
