import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { VocabularyPage } from '../pages/VocabularyPage';
import { AddVocabularyPage } from '../pages/AddVocabularyPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public — redirect to dashboard if already logged in */}
      <Route path="/login" element={<PublicRoute />} />

      {/* Protected — redirect to /login if not authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/vocabularies" element={<VocabularyPage />} />
        <Route path="/vocabularies/new" element={<AddVocabularyPage />} />
      </Route>
    </Routes>
  );
}
