import { LoadingIndicator } from './ui/application/loading-indicator/loading-indicator';

export default function Loading() {
	return (
		<div className="w-full h-full grow flex items-center justify-center">
			<LoadingIndicator
				size="xl"
				type="line-simple"
			/>
		</div>
	);
}
