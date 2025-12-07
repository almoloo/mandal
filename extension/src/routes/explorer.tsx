import { useQuery } from '@tanstack/react-query';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { getContractAddressFromUrl } from '@/lib/utils';
import { useEffect, useState } from 'preact/hooks';
import { API_BASE_URL, DEFAULT_AI_MODEL } from '@/lib/constants';
import type { ContractResponse } from '@/lib/types';

export default function ExplorerView() {
	const { currentUrl, chainId } = useCurrentTab();
	const [address, setAddress] = useState<string | null>(null);
	// const address = getContractAddressFromUrl(currentUrl || '');

	useEffect(() => {
		if (currentUrl) {
			const addr = getContractAddressFromUrl(currentUrl);
			setAddress(addr);
		}
	}, [currentUrl]);

	const { data, dataUpdatedAt, isLoading } = useQuery({
		queryKey: ['contract', address],
		queryFn: async () => {
			// Fetch contract data from API
			const response = await fetch(
				`${API_BASE_URL}/contracts?address=${address}&chainId=${chainId}&model=${DEFAULT_AI_MODEL}`
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const json = await response.json();

			if (!json.success) {
				throw new Error(json.error || 'Failed to fetch contract data');
			}

			return json.data as ContractResponse;
		},
		enabled: !!address && !!chainId,
	});

	return (
		<div>
			ExplorerView
			<div>{currentUrl}</div>
			<div>{chainId}</div>
			{isLoading && <div>Loading...</div>}
			<pre>
				<code>{data?.latestAnalysis?.summary}</code>
			</pre>
			<div>{dataUpdatedAt}</div>
		</div>
	);
}
