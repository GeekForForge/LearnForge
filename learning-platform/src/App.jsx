import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './globals.css';

// Import Pages
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AboutPage from './pages/AboutPage';
import Feed from './pages/Feed';
import Community from './pages/Community';
import Leaderboard from './pages/Leaderboard';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Home from './pages/Home';
import Resources from './pages/Resources';


// Admin
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdminPageNew from './pages/AdminPageNew';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DynamicCursor from './components/DynamicCursor';
import ParticleBackground from './components/ParticleBackground';
import SmoothScrolling from './components/SmoothScrolling';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';

function AppContent() {
    const [currentPage, setCurrentPage] = useState('landing');

    useEffect(() => {
        // Initialize dynamic cursor
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);

        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);

        const moveCursor = (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                cursorTrail.style.left = e.clientX + 'px';
                cursorTrail.style.top = e.clientY + 'px';
            }, 100);
        };

        document.addEventListener('mousemove', moveCursor);

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            if (cursorTrail.parentNode) cursorTrail.parentNode.removeChild(cursorTrail);
        };
    }, []);

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5,
    };

    return (
        <div className="App min-h-screen bg-dark-900 text-white overflow-hidden">
            <ParticleBackground />
            <DynamicCursor />
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="relative z-10"
                >
                    <Routes>
                        <Route
                            path="/"
                            element={<LandingPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/home"
                            element={<Home setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/feed"
                            element={<Feed setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/messages"
                            element={<Messages setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/notifications"
                            element={<Notifications setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/leaderboard"
                            element={<Leaderboard setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/community"
                            element={<Community setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/courses"
                            element={<CoursesPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/course/:id"
                            element={<CourseDetailPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/profile"
                            element={<ProfilePage setCurrentPage={setCurrentPage} />}
                        />
                        <Route path="/resources" element={<Resources />} />
                        <Route
                            path="/login"
                            element={<LoginPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/signup"
                            element={<SignUpPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/settings"
                            element={<SettingsPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/auth/callback"
                            element={<AuthCallbackPage setCurrentPage={setCurrentPage} />}
                        />
                        <Route
                            path="/about"
                            element={<AboutPage setCurrentPage={setCurrentPage} />}
                        />
                        {/* ✅ Protected Admin Route */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminPageNew setCurrentPage={setCurrentPage} />
                                </ProtectedAdminRoute>
                            }
                        />
                    </Routes>
                </motion.div>
            </AnimatePresence>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ProgressProvider>
                    <SmoothScrolling>
                        <AppContent />
                    </SmoothScrolling>
                </ProgressProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
