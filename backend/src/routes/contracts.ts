import { Hono } from 'hono';
import prisma from '../lib/db.js';
import { ChainId, getNewContractInfo } from '../lib/explorer.js';
import { analyzeContractWithAI } from '../services/ai-analysis.service.js';

const contracts = new Hono();

// Get Contract with Security Analysis
// Query Params: address (required), chainId (optional), model (optional)
contracts.get('/', async (c) => {
	const address = c.req.query('address');
	const chainId = (
		c.req.query('chainId')
			? Number(c.req.query('chainId'))
			: ChainId.MantleMainnet
	) as ChainId;
	const model = c.req.query('model') || 'gpt-4-turbo-preview';

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

		// Always fetch current balance
		const currentBalance = await getNewContractInfo(address, chainId).then(
			(info) => info.balance
		);

		if (!contract) {
			// GET CONTRACT INFO FROM EXPLORER API
			const newContractInfo = await getNewContractInfo(address, chainId);

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
					createdAt: new Date(
						parseInt(newContractInfo.creator.timestamp) * 1000
					),
				},
				include: {
					analyses: true,
					userReports: true,
				},
			});

			// ANALYZE CONTRACT (only if verified)
			let analysis = null;
			if (
				newContractInfo.isVerified &&
				contract.sourceCode &&
				contract.abi
			) {
				try {
					const aiAnalysis = await analyzeContractWithAI(
						{
							id: contract.id,
							address: contract.address,
							chainId: contract.chainId,
							name: contract.name,
							verified: contract.verified,
							sourceCode: contract.sourceCode,
							abi: JSON.stringify(contract.abi),
							compilerVersion: contract.compilerVersion,
							optimizationUsed: contract.optimizationUsed,
							runs: contract.runs,
							constructorArgs: contract.constructorArgs,
							createdAt: contract.createdAt,
							updatedAt: contract.updatedAt,
							creatorAddress: contract.creatorAddress,
						},
						model
					);

					// Save analysis to database
					analysis = await prisma.securityAnalysis.create({
						data: {
							contractId: contract.id,
							version: 1,
							riskLevel: aiAnalysis.riskLevel,
							summary: aiAnalysis.summary,
							detailedAnalysis: aiAnalysis.detailedAnalysis,
							isHoneypot: aiAnalysis.isHoneypot,
							hasUnlimitedMint: aiAnalysis.hasUnlimitedMint,
							hasHiddenFees: aiAnalysis.hasHiddenFees,
							hasBlacklist: aiAnalysis.hasBlacklist,
							isUpgradeable: aiAnalysis.isUpgradeable,
							ownerCanPause: aiAnalysis.ownerCanPause,
							ownerCanDrain: aiAnalysis.ownerCanDrain,
							functionAnalysis: aiAnalysis.functionAnalysis,
							vulnerabilities: aiAnalysis.vulnerabilities,
							externalCalls: aiAnalysis.externalCalls,
							aiModel: aiAnalysis.aiModel,
							analysisTime: Math.floor(
								aiAnalysis.analysisTime.getTime()
							),
						},
					});
				} catch (error) {
					console.error('AI analysis failed:', error);
					// Continue without analysis - don't fail the whole request
				}
			}

			return c.json({
				success: true,
				data: {
					contract,
					balance: newContractInfo.balance,
					latestAnalysis: analysis,
					reports: [],
				},
				message: analysis
					? 'Contract analyzed successfully'
					: 'Contract added but not analyzed',
			});
		}

		return c.json({
			success: true,
			data: {
				contract,
				balance: currentBalance,
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
