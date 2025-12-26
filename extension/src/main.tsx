import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/theme-provider.tsx';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 3 * 24 * 60 * 60 * 1000, // 3 DAYS
			gcTime: 6 * 24 * 60 * 60 * 1000, // 6 DAYS
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	},
});

createRoot(document.getElementById('app')!).render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</QueryClientProvider>
);
