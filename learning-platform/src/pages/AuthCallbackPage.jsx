import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const AuthCallbackPage = ({ setCurrentPage }) => {
    const [searchParams] = useSearchParams();
    const { handleGithubCallback, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const hasCalledRef = useRef(false);

    useEffect(() => {
        // ✅ PREVENT DOUBLE EXECUTION
        if (hasCalledRef.current) {
            console.log('⚠️ Already processed, skipping...');
            return;
        }

        setCurrentPage('auth-callback');

        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('❌ GitHub error:', error);
            setStatus('error');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (code) {
            console.log('✅ Got code, processing...', code);
            hasCalledRef.current = true;  // ✅ Mark as called IMMEDIATELY

            // ✅ CLEAR URL TO PREVENT REUSE
            window.history.replaceState({}, '', '/auth/callback');

            // ✅ Call authentication
            authenticateUser(code);
        } else {
            console.error('❌ No code in URL');
            setStatus('error');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, []); // ✅ EMPTY DEPENDENCY ARRAY - Run only once!

    const authenticateUser = async (code) => {
        try {
            setStatus('loading');
            console.log('🔐 Authenticating with code:', code);

            const success = await handleGithubCallback(code);

            if (success) {
                console.log('✅ Authentication successful!');
                setStatus('success');

                // ✅ Wait a bit, then fetch fresh user data
                await new Promise(resolve => setTimeout(resolve, 500));
                await fetchUser();

                // ✅ Navigate to home
                setTimeout(() => navigate('/'), 1500);
            } else {
                console.error('❌ Authentication returned false');
                setStatus('error');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.error('❌ Authentication error:', error);
            setStatus('error');
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-purple-900/20 to-cyan-900/20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                {status === 'loading' && (
                    <>
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white text-2xl font-bold mb-2">Authenticating...</p>
                        <p className="text-gray-400">Please wait while we verify your credentials</p>
                    </>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
                            <CheckCircle size={60} className="text-white" />
                        </div>
                        <p className="text-white text-3xl font-bold mb-2">Success!</p>
                        <p className="text-gray-400">Redirecting to dashboard...</p>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-red-500/50">
                            <XCircle size={60} className="text-white" />
                        </div>
                        <p className="text-white text-3xl font-bold mb-2">Authentication Failed</p>
                        <p className="text-gray-400 mb-4">Redirecting to login...</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AuthCallbackPage;
