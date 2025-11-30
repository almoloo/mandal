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
