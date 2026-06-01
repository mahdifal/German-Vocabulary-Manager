import { Search, X } from 'lucide-react';
import type { VocabularyLevel } from '../../types';
import { Select } from '../ui/Select';

const LEVELS: VocabularyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface VocabularyFiltersProps {
  search: string;
  level: VocabularyLevel | '';
  onSearchChange: (value: string) => void;
  onLevelChange: (value: VocabularyLevel | '') => void;
}

export function VocabularyFilters({
  search,
  level,
  onSearchChange,
  onLevelChange,
}: VocabularyFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search German word or Persian translation..."
          className="w-full h-10 pl-9 pr-9 rounded-lg border border-gray-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Level filter */}
      <Select
        value={level}
        onChange={(e) => onLevelChange(e.target.value as VocabularyLevel | '')}
        placeholder="All Levels"
        className="sm:w-40"
      >
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </Select>
    </div>
  );
}
