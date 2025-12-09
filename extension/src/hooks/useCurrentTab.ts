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

	// useEffect(() => {
	// 	getCurrentTab();

	// 	const messageListener = (
	// 		message: {
	// 			type: string;
	// 			url: string;
	// 			chainId: number | null;
	// 		},
	// 		_sender: chrome.runtime.MessageSender,
	// 		_sendResponse: (response?: any) => void
	// 	): boolean | undefined => {
	// 		if (message.type === 'TAB_UPDATED') {
	// 			setCurrentUrl(message.url);
	// 			setCurrentUrlType(checkUrl(message.url));
	// 			if (checkUrl(message.url) !== 'OTHER') {
	// 				const chainId = getChainIdFromUrlType(
	// 					checkUrl(message.url)
	// 				);
	// 				setChainId(chainId);
	// 			}
	// 		}
	// 		return undefined;
	// 	};

	// 	chrome.runtime.onMessage.addListener(messageListener);

	// 	return () => {
	// 		chrome.runtime.onMessage.removeListener(messageListener);
	// 	};
	// }, []);

	return { currentUrl, currentUrlType, chainId };
}
