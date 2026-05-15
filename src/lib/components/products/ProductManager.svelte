<script lang="ts">
	import * as Card from '$components/ui/card/index.js';
	import type { Product } from '$lib/domains/products/domain/product.js';
	import type { ProductsStore } from '$lib/domains/products/application/products.store.js';

	interface ProductManagerProps {
		store: ProductsStore;
		selectedProductIds: string[];
		onSelectionChange: (productIds: string[]) => void;
	}

	let { store, selectedProductIds, onSelectionChange }: ProductManagerProps = $props();

	function updateField(field: 'name' | 'description' | 'price', event: Event) {
		store.setField(field, (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value);
	}

	function updateProperty(index: number, field: 'name' | 'value', event: Event) {
		store.updateProperty(index, field, (event.currentTarget as HTMLInputElement).value);
	}

	function toggleSelection(productId: string, checked: boolean) {
		onSelectionChange(
			checked
				? [...selectedProductIds, productId]
				: selectedProductIds.filter((selectedProductId) => selectedProductId !== productId)
		);
	}

	function isSelected(productId: string) {
		return selectedProductIds.includes(productId);
	}

	function formatDate(dateValue: string | null) {
		if (!dateValue) {
			return 'Sin fecha de expiracion';
		}

		return new Intl.DateTimeFormat('es-CO', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(dateValue));
	}

	function productPropertySummary(product: Product) {
		if (product.properties.length === 0) {
			return 'Sin propiedades';
		}

		return product.properties.map((property) => `${property.name}: ${property.value}`).join(' | ');
	}
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Productos</Card.Title>
		<Card.Description>
			Crea nuevos productos
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-6">
		{#if $store.error}
			<p class="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
				{$store.error}
			</p>
		{/if}

		{#if $store.message}
			<p class="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
				{$store.message}
			</p>
		{/if}

		<form class="grid gap-4" onsubmit={(event) => {
			event.preventDefault();
			void store.saveProduct();
		}}>
			<div class="grid gap-2">
				<label class="text-sm font-medium text-slate-700" for="product-name">Nombre</label>
				<input
					id="product-name"
					class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
					type="text"
					value={$store.form.name}
					oninput={(event) => updateField('name', event)}
				/>
			</div>

			<div class="grid gap-2">
				<label class="text-sm font-medium text-slate-700" for="product-description">
					Descripcion
				</label>
				<textarea
					id="product-description"
					class="min-h-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
					value={$store.form.description}
					oninput={(event) => updateField('description', event)}
				></textarea>
			</div>

			<div class="grid gap-2">
				<label class="text-sm font-medium text-slate-700" for="product-price">Precio</label>
				<input
					id="product-price"
					class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
					type="number"
					min="0"
					step="0.01"
					value={$store.form.price}
					oninput={(event) => updateField('price', event)}
				/>
			</div>

			<div class="space-y-3 rounded-lg border border-slate-200 bg-white/70 p-4">
				<div class="flex items-center justify-between gap-4">
					<div>
						<h3 class="text-sm font-semibold text-slate-900">Propiedades</h3>
						<p class="text-xs text-slate-500">Usa `true` o `false` para enviar booleanos.</p>
					</div>
					<button
						class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
						type="button"
						onclick={() => store.addProperty()}
					>
						Agregar propiedad
					</button>
				</div>

				<div class="space-y-3">
					{#each $store.form.properties as property, index (index)}
						<div class="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
							<div class="grid gap-2">
								<label class="text-xs font-medium uppercase tracking-wide text-slate-500" for={`product-property-name-${index}`}>
									Nombre
								</label>
								<input
									id={`product-property-name-${index}`}
									class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
									type="text"
									value={property.name}
									oninput={(event) => updateProperty(index, 'name', event)}
								/>
							</div>

							<div class="grid gap-2">
								<label class="text-xs font-medium uppercase tracking-wide text-slate-500" for={`product-property-value-${index}`}>
									Valor
								</label>
								<input
									id={`product-property-value-${index}`}
									class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
									type="text"
									value={property.value}
									oninput={(event) => updateProperty(index, 'value', event)}
								/>
							</div>

							<button
								class="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700"
								type="button"
								onclick={() => store.removeProperty(index)}
							>
								Quitar
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="flex flex-wrap gap-3">
				<button
					class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
					type="submit"
					disabled={$store.submitting}
				>
					{$store.submitting
						? 'Guardando...'
						: $store.form.id
							? 'Actualizar producto'
							: 'Crear producto'}
				</button>

				<button
					class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
					type="button"
					onclick={() => store.resetForm()}
				>
					Limpiar formulario
				</button>
			</div>
		</form>

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

			<div class="grid gap-3 xl:grid-cols-2">
				{#each $store.items as product (product._id)}
					<article class="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
						<div class="flex items-start justify-between gap-3">
							<div>
								<h4 class="font-semibold text-slate-900">{product.name}</h4>
								<p class="text-sm text-slate-500">ID: {product._id}</p>
							</div>

							<label class="flex items-center gap-2 text-sm text-slate-600" for={`select-product-${product._id}`}>
								<input
									id={`select-product-${product._id}`}
									type="checkbox"
									checked={isSelected(product._id)}
									onchange={(event) =>
										toggleSelection(
											product._id,
											(event.currentTarget as HTMLInputElement).checked
										)
									}
								/>
								Factura
							</label>
						</div>

						<p class="text-sm text-slate-700">{product.description}</p>
						<p class="text-sm text-slate-600">Precio: ${product.price.toFixed(2)}</p>
						<p class="text-sm text-slate-500">{productPropertySummary(product)}</p>
						<p class="text-xs uppercase tracking-wide text-slate-400">{formatDate(product.expiresAt)}</p>

						<div class="flex flex-wrap gap-2">
							<button
								class="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
								type="button"
								onclick={() => void store.selectProduct(product._id)}
								disabled={$store.detailsLoading}
							>
								{$store.detailsLoading && $store.form.id === product._id ? 'Cargando...' : 'Cargar detalle'}
							</button>
							<button
								class="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700"
								type="button"
								onclick={() => void store.deleteProduct(product._id)}
								disabled={$store.deleting}
							>
								{$store.deleting ? 'Eliminando...' : 'Eliminar'}
							</button>
						</div>
					</article>
				{/each}
			</div>
		</section>
	</Card.Content>
</Card.Root>