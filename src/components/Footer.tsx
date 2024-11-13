import React from 'react';
import { useThemeStore } from '../store/useThemeStore';

export function Footer() {
  const { isDarkMode } = useThemeStore();
  
  return (
    <footer className={`w-full py-4 px-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-900 text-cream-100'}`}>
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} BCC Best Players Board. All rights reserved.</p>
      </div>
    </footer>
  );
}