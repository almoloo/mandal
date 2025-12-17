import type { RiskLevel } from '@/lib/types';
import RiskLevelBadge from '@/components/analysis/risk-level-badge';

interface OverviewTabProps {
	riskLevel?: RiskLevel;
	summary?: string;
}

export default function OverviewTab(props: OverviewTabProps) {
	return (
		<div className="flex flex-col gap-3">
			<div>
				<h3 className="text-xs font-bold mb-1">Summary:</h3>
				<p className="text-sm leading-relaxed">
					{props.summary || 'N/A'}
				</p>
			</div>
			{props.riskLevel && <RiskLevelBadge riskLevel={props.riskLevel} />}
		</div>
	);
}
