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

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DynamicCursor from './components/DynamicCursor';
import ParticleBackground from './components/ParticleBackground';
import SmoothScrolling from './components/SmoothScrolling';

// Import Auth Context
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <AuthProvider>
      <Router>
        <SmoothScrolling>
          <div className="App min-h-screen bg-dark-900 text-white overflow-hidden">
            {/* Global Particle Background */}
            <ParticleBackground />
            
            {/* Dynamic Cursor */}
            <DynamicCursor />
            
            {/* Navigation */}
            <Navbar 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
            
            {/* Main Content */}
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
                </Routes>
              </motion.div>
            </AnimatePresence>
            
            {/* Footer */}
            <Footer />
          </div>
        </SmoothScrolling>
      </Router>
    </AuthProvider>
  );
}

export default App;
