// src/pages/UserProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Github,
    Mail,
    BookOpen,
    Clock,
    TrendingUp,
    Flame,
    CheckCircle
} from 'lucide-react';
import ApiService from '../services/api';

const UserProfilePage = ({ setCurrentPage }) => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalLessonsCompleted: 0
    });

    useEffect(() => {
        setCurrentPage('user-profile');
        fetchUserProfile();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching profile for user:', userId);

            // Fetch user info, progress, and streak
            const [userInfo, progressData, streak] = await Promise.all([
                ApiService.getUserById(userId),
                ApiService.getUserProgress(userId),
                ApiService.getUserStreak(userId)
            ]);

            setUser(userInfo);
            setUserProgress(progressData);
            setStreakData(streak);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching user profile:', err);
            setError('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-dark-900 via-purple-900/20 to-cyan-900/20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-dark-900 via-purple-900/20 to-cyan-900/20">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error || 'User not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-purple-900/20 to-cyan-900/20 pt-24 px-6 pb-12">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-6"
                >
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-neon-cyan/30 shadow-lg shadow-neon-cyan/20">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white text-5xl font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-orbitron font-bold text-white mb-3">
                                {user.name}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-4">
                                {user.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-neon-cyan" />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                                {user.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-neon-purple" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-neon-cyan" />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {user.bio && (
                                <p className="text-gray-300 mb-4 text-lg">{user.bio}</p>
                            )}

                            {user.provider === 'GITHUB' && (
                                <a
                                    href={`https://github.com/${user.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 text-white rounded-xl transition-all hover:border-neon-cyan/30"
                                >
                                    <Github size={18} />
                                    <span>View GitHub Profile</span>
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                {userProgress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            icon={<BookOpen className="text-neon-purple" size={28} />}
                            label="Courses Enrolled"
                            value={userProgress.totalCourses || 0}
                            color="purple"
                            delay={0.1}
                        />

                        <StatCard
                            icon={<CheckCircle className="text-green-400" size={28} />}
                            label="Lessons Completed"
                            value={userProgress.completedLessons || 0}
                            color="green"
                            delay={0.2}
                        />

                        <StatCard
                            icon={<Clock className="text-neon-cyan" size={28} />}
                            label="Watch Time"
                            value={`${Math.floor((userProgress.totalWatchTime || 0) / 60)}h`}
                            color="cyan"
                            delay={0.3}
                        />

                        <StatCard
                            icon={<Flame className="text-orange-400" size={28} />}
                            label="Current Streak"
                            value={`${streakData.currentStreak || 0}🔥`}
                            color="orange"
                            delay={0.4}
                        />
                    </div>
                )}

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                >
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                        <TrendingUp className="text-neon-cyan" size={28} />
                        Learning Journey
                    </h2>

                    {userProgress?.recentActivity && userProgress.recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {userProgress.recentActivity.map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-neon-cyan/30"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BookOpen size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold">{activity.courseName}</p>
                                        <p className="text-gray-400 text-sm">{activity.lessonName}</p>
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {new Date(activity.completedAt).toLocaleDateString()}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen size={64} className="mx-auto text-gray-500 mb-4 opacity-30" />
                            <p className="text-gray-400">No recent activity</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color, delay }) => {
    const colorClasses = {
        purple: 'bg-neon-purple/10 border-neon-purple/30 hover:bg-neon-purple/20',
        cyan: 'bg-neon-cyan/10 border-neon-cyan/30 hover:bg-neon-cyan/20',
        green: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
        orange: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`${colorClasses[color]} border backdrop-blur-sm rounded-2xl p-6 transition-all cursor-default`}
        >
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfilePage;