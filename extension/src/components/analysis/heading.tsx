interface HeadingProps {
	title: string;
}

export default function Heading({ title }: HeadingProps) {
	return (
		<div className="flex items-center gap-3 mb-2">
			<span className="grow border-b border-dotted border-slate-400/50 dark:border-slate-400/50"></span>
			<h3 className="text-xs font-bold mb-1">{title}</h3>
			<span className="grow border-b border-dotted border-slate-400/50 dark:border-slate-400/50"></span>
		</div>
	);
}
