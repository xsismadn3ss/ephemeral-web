export type ProductPropertyValue = string | boolean;

export interface ProductProperty {
	name: string;
	value: ProductPropertyValue;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	properties: ProductProperty[];
	sold?: boolean;
	expiresAt: string | null;
}

export interface ProductInput {
	name: string;
	description: string;
	price: number;
	properties: ProductProperty[];
}

export interface ProductFormProperty {
	name: string;
	value: string;
}

export interface ProductFormState {
	id: string | null;
	name: string;
	description: string;
	price: string;
	properties: ProductFormProperty[];
}

export const createEmptyProductForm = (): ProductFormState => ({
	id: null,
	name: '',
	description: '',
	price: '',
	properties: [{ name: '', value: '' }]
});

export function productToFormState(product: Product): ProductFormState {
	return {
		id: product._id,
		name: product.name,
		description: product.description,
		price: String(product.price),
		properties:
			product.properties.length > 0
				? product.properties.map((property) => ({
					name: property.name,
					value: String(property.value)
				}))
				: [{ name: '', value: '' }]
	};
}

export function formStateToProductInput(form: ProductFormState): ProductInput {
	const price = Number(form.price);

	if (!form.name.trim()) {
		throw new Error('El nombre del producto es obligatorio.');
	}

	if (!form.description.trim()) {
		throw new Error('La descripcion del producto es obligatoria.');
	}

	if (!Number.isFinite(price)) {
		throw new Error('El precio debe ser un numero valido.');
	}

	return {
		name: form.name.trim(),
		description: form.description.trim(),
		price,
		properties: form.properties
			.filter((property) => property.name.trim() && property.value.trim())
			.map((property) => ({
				name: property.name.trim(),
				value: parseProductPropertyValue(property.value)
			}))
	};
}

function parseProductPropertyValue(value: string): ProductPropertyValue {
	const normalizedValue = value.trim().toLowerCase();

	if (normalizedValue === 'true') {
		return true;
	}

	if (normalizedValue === 'false') {
		return false;
	}

	return value.trim();
}