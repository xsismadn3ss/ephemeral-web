<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardHeaderProps {
		children: Snippet;
	}

	let { children }: CardHeaderProps = $props();
</script>

<section class="space-y-2">
	{@render children()}
</section>