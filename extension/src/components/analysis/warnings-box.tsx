import { AlertTriangle, ChevronRightDouble } from '@untitledui/icons';
import React from 'react';

interface WarningsBoxProps {
	isHoneypot: boolean;
	hasUnlimitedMint: boolean;
	hasHiddenFees: boolean;
	hasBlacklist: boolean;
	isUpgradeable: boolean;
	ownerCanPause: boolean;
	ownerCanDrain: boolean;
}

export default function WarningsBox(props: WarningsBoxProps) {
	const {
		isHoneypot,
		hasUnlimitedMint,
		hasHiddenFees,
		hasBlacklist,
		isUpgradeable,
		ownerCanPause,
		ownerCanDrain,
	} = props;

	return (
		<div className="p-3 bg-rose-300/10 border border-rose-100 dark:bg-rose-900/10 dark:border-rose-950 rounded-xl">
			<h4 className="flex items-center gap-2 text-sm font-bold mt-1 mb-3 text-rose-900 dark:text-rose-400">
				<AlertTriangle size={18} />
				<span>Warnings</span>
			</h4>
			<div className="flex flex-col gap-3">
				{isHoneypot && (
					<ListItem>
						This contract has been identified as a honeypot.
					</ListItem>
				)}
				{hasUnlimitedMint && (
					<ListItem>
						This contract has the ability to mint unlimited tokens.
					</ListItem>
				)}
				{hasHiddenFees && (
					<ListItem>
						This contract may impose hidden fees on transactions.
					</ListItem>
				)}
				{hasBlacklist && (
					<ListItem>
						This contract has a blacklist feature that may restrict
						certain users.
					</ListItem>
				)}
				{isUpgradeable && (
					<ListItem>
						This contract is upgradeable, which may introduce future
						changes.
					</ListItem>
				)}
				{ownerCanPause && (
					<ListItem>
						The owner of this contract can pause its functionality.
					</ListItem>
				)}
				{ownerCanDrain && (
					<ListItem>
						The owner of this contract can drain its funds.
					</ListItem>
				)}
			</div>
		</div>
	);
}

function ListItem({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-start gap-2 text-sm leading-relaxed">
			<ChevronRightDouble
				size={14}
				className="text-rose-500 mt-1"
			/>
			<p className="">{children}</p>
		</div>
	);
}
