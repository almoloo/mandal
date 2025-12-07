import { render } from 'preact';
import './index.css';
import { App } from './app.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider.tsx';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			gcTime: Infinity,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		},
	},
});

render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</QueryClientProvider>,
	document.getElementById('app')!
);
