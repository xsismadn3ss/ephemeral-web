<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardFooterProps {
		children: Snippet;
		class?: string;
	}

	let { children, class: classname }: CardFooterProps = $props();
</script>

<section class="text-gray-700 {classname}">
	{@render children()}
</section>