import type { ContractAnalysis } from '@/lib/types';
import RiskLevelBadge from '@/components/analysis/risk-level-badge';

interface VulItemProps {
	vulnerability: ContractAnalysis['vulnerabilities'][number];
}

export default function VulItem({ vulnerability }: VulItemProps) {
	return (
		<div className="border-l-4 border-slate-300 bg-slate-300/25 dark:bg-slate-500/25 dark:border-slate-600 p-2">
			<h3 className="text-base font-bold mb-1">{vulnerability.name}</h3>
			<RiskLevelBadge riskLevel={vulnerability.severity} />
			<p className="my-3 text-sm">{vulnerability.description}</p>
			<h4 className="text-xs font-semibold mb-1 border-t border-slate-400/10 pt-3">
				Recommendation:
			</h4>
			<p>{vulnerability.recommendation}</p>
		</div>
	);
}
