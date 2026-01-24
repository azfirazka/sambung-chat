<script lang="ts">
  interface Props {
    loading: boolean;
    searching: boolean;
  }

  let { loading, searching }: Props = $props();
</script>

<div class="text-muted-foreground flex items-center justify-center p-8 text-sm">
  {loading ? 'Loading chats...' : 'Searching...'}
</div>
