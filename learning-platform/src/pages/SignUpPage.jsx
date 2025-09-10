// src/pages/SignUpPage.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

const SignUpPage = ({ setCurrentPage }) => {
  useEffect(() => {
    setCurrentPage('signup');
  }, [setCurrentPage]);

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth signup');
    // Redirect to: /api/auth/oauth2/google
  };

  const handleGithubSignup = () => {
    // TODO: Implement GitHub OAuth
    console.log('GitHub OAuth signup');
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
              Join LearnForge
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300"
            >
              Start your coding journey today
            </motion.p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* Google Signup */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaGoogle size={20} className="text-red-500" />
              <span>Sign up with Google</span>
            </motion.button>

            {/* GitHub Signup */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGithubSignup}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Github size={20} />
              <span>Sign up with GitHub</span>
            </motion.button>
          </div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400 text-xs">
              By signing up, you agree to our{' '}
              <a href="#" className="text-neon-cyan hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-neon-cyan hover:underline">Privacy Policy</a>
            </p>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-neon-cyan hover:text-neon-purple transition-colors duration-300 font-semibold"
              >
                Sign in here
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
