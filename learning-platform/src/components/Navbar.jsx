// src/components/Navbar.jsx (Fixed)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, User, BookOpen, Home, Settings, LogIn, LogOut, Info,
    Trophy, Sword, MessageSquare, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsUserMenuOpen(false);

        const path = location.pathname;
        if (path === '/') setCurrentPage('home');
        else if (path === '/home') setCurrentPage('home');
        else if (path === '/feed') setCurrentPage('feed');
        else if (path === '/courses') setCurrentPage('courses');
        else if (path === '/about') setCurrentPage('about');
        else if (path.includes('/arena')) setCurrentPage('arena');
        else if (path === '/profile') setCurrentPage('profile');
        else if (path === '/settings') setCurrentPage('settings');
        else if (path === '/login') setCurrentPage('login');
    }, [location, setCurrentPage]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsUserMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-menu')) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Navigation items - Arena appears only when authenticated
    const navItems = isAuthenticated ? [
        { name: 'Home', path: '/', icon: Home, key: 'home' },
        { name: 'Feed', path: '/feed', icon: MessageSquare, key: 'feed' },
        { name: 'Arena', path: '/arena', icon: Sword, key: 'arena', isPremium: true },
        { name: 'Courses', path: '/courses', icon: BookOpen, key: 'courses' },
        { name: 'About', path: '/about', icon: Info, key: 'about' },
    ] : [
        { name: 'Home', path: '/', icon: Home, key: 'home' },
        { name: 'Courses', path: '/courses', icon: BookOpen, key: 'courses' },
        { name: 'About', path: '/about', icon: Info, key: 'about' },
    ];

    const userMenuItems = [
        { name: 'Profile', path: '/profile', icon: User, key: 'profile' },
        { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, key: 'leaderboard' },
        { name: 'Settings', path: '/settings', icon: Settings, key: 'settings' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/10'
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo - Without Crown */}
                    <Link to="/" className="flex items-center space-x-2 interactive">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent"
                        >
                            LearnForge
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
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
                                            ? item.isPremium
                                                ? 'text-yellow-400 bg-yellow-400/10'
                                                : 'text-neon-purple bg-neon-purple/10'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    } ${item.isPremium ? 'border border-yellow-400/30' : ''}`}
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium">{item.name}</span>
                                    {item.isPremium && (
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-2 h-2 bg-yellow-400 rounded-full"
                                        />
                                    )}
                                </motion.div>
                                {currentPage === item.key && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                                            item.isPremium
                                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                                : 'bg-gradient-to-r from-neon-purple to-neon-cyan'
                                        }`}
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative dropdown-menu ml-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                                >
                                    <img
                                        src={user?.avatarUrl || "/api/placeholder/32/32"}
                                        alt={user?.name || "User"}
                                        className="w-8 h-8 rounded-full border-2 border-neon-cyan group-hover:border-neon-purple transition-colors"
                                        onError={(e) => {
                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2306B6D4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                                        }}
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            {/* User Info Header */}
                                            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={user?.avatarUrl || "/api/placeholder/48/48"}
                                                        alt={user?.name || "User"}
                                                        className="w-12 h-12 rounded-full border-2 border-neon-cyan"
                                                        onError={(e) => {
                                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%2306B6D4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-semibold text-base truncate">
                                                            {user?.name || 'User'}
                                                        </p>
                                                        <p className="text-gray-400 text-sm truncate">
                                                            {user?.email || 'Welcome back!'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-3">
                                                {userMenuItems.map((item) => (
                                                    <Link
                                                        key={item.key}
                                                        to={item.path}
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-base group ${
                                                            currentPage === item.key
                                                                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                                                                : 'text-gray-300 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                                                        }`}
                                                    >
                                                        <item.icon size={20} />
                                                        <span className="font-medium">{item.name}</span>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                                            <ChevronRight size={16} />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Logout Section */}
                                            <div className="p-3 border-t border-white/10">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all text-base group"
                                                >
                                                    <LogOut size={20} />
                                                    <span className="font-medium">Logout</span>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                                        <ChevronRight size={16} />
                                                    </div>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg transition-all flex items-center gap-2"
                                >
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </motion.button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-dark-800/95 backdrop-blur-lg rounded-2xl border border-white/10 mt-4 overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl transition-all group ${
                                            currentPage === item.key
                                                ? item.isPremium
                                                    ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30'
                                                    : 'text-neon-purple bg-neon-purple/10 border border-neon-purple/30'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        <span className="font-medium">{item.name}</span>
                                        {item.isPremium && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-2 h-2 bg-yellow-400 rounded-full"
                                            />
                                        )}
                                    </Link>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <div className="border-t border-white/10 mx-2 my-2"></div>
                                        {userMenuItems.map((item) => (
                                            <Link
                                                key={item.key}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl transition-all group ${
                                                    currentPage === item.key
                                                        ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30'
                                                        : 'text-gray-300 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                                                }`}
                                            >
                                                <item.icon size={18} />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        ))}

                                        <div className="border-t border-white/10 mx-2 my-2"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center space-x-3 w-full px-4 py-3 mx-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-xl group"
                                        >
                                            <LogOut size={18} />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;