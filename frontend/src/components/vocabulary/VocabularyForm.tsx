import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vocabulary, VocabularyFormData, GermanArticle, VocabularyLevel } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const ARTICLES: GermanArticle[] = ['der', 'die', 'das'];
const LEVELS: VocabularyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const schema = z.object({
  german_word: z.string().min(1, 'German word is required'),
  article: z.enum(['der', 'die', 'das'] as const),
  persian_translation: z.string().min(1, 'Persian translation is required'),
  example_sentence: z.string().optional(),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const),
});

interface VocabularyFormProps {
  defaultValues?: Partial<Vocabulary>;
  onSubmit: (data: VocabularyFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function VocabularyForm({ defaultValues, onSubmit, onCancel, isLoading }: VocabularyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VocabularyFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      german_word: defaultValues?.german_word ?? '',
      article: defaultValues?.article ?? 'das',
      persian_translation: defaultValues?.persian_translation ?? '',
      example_sentence: defaultValues?.example_sentence ?? '',
      level: defaultValues?.level ?? 'A1',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="German Word"
            placeholder="e.g. Haus"
            error={errors.german_word?.message}
            {...register('german_word')}
          />
        </div>
        <Select
          label="Article"
          error={errors.article?.message}
          {...register('article')}
        >
          {ARTICLES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Persian Translation"
        placeholder="e.g. خانه"
        dir="rtl"
        error={errors.persian_translation?.message}
        {...register('persian_translation')}
      />

      <Input
        label="Example Sentence (optional)"
        placeholder="e.g. Das Haus ist groß."
        error={errors.example_sentence?.message}
        {...register('example_sentence')}
      />

      <Select
        label="Level"
        error={errors.level?.message}
        {...register('level')}
      >
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </Select>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isLoading} className="flex-1">
          {defaultValues?.id ? 'Update Word' : 'Add Word'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
