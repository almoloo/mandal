import { useEffect, useState } from 'preact/hooks';

export function useCache<T>(key: string) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const loadCache = async () => {
			try {
				const result = await chrome.storage.local.get(key);
				const cached = result[key] as T | undefined;

				if (cached) {
					setData(cached);
				}
			} catch (error) {
				console.error('Failed to load cache:', error);
			} finally {
				setLoading(false);
			}
		};

		loadCache();
	}, [key]);

	const save = async (value: T) => {
		await chrome.storage.local.set({ [key]: value });
		setData(value);
	};

	const clear = async () => {
		await chrome.storage.local.remove(key);
		setData(null);
	};

	return { data, loading, save, clear };
}
