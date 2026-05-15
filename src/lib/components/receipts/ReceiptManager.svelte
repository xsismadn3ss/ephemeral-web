<script lang="ts">
	import * as Card from '$components/ui/card/index.js';
	import type { Product } from '$lib/domains/products/domain/product.js';
	import type { ReceiptsStore } from '$lib/domains/receipts/application/receipts.store.js';

	interface ReceiptManagerProps {
		store: ReceiptsStore;
		selectedProducts: Product[];
		onReceiptCreated: () => void;
	}

	let { store, selectedProducts, onReceiptCreated }: ReceiptManagerProps = $props();

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	}

	function formatDate(dateValue: string) {
		return new Intl.DateTimeFormat('es-CO', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(dateValue));
	}

	async function createReceipt() {
		const created = await store.createReceipt(selectedProducts);

		if (created) {
			onReceiptCreated();
		}
	}

	const selectedTotal = $derived(
		selectedProducts.reduce((total, product) => total + product.price, 0)
	);
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Recibos</Card.Title>
		<Card.Description>
			Gestion de facturas a partir de productos seleccionados y consulta de detalle individual.
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-6">
		{#if $store.error}
			<p class="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
				{$store.error}
			</p>
		{/if}

		{#if $store.message}
			<p class="rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-sm text-sky-700">
				{$store.message}
			</p>
		{/if}

		<section class="space-y-4 rounded-lg border border-slate-200 bg-white/70 p-4">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h3 class="font-semibold text-slate-900">Generar recibo</h3>
					<p class="text-sm text-slate-500">Usa la seleccion de productos del panel izquierdo.</p>
				</div>
				<button
					class="rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-sky-300"
					type="button"
					onclick={() => void createReceipt()}
					disabled={$store.submitting || selectedProducts.length === 0}
				>
					{$store.submitting ? 'Generando...' : 'Crear recibo'}
				</button>
			</div>

			<div class="space-y-2">
				<p class="text-sm text-slate-600">Productos seleccionados: {selectedProducts.length}</p>
				<p class="text-sm font-medium text-slate-800">Total proyectado: {formatCurrency(selectedTotal)}</p>
			</div>

			<div class="space-y-2">
				{#if selectedProducts.length === 0}
					<p class="text-sm text-slate-500">No hay productos seleccionados.</p>
				{:else}
					{#each selectedProducts as product (product._id)}
						<div class="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
							<span>{product.name}</span>
							<span>{formatCurrency(product.price)}</span>
						</div>
					{/each}
				{/if}
			</div>
		</section>

		<section class="space-y-3">
			<div class="flex items-center justify-between gap-4">
				<h3 class="text-sm font-semibold text-slate-900">
					Listado {$store.loading ? '(cargando...)' : `(${ $store.items.length })`}
				</h3>
				<button
					class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
					type="button"
					onclick={() => void store.load()}
				>
					Recargar
				</button>
			</div>

			<div class="grid gap-3">
				{#each $store.items as receipt (receipt._id)}
					<article class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div class="space-y-1">
								<h4 class="font-semibold text-slate-900">Recibo {receipt._id}</h4>
								<p class="text-sm text-slate-500">{formatDate(receipt.date)}</p>
							</div>

							<div class="text-right">
								<p class="text-sm font-semibold text-slate-900">{formatCurrency(receipt.total)}</p>
								<p class="text-xs uppercase tracking-wide text-slate-400">
									{receipt.hash ? 'Con hash' : 'Sin hash'}
								</p>
							</div>
						</div>

						<div class="mt-3 flex flex-wrap gap-2">
							<button
								class="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
								type="button"
								onclick={() => void store.selectReceipt(receipt._id)}
								disabled={$store.detailsLoading}
							>
								{$store.detailsLoading && $store.selectedReceipt?._id === receipt._id
									? 'Cargando...'
									: 'Ver detalle'}
							</button>
						</div>
					</article>
				{/each}
			</div>
		</section>

		{#if $store.selectedReceipt}
			<section class="space-y-3 rounded-lg border border-slate-200 bg-slate-950 p-4 text-slate-100">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h3 class="font-semibold">Detalle del recibo</h3>
						<p class="text-sm text-slate-300">{$store.selectedReceipt._id}</p>
					</div>
					<p class="text-sm text-slate-300">{formatDate($store.selectedReceipt.date)}</p>
				</div>

				<div class="space-y-2">
					{#each $store.selectedReceipt.products_data as product (product._id)}
						<div class="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm">
							<span>{product.name}</span>
							<span>{formatCurrency(product.price)}</span>
						</div>
					{/each}
				</div>

				<div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3 text-sm">
					<span>Total</span>
					<strong>{formatCurrency($store.selectedReceipt.total)}</strong>
				</div>

				<p class="text-xs text-slate-400">
					Hash: {$store.selectedReceipt.hash ?? 'No disponible'}
				</p>
			</section>
		{/if}
	</Card.Content>
</Card.Root>