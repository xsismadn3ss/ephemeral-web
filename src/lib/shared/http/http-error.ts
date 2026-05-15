import axios from 'axios';

export function getHttpErrorMessage(error: unknown, fallback: string): string {
	if (axios.isAxiosError(error)) {
		return error.response?.data?.detail?.[0]?.msg ?? error.response?.data?.message ?? error.message ?? fallback;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallback;
}