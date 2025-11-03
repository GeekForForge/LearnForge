// src/pages/Leaderboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Star, Award, TrendingUp } from 'lucide-react';

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
            positionChange: 0
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
            positionChange: 1
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
            positionChange: -1
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
            positionChange: 0
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
            positionChange: 2
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
            positionChange: -1
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
            positionChange: 0
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
            positionChange: -2
        },
    ];

    React.useEffect(() => {
        setCurrentPage('leaderboard');
    }, [setCurrentPage]);

    const getRankMedalIcon = (rank) => {
        if (rank === 1) return <Trophy size={24} className="text-yellow-500" />;
        if (rank === 2) return <Medal size={24} className="text-gray-400" />;
        if (rank === 3) return <Medal size={24} className="text-orange-600" />;
        return <span className="text-xl font-bold text-gray-400">#{rank}</span>;
    };

    return (
        <div className="min-h-screen bg-dark-900 pt-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy size={40} className="text-neon-purple" />
                        <h1 className="text-5xl md:text-6xl font-bold text-gradient">
                            Leaderboard
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Climb the ranks and become a LearnForge champion! 🏆
                    </p>
                </motion.div>

                {/* Time Range Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center gap-4 mb-8"
                >
                    {['week', 'month', 'all-time'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                timeRange === range
                                    ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                    : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'
                            }`}
                        >
                            {range === 'week' && 'This Week'}
                            {range === 'month' && 'This Month'}
                            {range === 'all-time' && 'All Time'}
                        </button>
                    ))}
                </motion.div>

                {/* Leaderboard Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    {leaderboardData.map((user, index) => (
                        <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-dark-800 rounded-2xl p-5 border transition-all hover:border-white/20 ${
                                user.rank <= 3
                                    ? 'border-white/20 shadow-lg shadow-neon-purple/10'
                                    : 'border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Rank */}
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                    {getRankMedalIcon(user.rank)}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-white font-bold truncate">{user.name}</p>
                                            <p className="text-gray-400 text-sm truncate">{user.username}</p>
                                        </div>
                                        <span className="text-2xl">{user.badge}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="hidden md:flex items-center gap-6">
                                    {/* Level */}
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs uppercase tracking-wider">Level</p>
                                        <p className="text-white font-bold text-lg">{user.level}</p>
                                    </div>

                                    {/* XP */}
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs uppercase tracking-wider">XP</p>
                                        <p className="text-neon-cyan font-bold text-lg">{user.xp.toLocaleString()}</p>
                                    </div>

                                    {/* Streak */}
                                    <div className="text-center">
                                        <p className="text-gray-400 text-xs uppercase tracking-wider">Streak</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <Flame size={16} className="text-orange-500" />
                                            <p className="text-white font-bold text-lg">{user.streak}</p>
                                        </div>
                                    </div>

                                    {/* Position Change */}
                                    <div className="text-center w-12">
                                        {user.positionChange !== 0 && (
                                            <div className={`flex items-center justify-center ${
                                                user.positionChange > 0 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                                <TrendingUp size={20} className={user.positionChange < 0 ? 'rotate-180' : ''} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Stats */}
                                <div className="md:hidden text-right">
                                    <p className="text-neon-cyan font-bold text-lg">Lv {user.level}</p>
                                    <p className="text-gray-400 text-xs">{user.xp.toLocaleString()} XP</p>
                                </div>
                            </div>

                            {/* Mobile Streak */}
                            <div className="md:hidden mt-3 flex items-center gap-2 text-sm">
                                <Flame size={14} className="text-orange-500" />
                                <span className="text-gray-400">{user.streak} day streak</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-2xl p-8 border border-white/10 text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-3">Ready to climb the leaderboard?</h3>
                    <p className="text-gray-400 mb-6">
                        Complete courses, solve challenges, and earn XP to reach the top!
                    </p>
                    <a href="/feed" className="inline-block px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Start Learning Now
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;
