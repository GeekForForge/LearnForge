// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';

import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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

    // ✅ GitHub OAuth Login
    const loginWithGithub = () => {
        const clientId = 'Ov23litSllTjFFL7HGIv';
        const redirectUri = 'http://localhost:3000/auth/callback';
        const scope = 'read:user user:email';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
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

                // This will trigger fetchUser() which now handles Firestore doc creation
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