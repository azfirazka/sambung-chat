<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  export type ProgressProps = WithoutChildren<
    WithElementRef<HTMLAttributes<HTMLDivElement>> & {
      value?: number;
      max?: number;
    }
  >;

  let {
    ref = $bindable(null),
    class: className,
    value = 0,
    max = 100,
    ...restProps
  }: ProgressProps = $props();

  const percentage = $derived(Math.min(Math.max((value / max) * 100, 0), 100));
</script>

<div
  bind:this={ref}
  data-slot="progress"
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  data-value={value}
  data-state={value === undefined ? 'indeterminate' : percentage === 100 ? 'complete' : 'loading'}
  class={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
  {...restProps}
>
  <div
    class="bg-primary h-full w-full flex-1 transition-all duration-300 ease-in-out"
    style="transform: translateX(-{100 - percentage}%);"
  ></div>
</div>
