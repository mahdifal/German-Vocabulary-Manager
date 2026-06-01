import 'dotenv/config';
import { createApp } from './app';

const app = createApp();
const port = parseInt(process.env.PORT ?? '3001', 10);

console.log(`🚀 Backend running on http://localhost:${port}`);

export default { port, fetch: app.fetch };
