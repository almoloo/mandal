import type {
	GetContractCreatorResponse,
	GetContractSourceCodeResponse,
} from './types.js';

enum ChainId {
	MantleMainnet = '5000',
	MantleTestnet = '5003',
}

function generateExplorerApiUrl(
	module: string,
	action: string,
	chainId: ChainId,
	params: Record<string, string>
) {
	const baseUrl = process.env.EXPLORER_BASE_URL;
	const apiKey = process.env.EXPLORER_API_KEY;

	const url = new URL(baseUrl!);
	url.searchParams.append('apikey', apiKey!);
	url.searchParams.append('module', module);
	url.searchParams.append('action', action);
	url.searchParams.append('chainid', chainId);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.append(key, value);
	}

	return url.toString();
}

async function getContractSourceCode(address: string, chainId: ChainId) {
	try {
		const url = generateExplorerApiUrl(
			'contract',
			'getsourcecode',
			chainId,
			{
				address,
			}
		);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Error fetching contract source code: ${response.statusText}`
			);
		}

		const data = await response.json();

		if (data.status !== '1') {
			throw new Error(
				`Error fetching contract source code: ${data.message}`
			);
		}

		if (!data.result || data.result.length === 0) {
			throw new Error('No contract source code found');
		}

		return data.result[0] as GetContractSourceCodeResponse;
	} catch (error) {
		console.error('Error fetching contract source code:', error);
		throw new Error('Failed to fetch contract source code');
	}
}

async function getContractCreator(address: string, chainId: ChainId) {
	try {
		const url = generateExplorerApiUrl(
			'contract',
			'getcontractcreation',
			chainId,
			{
				contractaddresses: address,
			}
		);

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Error fetching contract creator: ${response.statusText}`
			);
		}

		const data = await response.json();

		if (data.status !== '1') {
			throw new Error(`Error fetching contract creator: ${data.message}`);
		}

		if (!data.result || data.result.length === 0) {
			throw new Error('No contract creator found');
		}

		return data.result[0] as GetContractCreatorResponse;
	} catch (error) {
		console.error('Error fetching contract creator:', error);
		throw new Error('Failed to fetch contract creator');
	}
}

async function getContractBalance(address: string, chainId: ChainId) {
	try {
		const url = generateExplorerApiUrl('account', 'balance', chainId, {
			address,
		});

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Error fetching contract balance: ${response.statusText}`
			);
		}

		const data = await response.json();
		if (data.status !== '1') {
			throw new Error(`Error fetching contract balance: ${data.message}`);
		}

		data.result = parseFloat(data.result) / 1e18; // Convert wei to ether
		data.result = data.result.toString();

		return data.result as string;
	} catch (error) {
		console.error('Error fetching contract balance:', error);
		throw new Error('Failed to fetch contract balance');
	}
}

async function getNewContractInfo(address: string, chainId: ChainId) {
	const [sourceCode, creator, balance] = await Promise.all([
		getContractSourceCode(address, chainId),
		getContractCreator(address, chainId),
		getContractBalance(address, chainId),
	]);

	const isVerified =
		sourceCode['SourceCode'] !== '' &&
		sourceCode['ABI'] !== 'Contract source code not verified';

	return {
		sourceCode,
		creator,
		balance,
		isVerified,
	};
}

export {
	getContractSourceCode,
	getContractCreator,
	getContractBalance,
	getNewContractInfo,
	ChainId,
};
