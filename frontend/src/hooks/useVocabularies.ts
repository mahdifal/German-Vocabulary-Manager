import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { vocabularyApi } from '../lib/api';
import type { VocabularyFilters, VocabularyFormData } from '../types';

export const VOCAB_KEYS = {
  all: ['vocabularies'] as const,
  list: (filters: VocabularyFilters) => ['vocabularies', 'list', filters] as const,
  stats: () => ['vocabularies', 'stats'] as const,
};

export function useVocabularies(filters: VocabularyFilters, token: string | undefined) {
  return useQuery({
    queryKey: VOCAB_KEYS.list(filters),
    queryFn: () => vocabularyApi.list(filters, token!),
    enabled: !!token,
  });
}

export function useVocabularyStats(token: string | undefined) {
  return useQuery({
    queryKey: VOCAB_KEYS.stats(),
    queryFn: () => vocabularyApi.stats(token!),
    enabled: !!token,
  });
}

export function useCreateVocabulary(token: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: VocabularyFormData) => vocabularyApi.create(data, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VOCAB_KEYS.all });
    },
  });
}

export function useUpdateVocabulary(token: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VocabularyFormData> }) =>
      vocabularyApi.update(id, data, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VOCAB_KEYS.all });
    },
  });
}

export function useDeleteVocabulary(token: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vocabularyApi.delete(id, token!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VOCAB_KEYS.all });
    },
  });
}
