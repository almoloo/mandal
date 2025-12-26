import ReportForm from '@/components/reports/report-form';
import { type ContractReport } from '@/lib/types';
import ReportItem from '@/components/reports/report-item';

export default function ReportsTab({ reports }: { reports: ContractReport[] }) {
	return (
		<div className="flex flex-col gap-3">
			<ReportForm />

			<div>
				<h3 className="text-sm font-bold mb-2">User Reports:</h3>
				{reports.length === 0 ? (
					<p className="text-sm leading-relaxed">
						No reports available.
					</p>
				) : (
					<div className="flex flex-col gap-3">
						{reports.map((report, index) => (
							<ReportItem
								key={index}
								report={report}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
