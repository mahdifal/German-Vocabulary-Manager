import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: PageErrorProps) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <div>
        <p className="text-gray-800 font-medium">Oops, something went wrong</p>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
