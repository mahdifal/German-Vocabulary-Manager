import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginPage } from '../pages/LoginPage';

/**
 * Wraps routes that should only be accessible when logged out.
 * Redirects to the dashboard if a session already exists.
 */
export function PublicRoute() {
  const { session, loading } = useAuth();

  // Don't flash the login page while checking session
  if (loading) return null;
  if (session) return <Navigate to="/" replace />;

  return <LoginPage />;
}
