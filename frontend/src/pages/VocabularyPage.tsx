import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  useVocabularies,
  useUpdateVocabulary,
  useDeleteVocabulary,
} from '../hooks/useVocabularies';
import { VocabularyFilters } from '../components/vocabulary/VocabularyFilters';
import { VocabularyTable } from '../components/vocabulary/VocabularyTable';
import type { VocabularyFormData, VocabularyLevel } from '../types';

export function VocabularyPage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<VocabularyLevel | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useVocabularies(
    { search, level, page, limit: 10 },
    token
  );

  const updateMutation = useUpdateVocabulary(token);
  const deleteMutation = useDeleteVocabulary(token);

  const handleEdit = useCallback(
    async (id: string, formData: Partial<VocabularyFormData>) => {
      await updateMutation.mutateAsync({ id, data: formData });
    },
    [updateMutation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleLevelChange = (value: VocabularyLevel | '') => {
    setLevel(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vocabularies</h1>
        <p className="text-gray-500 text-sm mt-1">
          {data?.total !== undefined ? `${data.total} words total` : 'Your vocabulary list'}
        </p>
      </div>

      <VocabularyFilters
        search={search}
        level={level}
        onSearchChange={handleSearchChange}
        onLevelChange={handleLevelChange}
      />

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : (
        <VocabularyTable
          data={data?.data ?? []}
          total={data?.total ?? 0}
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isUpdating={updateMutation.isPending}
        />
      )}
    </div>
  );
}
