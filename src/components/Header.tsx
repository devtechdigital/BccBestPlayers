import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';

export function Header() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <header className={`w-full py-4 px-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-900 text-cream-100'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Trophy className="h-8 w-8" />
          <span className="text-xl font-bold">BCC Best Players Board</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-blue-300 transition-colors">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-300 transition-colors">
                  Admin
                </Link>
              )}
              {user.role === 'captain' && (
                <Link to="/vote" className="hover:text-blue-300 transition-colors">
                  Cast Votes
                </Link>
              )}
              <button
                onClick={logout}
                className="hover:text-blue-300 transition-colors"
              >
                Logout
              </button>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-blue-800 transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}