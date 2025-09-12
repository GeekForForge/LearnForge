// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthCallbackPage = () => {
  const { checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await checkAuthStatus();
        navigate('/courses', { replace: true });
      } catch (error) {
        console.error('Auth callback failed:', error);
        navigate('/login?error=auth_failed', { replace: true });
      }
    };

    handleCallback();
  }, [checkAuthStatus, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
