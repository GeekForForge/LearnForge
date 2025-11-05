import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Lock, Eye, EyeOff, Save, Trash2,
    Github, Chrome, Unlink, Bell, Shield, Globe, Upload,
    CheckCircle, AlertCircle, Loader, Code, Cpu, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SettingsPage = ({ setCurrentPage }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated, updateUser, logout } = useAuth();

    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const API_BASE_URL = 'http://localhost:8080/api';

    // Real user profile data from backend
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        location: '',
        website: '',
        leetcodeUrl: '',
        gfgUrl: '',
        codechefUrl: ''
    });

    // Password change data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Coding platform URLs for connection
    const [platformUrls, setPlatformUrls] = useState({
        leetcode: '',
        gfg: '',
        codechef: ''
    });

    useEffect(() => {
        setCurrentPage('settings');

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Load real user data
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                leetcodeUrl: user.leetcodeUrl || '',
                gfgUrl: user.gfgUrl || '',
                codechefUrl: user.codechefUrl || ''
            });

            setPlatformUrls({
                leetcode: user.leetcodeUrl || '',
                gfg: user.gfgUrl || '',
                codechef: user.codechefUrl || ''
            });
        }
    }, [isAuthenticated, user, setCurrentPage]);

    const showMessage = (type, message) => {
        if (type === 'success') {
            setSuccess(message);
            setError('');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(message);
            setSuccess('');
            setTimeout(() => setError(''), 5000);
        }
    };

    // ✅ HANDLE PROFILE SAVE
    const handleProfileSave = async () => {
        setIsLoading(true);
        try {
            console.log('💾 Updating profile:', profileData);

            const response = await axios.put(
                `${API_BASE_URL}/users/${user.userId}`,
                profileData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('✅ Profile updated:', response.data);
            updateUser(response.data);
            showMessage('success', 'Profile updated successfully!');
        } catch (err) {
            console.error('❌ Error updating profile:', err);
            showMessage('error', err.response?.data || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ HANDLE PLATFORM CONNECTION
    const handlePlatformConnect = async (platform) => {
        const url = platformUrls[platform];

        if (!url) {
            showMessage('error', `Please enter your ${platform} profile URL`);
            return;
        }

        // Basic URL validation
        const urlPatterns = {
            leetcode: /leetcode\.com/,
            gfg: /geeksforgeeks\.org/,
            codechef: /codechef\.com/
        };

        if (!urlPatterns[platform].test(url)) {
            showMessage('error', `Please enter a valid ${platform} profile URL`);
            return;
        }

        setIsLoading(true);
        try {
            const updatedProfileData = {
                ...profileData,
                [`${platform}Url`]: url
            };

            const response = await axios.put(
                `${API_BASE_URL}/users/${user.userId}`,
                updatedProfileData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log(`✅ ${platform} connected:`, response.data);
            updateUser(response.data);
            setProfileData(updatedProfileData);
            showMessage('success', `${platform.charAt(0).toUpperCase() + platform.slice(1)} profile connected successfully!`);
        } catch (err) {
            console.error(`❌ Error connecting ${platform}:`, err);
            showMessage('error', err.response?.data || `Failed to connect ${platform}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ HANDLE PLATFORM DISCONNECT
    const handlePlatformDisconnect = async (platform) => {
        setIsLoading(true);
        try {
            const updatedProfileData = {
                ...profileData,
                [`${platform}Url`]: ''
            };

            const response = await axios.put(
                `${API_BASE_URL}/users/${user.userId}`,
                updatedProfileData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log(`✅ ${platform} disconnected:`, response.data);
            updateUser(response.data);
            setProfileData(updatedProfileData);
            setPlatformUrls(prev => ({ ...prev, [platform]: '' }));
            showMessage('success', `${platform.charAt(0).toUpperCase() + platform.slice(1)} profile disconnected!`);
        } catch (err) {
            console.error(`❌ Error disconnecting ${platform}:`, err);
            showMessage('error', err.response?.data || `Failed to disconnect ${platform}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ HANDLE PASSWORD CHANGE
    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'New passwords do not match!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters long!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/users/${user.userId}/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('✅ Password changed');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showMessage('success', 'Password updated successfully!');
        } catch (err) {
            console.error('❌ Error changing password:', err);
            showMessage('error', err.response?.data || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ HANDLE DELETE ACCOUNT
    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you ABSOLUTELY sure? This action cannot be undone!')) {
            return;
        }

        try {
            await axios.delete(
                `${API_BASE_URL}/users/${user.userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            showMessage('success', 'Account deleted successfully');
            setTimeout(() => {
                logout();
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error('❌ Error deleting account:', err);
            showMessage('error', 'Failed to delete account');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: User },
        { id: 'accounts', label: 'Connected Accounts', icon: Globe },
    ];

    // Coding platforms data
    const codingPlatforms = [
        {
            id: 'leetcode',
            name: 'LeetCode',
            icon: Code,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            placeholder: 'https://leetcode.com/username',
            description: 'Track your coding problems and solutions'
        },
        {
            id: 'gfg',
            name: 'GeeksforGeeks',
            icon: Cpu,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            placeholder: 'https://auth.geeksforgeeks.org/user/username',
            description: 'Connect your DSA practice profile'
        },
        {
            id: 'codechef',
            name: 'CodeChef',
            icon: Award,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            placeholder: 'https://www.codechef.com/users/username',
            description: 'Sync your competitive programming progress'
        }
    ];

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader className="w-12 h-12 text-neon-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                        Settings
                    </h1>
                    <p className="text-xl text-gray-300">
                        Manage your account preferences and security settings
                    </p>
                </motion.div>

                {/* Success/Error Messages */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3"
                    >
                        <CheckCircle size={20} className="text-green-400" />
                        <span className="text-green-400 font-medium">{success}</span>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle size={20} className="text-red-400" />
                        <span className="text-red-400 font-medium">{error}</span>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 text-neon-cyan border border-neon-purple/30'
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        <tab.icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </motion.button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">

                            {/* Profile Settings */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                                        Profile Information
                                    </h2>

                                    {/* Avatar Section */}
                                    <div className="flex items-center space-x-6 mb-8">
                                        <div className="relative">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.name}
                                                    className="w-20 h-20 rounded-full border-2 border-neon-cyan"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan p-1">
                                                    <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                            <span className="text-2xl font-orbitron font-bold text-white">
                              {user.name?.charAt(0) || 'U'}
                            </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                                            <p className="text-gray-400">{user.email}</p>
                                            {user.provider && (
                                                <p className="text-sm text-neon-cyan mt-1">
                                                    Connected via {user.provider}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-pink transition-all"
                                                placeholder="Your location"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={profileData.website}
                                                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <motion.button
                                        onClick={handleProfileSave}
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader className="animate-spin" size={18} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            )}

                            {/* Connected Accounts */}
                            {activeTab === 'accounts' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                                        Connected Accounts
                                    </h2>

                                    {/* GitHub Account */}
                                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                                                <Github size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">GitHub Account</h4>
                                                <p className="text-sm text-gray-400">
                                                    {user.provider === 'github' ? `Connected as ${user.email}` : 'Connect your GitHub account'}
                                                </p>
                                            </div>
                                        </div>
                                        {user.provider === 'github' ? (
                                            <span className="px-4 py-2 bg-green-500/20 text-green-400 font-medium rounded-lg border border-green-500/30">
                        Connected
                      </span>
                                        ) : (
                                            <motion.button
                                                onClick={() => window.location.href = '/login'}
                                                whileHover={{ scale: 1.05 }}
                                                className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg transition-all flex items-center space-x-2"
                                            >
                                                <Github size={16} />
                                                <span>Connect</span>
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* Coding Platforms */}
                                    {codingPlatforms.map((platform) => {
                                        const isConnected = profileData[`${platform.id}Url`];
                                        const PlatformIcon = platform.icon;

                                        return (
                                            <div key={platform.id} className={`p-6 rounded-xl border ${platform.borderColor} ${platform.bgColor}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${platform.bgColor}`}>
                                                            <PlatformIcon size={24} className={platform.color} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">{platform.name}</h4>
                                                            <p className="text-sm text-gray-400">
                                                                {isConnected ? `Connected: ${profileData[`${platform.id}Url`]}` : platform.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {isConnected ? (
                                                        <div className="flex items-center space-x-3">
                              <span className="px-4 py-2 bg-green-500/20 text-green-400 font-medium rounded-lg border border-green-500/30">
                                Connected
                              </span>
                                                            <motion.button
                                                                onClick={() => handlePlatformDisconnect(platform.id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                                                title="Disconnect"
                                                            >
                                                                <Unlink size={16} />
                                                            </motion.button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="url"
                                                                value={platformUrls[platform.id]}
                                                                onChange={(e) => setPlatformUrls(prev => ({
                                                                    ...prev,
                                                                    [platform.id]: e.target.value
                                                                }))}
                                                                placeholder={platform.placeholder}
                                                                className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-all w-80"
                                                            />
                                                            <motion.button
                                                                onClick={() => handlePlatformConnect(platform.id)}
                                                                disabled={isLoading}
                                                                whileHover={{ scale: 1.05 }}
                                                                className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg transition-all flex items-center space-x-2 disabled:opacity-50"
                                                            >
                                                                {isLoading ? (
                                                                    <Loader className="animate-spin" size={16} />
                                                                ) : (
                                                                    <CheckCircle size={16} />
                                                                )}
                                                                <span>Connect</span>
                                                            </motion.button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Info Section */}
                                    <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 p-6 rounded-xl border border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-2">Why connect coding platforms?</h3>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            <li>• Track your coding progress and achievements</li>
                                            <li>• Sync your problem-solving statistics</li>
                                            <li>• Showcase your coding profiles to the community</li>
                                            <li>• Get personalized learning recommendations</li>
                                            <li>• Compete with friends on coding platforms</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;