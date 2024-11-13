import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authHelpers } from '../lib/pocketbase';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { LoginForm } from '../components/LoginForm';
import { ConnectionError } from '../components/ConnectionError';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { login } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionError(false);
    const isConnected = await authHelpers.testConnection();
    setConnectionError(!isConnected);
    setIsCheckingConnection(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCheckingConnection || connectionError) return;
    
    setIsLoading(true);

    try {
      const result = await authHelpers.login(username, password);
      
      if (result.success && result.data && result.token) {
        login(result.data, result.token);
        toast.success('Welcome back!');
        navigate(result.data.role === 'admin' ? '/admin' : '/vote');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingConnection) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className={`card ${isDarkMode ? 'card-dark' : 'card-light'} w-full max-w-md text-center p-8`}>
          <LoadingSpinner />
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connecting to server...
          </p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return <ConnectionError isDarkMode={isDarkMode} onRetry={checkConnection} />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className={`card ${isDarkMode ? 'card-dark' : 'card-light'} w-full max-w-md p-8`}>
        <LoginForm
          username={username}
          password={password}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}