<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardTitleProps {
		children: Snippet;
	}

	let { children }: CardTitleProps = $props();
</script>

<div class="text-2xl font-bold text-gray-600">
	{@render children()}
</div>