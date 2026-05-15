<script lang="ts">
	import { onMount } from 'svelte';

	import ProductManager from '$lib/components/products/ProductManager.svelte';
	import ReceiptManager from '$lib/components/receipts/ReceiptManager.svelte';
	import { createProductsStore } from '$lib/domains/products/application/products.store.js';
	import { createReceiptsStore } from '$lib/domains/receipts/application/receipts.store.js';

	const productsStore = createProductsStore();
	const receiptsStore = createReceiptsStore();

	let selectedProductIds = $state<string[]>([]);

	const selectedProducts = $derived(
		$productsStore.items.filter((product) => selectedProductIds.includes(product._id))
	);

	$effect(() => {
		const validProductIds = new Set($productsStore.items.map((product) => product._id));
		const normalizedSelection = selectedProductIds.filter((productId) => validProductIds.has(productId));

		if (normalizedSelection.length !== selectedProductIds.length) {
			selectedProductIds = normalizedSelection;
		}
	});

	onMount(() => {
		void Promise.all([productsStore.load(), receiptsStore.load()]);
	});
</script>

<svelte:head>
	<title>Ephemeral Web</title>
	<meta
		name="description"
		content="Panel para administrar productos y recibos usando los endpoints documentados en OpenAPI."
	/>
</svelte:head>

<section class="min-h-screen bg-linear-to-br from-slate-100 via-white to-emerald-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl space-y-8">
		<header class="space-y-3">
			<p class="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Ephemeral</p>
			<h1 class="max-w-3xl text-4xl font-black tracking-tight text-balance text-slate-950 sm:text-5xl">
				Productos efimeros y recibos duraderos
			</h1>
			<p class="text-gray-600">Registra productos y crea facturas. Ejemplo de modelo de limpieza automatica, solo se conservan los datos importantes. Los datos de productos pueden ser eliminados automáticamente después de un tiempo.</p>
		</header>

		<div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
			<ProductManager
				store={productsStore}
				selectedProductIds={selectedProductIds}
				onSelectionChange={(productIds) => {
					selectedProductIds = productIds;
				}}
			/>

			<ReceiptManager
				store={receiptsStore}
				selectedProducts={selectedProducts}
				onReceiptCreated={() => {
					selectedProductIds = [];
				}}
			/>
		</div>
	</div>
</section>
