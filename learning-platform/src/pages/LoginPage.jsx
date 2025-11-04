// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Code, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Google SVG Icon Component with proper colors
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const LoginPage = ({ setCurrentPage }) => {
    const { loginWithGithub, loginWithGoogle, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage('login');
        if (isAuthenticated) {
            navigate('/landing');
        }
    }, [isAuthenticated, navigate, setCurrentPage]);

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

                    {/* OAuth Buttons */}
                    <div className="space-y-4 mb-6">
                        {/* Google Login */}
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={loginWithGoogle}
                            className="w-full py-4 bg-dark-700 hover:bg-dark-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all border border-white/10"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </motion.button>

                        {/* GitHub Login */}
                        <motion.button
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={loginWithGithub}
                            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all border border-white/10"
                        >
                            <Github size={24} />
                            Continue with GitHub
                        </motion.button>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6 mt-6">
                        {[
                            'Track your learning progress',
                            'Save notes for each lesson',
                            'Be Curious',
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-gray-400 text-sm"
                            >
                                <Zap size={16} className="text-neon-cyan" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <p className="text-gray-500 text-xs text-center mt-6">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
