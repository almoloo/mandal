import OpenAI from 'openai';
import type {
	GenerateContractAnalysisPromptArgs,
	RiskLevel,
	SecurityAnalysisResult,
} from '../lib/types.js';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export function generateAnalysisPrompt(
	contract: GenerateContractAnalysisPromptArgs
): string {
	return `
Analyze this Solidity smart contract for security vulnerabilities and provide a comprehensive security audit.

CONTRACT DETAILS:
- Address: ${contract.address}
- Chain ID: ${contract.chainId}
- Name: ${contract.name || 'Unknown'}
- Compiler: ${contract.compilerVersion || 'Unknown'}
- Optimization: ${
		contract.optimizationUsed
			? `Enabled (${contract.runs} runs)`
			: 'Disabled'
	}
- Verified: ${contract.verified}
- Created: ${contract.createdAt.toISOString()}
- Creator: ${contract.creatorAddress || 'Unknown'}

SOURCE CODE:
\`\`\`solidity
${contract.sourceCode}
\`\`\`

ABI:
\`\`\`json
${JSON.stringify(JSON.parse(contract.abi), null, 2)}
\`\`\`

ANALYSIS REQUIREMENTS:
Perform a thorough security analysis and return a JSON object with the following structure:

{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "summary": "A concise 2-3 sentence overview of the contract's security status",
  "detailedAnalysis": "A comprehensive explanation of findings, potential risks, and notable security features",
  "isHoneypot": boolean (Can users sell/transfer tokens or are they trapped?),
  "hasUnlimitedMint": boolean (Can owner mint unlimited tokens?),
  "hasHiddenFees": boolean (Are there hidden transaction fees?),
  "hasBlacklist": boolean (Can addresses be blacklisted?),
  "isUpgradeable": boolean (Is this a proxy or upgradeable contract?),
  "ownerCanPause": boolean (Can owner pause contract operations?),
  "ownerCanDrain": boolean (Can owner drain contract funds?),
  "functionAnalysis": [
    {
      "functionName": "string",
      "issues": ["array of security issues or concerns for this function"]
    }
  ],
  "vulnerabilities": [
    {
      "name": "Vulnerability name (e.g., 'Reentrancy', 'Integer Overflow')",
      "description": "Detailed explanation of the vulnerability",
      "severity": "Low" | "Medium" | "High" | "Critical",
      "recommendation": "How to fix or mitigate this vulnerability"
    }
  ],
  "externalCalls": [
    {
      "target": "contract address or 'external'",
      "functionSignature": "function signature being called"
    }
  ]
}

Focus on:
- Common vulnerabilities (reentrancy, overflow/underflow, access control issues)
- Centralization risks
- Owner privileges and their implications
- Token economics manipulation
- External dependencies and their risks
- Gas optimization issues that might indicate malicious intent

Return ONLY valid JSON, no additional text.
`;
}

export async function analyzeContractWithAI(
	contract: GenerateContractAnalysisPromptArgs,
	model: string = 'gpt-4-turbo-preview'
): Promise<Omit<SecurityAnalysisResult, 'contractId' | 'version'>> {
	const startTime = Date.now();

	try {
		const prompt = generateAnalysisPrompt(contract);

		const response = await openai.chat.completions.create({
			model,
			messages: [
				{
					role: 'system',
					content:
						'You are an expert Solidity smart contract security auditor with deep knowledge of common vulnerabilities, attack vectors, and best practices. Analyze contracts thoroughly and return results in valid JSON format only.',
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			response_format: { type: 'json_object' },
			temperature: 0.3,
			max_tokens: 4096,
		});

		const content = response.choices[0].message.content;
		if (!content) {
			throw new Error('No content in OpenAI response');
		}

		const analysisResult = JSON.parse(content);
		const analysisTime = Date.now() - startTime;

		return {
			riskLevel: analysisResult.riskLevel as RiskLevel,
			summary: analysisResult.summary,
			detailedAnalysis: analysisResult.detailedAnalysis,
			isHoneypot: analysisResult.isHoneypot,
			hasUnlimitedMint: analysisResult.hasUnlimitedMint,
			hasHiddenFees: analysisResult.hasHiddenFees,
			hasBlacklist: analysisResult.hasBlacklist,
			isUpgradeable: analysisResult.isUpgradeable,
			ownerCanPause: analysisResult.ownerCanPause,
			ownerCanDrain: analysisResult.ownerCanDrain,
			functionAnalysis: analysisResult.functionAnalysis,
			vulnerabilities: analysisResult.vulnerabilities,
			externalCalls: analysisResult.externalCalls,
			aiModel: model,
			analysisTime: new Date(analysisTime),
		};
	} catch (error) {
		console.error('Error analyzing contract with AI:', error);
		throw new Error(
			`AI analysis failed: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`
		);
	}
}
