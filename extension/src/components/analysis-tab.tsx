import type { ContractAnalysis } from '@/lib/types';
import { useState } from 'react';
import WarningsBox from '@/components/analysis/warnings-box';
import VulItem from '@/components/analysis/vul-item';
import Heading from '@/components/analysis/heading';
import FuncItem from '@/components/analysis/func-item';

export default function AnalysisTab({
	analysis,
}: {
	analysis: ContractAnalysis;
}) {
	const [needToConsider, setNeedToConsider] = useState(false);

	const {
		isHoneypot,
		hasUnlimitedMint,
		hasHiddenFees,
		hasBlacklist,
		isUpgradeable,
		ownerCanPause,
		ownerCanDrain,
	} = analysis;

	if (
		isHoneypot ||
		hasUnlimitedMint ||
		hasHiddenFees ||
		hasBlacklist ||
		isUpgradeable ||
		ownerCanPause ||
		ownerCanDrain
	) {
		setNeedToConsider(true);
	}

	return (
		<div className="flex flex-col gap-3">
			<div>
				<Heading title="Detailed Analysis" />
				<p className="text-sm leading-relaxed">
					{analysis.detailedAnalysis || 'N/A'}
				</p>
			</div>
			{/* ----- WARNINGS ----- */}
			{needToConsider && (
				<WarningsBox
					isHoneypot={isHoneypot}
					hasUnlimitedMint={hasUnlimitedMint}
					hasHiddenFees={hasHiddenFees}
					hasBlacklist={hasBlacklist}
					isUpgradeable={isUpgradeable}
					ownerCanPause={ownerCanPause}
					ownerCanDrain={ownerCanDrain}
				/>
			)}
			{/* ----- VULNERABILITIES ----- */}
			{analysis.vulnerabilities.length > 0 && (
				<div>
					<Heading title="Vulnerabilities" />
					<div className="flex flex-col gap-2">
						{analysis.vulnerabilities.map((vul, index) => (
							<VulItem
								key={index}
								vulnerability={vul}
							/>
						))}
					</div>
				</div>
			)}
			{/* ----- FUNCTION ANALYSIS ----- */}
			{analysis.functionAnalysis.length > 0 && (
				<div>
					<Heading title="Function Analysis" />
					<div className="flex flex-col gap-2">
						{analysis.functionAnalysis.map((func, index) => (
							<FuncItem
								key={index}
								func={func}
							/>
						))}
					</div>
				</div>
			)}
			{/* ----- EXTERNAL CALLS ----- */}
			{analysis.externalCalls.length > 0 && (
				<div>
					<Heading title="External Calls" />
					<div className="flex flex-col gap-2">
						{analysis.externalCalls.map((call, index) => (
							<pre
								key={index}
								className="border-l-4 border-slate-300 bg-slate-300/25 dark:bg-slate-500/25 dark:border-slate-600 p-2"
							>
								<code className="text-xs break-all whitespace-normal">
									{call.functionSignature}
								</code>
							</pre>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
