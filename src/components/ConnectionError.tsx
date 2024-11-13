import React from 'react';
import { Trophy } from 'lucide-react';

interface ConnectionErrorProps {
  isDarkMode: boolean;
  onRetry: () => void;
}

export function ConnectionError({ isDarkMode, onRetry }: ConnectionErrorProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className={`card ${isDarkMode ? 'card-dark' : 'card-light'} w-full max-w-md text-center`}>
        <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-600 mb-4">Connection Error</h2>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Unable to connect to the server. Please check your internet connection and try again.
        </p>
        <button 
          onClick={onRetry}
          className="btn btn-primary"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}