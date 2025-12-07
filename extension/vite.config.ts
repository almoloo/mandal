import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	base: './',
	build: {
		assetsInlineLimit: 0,
		outDir: 'dist',
		rollupOptions: {
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: '[name].[ext]',
			},
			input: {
				popup: resolve(__dirname, 'index.html'),
				'service-worker': resolve(__dirname, 'src/service-worker.ts'),
			},
		},
	},
	plugins: [preact(), tailwindcss()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
});
