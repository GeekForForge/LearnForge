// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api";
const GOOGLE_CLIENT_ID = "354410344753-k7kj6li8pgociktjun9g6ig8hohdt3p7.apps.googleusercontent.com";
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
                console.log('✅ AuthContext: User authenticated');

                // ✅ --- START: CREATE/UPDATE USER DOCUMENT IN FIRESTORE ---

                // 1. Create a reference to the user's document
                const userDocRef = doc(db, "users", userData.userId);

                // 2. Check if the document already exists
                const docSnap = await getDoc(userDocRef);

                if (!docSnap.exists()) {
                    // 3. If the user is NEW, create the document with all default fields
                    console.log('✨ Creating new user document in Firestore...');
                    const userDataForFirestore = {
                        userId: userData.userId,
                        name: userData.name,
                        email: userData.email,
                        avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}`,
                        bio: userData.bio || "A LearnForge User",
                        location: userData.location || "",
                        followersCount: 0,
                        followingCount: 0,
                        postsCount: 0
                        // Add any other fields you want to initialize
                    };
                    await setDoc(userDocRef, userDataForFirestore);
                } else {
                    // 4. If the user EXISTS, just update their profile info
                    //    We use { merge: true } so we don't overwrite the counts
                    console.log('🔄 Merging existing user document in Firestore...');
                    await setDoc(userDocRef, {
                        name: userData.name,
                        email: userData.email,
                        avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}`,
                        bio: userData.bio || "A LearnForge User",
                        location: userData.location || "",
                    }, { merge: true });
                }
                // ✅ --- END: CREATE/UPDATE USER DOCUMENT IN FIRESTORE ---


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
    // ✅ GitHub OAuth Login
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
        console.log('🔐 Redirecting to GitHub OAuth...');
        window.location.href = githubAuthUrl;
    };

    // ✅ Google OAuth Login
    const loginWithGoogle = () => {
        console.log('🔐 Redirecting to Google OAuth...');
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    // ✅ Email/Password Login
    const loginWithEmail = async (email, password) => {
        try {
            console.log('🔐 AuthContext: Email login attempt for:', email);
            const result = await ApiService.loginWithEmail(email, password);

            if (result.success) {
                await fetchUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ AuthContext: Email login error:', error);
            return false;
        }
    };

    // ✅ Email/Password Signup
    const signupWithEmail = async (name, email, password) => {
        try {
            console.log('🔐 AuthContext: Email signup attempt for:', email);
            const result = await ApiService.signupWithEmail(name, email, password);

            if (result.success) {
                await fetchUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ AuthContext: Email signup error:', error);
            return false;
        }
    };

    // ✅ Handle GitHub Callback
    const handleGithubCallback = async (code) => {
        try {
            console.log('🔐 AuthContext: Processing GitHub callback with code:', code);

            const response = await fetch('http://localhost:8080/api/auth/github', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                console.log('✅ User authenticated:', data.user.email);

                // This will trigger fetchUser() which now handles Firestore doc creation
                await fetchUser();

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
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout,
            fetchUser,
            loginWithGithub,
            loginWithGoogle,
            loginWithEmail,
            signupWithEmail,
            handleGithubCallback
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthContext');
    }
    return context;
};
