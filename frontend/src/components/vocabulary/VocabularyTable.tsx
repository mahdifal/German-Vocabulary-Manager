import { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Vocabulary, VocabularyFormData } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { VocabularyForm } from './VocabularyForm';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-green-100 text-green-800',
  A2: 'bg-emerald-100 text-emerald-800',
  B1: 'bg-blue-100 text-blue-800',
  B2: 'bg-indigo-100 text-indigo-800',
  C1: 'bg-purple-100 text-purple-800',
  C2: 'bg-red-100 text-red-800',
};

interface VocabularyTableProps {
  data: Vocabulary[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (id: string, data: Partial<VocabularyFormData>) => Promise<void>;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export function VocabularyTable({
  data,
  total,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  isUpdating,
}: VocabularyTableProps) {
  const [editingItem, setEditingItem] = useState<Vocabulary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEditSubmit = async (formData: VocabularyFormData) => {
    if (!editingItem) return;
    await onEdit(editingItem.id, formData);
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingId) return;
    onDelete(deletingId);
    setDeletingId(null);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">No vocabulary found.</p>
        <p className="text-sm mt-1">Add your first word to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">German Word</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Translation</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Level</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Added</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-500 mr-1 text-xs">{item.article}</span>
                  <span className="font-semibold text-gray-900">{item.german_word}</span>
                </td>
                <td className="px-4 py-3 text-gray-700 font-medium" dir="rtl">{item.persian_translation}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${LEVEL_COLORS[item.level]}`}>
                    {item.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} words
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Vocabulary"
      >
        {editingItem && (
          <VocabularyForm
            defaultValues={editingItem}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingItem(null)}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Vocabulary"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this word? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDeleteConfirm} className="flex-1">
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeletingId(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
