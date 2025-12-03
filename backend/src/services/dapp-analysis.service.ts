import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export interface DAppAnalysisArgs {
	url: string;
	domain: string;
	title?: string;
	description?: string;
	connectedContracts?: {
		address: string;
		name?: string;
		verified: boolean;
		latestAnalysis?: {
			riskLevel: string;
			summary: string;
			isHoneypot?: boolean;
			hasHiddenFees?: boolean;
		};
	}[];
}

export interface DAppAnalysisResult {
	overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
	summary: string;
	detailedAnalysis: string;
	domainTrustScore: number; // 0-100
	sslValid: boolean;
	isPhishing: boolean;
	suspiciousPatterns: string[];
	recommendations: string[];
	contractRisks?: {
		address: string;
		riskLevel: string;
		concerns: string[];
	}[];
}

export function generateDAppAnalysisPrompt(dapp: DAppAnalysisArgs): string {
	return `
Analyze this decentralized application (DApp) website for security and trustworthiness.

DAPP DETAILS:
- URL: ${dapp.url}
- Domain: ${dapp.domain}
- Title: ${dapp.title || 'Unknown'}
- Description: ${dapp.description || 'Not provided'}

CONNECTED SMART CONTRACTS:
${
	dapp.connectedContracts && dapp.connectedContracts.length > 0
		? dapp.connectedContracts
				.map((contract) => {
					return `
- Address: ${contract.address}
  Name: ${contract.name || 'Unknown'}
  Verified: ${contract.verified}
  ${
		contract.latestAnalysis
			? `Risk Level: ${contract.latestAnalysis.riskLevel}
  Summary: ${contract.latestAnalysis.summary}
  Honeypot: ${contract.latestAnalysis.isHoneypot ? 'Yes' : 'No'}
  Hidden Fees: ${contract.latestAnalysis.hasHiddenFees ? 'Yes' : 'No'}`
			: 'No security analysis available'
  }
`;
				})
				.join('\n')
		: 'No contracts connected or provided'
}

ANALYSIS REQUIREMENTS:
Perform a comprehensive security analysis of this DApp and return a JSON object with the following structure:

{
  "overallRisk": "Low" | "Medium" | "High" | "Critical",
  "summary": "A 2-3 sentence overview of the DApp's trustworthiness and security status",
  "detailedAnalysis": "Comprehensive analysis including domain reputation, contract security implications, and overall user safety assessment",
  "domainTrustScore": number (0-100, where 100 is most trustworthy),
  "sslValid": boolean (assume true for https, false for http),
  "isPhishing": boolean (does this appear to be a phishing site or impersonating a known DApp?),
  "suspiciousPatterns": [
    "array of suspicious patterns detected (e.g., 'Suspicious domain similarity to popular DApp', 'Requests excessive permissions', 'Unverified contracts')"
  ],
  "recommendations": [
    "array of security recommendations for users (e.g., 'Verify contract addresses', 'Use small test amounts first', 'Enable wallet security features')"
  ],
  "contractRisks": [
    {
      "address": "contract address",
      "riskLevel": "Low" | "Medium" | "High" | "Critical",
      "concerns": ["array of specific concerns about this contract"]
    }
  ]
}

Focus on:
- Domain reputation and potential phishing indicators
- SSL/HTTPS security
- Connected contract security analysis
- Overall user safety assessment
- Red flags in domain name or website behavior
- Comparison to known legitimate DApps
- Aggregated risk from all connected contracts

Return ONLY valid JSON, no additional text.
`;
}

export async function analyzeDAppWithAI(
	dapp: DAppAnalysisArgs,
	model: string = 'gpt-4o'
): Promise<DAppAnalysisResult> {
	try {
		const prompt = generateDAppAnalysisPrompt(dapp);

		const response = await openai.chat.completions.create({
			model,
			messages: [
				{
					role: 'system',
					content:
						'You are an expert web security analyst specializing in decentralized applications and blockchain security. Analyze DApps for security risks, phishing patterns, and overall trustworthiness. Return results in valid JSON format only.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			response_format: { type: 'json_object' },
			temperature: 0.3,
			max_tokens: 2048,
		});

		const content = response.choices[0].message.content;
		if (!content) {
			throw new Error('No content in OpenAI response');
		}

		const analysisResult = JSON.parse(content);

		return {
			overallRisk: analysisResult.overallRisk,
			summary: analysisResult.summary,
			detailedAnalysis: analysisResult.detailedAnalysis,
			domainTrustScore: analysisResult.domainTrustScore,
			sslValid: analysisResult.sslValid,
			isPhishing: analysisResult.isPhishing,
			suspiciousPatterns: analysisResult.suspiciousPatterns,
			recommendations: analysisResult.recommendations,
			contractRisks: analysisResult.contractRisks,
		};
	} catch (error) {
		console.error('Error analyzing DApp with AI:', error);
		throw new Error(
			`DApp analysis failed: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
}
