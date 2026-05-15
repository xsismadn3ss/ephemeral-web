import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';

export const apiClient = axios.create({
	baseURL: import.meta.env.PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});