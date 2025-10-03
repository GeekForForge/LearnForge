import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration
  const API_BASE_URL ='http://localhost:8080/api';
  const GITHUB_CLIENT_ID ='Ov23li0GzarRfL1R2lcv';

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated with stored token
   */
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('ℹ️ No token found in localStorage');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Checking authentication with token...');
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        console.log('✅ User authenticated:', response.data.email);
        setUser(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error.response?.status, error.message);
      
      // Clear invalid token
      localStorage.removeItem('token');
      setUser(null);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Redirect to GitHub OAuth login
   */
  const loginWithGithub = () => {
    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
      
      githubAuthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID);
      githubAuthUrl.searchParams.append('redirect_uri', redirectUri);
      githubAuthUrl.searchParams.append('scope', 'user:email read:user');
      githubAuthUrl.searchParams.append('state', generateRandomState()); // CSRF protection

      console.log('🔐 Redirecting to GitHub OAuth:', githubAuthUrl.toString());
      
      // Store state for verification
      sessionStorage.setItem('oauth_state', githubAuthUrl.searchParams.get('state'));
      
      window.location.href = githubAuthUrl.toString();
    } catch (error) {
      console.error('❌ Error initiating GitHub login:', error);
      setError('Failed to initiate login. Please try again.');
    }
  };

  /**
   * Handle GitHub OAuth callback
   */
  const handleGithubCallback = async (code, state) => {
    try {
      // Verify state for CSRF protection
      const savedState = sessionStorage.getItem('oauth_state');
      if (state && savedState && state !== savedState) {
        throw new Error('Invalid OAuth state - possible CSRF attack');
      }

      console.log('📤 Sending authorization code to backend...');
      
      const response = await axios.post(
        `${API_BASE_URL}/auth/github`,
        { code },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error('Invalid response format from server');
      }

      console.log('✅ Authentication successful!');
      console.log('👤 User:', userData.email);
      console.log('🎫 Token received');

      // Store token
      localStorage.setItem('token', token);
      
      // Set user data
      setUser(userData);
      setError(null);

      // Clear OAuth state
      sessionStorage.removeItem('oauth_state');

      return true;
    } catch (error) {
      console.error('❌ GitHub authentication failed:', error);
      
      // Handle specific errors
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.response) {
        // Server responded with error
        console.error('Server error:', error.response.status, error.response.data);
        errorMessage = error.response.data || errorMessage;
      } else if (error.request) {
        // Request made but no response
        console.error('Network error:', error.message);
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something else went wrong
        console.error('Error:', error.message);
        errorMessage = error.message;
      }

      setError(errorMessage);
      
      // Clear any stored data
      localStorage.removeItem('token');
      sessionStorage.removeItem('oauth_state');
      setUser(null);

      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Optional: Call logout endpoint
        try {
          await axios.post(
            `${API_BASE_URL}/auth/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (error) {
          console.warn('Logout endpoint failed:', error.message);
        }
      }

      // Clear local data
      localStorage.removeItem('token');
      sessionStorage.removeItem('oauth_state');
      
      setUser(null);
      setError(null);

      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  /**
   * Update user profile
   */
  const updateUser = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Generate random state for CSRF protection
   */
  const generateRandomState = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    loginWithGithub,
    handleGithubCallback,
    logout,
    updateUser,
    clearError,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
