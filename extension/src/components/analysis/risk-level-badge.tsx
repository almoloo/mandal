import type { RiskLevel } from '@/lib/types';
import { BadgeWithIcon } from '@/components/ui/base/badges/badges';
import type {
	BadgeColors,
	IconComponentType,
} from '@/components/ui/base/badges/badge-types';
import {
	HelpCircle,
	ShieldTick,
	Shield01,
	ShieldZap,
	ShieldOff,
} from '@untitledui/icons';

export default function RiskLevelBadge(props: { riskLevel?: RiskLevel }) {
	let badgeColor: BadgeColors = 'gray';
	let badgeText = 'Unknown';
	let badgeIcon: IconComponentType = HelpCircle;

	switch (props.riskLevel) {
		case 'Low':
			badgeColor = 'success';
			badgeText = 'Low Risk';
			badgeIcon = ShieldTick;
			break;
		case 'Medium':
			badgeColor = 'blue-light';
			badgeText = 'Medium Risk';
			badgeIcon = Shield01;
			break;
		case 'High':
			badgeColor = 'error';
			badgeText = 'High Risk';
			badgeIcon = ShieldZap;
			break;
		case 'Critical':
			badgeColor = 'purple';
			badgeText = 'Critical Risk';
			badgeIcon = ShieldOff;
			break;
		default:
			badgeColor = 'gray';
			badgeText = 'Unknown';
			badgeIcon = HelpCircle;
			break;
	}

	return (
		<BadgeWithIcon
			size="md"
			color={badgeColor}
			iconLeading={badgeIcon}
		>
			{badgeText}
		</BadgeWithIcon>
	);
}
