import { AlertTriangle, ShieldTick } from '@untitledui/icons';
import { BadgeWithIcon } from '@/components/ui/base/badges/badges';
import { Button } from '@/components/ui/base/buttons/button';
import {
	formatAddress,
	formatBalance,
	getExplorerUrl,
	isTestnet,
} from '@/lib/utils';
import type { ReactNode } from 'react';

interface OverviewBoxProps {
	contractName: string | null;
	verified: boolean;
	createdAt: Date;
	creatorAddress: string | null;
	chainId: number;
	balance: string;
}

function ListItem(props: { label: string; value: ReactNode }) {
	return (
		<div className="flex items-center gap-3">
			<span className="font-medium">{props.label}</span>
			<span
				className="grow border-b border-dashed opacity-25
      "
			></span>
			{props.value}
		</div>
	);
}

export default function OverviewBox(props: OverviewBoxProps) {
	return (
		<section className="bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-950 rounded-xl p-3">
			<h2 className="font-bold text-xl">
				{props.contractName ?? 'Unknown Contract'}
			</h2>
			<div className="flex items-center gap-1 my-2">
				{props.verified && (
					<BadgeWithIcon
						type="pill-color"
						color="success"
						size="sm"
						iconLeading={ShieldTick}
					>
						Verified Contract
					</BadgeWithIcon>
				)}
				{isTestnet(props.chainId) && (
					<BadgeWithIcon
						type="pill-color"
						color="warning"
						size="sm"
						iconLeading={AlertTriangle}
					>
						Testnet
					</BadgeWithIcon>
				)}
			</div>
			<div className="flex flex-col gap-1">
				<ListItem
					label="Created By"
					value={
						props.creatorAddress ? (
							<Button
								href={getExplorerUrl(
									props.chainId,
									props.creatorAddress
								)}
								color="link-color"
								size="sm"
								target="_blank"
							>
								{formatAddress(props.creatorAddress)}
							</Button>
						) : (
							<span>Unknown</span>
						)
					}
				/>
				<ListItem
					label="Deployed At"
					value={
						<time dateTime={props.createdAt.toISOString()}>
							{props.createdAt.toDateString()}
						</time>
					}
				/>
				<ListItem
					label="Balance"
					value={<span>{formatBalance(props.balance)} ETH</span>}
				/>
			</div>
		</section>
	);
}
