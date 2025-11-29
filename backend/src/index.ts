import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import contracts from './routes/contracts.js';
import dapps from './routes/dapps.js';
import reviews from './routes/reviews.js';

const app = new Hono();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

// Route mounting
app.route('/contracts', contracts);
app.route('/dapps', dapps);
app.route('/reviews', reviews);

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	}
);
