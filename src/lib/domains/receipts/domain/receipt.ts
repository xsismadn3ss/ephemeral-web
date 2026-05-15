import type { Product } from '$lib/domains/products/domain/product.js';

export interface ProductMinified {
	_id: string;
	name: string;
	price: number;
}

export interface Receipt {
	_id: string;
	products_data: ProductMinified[];
	total: number;
	date: string;
	hash: string | null;
}

export interface ReceiptInput {
	products: Product[];
}

export interface MessageOutput {
	message: string;
}