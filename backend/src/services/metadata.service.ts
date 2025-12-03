import * as cheerio from 'cheerio';

export interface DAppMetadata {
	title: string | null;
	description: string | null;
}

export interface DomainWhoisData {
	domainCreatedAt: Date | null;
	expireDate: string | null;
	registrar: string | null;
}

/**
 * Fetch metadata (title, description) from a DApp website
 */
export async function getDAppMetadata(url: string): Promise<DAppMetadata> {
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; MandatSecurityBot/1.0)',
			},
			signal: AbortSignal.timeout(10000), // 10 second timeout
		});

		if (!response.ok) {
			console.warn(`Failed to fetch ${url}: HTTP ${response.status}`);
			return { title: null, description: null };
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		const title =
			$('title').text().trim() ||
			$('meta[property="og:title"]').attr('content') ||
			$('meta[name="twitter:title"]').attr('content') ||
			null;

		const description =
			$('meta[name="description"]').attr('content') ||
			$('meta[property="og:description"]').attr('content') ||
			$('meta[name="twitter:description"]').attr('content') ||
			null;

		return { title, description };
	} catch (error) {
		console.error(`Failed to fetch metadata for ${url}:`, error);
		return { title: null, description: null };
	}
}

/**
 * Fetch domain age and WHOIS data from IP2Location API
 */
export async function getDomainWhoisData(
	domain: string
): Promise<DomainWhoisData> {
	const apiKey = process.env.IP2LOCATION_API_KEY;

	if (!apiKey) {
		console.warn('IP2LOCATION_API_KEY not set, skipping domain age fetch');
		return {
			domainCreatedAt: null,
			expireDate: null,
			registrar: null,
		};
	}

	try {
		const response = await fetch(
			`https://api.ip2whois.com/v2?key=${apiKey}&domain=${domain}`,
			{
				signal: AbortSignal.timeout(5000), // 5 second timeout
			}
		);

		if (!response.ok) {
			console.warn(
				`Failed to fetch WHOIS data for ${domain}: HTTP ${response.status}`
			);
			return {
				domainCreatedAt: null,
				expireDate: null,
				registrar: null,
			};
		}

		const data = await response.json();

		// Check if domain has valid data (domain_age exists means it's registered)
		// Status can be "registered", "client transfer prohibited", etc.
		if (!data.domain_age && !data.create_date) {
			console.warn(`Domain ${domain} has no registration data available`);
			return {
				domainCreatedAt: null,
				expireDate: null,
				registrar: null,
			};
		}

		return {
			domainCreatedAt: data.create_date
				? new Date(data.create_date)
				: null,
			expireDate: data.expire_date || null,
			registrar: data.registrar?.name || null,
		};
	} catch (error) {
		console.error(`Failed to fetch WHOIS data for ${domain}:`, error);
		return {
			domainCreatedAt: null,
			expireDate: null,
			registrar: null,
		};
	}
}
