import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FullPageSpinner } from '../components/ui/Spinner';
import { Layout } from '../components/layout/Layout';

/**
 * Wraps routes that require an authenticated session.
 * Shows a spinner while the session is being resolved, then
 * redirects to /login if there's no session.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (!session) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
