import type { RiskLevel } from '@/lib/types';

interface OverviewTabProps {
	riskLevel?: RiskLevel;
	summary?: string;
}

export default function OverviewTab(props: OverviewTabProps) {
	return (
		<div>
			overview-tab Risk Level: {props.riskLevel || 'N/A'}
			Summary: {props.summary || 'N/A'}
		</div>
	);
}
