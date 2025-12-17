import type { ContractAnalysis } from '@/lib/types';

interface FuncItemProps {
	func: ContractAnalysis['functionAnalysis'][number];
}

export default function FuncItem({ func }: FuncItemProps) {
	return (
		<div className="border-l-4 border-slate-300 bg-slate-300/25 dark:bg-slate-500/25 dark:border-slate-600 p-2">
			<h3 className="text-base font-bold mb-1">{func.functionName}</h3>
			<div className="flex flex-col gap-2">
				{func.issues.map((issue, idx) => (
					<p
						key={idx}
						className="text-sm leading-relaxed"
					>
						{issue}
					</p>
				))}
			</div>
		</div>
	);
}
