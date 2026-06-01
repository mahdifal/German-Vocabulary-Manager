-- Migration: Create vocabularies table

CREATE TYPE public.vocabulary_level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
CREATE TYPE public.german_article AS ENUM ('der', 'die', 'das');

CREATE TABLE IF NOT EXISTS public.vocabularies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  german_word text NOT NULL,
  article public.german_article NOT NULL,
  persian_translation text NOT NULL,
  example_sentence text,
  level public.vocabulary_level NOT NULL DEFAULT 'A1',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_vocabularies_user_id ON public.vocabularies(user_id);
CREATE INDEX idx_vocabularies_level ON public.vocabularies(level);
CREATE INDEX idx_vocabularies_german_word ON public.vocabularies(german_word);

-- Enable Row Level Security
ALTER TABLE public.vocabularies ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own vocabulary
CREATE POLICY "Users can view own vocabularies"
  ON public.vocabularies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vocabularies"
  ON public.vocabularies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabularies"
  ON public.vocabularies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vocabularies"
  ON public.vocabularies FOR DELETE
  USING (auth.uid() = user_id);
