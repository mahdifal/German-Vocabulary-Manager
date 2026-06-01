export type VocabularyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type GermanArticle = 'der' | 'die' | 'das';

export interface Vocabulary {
  id: string;
  user_id: string;
  german_word: string;
  article: GermanArticle;
  persian_translation: string;
  example_sentence: string | null;
  level: VocabularyLevel;
  created_at: string;
}

export interface VocabularyFormData {
  german_word: string;
  article: GermanArticle;
  persian_translation: string;
  example_sentence?: string;
  level: VocabularyLevel;
}

export interface VocabularyFilters {
  search?: string;
  level?: VocabularyLevel | '';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  total: number;
  byLevel: Record<VocabularyLevel, number>;
}

export interface Profile {
  id: string;
  name: string | null;
  created_at: string;
}
