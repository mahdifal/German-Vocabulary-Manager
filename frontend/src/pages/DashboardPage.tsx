import { Link } from 'react-router-dom';
import { BarChart2, BookOpen, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useVocabularies, useVocabularyStats } from '../hooks/useVocabularies';
import type { VocabularyLevel } from '../types';

const LEVEL_COLORS: Record<VocabularyLevel, string> = {
  A1: 'bg-green-500',
  A2: 'bg-emerald-500',
  B1: 'bg-blue-500',
  B2: 'bg-indigo-500',
  C1: 'bg-purple-500',
  C2: 'bg-red-500',
};

const DISPLAYED_LEVELS: VocabularyLevel[] = ['A1', 'A2', 'B1', 'B2'];

export function DashboardPage() {
  const { session } = useAuth();
  const token = session?.access_token;

  const { data: stats, isLoading: statsLoading } = useVocabularyStats(token);
  const { data: recentData, isLoading: recentLoading } = useVocabularies(
    { page: 1, limit: 5 },
    token
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Your vocabulary learning progress</p>
        </div>
        <Link
          to="/vocabularies/new"
          className="inline-flex items-center justify-center gap-2 h-8 px-3 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Word
        </Link>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {statsLoading ? '—' : (stats?.total ?? 0)}
            </p>
          </div>

          {/* Per level */}
          {DISPLAYED_LEVELS.map((level) => (
            <div key={level} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${LEVEL_COLORS[level]}`} />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{level}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {statsLoading ? '—' : (stats?.byLevel[level] ?? 0)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Words */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Recent Words
          </h2>
          <Link to="/vocabularies" className="text-sm text-indigo-600 hover:underline font-medium">
            View all
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {recentLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : !recentData?.data.length ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No vocabulary yet.</p>
              <Link to="/vocabularies/new" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
                Add your first word →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentData.data.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="text-xs text-gray-400 mr-1">{item.article}</span>
                    <span className="font-semibold text-gray-900">{item.german_word}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-gray-700" dir="rtl">{item.persian_translation}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    LEVEL_COLORS[item.level].replace('bg-', 'bg-').replace('-500', '-100')
                  } text-gray-700`}>
                    {item.level}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
