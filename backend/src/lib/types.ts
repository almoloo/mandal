export interface GetContractCreatorResponse {
	contractAddress: string;
	contractCreator: string;
	txHash: string;
	blockNumber: string;
	timestamp: string;
	contractFactory: string;
	creationBytecode: string;
}

export interface GetContractSourceCodeResponse {
	SourceCode: string;
	ABI: string;
	ContractName: string;
	CompilerVersion: string;
	CompilerType: string;
	OptimizationUsed: string;
	Runs: string;
	ConstructorArguments: string;
	EVMVersion: string;
	Library: string;
	ContractFileName: string;
	LicenseType: string;
	Proxy: string;
	Implementation: string;
	SwarmSource: string;
	SimilarMatch: string;
}

export interface GenerateContractAnalysisPromptArgs {
	id: string;
	address: string;
	chainId: number;
	name: string | null;
	verified: boolean;
	sourceCode: string;
	abi: string;
	compilerVersion: string | null;
	optimizationUsed: boolean | null;
	runs: number | null;
	constructorArgs: string | null;
	createdAt: Date;
	updatedAt: Date;
	creatorAddress: string | null;
}

export enum RiskLevel {
	Low = 'Low',
	Medium = 'Medium',
	High = 'High',
	Critical = 'Critical',
}

export interface SecurityAnalysisResult {
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
		description: string;
		severity: RiskLevel;
		recommendation: string;
	}[];
	externalCalls: {
		target: string;
		functionSignature: string;
	}[];
	aiModel: string;
	analysisTime: Date;
}
