<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardContentProps {
		children: Snippet;
		class?: string;
	}

	let { children, class: classname }: CardContentProps = $props();
</script>

<section class="text-gray-700 {classname}">
	{@render children()}
</section>