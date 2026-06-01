import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware } from './middleware/auth';
import { vocabulariesRouter } from './routes/vocabularies';

export function createApp() {
  const app = new Hono();

  // Middleware
  app.use(logger());
  app.use(
    '*',
    cors({
      origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Health check (no auth required)
  app.get('/health', (c) => c.json({ status: 'ok' }));

  // Protected API routes
  app.use('/api/*', authMiddleware);
  app.route('/api/vocabularies', vocabulariesRouter);

  // Global error handler
  app.onError((err, c) => {
    console.error('[error]', err);
    return c.json({ message: err.message ?? 'Internal server error' }, 500);
  });

  // 404
  app.notFound((c) => c.json({ message: 'Not found' }, 404));

  return app;
}
