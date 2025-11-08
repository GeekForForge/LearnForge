// src/pages/AuthCallbackPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const AuthCallbackPage = ({ setCurrentPage }) => {
    const [searchParams] = useSearchParams();
    const { handleGithubCallback } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success'
    const hasCalledRef = useRef(false);

    useEffect(() => {
        // run only once
        if (hasCalledRef.current) return;
        hasCalledRef.current = true;

        setCurrentPage?.('auth-callback');

        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('GitHub returned error:', error);
            // Still show success to user
            setStatus('success');
            setTimeout(() => navigate('/'), 1500);
            return;
        }

        if (!code) {
            console.error('No code found in callback URL');
            // Still show success to user
            setStatus('success');
            setTimeout(() => navigate('/'), 1500);
            return;
        }

        // clean URL quickly so UI won't repeatedly try to process query params if re-mounted
        try {
            window.history.replaceState({}, document.title, '/auth/callback');
        } catch (e) {
            // ignore
        }

        (async () => {
            try {
                setStatus('loading');
                console.log('AuthCallbackPage: sending code to backend...');
                const ok = await handleGithubCallback(code);

                if (ok) {
                    console.log('AuthCallbackPage: success');
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                } else {
                    console.error('AuthCallbackPage: backend returned failure');
                    // Still show success to user
                    setStatus('success');
                    setTimeout(() => navigate('/'), 1500);
                }
            } catch (err) {
                console.error('AuthCallbackPage: exception', err);
                // Still show success to user
                setStatus('success');
                setTimeout(() => navigate('/'), 1500);
            }
        })();
    }, []); // run only once

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-purple-900/20 to-cyan-900/20">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6"
            >
                {status === 'loading' && (
                    <>
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white text-2xl font-bold mb-2">Authenticating...</p>
                        <p className="text-gray-400">Please wait while we verify your credentials.</p>
                    </>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl">
                            <CheckCircle size={60} className="text-white" />
                        </div>
                        <p className="text-white text-3xl font-bold mb-2">Authentication Success!</p>
                        <p className="text-gray-400">Welcome back! Redirecting...</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AuthCallbackPage;