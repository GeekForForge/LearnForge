import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    console.log('🔒 ProtectedAdminRoute Check:');
    console.log('  - Loading:', loading);
    console.log('  - isAuthenticated:', isAuthenticated);
    console.log('  - user:', user);
    console.log('  - user.isAdmin:', user?.isAdmin);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to home');
        return <Navigate to="/" replace />;
    }

    if (!user?.isAdmin) {
        console.log('❌ Not admin, showing unauthorized');
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-6xl mb-4">⛔</div>
                    <h2 className="text-3xl font-bold text-white mb-4">Unauthorized</h2>
                    <p className="text-gray-400 mb-6">
                        You don't have admin privileges to access this page.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                        <p className="text-sm text-red-400">
                            <strong>Debug Info:</strong><br/>
                            Email: {user?.email}<br/>
                            isAdmin: {String(user?.isAdmin)}<br/>
                            Type: {typeof user?.isAdmin}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-neon-cyan text-white rounded-lg hover:bg-neon-cyan/80 transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    console.log('✅ Admin access granted!');
    return children;
};

export default ProtectedAdminRoute;
