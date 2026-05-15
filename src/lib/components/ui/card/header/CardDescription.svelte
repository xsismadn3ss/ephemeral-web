<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CardDescriptionProps {
		children: Snippet;
	}

	let props: CardDescriptionProps = $props();
</script>

<div class="text-sm text-gray-500">
	{@render props.children()}
</div>