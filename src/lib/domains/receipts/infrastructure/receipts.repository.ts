import { apiClient } from '$lib/shared/http/api-client.js';

import type { Product } from '$lib/domains/products/domain/product.js';
import type { MessageOutput, Receipt } from '../domain/receipt.js';

const RECEIPTS_PATH = '/receipts';

export class ReceiptsRepository {
	async list(): Promise<Receipt[]> {
		const response = await apiClient.get<Receipt[]>(`${RECEIPTS_PATH}/`);
		return response.data;
	}

	async getById(receiptId: string): Promise<Receipt> {
		const response = await apiClient.get<Receipt>(`${RECEIPTS_PATH}/${receiptId}`);
		return response.data;
	}

	async create(products: Product[]): Promise<MessageOutput> {
		const response = await apiClient.post<MessageOutput>(`${RECEIPTS_PATH}/`, { products });
		return response.data;
	}
}