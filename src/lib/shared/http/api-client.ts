import axios from 'axios';
import { env } from '$env/dynamic/public';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';

const API_BASE_URL = env.VITE_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});
