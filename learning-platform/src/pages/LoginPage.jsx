import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setCurrentPage }) => {
  const { loginWithGithub, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage('login');
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Code size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-orbitron font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg">Sign in to continue learning</p>
          </div>

          {/* GitHub Login Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={loginWithGithub}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all border border-white/10 mb-6"
          >
            <Github size={24} />
            Continue with GitHub
          </motion.button>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {[
              'Track your learning progress',
              'Save notes for each lesson',
              'Be Curious'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-400 text-sm">
                <Zap size={16} className="text-neon-cyan" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-gray-500 text-xs text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
