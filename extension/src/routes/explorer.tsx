import { useQuery } from '@tanstack/react-query';
import { useCurrentTab } from '@/hooks/use-current-tab';
import { getContractAddressFromUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { API_BASE_URL, DEFAULT_AI_MODEL } from '@/lib/constants';
import type { ContractResponse } from '@/lib/types';
import OverviewBox from '@/components/overview-box';
import type { Key } from 'react-aria-components';
import { Tabs } from '@/components/ui/application/tabs/tabs';
import OverviewTab from '@/components/overview-tab';
import AnalysisTab from '@/components/analysis-tab';
import ReportsTab from '@/components/reports-tab';
import { Clock, InfoCircle } from '@untitledui/icons';

const tabs = [
	{
		id: 'overview',
		label: 'Overview',
	},
	{
		id: 'analysis',
		label: 'AI Analysis',
	},
	{
		id: 'reports',
		label: 'User Reports',
	},
];

export default function ExplorerView() {
	const { currentUrl, chainId } = useCurrentTab();
	const [address, setAddress] = useState<string | null>(null);
	const [selectedTabIndex, setSelectedTabIndex] = useState<Key>('overview');
	// const address = getContractAddressFromUrl(currentUrl || '');

	useEffect(() => {
		if (currentUrl) {
			const addr = getContractAddressFromUrl(currentUrl);
			setAddress(addr);
		}
	}, [currentUrl]);

	const { data } = useQuery({
		queryKey: ['contract', address],
		queryFn: async () => {
			// Fetch contract data from API
			const response = await fetch(
				`${API_BASE_URL}/contracts?address=${address}&chainId=${chainId}&model=${DEFAULT_AI_MODEL}`
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const json = await response.json();

			if (!json.success) {
				throw new Error(json.error || 'Failed to fetch contract data');
			}

			return json.data as ContractResponse;
		},
		enabled: !!address && !!chainId,
	});

	if (!data) {
		return <div className="p-4">Loading contract data...</div>;
	}

	return (
		<div className="flex flex-col grow gap-3 px-3">
			<OverviewBox
				contractName={data?.contract.name}
				verified={data.contract.verified}
				createdAt={new Date(data.contract.createdAt)}
				creatorAddress={data.contract.creatorAddress}
				chainId={data.contract.chainId}
				balance={data.balance}
			/>

			<Tabs
				selectedKey={selectedTabIndex}
				onSelectionChange={setSelectedTabIndex}
				className="w-full"
			>
				<Tabs.List
					type="underline"
					items={tabs}
				>
					{(tab) => <Tabs.Item {...tab} />}
				</Tabs.List>
			</Tabs>

			{selectedTabIndex === 'overview' && (
				<OverviewTab
					riskLevel={data.latestAnalysis?.riskLevel}
					summary={data.latestAnalysis?.summary}
				/>
			)}

			{selectedTabIndex === 'analysis' && (
				<AnalysisTab analysis={data.latestAnalysis!} />
			)}

			{selectedTabIndex === 'reports' && (
				<ReportsTab reports={data.reports} />
			)}

			<div className="flex flex-col gap-1 pt-3 pb-2 mt-auto text-xs text-slate-600">
				<div className="flex items-center gap-1">
					<InfoCircle size={14} />
					<span>Analyzed by:</span>
					<span className="font-mono">
						{data.latestAnalysis?.aiModel}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Clock size={14} />
					<span>Last analyzed:</span>
					<time
						dateTime={new Date(
							data.latestAnalysis?.createdAt!
						).toISOString()}
					>
						{new Date(
							data.latestAnalysis?.createdAt!
						).toLocaleString()}
					</time>
				</div>
			</div>
		</div>
	);
}
