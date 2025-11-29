import { Hono } from 'hono';
import prisma from '../lib/db.js';

const contracts = new Hono();

// Get Contract with Security Analysis
// Query Params: address (required), chainId (optional)
contracts.get('/', async (c) => {
	const address = c.req.query('address');
	const chainId = c.req.query('chainId');

	if (!address) {
		return c.json(
			{ success: false, error: 'Contract address is required' },
			400
		);
	}

	try {
		// Find or create contract
		let contract = await prisma.contract.findFirst({
			where: {
				address: address.toLowerCase(),
				chainId: chainId ? parseInt(chainId) : undefined,
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

		if (!contract) {
			// Contract not in DB yet - will need to fetch from Etherscan/Mantle
			return c.json({
				success: true,
				data: null,
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
