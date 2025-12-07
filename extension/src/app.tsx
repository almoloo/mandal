import Header from './components/header';
import { useCurrentTab } from './hooks/useCurrentTab';
import ExplorerView from './routes/explorer';

export function App() {
	const { currentUrlType, currentUrl, chainId } = useCurrentTab();
	return (
		<>
			<Header />
			<div className="bg-blue-400 text-white">{currentUrlType}</div>
			<div className="bg-green-400 text-white">{currentUrl}</div>
			<div className="bg-red-400 text-white">{chainId}</div>
			{currentUrlType !== 'OTHER' ? (
				<ExplorerView />
			) : (
				<div className="p-4">Unsupported URL</div>
			)}
		</>
	);
}
