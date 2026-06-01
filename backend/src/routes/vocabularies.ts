import { Hono } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const VALID_ARTICLES = ['der', 'die', 'das'] as const;

const createSchema = z.object({
  german_word: z.string().min(1),
  article: z.enum(VALID_ARTICLES),
  persian_translation: z.string().min(1),
  example_sentence: z.string().optional(),
  level: z.enum(VALID_LEVELS),
});

const updateSchema = createSchema.partial();

function getDb() {
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const vocabulariesRouter = new Hono<{
  Variables: { userId: string; userToken: string };
}>();

// GET /vocabularies — list with search, filter, pagination
vocabulariesRouter.get('/', async (c) => {
  const userId = c.get('userId');
  const db = getDb();

  const { search, level, page = '1', limit = '10' } = c.req.query();

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  let query = db
    .from('vocabularies')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`german_word.ilike.${term},persian_translation.ilike.${term}`);
  }

  if (level && VALID_LEVELS.includes(level as (typeof VALID_LEVELS)[number])) {
    query = query.eq('level', level);
  }

  query = query.range(offset, offset + limitNum - 1);

  const { data, error, count } = await query;

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  const total = count ?? 0;
  return c.json({
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// GET /vocabularies/stats — dashboard statistics
vocabulariesRouter.get('/stats', async (c) => {
  const userId = c.get('userId');
  const db = getDb();

  const { data, error } = await db
    .from('vocabularies')
    .select('level')
    .eq('user_id', userId);

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  const byLevel: Record<string, number> = {
    A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0,
  };

  for (const row of data) {
    if (row.level in byLevel) {
      byLevel[row.level] = (byLevel[row.level] ?? 0) + 1;
    }
  }

  return c.json({ total: data.length, byLevel });
});

// POST /vocabularies — create
vocabulariesRouter.post('/', async (c) => {
  const userId = c.get('userId');
  const db = getDb();

  const body = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ message: 'Validation error', errors: parsed.error.flatten() }, 400);
  }

  const { data, error } = await db
    .from('vocabularies')
    .insert({ ...parsed.data, user_id: userId })
    .select()
    .single();

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  return c.json(data, 201);
});

// PATCH /vocabularies/:id — update
vocabulariesRouter.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const db = getDb();

  const body = await c.req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ message: 'Validation error', errors: parsed.error.flatten() }, 400);
  }

  if (Object.keys(parsed.data).length === 0) {
    return c.json({ message: 'No fields to update' }, 400);
  }

  // Verify ownership via RLS — only update rows belonging to this user
  const { data, error } = await db
    .from('vocabularies')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  if (!data) {
    return c.json({ message: 'Not found' }, 404);
  }

  return c.json(data);
});

// DELETE /vocabularies/:id — delete
vocabulariesRouter.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const db = getDb();

  const { error } = await db
    .from('vocabularies')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  return c.body(null, 204);
});
