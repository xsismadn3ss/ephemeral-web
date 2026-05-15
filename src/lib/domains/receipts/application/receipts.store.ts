import { writable } from 'svelte/store';

import type { Product } from '$lib/domains/products/domain/product.js';
import { getHttpErrorMessage } from '$lib/shared/http/http-error.js';

import type { Receipt } from '../domain/receipt.js';
import { ReceiptsRepository } from '../infrastructure/receipts.repository.js';

interface ReceiptsState {
	items: Receipt[];
	selectedReceipt: Receipt | null;
	loading: boolean;
	detailsLoading: boolean;
	submitting: boolean;
	error: string | null;
	message: string | null;
}

const initialState = (): ReceiptsState => ({
	items: [],
	selectedReceipt: null,
	loading: false,
	detailsLoading: false,
	submitting: false,
	error: null,
	message: null
});

export function createReceiptsStore(repository = new ReceiptsRepository()) {
	const store = writable<ReceiptsState>(initialState());

	async function load() {
		store.update((state) => ({ ...state, loading: true, error: null }));

		try {
			const items = await repository.list();
			store.update((state) => ({ ...state, items, loading: false }));
		} catch (error) {
			store.update((state) => ({
				...state,
				loading: false,
				error: getHttpErrorMessage(error, 'No se pudieron cargar los recibos.')
			}));
		}
	}

	async function selectReceipt(receiptId: string) {
		store.update((state) => ({ ...state, detailsLoading: true, error: null, message: null }));

		try {
			const receipt = await repository.getById(receiptId);
			store.update((state) => ({
				...state,
				selectedReceipt: receipt,
				detailsLoading: false
			}));
		} catch (error) {
			store.update((state) => ({
				...state,
				detailsLoading: false,
				error: getHttpErrorMessage(error, 'No se pudo cargar el detalle del recibo.')
			}));
		}
	}

	async function createReceipt(products: Product[]) {
		if (products.length === 0) {
			store.update((state) => ({
				...state,
				error: 'Selecciona al menos un producto para generar el recibo.',
				message: null
			}));
			return false;
		}

		store.update((state) => ({ ...state, submitting: true, error: null, message: null }));

		try {
			const result = await repository.create(products);
			await load();
			store.update((state) => ({
				...state,
				submitting: false,
				message: result.message
			}));
			return true;
		} catch (error) {
			store.update((state) => ({
				...state,
				submitting: false,
				error: getHttpErrorMessage(error, 'No se pudo crear el recibo.')
			}));
			return false;
		}
	}

	return {
		subscribe: store.subscribe,
		load,
		selectReceipt,
		createReceipt
	};
}

export type ReceiptsStore = ReturnType<typeof createReceiptsStore>;