<script lang="ts">
  import { page } from '$app/stores';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { onMount } from 'svelte';

  const { children } = $props();

  // Server-side protection handles auth check
  // $page.data.user is available from +layout.server.ts
  const user = $derived($page.data?.user);

  // Defer sidebar rendering to client-side to avoid hydration mismatches
  let mounted = $state(false);
  onMount(() => {
    mounted = true;
  });
</script>

<!-- Sidebar layout for app pages -->
{#if mounted}
  <Sidebar.Provider style="--sidebar-width: 350px;">
    <AppSidebar {user} />
    <Sidebar.Inset>
      {@render children()}
    </Sidebar.Inset>
  </Sidebar.Provider>
{:else}
  <!-- SSR fallback - simple layout until mounted -->
  <div class="flex min-h-screen">
    <!-- Sidebar placeholder -->
    <div style="width: 350px;" class="border-border bg-card border-r"></div>
    <!-- Main content -->
    <div class="flex-1">
      {@render children()}
    </div>
  </div>
{/if}
