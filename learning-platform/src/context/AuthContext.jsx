import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api";
const GOOGLE_CLIENT_ID = "354410344753-k7kj6li8pgociktjun9g6ig8hohdt3p7.apps.googleusercontent.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUserDirect();
    }, []);

    const fetchCurrentUserDirect = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/me`, {
                credentials: 'include',
            });

            if (res.ok) {
                const userData = await res.json();
                if (userData && userData.email) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ User loaded from session:', userData.email);

                    // ✅ Detect Google OAuth callback
                    const urlParams = new URLSearchParams(window.location.search);
                    const fromGoogle =
                        urlParams.get('code') ||
                        window.location.pathname.includes('/auth/google/callback');

                    if (fromGoogle) {
                        console.log('🌐 Redirecting to /landing after Google login');
                        // Clean redirect (same style as GitHub)
                        window.history.replaceState({}, document.title, '/landing');
                        window.location.href = '/landing';
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error('Session fetch error:', err);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Standard email fetch (kept for completeness)
    const fetchUser = async () => {
        try {
            const userData = await ApiService.getCurrentUser();
            if (userData && !userData.error) {
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
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // ✅ GitHub OAuth login
    const loginWithGithub = () => {
        const clientId = 'Ov23litSllTjFFL7HGIv';
        const redirectUri = 'http://localhost:3000/auth/callback';
        const scope = 'read:user user:email';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = githubAuthUrl;
    };

    // ✅ Google OAuth login — same behavior as GitHub
    const loginWithGoogle = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            `${BASE_URL}/auth/google/callback`
        )}&response_type=code&scope=openid%20email%20profile`;
        window.location.href = googleAuthUrl;
    };

    // ✅ GitHub callback handler
    const handleGithubCallback = async (code) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/github`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                setUser(null);
                setIsAuthenticated(false);
                return false;
            }

            const data = await response.json();
            if (data.user) {
                setUser(data.user);
                setIsAuthenticated(true);

                // ✅ Redirect to Landing page after GitHub login
                console.log('🌐 Redirecting to /landing after GitHub login');
                window.location.href = '/landing';
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            console.error('GitHub callback error:', error);
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch(`${BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
                fetchUser,
                fetchCurrentUserDirect,
                loginWithGithub,
                loginWithGoogle,
                handleGithubCallback,
            }}
        >
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
