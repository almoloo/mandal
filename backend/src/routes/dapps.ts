import { Hono } from 'hono';
import prisma from '../lib/db.js';

const dapps = new Hono();

// Get DApp with connected contracts
dapps.get('/', async (c) => {
	const url = c.req.query('url');

	if (!url) {
		return c.json({ success: false, error: 'URL is required' }, 400);
	}

	try {
		const dapp = await prisma.dApp.findUnique({
			where: { url },
			include: {
				connectedContracts: {
					include: {
						contract: {
							include: {
								analyses: {
									orderBy: { createdAt: 'desc' },
									take: 1,
								},
							},
						},
					},
				},
				userReports: {
					where: { status: 'APPROVED' },
					orderBy: { createdAt: 'desc' },
					take: 10,
				},
			},
		});

		if (!dapp) {
			return c.json({
				success: true,
				data: null,
				message: 'DApp not found in database',
			});
		}

		return c.json({
			success: true,
			data: dapp,
		});
	} catch (error) {
		console.error('Error fetching DApp:', error);
		return c.json({ success: false, error: 'Failed to fetch DApp' }, 500);
	}
});

export default dapps;
