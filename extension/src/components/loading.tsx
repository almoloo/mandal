import { LoadingIndicator } from '@/components/ui/application/loading-indicator/loading-indicator';

export default function Loading() {
	return (
		<div className="w-full h-full grow flex items-center justify-center">
			<LoadingIndicator
				type="line-simple"
				size="lg"
			/>
		</div>
	);
}
