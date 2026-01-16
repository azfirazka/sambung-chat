<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';

  const { children } = $props();
</script>

<!-- ModeWatcher must be at root level for global theme tracking -->
<ModeWatcher defaultMode="dark" />
{@render children()}
