import type { UrlType } from './types';

export function checkUrl(url: string) {
	const MANTLE_EXPLORER_ORIGIN = 'https://mantlescan.xyz';
	const MANTLE_SEPOLIA_EXPLORER_ORIGIN = 'https://sepolia.mantlescan.xyz';

	const parsedUrl = new URL(url);
	let urlType: UrlType;
	switch (parsedUrl.origin) {
		case MANTLE_EXPLORER_ORIGIN:
			urlType = 'MANTLE_MAINNET_EXPLORER';
			break;
		case MANTLE_SEPOLIA_EXPLORER_ORIGIN:
			urlType = 'MANTLE_SEPOLIA_EXPLORER';
			break;
		default:
			urlType = 'OTHER';
			break;
	}

	return urlType;
}

export function getChainIdFromUrlType(urlType: UrlType): number | null {
	switch (urlType) {
		case 'MANTLE_MAINNET_EXPLORER':
			return 5000;
		case 'MANTLE_SEPOLIA_EXPLORER':
			return 5003;
		default:
			return null;
	}
}

export function getContractAddressFromUrl(url: string): string | null {
	const parsedUrl = new URL(url);
	const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
	if (pathSegments.length > 1 && pathSegments[0] === 'address') {
		return pathSegments[1];
	}
	return null;
}
