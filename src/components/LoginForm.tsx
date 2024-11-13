import React from 'react';
import { Trophy } from 'lucide-react';

interface LoginFormProps {
  username: string;
  password: string;
  isLoading: boolean;
  isDarkMode: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  username,
  password,
  isLoading,
  isDarkMode,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) {
  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <Trophy className="h-12 w-12 text-blue-600 mb-2" />
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Sign in to access your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className={`mt-4 text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Test Credentials:<br />
        Captain: team1captain / test1234<br />
        Admin: admin / admin1234
      </div>
    </>
  );
}