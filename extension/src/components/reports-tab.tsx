import ReportForm from '@/components/reports/report-form';
import { type ContractReport } from '@/lib/types';

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
					<ul className="flex flex-col gap-3">
						{reports.map((report, index) => (
							<li
								key={index}
								className="border p-3 rounded-md"
							>
								<p className="text-sm leading-relaxed">
									{report.userEmail}
								</p>
								<p className="text-xs text-slate-500 mt-1">
									Reported on:{' '}
									{new Date(
										report.createdAt
									).toLocaleDateString()}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
