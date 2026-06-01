import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

type Mode = 'login' | 'register';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      if (mode === 'login') {
        await signIn(data.email, data.password);
        navigate('/');
      } else {
        const needsConfirmation = await signUp(data.email, data.password, data.name);
        if (needsConfirmation) {
          setConfirmationSent(true);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      if (message.toLowerCase().includes('email not confirmed')) {
        setError('Please confirm your email before signing in. Check your inbox.');
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-4">
            <BookOpen className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">German Vocab</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Email confirmation screen */}
        {confirmationSent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-600 mb-4">
              We sent a confirmation link to <strong>{getValues('email')}</strong>.
              Click it to activate your account, then sign in.
            </p>
            <button
              onClick={() => { setConfirmationSent(false); setMode('login'); }}
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          /* Login / Register Card */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {mode === 'register' && (
                <Input
                  label="Name (optional)"
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register('name')}
                />
              )}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                error={errors.password?.message}
                {...register('password')}
              />

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button type="submit" loading={isSubmitting} className="w-full mt-2">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => { setMode('register'); setError(null); }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setMode('login'); setError(null); }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
