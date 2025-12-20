export type UrlType =
	| 'MANTLE_MAINNET_EXPLORER'
	| 'MANTLE_SEPOLIA_EXPLORER'
	| 'OTHER';

export const RiskLevel = {
	Low: 'Low',
	Medium: 'Medium',
	High: 'High',
	Critical: 'Critical',
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export interface Contract {
	id: string;
	address: string;
	chainId: number;
	name: string | null;
	verified: boolean;
	sourceCode: string | null;
	abi: any | null;
	compilerVersion: string | null;
	optimizationUsed: boolean | null;
	runs: number | null;
	constructorArgs: string | null;
	createdAt: Date;
	updatedAt: Date;
	creatorAddress: string | null;
}

export interface ContractAnalysis {
	id: string;
	contractId: string;
	version: number;
	riskLevel: RiskLevel;
	summary: string;
	detailedAnalysis: string;
	isHoneypot: boolean;
	hasUnlimitedMint: boolean;
	hasHiddenFees: boolean;
	hasBlacklist: boolean;
	isUpgradeable: boolean;
	ownerCanPause: boolean;
	ownerCanDrain: boolean;
	functionAnalysis: {
		functionName: string;
		issues: string[];
	}[];
	vulnerabilities: {
		name: string;
		severity: RiskLevel;
		description: string;
		recommendation: string;
	}[];
	externalCalls: {
		target: string;
		functionSignature: string;
	}[];
	aiModel: string;
	analysisTime: Date;
	createdAt: Date;
}

// TODO: Define properties of ContractReport
export interface ContractReport {
	id: string;
	contractId: string | null;
	dappId: string | null;
	reportType: string;
	severity: string | null;
	title: string;
	description: string;
	userAddress: string | null;
	userEmail: string | null;
	isVerified: boolean;
	status: string;
	moderatedAt: Date | null;
	moderatorNotes: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface ContractResponse {
	contract: Contract;
	compilerVersion: string;
	optimizationUsed: boolean;
	runs: number | null;
	constructorArgs: string | null;
	createdAt: Date;
	updatedAt: Date;
	creatorAddress: string;
	analyses: ContractAnalysis[];
	balance: string;
	latestAnalysis: ContractAnalysis | null;
	reports: ContractReport[];
}

export const ReportTypes = {
	SCAM: 'SCAM',
	PHISHING: 'PHISHING',
	HONEYPOT: 'HONEYPOT',
	RUG_PULL: 'RUG_PULL',
	SECURITY: 'SECURITY',
	BUG: 'BUG',
	SUSPICIOUS: 'SUSPICIOUS',
	MALICIOUS: 'MALICIOUS',
	OTHER: 'OTHER',
} as const;

export type ReportType = (typeof ReportTypes)[keyof typeof ReportTypes];

export const ReportTypeLabels: Record<ReportType, string> = {
	SCAM: 'Scam',
	PHISHING: 'Phishing Attempt',
	HONEYPOT: 'Honeypot',
	RUG_PULL: 'Rug Pull',
	SECURITY: 'Security Vulnerability',
	BUG: 'Bug Report',
	SUSPICIOUS: 'Suspicious Activity',
	MALICIOUS: 'Malicious Contract',
	OTHER: 'Other',
};
