// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Removed unused 'updateDoc'

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api";
const GOOGLE_CLIENT_ID = "354410344753-k7kj6li8pgociktjun9g6ig8hohdt3p7.apps.googleusercontent.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // On mount: try to load session (covers OAuth redirects)
    useEffect(() => {
        fetchCurrentUserDirect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch session-backed user (used on mount)
    const fetchCurrentUserDirect = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/me`, {
                credentials: 'include',
            });

            if (!res.ok) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false); // ✅ Set loading false on failure
                return;
            }

            const userData = await res.json();

            if (userData && userData.email) {
                // ✅ Call fetchUser to sync Firestore
                await fetchUser(userData);
                console.log('✅ User loaded from session:', userData.email);

                // ... (rest of OAuth redirect logic) ...
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

    // Standard fetch user (used after login flows)
    // ✅ Can now accept userData to prevent a double-fetch
    const fetchUser = async (userDataFromApi) => {
        let userData = userDataFromApi;
        try {
            // If data wasn't passed in, fetch it
            if (!userData) {
                setLoading(true);
                userData = await ApiService.getCurrentUser();
            }

            if (userData && !userData.error) {
                console.log('✅ AuthContext: User authenticated via API:', userData.email);

                // ✅ --- THIS IS THE CRITICAL FIX ---
                let firestoreData = null;

                try {
                    if (db && userData.userId) {
                        const userDocRef = doc(db, 'users', userData.userId);
                        const docSnap = await getDoc(userDocRef);

                        const avatar = userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.email)}`;

                        if (!docSnap.exists()) {
                            // --- User is NEW ---
                            const userDataForFirestore = {
                                userId: userData.userId,
                                name: userData.name,
                                email: userData.email,
                                avatarUrl: avatar,
                                bio: userData.bio || 'A LearnForge User',
                                location: userData.location || '',
                                followersCount: 0,
                                followingCount: 0,
                                postsCount: 0,
                                leetcodeHandle: null // Create the field
                            };
                            await setDoc(userDocRef, userDataForFirestore);
                            firestoreData = userDataForFirestore; // Use this new data
                            console.log('✨ Firestore: created user document');
                        } else {
                            // --- User EXISTS, merge API data ---
                            await setDoc(userDocRef, {
                                name: userData.name,
                                email: userData.email,
                                avatarUrl: avatar,
                                bio: userData.bio || 'A LearnForge User',
                                location: userData.location || ''
                            }, { merge: true });

                            // Read the *merged* document back from Firestore
                            const updatedDocSnap = await getDoc(userDocRef);
                            firestoreData = updatedDocSnap.data();
                            console.log('🔄 Firestore: merged user document');
                        }
                    }
                } catch (fsErr) {
                    console.warn('Firestore sync skipped / failed:', fsErr);
                }
                // --- END OF FIX ---

                setUser({
                    userId: userData.userId,
                    name: userData.name,
                    email: userData.email,
                    avatarUrl: userData.avatarUrl,
                    bio: userData.bio,
                    location: userData.location,
                    isAdmin: userData.isAdmin || false,
                    // ✅ This now correctly sets the leetcodeHandle
                    leetcodeHandle: firestoreData?.leetcodeHandle || null
                });
                setIsAuthenticated(true);
                return true;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return false;
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            if (!userDataFromApi) {
                setLoading(false);
            }
        }
    };

    // ... (rest of AuthProvider: loginWithGithub, loginWithGoogle, etc.) ...
    // GitHub OAuth - redirect user to backend (or GitHub directly)
    const loginWithGithub = () => {
        // If your backend handles exchange, direct to backend auth route (recommended).
        // Example: window.location.href = `${BASE_URL}/oauth2/authorization/github`
        const clientId = 'Ov23litSllTjFFL7HGIv';
        const redirectUri = 'http://localhost:3000/auth/callback';
        const scope = 'read:user user:email';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        window.location.href = githubAuthUrl;
    };

    // Google OAuth - redirect to Google consent (backend callback URL used)
    const loginWithGoogle = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            `${BASE_URL}/auth/google/callback`
        )}&response_type=code&scope=openid%20email%20profile`;
        window.location.href = googleAuthUrl;
    };

    // Optional: email/password login via ApiService
    const loginWithEmail = async (email, password) => {
        try {
            const result = await ApiService.loginWithEmail(email, password);
            if (result.success) {
                await fetchUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Email login error:', error);
            return false;
        }
    };

    const signupWithEmail = async (name, email, password) => {
        try {
            const result = await ApiService.signupWithEmail(name, email, password);
            if (result.success) {
                await fetchUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };

    // Handle GitHub callback: backend exchanges code and sets session cookie
    // We POST the code to backend endpoint then refresh client session via fetchUser()
    const handleGithubCallback = async (code) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/github`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                console.error('GitHub callback backend returned non-OK:', response.status);
                return false;
            }

            const data = await response.json();
            console.log('GitHub callback response:', data);

            // Refresh session user and redirect to landing
            const ok = await fetchUser();
            if (ok) {
                window.history.replaceState({}, document.title, '/landing');
                window.location.href = '/landing';
            }
            return ok;
        } catch (error) {
            console.error('GitHub callback error:', error);
            return false;
        }
    };

    // Generic login helper (client-side)
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Logout
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
                fetchUser, // ✅ This is now exported
                fetchCurrentUserDirect,
                loginWithGithub,
                loginWithGoogle,
                loginWithEmail,
                signupWithEmail,
                handleGithubCallback
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