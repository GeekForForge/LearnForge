import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            console.log('🔍 AuthContext: Fetching user...');
            const userData = await ApiService.getCurrentUser();

            console.log('📦 AuthContext: User data received:', userData);

            if (userData && !userData.error) {
                console.log('✅ AuthContext: User authenticated');
                console.log('   - Name:', userData.name);
                console.log('   - Email:', userData.email);
                console.log('   - isAdmin:', userData.isAdmin);

                setUser({
                    userId: userData.userId,
                    name: userData.name,
                    email: userData.email,
                    avatarUrl: userData.avatarUrl,
                    bio: userData.bio,
                    location: userData.location,
                    isAdmin: userData.isAdmin || false,
                });
                setIsAuthenticated(true);
            } else {
                console.log('❌ AuthContext: No user data or error');
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('❌ AuthContext: Error fetching user:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // ✅ GitHub OAuth Login - Redirect to GitHub
    const loginWithGithub = () => {
        const clientId = 'Ov23litSllTjFFL7HGIv';
        const redirectUri = 'http://localhost:3000/auth/callback'; // ✅ FIXED
        const scope = 'read:user user:email';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        console.log('🔐 Redirecting to GitHub OAuth...');
        console.log('   - Client ID:', clientId);
        console.log('   - Redirect URI:', redirectUri);
        window.location.href = githubAuthUrl;
    };


    // ✅ Handle GitHub Callback - Process the code
    const handleGithubCallback = async (code) => {
        try {
            console.log('🔐 AuthContext: Processing GitHub callback with code:', code);

            // Send code to backend
            const response = await fetch('http://localhost:8080/api/auth/github', {
                method: 'POST',
                credentials: 'include', // ✅ CRITICAL for sessions
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            console.log('📡 Backend response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend error:', errorText);
                throw new Error(`Authentication failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Backend response data:', data);

            if (data.user) {
                console.log('✅ User authenticated:', data.user.email);

                // Set user in context
                setUser({
                    userId: data.user.userId,
                    name: data.user.name || data.user.username,
                    email: data.user.email,
                    avatarUrl: data.user.avatarUrl || data.user.avatar_url,
                    bio: data.user.bio,
                    location: data.user.location,
                    isAdmin: data.user.isAdmin || false,
                });
                setIsAuthenticated(true);

                // Fetch fresh user data to ensure isAdmin is loaded
                await fetchUser();

                return true;
            } else {
                console.error('❌ No user in response');
                return false;
            }
        } catch (error) {
            console.error('❌ AuthContext: handleGithubCallback error:', error);
            return false;
        }
    };

    const login = (userData) => {
        console.log('🔐 AuthContext: Login called with:', userData);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            console.log('👋 AuthContext: Logging out...');
            await ApiService.logout();
            setUser(null);
            setIsAuthenticated(false);
            console.log('✅ AuthContext: Logout complete');
        } catch (error) {
            console.error('❌ AuthContext: Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout,
            fetchUser,
            loginWithGithub,      // ✅ For login button
            handleGithubCallback  // ✅ For callback page
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};