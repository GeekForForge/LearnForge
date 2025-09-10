// src/pages/LoginPage.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const LoginPage = ({ setCurrentPage }) => {
  useEffect(() => {
    setCurrentPage('login');
  }, [setCurrentPage]);

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth login');
    // Redirect to: /api/auth/oauth2/google
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth
    console.log('GitHub OAuth login');
    // Redirect to: /api/auth/oauth2/github
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-orbitron font-bold text-white mb-2"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300"
            >
              Sign in to continue your learning journey
            </motion.p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* Google Login */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaGoogle size={20} className="text-red-500" />
              <span>Continue with Google</span>
            </motion.button>

            {/* GitHub Login */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Github size={20} />
              <span>Continue with GitHub</span>
            </motion.button>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-neon-cyan hover:text-neon-purple transition-colors duration-300 font-semibold"
              >
                Sign up here
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
