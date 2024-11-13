import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`card ${isDarkMode ? 'card-dark' : 'card-light'}`}>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h1>
      <div className="space-y-2">
        <p>Role: {user?.role}</p>
        {user?.team && <p>Team: {user?.team}</p>}
      </div>
    </div>
  );
}