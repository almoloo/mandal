import { Button } from '@/components/ui/base/buttons/button';
import { CodeCircle03 } from '@untitledui/icons';

export default function Header() {
	return (
		<header className="p-3 flex items-center justify-between">
			<h1 className="text-xl font-bold">mandal</h1>
			<Button
				href="https://github.com/almoloo"
				title="GitHub"
				color="link-gray"
			>
				<CodeCircle03 className="w-5 h-5" />
			</Button>
		</header>
	);
}
