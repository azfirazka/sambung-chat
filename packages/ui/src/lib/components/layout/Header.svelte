<script lang="ts">
  import { cn } from '../../utils';

  export interface HeaderProps {
    class?: string;
    logoHref?: string;
  }

  let { class: className = '', logoHref = '/' }: HeaderProps = $props();
</script>

<header
  class={cn(
    'fixed top-0 left-0 right-0 h-[60px] z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    className
  )}
>
  <div class="container flex h-full items-center justify-center px-4">
    <a
      href={logoHref}
      class="flex items-center space-x-2 font-bold text-xl hover:opacity-80 transition-opacity"
    >
      <span class="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
        SambungChat
      </span>
    </a>
  </div>
</header>
