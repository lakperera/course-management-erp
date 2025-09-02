// src/pages/auth/Login.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import Icons from '../../components/ui/Icons';

const Login = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (role) => {
    setSelectedRole(role);
    const result = await login(role);
    if (!result.success) {
      setSelectedRole(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Icons.Sun className="w-5 h-5 text-yellow-500" /> : <Icons.Moon className="w-5 h-5 text-gray-600" />}
      </button>

      <div className="w-full max-w-md p-8 space-y-8">
        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Icons.BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
              Choose your role to access the system
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icons.AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Role Selection Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('admin')}
              disabled={loading && selectedRole === 'admin'}
              className="w-full group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-3">
                {loading && selectedRole === 'admin' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Icons.Users className="w-5 h-5" />
                )}
                <span>Login as Administrator</span>
              </div>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button
              onClick={() => handleLogin('student')}
              disabled={loading && selectedRole === 'student'}
              className="w-full group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-3">
                {loading && selectedRole === 'student' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Icons.UserCircle className="w-5 h-5" />
                )}
                <span>Login as Student</span>
              </div>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icons.AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Demo Mode</h4>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                  This is a demonstration system. Choose any role to explore the features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;