<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import { mergeProps as mergeBitsProps } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type TabsContext = {
		value: string;
		setValue: (value: string) => void;
	};

	type Props = HTMLAttributes<HTMLDivElement> & {
		value: string;
		children?: Snippet;
	};

	let className: Props['class'] = undefined;
	let { children, value, ...restProps }: Props = $props();

	const context = getContext<TabsContext>('tabs');
	const shouldShow = $derived(context?.value === value);
</script>

{#if shouldShow}
	<div
		class={cn('mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
		{...mergeBitsProps(restProps)}
		role="tabpanel"
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
