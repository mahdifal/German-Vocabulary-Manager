import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware } from './middleware/auth';
import { vocabulariesRouter } from './routes/vocabularies';

const app = new Hono();

// Global middleware
app.use(logger());
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

// Protected API routes
app.use('/api/*', authMiddleware);
app.route('/api/vocabularies', vocabulariesRouter);

// 404
app.notFound((c) => c.json({ message: 'Not found' }, 404));

const port = parseInt(process.env.PORT ?? '3001', 10);

console.log(`🚀 Backend running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
