// src/pages/SignUpPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Google SVG Icon Component with proper colors
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const SignUpPage = ({ setCurrentPage }) => {
    const { loginWithGithub, loginWithGoogle, signupWithEmail, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentPage('signup');
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate, setCurrentPage]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const success = await signupWithEmail(formData.name, formData.email, formData.password);
            if (success) {
                navigate('/');
            } else {
                setError('Signup failed. Email may already be in use.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
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

                    {!showEmailForm ? (
                        <>
                            {/* OAuth Buttons */}
                            <div className="space-y-4 mb-6">
                                {/* Google Signup - Dark themed */}
                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={loginWithGoogle}
                                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                                >
                                    <GoogleIcon />
                                    <span>Sign up with Google</span>
                                </motion.button>

                                {/* GitHub Signup */}
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={loginWithGithub}
                                    className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
                                >
                                    <Github size={20} />
                                    <span>Sign up with GitHub</span>
                                </motion.button>
                            </div>

                            {/* Divider */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-transparent text-gray-400">Or sign up with</span>
                                </div>
                            </div>

                            {/* Email Signup Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowEmailForm(true)}
                                className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all"
                            >
                                <Mail size={24} />
                                Sign up with Email
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {/* Email Signup Form */}
                            <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan transition-colors pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan transition-colors pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </button>
                            </form>

                            {/* Back Button */}
                            <button
                                onClick={() => {
                                    setShowEmailForm(false);
                                    setError('');
                                }}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors"
                            >
                                Back to other options
                            </button>
                        </>
                    )}

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
