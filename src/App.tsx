import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginPage } from './pages/LoginPage';
import { VotingPage } from './pages/VotingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

export function App() {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-cream-50 text-gray-900'
      }`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/vote" element={
              <ProtectedRoute allowedRoles={['captain']}>
                <VotingPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            className: isDarkMode ? '!bg-gray-800 !text-white' : '',
            duration: 3000,
          }}
        />
      </div>
    </Router>
  );
}