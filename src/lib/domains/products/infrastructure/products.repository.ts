import { apiClient } from '$lib/shared/http/api-client.js';

import type { Product, ProductInput } from '../domain/product.js';

const PRODUCTS_PATH = '/products';

export class ProductsRepository {
	async list(): Promise<Product[]> {
		const response = await apiClient.get<Product[]>(`${PRODUCTS_PATH}/`);
		return response.data;
	}

	async getById(productId: string): Promise<Product> {
		const response = await apiClient.get<Product>(`${PRODUCTS_PATH}/${productId}`);
		return response.data;
	}

	async create(payload: ProductInput): Promise<void> {
		await apiClient.post(`${PRODUCTS_PATH}/`, payload);
	}

	async update(productId: string, payload: ProductInput): Promise<void> {
		await apiClient.put(`${PRODUCTS_PATH}/${productId}`, payload);
	}

	async remove(productId: string): Promise<void> {
		await apiClient.delete(`${PRODUCTS_PATH}/${productId}`);
	}
}