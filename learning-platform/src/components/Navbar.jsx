import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, BookOpen, Home, Settings, LogIn, LogOut, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // ✅ Get auth state from context
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Update current page based on location
    const path = location.pathname;
    if (path === '/') setCurrentPage('home');
    else if (path === '/courses') setCurrentPage('courses');
    else if (path === '/about') setCurrentPage('about');
    else if (path === '/profile') setCurrentPage('profile');
    else if (path === '/settings') setCurrentPage('settings');
    else if (path === '/login') setCurrentPage('login');
    else if (path.includes('/course/')) setCurrentPage('course-detail');
  }, [location, setCurrentPage]);

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  // Main navigation items
  const navItems = [
    { name: 'Home', path: '/', icon: Home, key: 'home' },
    { name: 'Courses', path: '/courses', icon: BookOpen, key: 'courses' },
    { name: 'About', path: '/about', icon: Info, key: 'about' },
  ];

  // Authenticated user items
  const authNavItems = [
    { name: 'Profile', path: '/profile', icon: User, key: 'profile' },
    { name: 'Settings', path: '/settings', icon: Settings, key: 'settings' },
  ];

  const allNavItems = [
    ...navItems,
    ...(isAuthenticated ? authNavItems : [])
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-900/80 backdrop-blur-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 interactive">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent"
            >
              LearnForge
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main Nav Items */}
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="interactive relative group"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.key
                      ? 'text-neon-purple shadow-neon-purple'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                
                {/* Active indicator */}
                {currentPage === item.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Conditional Navigation */}
            {isAuthenticated ? (
              <>
                {/* Authenticated User Links */}
                {authNavItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className="interactive relative group"
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === item.key
                          ? 'text-neon-cyan shadow-neon-cyan'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                    
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    
                    {currentPage === item.key && (
                      <motion.div
                        layoutId="activeAuthTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-3">
                  {user?.avatarUrl && (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-neon-cyan"
                    />
                  )}
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="interactive px-4 py-2 text-gray-300 hover:text-red-400 transition-colors flex items-center space-x-2 rounded-lg hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* Guest User Login Button */}
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className={`interactive px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg btn-glow transition-all duration-300 flex items-center space-x-2 ${
                      currentPage === 'login' ? 'shadow-neon-purple/50 shadow-lg' : ''
                    }`}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden interactive p-2 text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-3">
            {allNavItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`interactive flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  currentPage === item.key
                    ? 'text-neon-purple bg-neon-purple/10 shadow-neon-purple/20 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <>
                {user?.avatarUrl && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-neon-cyan"
                    />
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="interactive w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="interactive w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg">
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
