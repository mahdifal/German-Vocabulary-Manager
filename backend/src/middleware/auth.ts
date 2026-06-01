import type { Context } from 'hono';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables');
}

// Admin client (secret key) — used to verify JWT tokens
const adminClient = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authorization = c.req.header('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const token = authorization.slice(7);

  const { data, error } = await adminClient.auth.getUser(token);

  if (error || !data.user) {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }

  c.set('userId', data.user.id);
  c.set('userToken', token);

  await next();
}
