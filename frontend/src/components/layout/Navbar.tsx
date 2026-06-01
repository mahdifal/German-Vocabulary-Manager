import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Navbar() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-indigo-600" />
          <span className="font-bold text-gray-900 text-lg hidden sm:block">German Vocab</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </NavLink>
          <NavLink to="/vocabularies" className={linkClass}>
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Vocabularies</span>
          </NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/vocabularies/new')}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Word</span>
          </Button>
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <span className="text-xs text-gray-500 hidden sm:block truncate max-w-32">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
