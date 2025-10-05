import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, BookOpen, Home, Settings, LogIn, LogOut, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();

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
        // Close user menu when route changes
        setIsUserMenuOpen(false);

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
        setIsUserMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isUserMenuOpen && !event.target.closest('.user-menu')) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen]);

    // Main navigation items
    const navItems = [
        { name: 'Home', path: '/', icon: Home, key: 'home' },
        { name: 'Courses', path: '/courses', icon: BookOpen, key: 'courses' },
        { name: 'About', path: '/about', icon: Info, key: 'about' },
    ];

    // User dropdown menu items
    const userMenuItems = [
        { name: 'Profile', path: '/profile', icon: User, key: 'profile' },
        { name: 'Settings', path: '/settings', icon: Settings, key: 'settings' },
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
                                {/* User Dropdown Menu - Only Avatar Icon */}
                                <div className="relative user-menu">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                                    >
                                        {/* Only User Avatar - No Name */}
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={user?.avatarUrl || "/api/placeholder/32/32"}
                                                alt={user?.name || "User"}
                                                className="w-8 h-8 rounded-full border-2 border-neon-cyan"
                                                onError={(e) => {
                                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2306B6D4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                    </motion.button>

                                    {/* Dropdown Menu - Made Bigger */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-64 bg-dark-800/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl shadow-neon-purple/20 overflow-hidden"
                                            >
                                                {/* User Info Section - Made Bigger */}
                                                <div className="p-5 border-b border-white/10">
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

                                                {/* Menu Items - Made Bigger */}
                                                <div className="p-3">
                                                    {userMenuItems.map((item) => (
                                                        <Link
                                                            key={item.key}
                                                            to={item.path}
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
                                                                currentPage === item.key
                                                                    ? 'bg-neon-purple/20 text-neon-purple'
                                                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                            }`}
                                                        >
                                                            <item.icon size={20} />
                                                            <span className="font-medium">{item.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Logout Button - Made Bigger */}
                                                <div className="p-3 border-t border-white/10">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 text-base"
                                                    >
                                                        <LogOut size={20} />
                                                        <span className="font-medium">Logout</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                        {navItems.map((item) => (
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
                                {/* User Menu Items in Mobile */}
                                {userMenuItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`interactive flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                                            currentPage === item.key
                                                ? 'text-neon-cyan bg-neon-cyan/10 shadow-neon-cyan/20 shadow-lg'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <item.icon size={18} />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}

                                {/* User Info in Mobile */}
                                <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10 mt-3 pt-4">
                                    <img
                                        src={user?.avatarUrl || "/api/placeholder/32/32"}
                                        alt={user?.name || "User"}
                                        className="w-10 h-10 rounded-full border-2 border-neon-cyan"
                                        onError={(e) => {
                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2306B6D4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-base truncate">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-gray-400 text-sm truncate">
                                            {user?.email || 'Welcome back!'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="interactive w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-lg text-base"
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