import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
