import { useEffect, useState } from 'react';
import { checkUrl, getChainIdFromUrlType } from '../lib/utils';
import type { UrlType } from '../lib/types';

export function useCurrentTab() {
	const [currentUrl, setCurrentUrl] = useState<string | null>(null);
	const [currentUrlType, setCurrentUrlType] = useState<UrlType>('OTHER');
	const [chainId, setChainId] = useState<number | null>(null);

	useEffect(() => {
		const getCurrentTab = async () => {
			const [tab] = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (tab?.url) {
				setCurrentUrl(tab.url);
			}
		};

		getCurrentTab();
	}, []);

	useEffect(() => {
		if (!currentUrl) return;

		setCurrentUrl(currentUrl);
		setCurrentUrlType(checkUrl(currentUrl));
		if (checkUrl(currentUrl) !== 'OTHER') {
			const chainId = getChainIdFromUrlType(checkUrl(currentUrl));
			setChainId(chainId);
		}
	}, [currentUrl]);

	return { currentUrl, currentUrlType, chainId };
}
