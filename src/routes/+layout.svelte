<script lang="ts">
	import './layout.css';

	const { children } = $props();
</script>

<div class="text-gray-600">
	{@render children()}
</div>
