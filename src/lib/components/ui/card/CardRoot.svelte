<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardRootProps {
		class?: string;
		children: Snippet;
	}

	let { children, class: className }: CardRootProps = $props();
</script>

<div class="p-4 border border-gray-300 rounded-sm shadow-md bg-emerald-50/70 space-y-4 {className}">
	{@render children()}
</div>