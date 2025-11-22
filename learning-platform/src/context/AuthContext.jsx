import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/api';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api";
const GOOGLE_CLIENT_ID = "354410344753-k7kj6li8pgociktjun9g6ig8hohdt3p7.apps.googleusercontent.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUserDirect = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/me`, {
                credentials: 'include',
            });

            if (!res.ok) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            const userData = await res.json();

            if (userData && userData.email) {
                await fetchUser(userData);
                console.log('✅ User loaded from session:', userData.email);
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

    const fetchUser = async (userDataFromApi) => {
        let userData = userDataFromApi;
        try {
            if (!userData) {
                setLoading(true);
                userData = await ApiService.getCurrentUser();
            }

            if (userData && !userData.error) {
                console.log('✅ AuthContext: User authenticated via API:', userData.email);
                let firestoreData = null;
                try {
                    if (db && userData.userId) {
                        const userDocRef = doc(db, 'users', userData.userId);
                        const docSnap = await getDoc(userDocRef);

                        const avatar = userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.email)}`;

                        if (!docSnap.exists()) {
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
                                leetcodeHandle: null,
                                leetcodeUrl: null, // leetcodeUrl was missing, good to add
                                gfgUrl: null,       // <-- ADDED
                                codechefUrl: null   // <-- ADDED
                            };
                            await setDoc(userDocRef, userDataForFirestore);
                            firestoreData = userDataForFirestore;
                            console.log('✨ Firestore: created user document');
                        } else {
                            await setDoc(userDocRef, {
                                name: userData.name,
                                email: userData.email,
                                avatarUrl: avatar,
                                bio: userData.bio || 'A LearnForge User',
                                location: userData.location || ''
                            }, { merge: true });

                            const updatedDocSnap = await getDoc(userDocRef);
                            firestoreData = updatedDocSnap.data();
                            console.log('🔄 Firestore: merged user document');
                        }
                    }
                } catch (fsErr) {
                    console.warn('Firestore sync skipped / failed:', fsErr);
                }

                setUser({
                    userId: userData.userId,
                    name: userData.name,
                    email: userData.email,
                    avatarUrl: userData.avatarUrl,
                    bio: userData.bio,
                    location: userData.location,
                    isAdmin: userData.isAdmin || false,
                    leetcodeHandle: firestoreData?.leetcodeHandle || null,
                    leetcodeUrl: firestoreData?.leetcodeUrl || null, // leetcodeUrl was missing, good to add
                    gfgUrl: firestoreData?.gfgUrl || null,           // <-- ADDED
                    codechefUrl: firestoreData?.codechefUrl || null   // <-- ADDED
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

            const ok = await fetchUser();
            if (ok) {
                try {
                    const newUrl = '/landing';
                    window.history.replaceState({}, document.title, newUrl);
                    window.location.href = newUrl;
                } catch (e) {
                    window.location.href = '/landing';
                }
            }
            return ok;
        } catch (error) {
            console.error('GitHub callback error:', error);
            return false;
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const pathname = window.location.pathname || '';
                const isCallbackRoute = pathname.startsWith('/auth/callback');

                if (isCallbackRoute) {
                    console.log('AuthProvider: on /auth/callback — skipping initial session-check (callback page will handle auth).');
                    setLoading(false);
                    return;
                }

                if (code) {
                    setLoading(true);
                    console.log('AuthProvider: Detected OAuth code on non-callback route — handling it centrally.', code);

                    const ok = await handleGithubCallback(code);
                    try {
                        const base = window.location.pathname;
                        window.history.replaceState({}, document.title, base);
                    } catch (e) { /* ignore */ }

                    if (!ok) {
                        await fetchCurrentUserDirect();
                    }
                } else {
                    await fetchCurrentUserDirect();
                }
            } catch (err) {
                console.error('Auth init error:', err);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const loginWithGithub = () => {
        const clientId = 'Ov23litSllTjFFL7HGIv';
        const redirectUri = 'http://localhost:3000/auth/callback';
        const scope = 'read:user user:email';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = githubAuthUrl;
    };
    const loginWithGoogle = () => {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            `${BASE_URL}/auth/google/callback`
        )}&response_type=code&scope=openid%20email%20profile`;
        window.location.href = googleAuthUrl;
    };
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

    // ✅ Fix: Expose updateUser!
    const updateUser = async (data) => {
        if (!user) return false;
        if (!data || typeof data !== 'object') {
            console.warn('updateUser called with invalid data. Data must be an object.');
            return false;
        }
        try {
            const userDocRef = doc(db, 'users', user.userId);
            await updateDoc(userDocRef, data);
            await fetchUser(); // This re-fetches and updates the global user state
            await fetchUser();
            return true;
        } catch (error) {
            console.error("Error updating user data:", error);
            return false;
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
                loginWithEmail,
                signupWithEmail,
                handleGithubCallback,
                updateUser
                updateUser     // ✅——— ADD THIS LINE!
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