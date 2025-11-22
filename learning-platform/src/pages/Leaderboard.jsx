// src/pages/Leaderboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Star, Award, TrendingUp, Crown, Zap, Target } from 'lucide-react';

const Leaderboard = ({ setCurrentPage }) => {
    const [timeRange, setTimeRange] = useState('week'); // week, month, all-time

    const leaderboardData = [
        {
            rank: 1,
            name: 'Vikram Patel',
            username: '@vikram-dev',
            avatar: 'https://ui-avatars.com/api/?name=Vikram+Patel&background=FFD700&color=000',
            level: 25,
            xp: 8500,
            streak: 45,
            badge: '💎',
            positionChange: 0,
            progress: 85
        },
        {
            rank: 2,
            name: 'Priya Sharma',
            username: '@priya-dev',
            avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=C0C0C0&color=000',
            level: 22,
            xp: 7200,
            streak: 32,
            badge: '⭐',
            positionChange: 1,
            progress: 72
        },
        {
            rank: 3,
            name: 'Ananya Singh',
            username: '@ananya-learns',
            avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=CD7F32&color=fff',
            level: 19,
            xp: 5800,
            streak: 28,
            badge: '🔥',
            positionChange: -1,
            progress: 58
        },
        {
            rank: 4,
            name: 'Rahul Kumar',
            username: '@rahul-code',
            avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=8B5CF6&color=fff',
            level: 18,
            xp: 5200,
            streak: 21,
            badge: '🌟',
            positionChange: 0,
            progress: 52
        },
        {
            rank: 5,
            name: 'Samarth Patil',
            username: '@samarth-sachin',
            avatar: 'https://ui-avatars.com/api/?name=Samarth+Patil&background=06B6D4&color=fff',
            level: 15,
            xp: 4200,
            streak: 7,
            badge: '✨',
            positionChange: 2,
            progress: 42
        },
        {
            rank: 6,
            name: 'Neha Gupta',
            username: '@neha-codes',
            avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=EC4899&color=fff',
            level: 14,
            xp: 3800,
            streak: 15,
            badge: '🎯',
            positionChange: -1,
            progress: 38
        },
        {
            rank: 7,
            name: 'Arjun Singh',
            username: '@arjun-dev',
            avatar: 'https://ui-avatars.com/api/?name=Arjun+Singh&background=F59E0B&color=fff',
            level: 13,
            xp: 3500,
            streak: 12,
            badge: '🚀',
            positionChange: 0,
            progress: 35
        },
        {
            rank: 8,
            name: 'Divya Reddy',
            username: '@divya-learns',
            avatar: 'https://ui-avatars.com/api/?name=Divya+Reddy&background=10B981&color=fff',
            level: 12,
            xp: 3200,
            streak: 10,
            badge: '💪',
            positionChange: -2,
            progress: 32
        },
    ];

    React.useEffect(() => {
        setCurrentPage('leaderboard');
    }, [setCurrentPage]);

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1:
                return {
                    bg: 'from-yellow-400/20 to-amber-500/20',
                    border: 'border-yellow-400/40',
                    glow: 'shadow-xl shadow-yellow-500/20',
                    icon: <Crown className="text-yellow-400" size={28} />
                };
            case 2:
                return {
                    bg: 'from-gray-400/20 to-gray-300/20',
                    border: 'border-gray-400/40',
                    glow: 'shadow-lg shadow-gray-400/15',
                    icon: <Medal className="text-gray-300" size={26} />
                };
            case 3:
                return {
                    bg: 'from-orange-600/20 to-orange-500/20',
                    border: 'border-orange-500/40',
                    glow: 'shadow-lg shadow-orange-500/15',
                    icon: <Medal className="text-orange-400" size={24} />
                };
            default:
                return {
                    bg: 'bg-white/5',
                    border: 'border-white/10',
                    glow: '',
                    icon: <span className="text-xl font-bold text-white/60">#{rank}</span>
                };
        }
    };

    return (
        <div className="min-h-screen pt-20">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="relative">
                            <Trophy size={48} className="text-yellow-400 drop-shadow-lg" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                            Leaderboard
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg font-light">
                        Climb the ranks and become a LearnForge champion! 🏆
                    </p>
                </motion.div>

                {/* Time Range Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-3 mb-12"
                >
                    {['week', 'month', 'all-time'].map((range) => (
                        <motion.button
                            key={range}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-3 rounded-2xl font-semibold backdrop-blur-lg border transition-all ${
                                timeRange === range
                                    ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-white border-purple-400/50 shadow-lg shadow-purple-500/20'
                                    : 'bg-white/5 text-white/70 border-white/20 hover:border-white/40 hover:text-white'
                            }`}
                        >
                            {range === 'week' && 'This Week'}
                            {range === 'month' && 'This Month'}
                            {range === 'all-time' && 'All Time'}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Top 3 Podium */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    {leaderboardData.slice(0, 3).map((user, index) => {
                        const rankStyle = getRankStyle(user.rank);
                        const heights = ['h-48', 'h-40', 'h-44'];
                        const orders = ['order-2', 'order-1', 'order-3'];

                        return (
                            <motion.div
                                key={user.rank}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className={`${orders[index]} backdrop-blur-xl rounded-3xl p-6 border-2 ${rankStyle.border} ${rankStyle.glow} bg-gradient-to-b ${rankStyle.bg}`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    {/* Rank Badge */}
                                    <div className="mb-4 relative">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                            {rankStyle.icon}
                                        </div>
                                        {user.rank === 1 && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                <Zap size={12} className="text-black" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative mb-3">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-16 h-16 rounded-full border-2 border-white/30"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold">
                                            {user.rank}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <h3 className="text-white font-bold text-lg mb-1">{user.name}</h3>
                                    <p className="text-white/60 text-sm mb-3">{user.username}</p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 w-full mb-3">
                                        <div className="text-center">
                                            <div className="text-white/40 text-xs">Level</div>
                                            <div className="text-white font-bold">{user.level}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-white/40 text-xs">XP</div>
                                            <div className="text-cyan-400 font-bold">{user.xp.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${user.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Leaderboard List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 mb-12"
                >
                    {leaderboardData.slice(3).map((user, index) => {
                        const rankStyle = getRankStyle(user.rank);
                        return (
                            <motion.div
                                key={user.rank}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (index + 3) * 0.05 }}
                                whileHover={{ scale: 1.01, x: 5 }}
                                className={`backdrop-blur-xl rounded-2xl p-5 border transition-all ${rankStyle.border} ${rankStyle.glow} bg-gradient-to-r ${rankStyle.bg}`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rank */}
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                        {rankStyle.icon}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full border-2 border-white/20"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-bold truncate">{user.name}</p>
                                                    <span className="text-lg">{user.badge}</span>
                                                </div>
                                                <p className="text-white/60 text-sm truncate">{user.username}</p>
                                            </div>
                                        </div>
                                        {/* Progress Bar - Mobile */}
                                        <div className="md:hidden mt-2 bg-white/10 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1.5 rounded-full"
                                                style={{ width: `${user.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden md:flex items-center gap-8">
                                        {/* Level */}
                                        <div className="text-center">
                                            <p className="text-white/40 text-xs uppercase tracking-wider">Level</p>
                                            <p className="text-white font-bold text-lg">{user.level}</p>
                                        </div>

                                        {/* XP */}
                                        <div className="text-center">
                                            <p className="text-white/40 text-xs uppercase tracking-wider">XP</p>
                                            <p className="text-cyan-400 font-bold text-lg">{user.xp.toLocaleString()}</p>
                                        </div>

                                        {/* Streak */}
                                        <div className="text-center">
                                            <p className="text-white/40 text-xs uppercase tracking-wider">Streak</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <Flame size={16} className="text-orange-400" />
                                                <p className="text-white font-bold text-lg">{user.streak}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-24">
                                            <div className="bg-white/10 rounded-full h-2 mb-1">
                                                <div
                                                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                                                    style={{ width: `${user.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-white/40 text-xs text-center">{user.progress}%</p>
                                        </div>

                                        {/* Position Change */}
                                        <div className="text-center w-12">
                                            {user.positionChange !== 0 && (
                                                <div className={`flex items-center justify-center ${
                                                    user.positionChange > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    <TrendingUp size={20} className={user.positionChange < 0 ? 'rotate-180' : ''} />
                                                    <span className="text-sm font-bold ml-1">{Math.abs(user.positionChange)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Stats */}
                                    <div className="md:hidden text-right">
                                        <p className="text-cyan-400 font-bold text-lg">Lv {user.level}</p>
                                        <p className="text-white/60 text-xs">{user.xp.toLocaleString()} XP</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="backdrop-blur-xl rounded-3xl p-8 border border-white/20 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 text-center shadow-xl"
                >
                    <Target size={48} className="mx-auto mb-4 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white mb-3">Ready to climb the leaderboard?</h3>
                    <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                        Complete courses, solve challenges, and earn XP to reach the top! Your journey to the top starts now.
                    </p>
                    <motion.a
                        href="/feed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-2xl font-bold backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                        Start Learning Now
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;