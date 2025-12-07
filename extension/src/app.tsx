import { useIsFetching } from '@tanstack/react-query';
import Header from '@/components/header';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import ExplorerView from '@/routes/explorer';
import { useEffect, useState } from 'preact/hooks';
import Loading from '@/components/loading';

export function App() {
	const { currentUrlType } = useCurrentTab();
	const isFetchingContract = useIsFetching({ queryKey: ['contract'] });

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isFetchingContract > 0) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [isFetchingContract]);

	return (
		<>
			<Header />

			{isLoading ? (
				<Loading />
			) : (
				<>
					{currentUrlType !== 'OTHER' ? (
						<ExplorerView />
					) : (
						<div className="p-4">Unsupported URL</div>
					)}
				</>
			)}
		</>
	);
}
