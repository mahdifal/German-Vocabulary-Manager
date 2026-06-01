import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCreateVocabulary } from '../hooks/useVocabularies';
import { VocabularyForm } from '../components/vocabulary/VocabularyForm';
import type { VocabularyFormData } from '../types';

export function AddVocabularyPage() {
  const { session } = useAuth();
  const token = session?.access_token;
  const navigate = useNavigate();
  const createMutation = useCreateVocabulary(token);

  const handleSubmit = async (data: VocabularyFormData) => {
    await createMutation.mutateAsync(data);
    navigate('/vocabularies');
  };

  return (
    <div className="max-w-xl">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Add New Word</h1>

        {createMutation.error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {createMutation.error.message}
          </div>
        )}

        <VocabularyForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}
