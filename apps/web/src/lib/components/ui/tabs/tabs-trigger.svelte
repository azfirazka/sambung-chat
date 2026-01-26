<script lang="ts">
	import { getContext } from 'svelte';
	import { mergeProps as mergeBitsProps } from 'bits-ui';
	import type { HTMLAttributes, Snippet } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type TabsContext = {
		value: string;
		setValue: (value: string) => void;
	};

	type Props = HTMLAttributes<HTMLButtonElement> & {
		value: string;
		children?: Snippet;
	};

	let className: Props['class'] = undefined;
	let { children, value, ...restProps }: Props = $props();

	const context = getContext<TabsContext>('tabs');
	const isSelected = $derived(context?.value === value);
</script>

<button
	class={cn(
		'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		isSelected
			? 'bg-background text-foreground shadow-sm'
			: 'text-muted-foreground hover:bg-background/50',
		className
	)}
	{...mergeBitsProps(restProps, {
		onclick: () => context?.setValue(value)
	})}
	aria-selected={isSelected}
	role="tab"
	type="button"
>
	{#if children}
		{@render children()}
	{/if}
</button>
