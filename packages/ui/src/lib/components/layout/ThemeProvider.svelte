<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import type { Snippet } from 'svelte';
  import { themeStore } from '../../stores';

  interface Props {
    storageKey?: string;
    defaultTheme?: 'light' | 'dark' | 'system';
    children?: Snippet;
  }

  let { storageKey = 'sambungchat-ui-theme', defaultTheme = 'system', children }: Props = $props();

  let isBrowser = $state(false);

  $effect(() => {
    isBrowser = typeof window !== 'undefined';
  });

  // Initialize theme on mount
  onMount(() => {
    if (!isBrowser) return;

    // Get stored theme or use default
    const storedTheme = localStorage.getItem(storageKey) as 'light' | 'dark' | 'system' | null;
    const theme = storedTheme ?? defaultTheme;
    themeStore.setTheme(theme);

    // Listen for system theme changes when in 'system' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const currentTheme = get(themeStore);
      if (currentTheme.theme === 'system') {
        themeStore.setTheme('system'); // Re-apply system theme
      }
    };

    // Use addEventListener with modern browser support
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });
</script>

{@render children?.()}
