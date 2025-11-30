import { Hono } from 'hono';
import prisma from '../lib/db.js';
import { ChainId, getNewContractInfo } from '../lib/explorer.js';

const contracts = new Hono();

// Get Contract with Security Analysis
// Query Params: address (required), chainId (optional)
contracts.get('/', async (c) => {
	const address = c.req.query('address');
	const chainId = (
		c.req.query('chainId')
			? Number(c.req.query('chainId'))
			: ChainId.MantleMainnet
	) as ChainId;

	if (!address) {
		return c.json(
			{ success: false, error: 'Contract address is required' },
			400
		);
	}

	async function fetchContractFromDB(address: string, chainId: ChainId) {
		return await prisma.contract.findFirst({
			where: {
				address: address.toLowerCase(),
				chainId: Number(chainId),
			},
			include: {
				analyses: {
					orderBy: { createdAt: 'desc' },
					take: 1,
				},
				userReports: {
					where: { status: 'APPROVED' },
					orderBy: { createdAt: 'desc' },
					take: 10,
				},
			},
		});
	}

	try {
		let contract = await fetchContractFromDB(address, chainId);

		if (!contract) {
			// GET CONTRACT INFO FROM EXPLORER API
			const newContractInfo = await getNewContractInfo(address, chainId);

			// GET CONTRACT INFO FROM

			// ANALYZE CONTRACT

			// Add contract to DB
			contract = await prisma.contract.create({
				data: {
					address: address.toLowerCase(),
					chainId: Number(chainId),
					name: newContractInfo.sourceCode['ContractName'] || null,
					verified: newContractInfo.isVerified,
					sourceCode:
						newContractInfo.sourceCode['SourceCode'] || null,
					abi: newContractInfo.isVerified
						? JSON.parse(newContractInfo.sourceCode['ABI'])
						: null,
					compilerVersion:
						newContractInfo.sourceCode['CompilerVersion'] || null,
					optimizationUsed:
						newContractInfo.sourceCode['OptimizationUsed'] === '1',
					runs: newContractInfo.sourceCode['Runs']
						? parseInt(newContractInfo.sourceCode['Runs'])
						: null,
					constructorArgs:
						newContractInfo.sourceCode['ConstructorArguments'] ||
						null,
					creatorAddress: newContractInfo.creator.contractCreator,
				},
				include: {
					analyses: true,
					userReports: true,
				},
			});

			return c.json({
				success: true,
				data: null,
				temp: contract,
				message: 'Contract not analyzed yet',
			});
		}

		return c.json({
			success: true,
			data: {
				contract,
				latestAnalysis: contract.analyses[0] || null,
				reports: contract.userReports,
			},
		});
	} catch (error) {
		console.error('Error fetching contract:', error);
		return c.json(
			{ success: false, error: 'Failed to fetch contract' },
			500
		);
	}
});

export default contracts;
