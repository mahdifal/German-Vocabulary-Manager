import type {
  Vocabulary,
  VocabularyFormData,
  VocabularyFilters,
  PaginatedResponse,
  DashboardStats,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

export const vocabularyApi = {
  list(
    filters: VocabularyFilters,
    token: string
  ): Promise<PaginatedResponse<Vocabulary>> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.level) params.set('level', filters.level);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    return request(`/vocabularies?${params.toString()}`, {}, token);
  },

  create(data: VocabularyFormData, token: string): Promise<Vocabulary> {
    return request('/vocabularies', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  update(id: string, data: Partial<VocabularyFormData>, token: string): Promise<Vocabulary> {
    return request(`/vocabularies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token);
  },

  delete(id: string, token: string): Promise<void> {
    return request(`/vocabularies/${id}`, { method: 'DELETE' }, token);
  },

  stats(token: string): Promise<DashboardStats> {
    return request('/vocabularies/stats', {}, token);
  },
};
