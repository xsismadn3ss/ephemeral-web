import { get, writable } from 'svelte/store';

import {
	createEmptyProductForm,
	formStateToProductInput,
	productToFormState,
	type Product,
	type ProductFormProperty,
	type ProductFormState
} from '../domain/product.js';
import { ProductsRepository } from '../infrastructure/products.repository.js';
import { getHttpErrorMessage } from '$lib/shared/http/http-error.js';

interface ProductsState {
	items: Product[];
	form: ProductFormState;
	selectedProduct: Product | null;
	loading: boolean;
	detailsLoading: boolean;
	submitting: boolean;
	deleting: boolean;
	error: string | null;
	message: string | null;
}

const initialState = (): ProductsState => ({
	items: [],
	form: createEmptyProductForm(),
	selectedProduct: null,
	loading: false,
	detailsLoading: false,
	submitting: false,
	deleting: false,
	error: null,
	message: null
});

export function createProductsStore(repository = new ProductsRepository()) {
	const store = writable<ProductsState>(initialState());

	async function load() {
		store.update((state) => ({ ...state, loading: true, error: null }));

		try {
			const items = await repository.list();
			store.update((state) => ({ ...state, items, loading: false }));
		} catch (error) {
			store.update((state) => ({
				...state,
				loading: false,
				error: getHttpErrorMessage(error, 'No se pudieron cargar los productos.')
			}));
		}
	}

	async function selectProduct(productId: string) {
		store.update((state) => ({ ...state, detailsLoading: true, error: null, message: null }));

		try {
			const product = await repository.getById(productId);
			store.update((state) => ({
				...state,
				selectedProduct: product,
				form: productToFormState(product),
				detailsLoading: false
			}));
		} catch (error) {
			store.update((state) => ({
				...state,
				detailsLoading: false,
				error: getHttpErrorMessage(error, 'No se pudo cargar el detalle del producto.')
			}));
		}
	}

	function resetForm() {
		store.update((state) => ({
			...state,
			form: createEmptyProductForm(),
			selectedProduct: null,
			error: null,
			message: null
		}));
	}

	function setField(field: 'name' | 'description' | 'price', value: string) {
		store.update((state) => ({
			...state,
			form: {
				...state.form,
				[field]: value
			}
		}));
	}

	function addProperty() {
		store.update((state) => ({
			...state,
			form: {
				...state.form,
				properties: [...state.form.properties, { name: '', value: '' }]
			}
		}));
	}

	function updateProperty(index: number, field: keyof ProductFormProperty, value: string) {
		store.update((state) => ({
			...state,
			form: {
				...state.form,
				properties: state.form.properties.map((property, propertyIndex) =>
					propertyIndex === index ? { ...property, [field]: value } : property
				)
			}
		}));
	}

	function removeProperty(index: number) {
		store.update((state) => ({
			...state,
			form: {
				...state.form,
				properties:
					state.form.properties.length === 1
						? [{ name: '', value: '' }]
						: state.form.properties.filter((_, propertyIndex) => propertyIndex !== index)
			}
		}));
	}

	async function saveProduct() {
		const currentState = get(store);

		store.update((state) => ({ ...state, submitting: true, error: null, message: null }));

		try {
			const payload = formStateToProductInput(currentState.form);

			if (currentState.form.id) {
				await repository.update(currentState.form.id, payload);
			} else {
				await repository.create(payload);
			}

			await load();

			store.update((state) => ({
				...state,
				submitting: false,
				message: currentState.form.id
					? 'Producto actualizado correctamente.'
					: 'Producto creado correctamente.',
				form: createEmptyProductForm(),
				selectedProduct: null
			}));
		} catch (error) {
			store.update((state) => ({
				...state,
				submitting: false,
				error: getHttpErrorMessage(error, 'No se pudo guardar el producto.')
			}));
		}
	}

	async function deleteProduct(productId: string) {
		store.update((state) => ({ ...state, deleting: true, error: null, message: null }));

		try {
			await repository.remove(productId);
			await load();

			store.update((state) => ({
				...state,
				deleting: false,
				message: 'Producto eliminado correctamente.',
				selectedProduct:
					state.selectedProduct?._id === productId ? null : state.selectedProduct,
				form: state.form.id === productId ? createEmptyProductForm() : state.form
			}));
		} catch (error) {
			store.update((state) => ({
				...state,
				deleting: false,
				error: getHttpErrorMessage(error, 'No se pudo eliminar el producto.')
			}));
		}
	}

	return {
		subscribe: store.subscribe,
		load,
		selectProduct,
		resetForm,
		setField,
		addProperty,
		updateProperty,
		removeProperty,
		saveProduct,
		deleteProduct
	};
}

export type ProductsStore = ReturnType<typeof createProductsStore>;