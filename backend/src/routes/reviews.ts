import { Hono } from 'hono';
import prisma from '../lib/db.js';

const reviews = new Hono();

// Get reviews
reviews.get('/', async (c) => {
	const contractAddress = c.req.query('contractAddress');
	const dappUrl = c.req.query('dappUrl');
	const status = c.req.query('status') || 'APPROVED';

	if (!contractAddress && !dappUrl) {
		return c.json(
			{
				success: false,
				error: 'Either contractAddress or dappUrl is required',
			},
			400
		);
	}

	try {
		const where: any = {
			status,
		};

		if (contractAddress) {
			const contract = await prisma.contract.findFirst({
				where: { address: contractAddress.toLowerCase() },
			});
			if (contract) {
				where.contractId = contract.id;
			}
		}

		if (dappUrl) {
			const dapp = await prisma.dApp.findUnique({
				where: { url: dappUrl },
			});
			if (dapp) {
				where.dappId = dapp.id;
			}
		}

		const reports = await prisma.userReport.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			include: {
				contract: {
					select: { address: true, name: true },
				},
				dapp: {
					select: { url: true, title: true },
				},
			},
		});

		return c.json({
			success: true,
			data: reports,
		});
	} catch (error) {
		console.error('Error fetching reviews:', error);
		return c.json(
			{ success: false, error: 'Failed to fetch reviews' },
			500
		);
	}
});

// Submit review
reviews.post('/', async (c) => {
	try {
		const body = await c.req.json();
		const {
			contractAddress,
			dappUrl,
			reportType,
			severity,
			title,
			description,
			userAddress,
		} = body;

		if (!title || !description || !reportType) {
			return c.json(
				{
					success: false,
					error: 'Title, description, and reportType are required',
				},
				400
			);
		}

		if (!contractAddress && !dappUrl) {
			return c.json(
				{
					success: false,
					error: 'Either contractAddress or dappUrl is required',
				},
				400
			);
		}

		const data: any = {
			reportType,
			severity,
			title,
			description,
			userAddress,
		};

		// Find or create contract
		if (contractAddress) {
			let contract = await prisma.contract.findFirst({
				where: { address: contractAddress.toLowerCase() },
			});

			if (!contract) {
				contract = await prisma.contract.create({
					data: {
						address: contractAddress.toLowerCase(),
						chainId: 5000, // Default Mantle mainnet
					},
				});
			}
			data.contractId = contract.id;
		}

		// Find or create dapp
		if (dappUrl) {
			let dapp = await prisma.dApp.findUnique({
				where: { url: dappUrl },
			});

			if (!dapp) {
				const domain = new URL(dappUrl).hostname;
				dapp = await prisma.dApp.create({
					data: {
						url: dappUrl,
						domain,
					},
				});
			}
			data.dappId = dapp.id;
		}

		const report = await prisma.userReport.create({
			data,
		});

		return c.json(
			{
				success: true,
				message: 'Review submitted successfully',
				data: report,
			},
			201
		);
	} catch (error) {
		console.error('Error submitting review:', error);
		return c.json(
			{ success: false, error: 'Failed to submit review' },
			500
		);
	}
});

export default reviews;
