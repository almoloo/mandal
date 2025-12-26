import type { ContractReport } from '@/lib/types';
import { Badge } from '@/components/ui/base/badges/badges';

interface ReportItemProps {
	report: ContractReport;
}

export default function ReportItem({ report }: ReportItemProps) {
	return (
		<div className="border border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 p-3 rounded-md">
			<h3 className="text-sm font-bold">{report.title}</h3>
			<p className="text-base leading-relaxed">{report.description}</p>
			<div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
				<p className="text-xs text-slate-500 mt-1">
					Reported on:{' '}
					{new Date(report.createdAt).toLocaleDateString()}
				</p>
				<Badge
					color="gray-blue"
					size="sm"
				>
					{report.reportType}
				</Badge>
			</div>
		</div>
	);
}
