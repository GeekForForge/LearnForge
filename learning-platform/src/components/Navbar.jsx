// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, User, BookOpen, Home, Settings, LogIn, LogOut, Info,
    Bell, MessageSquare, Users, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const location = useLocation();

    const { user, isAuthenticated, logout } = useAuth();

    // Mock data for notifications and messages
    const [notificationCount] = useState(3);
    const [messageCount] = useState(5);

    const notifications = [
        {
            id: 1,
            message: 'John Doe sent you a friend request',
            time: '2 hours ago',
            unread: true
        },
        {
            id: 2,
            message: 'Jane replied to your discussion',
            time: '5 hours ago',
            unread: true
        },
        {
            id: 3,
            message: 'You earned the "7 Day Streak" badge!',
            time: '1 day ago',
            unread: false
        },
    ];

    const messages = [
        {
            id: 1,
            user: 'Alice Johnson',
            avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson',
            message: 'Hey! Can you help me with React hooks?',
            time: '2m ago',
            unread: true,
            online: true
        },
        {
            id: 2,
            user: 'Bob Smith',
            avatar: 'https://ui-avatars.com/api/?name=Bob+Smith',
            message: 'Thanks for the DSA notes!',
            time: '1h ago',
            unread: true,
            online: false
        },
        {
            id: 3,
            user: 'Carol White',
            avatar: 'https://ui-avatars.com/api/?name=Carol+White',
            message: 'Lets start a study group',
            time: '3h ago',
            unread: false,
            online: true
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
        setIsMessageOpen(false);

        const path = location.pathname;
        if (path === '/') setCurrentPage('home');
        else if (path === '/courses') setCurrentPage('courses');
        else if (path === '/about') setCurrentPage('about');
        else if (path === '/community') setCurrentPage('community');
        else if (path === '/messages') setCurrentPage('messages');
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-menu')) {
                setIsUserMenuOpen(false);
                setIsNotificationOpen(false);
                setIsMessageOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Main navigation items - ADDED COMMUNITY
    const navItems = [
        { name: 'Home', path: '/', icon: Home, key: 'home' },
        { name: 'Courses', path: '/courses', icon: BookOpen, key: 'courses' },
        { name: 'Community', path: '/community', icon: Users, key: 'community' }, // NEW!
        { name: 'About', path: '/about', icon: Info, key: 'about' },
    ];

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

                                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

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

                        {isAuthenticated && (
                            <>
                                {/* Notifications */}
                                <div className="relative dropdown-menu">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setIsNotificationOpen(!isNotificationOpen);
                                            setIsMessageOpen(false);
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                                    >
                                        <Bell size={20} className="text-gray-300" />
                                        {notificationCount > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                {notificationCount}
                                            </span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {isNotificationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-80 bg-dark-800/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                                    <h3 className="font-semibold text-white">Notifications</h3>
                                                    <button className="text-xs text-neon-cyan hover:text-neon-purple transition-colors">
                                                        Mark all read
                                                    </button>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.map((notif) => (
                                                        <div
                                                            key={notif.id}
                                                            className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                                                                notif.unread ? 'bg-neon-purple/10' : ''
                                                            }`}
                                                        >
                                                            <p className="text-sm text-gray-200">{notif.message}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link
                                                    to="/notifications"
                                                    className="block px-4 py-3 text-center text-sm text-neon-cyan hover:bg-white/5 font-medium"
                                                >
                                                    View All Notifications
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Messages */}
                                <div className="relative dropdown-menu">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setIsMessageOpen(!isMessageOpen);
                                            setIsNotificationOpen(false);
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                                    >
                                        <MessageSquare size={20} className="text-gray-300" />
                                        {messageCount > 0 && (
                                            <span className="absolute top-0 right-0 bg-neon-cyan text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                {messageCount}
                                            </span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {isMessageOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-80 bg-dark-800/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-white/10">
                                                    <h3 className="font-semibold text-white">Messages</h3>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {messages.map((msg) => (
                                                        <div
                                                            key={msg.id}
                                                            className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                                                                msg.unread ? 'bg-neon-cyan/10' : ''
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="relative">
                                                                    <img
                                                                        src={msg.avatar}
                                                                        alt={msg.user}
                                                                        className="w-10 h-10 rounded-full"
                                                                    />
                                                                    {msg.online && (
                                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="font-semibold text-sm text-white truncate">{msg.user}</p>
                                                                        <span className="text-xs text-gray-500">{msg.time}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-400 truncate">{msg.message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link
                                                    to="/messages"
                                                    className="block px-4 py-3 text-center text-sm text-neon-cyan hover:bg-white/5 font-medium"
                                                >
                                                    View All Messages
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative dropdown-menu">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setIsUserMenuOpen(!isUserMenuOpen);
                                        setIsNotificationOpen(false);
                                        setIsMessageOpen(false);
                                    }}
                                    className="flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                                >
                                    <img
                                        src={user?.avatarUrl || "/api/placeholder/32/32"}
                                        alt={user?.name || "User"}
                                        className="w-8 h-8 rounded-full border-2 border-neon-cyan"
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
                                            className="absolute right-0 mt-2 w-64 bg-dark-800/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl shadow-neon-purple/20 overflow-hidden"
                                        >
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
                        ) : (
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

                        {isAuthenticated ? (
                            <>
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
