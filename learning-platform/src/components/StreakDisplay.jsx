import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';

const StreakDisplay = ({ currentStreak, longestStreak, totalLessonsCompleted }) => {
    const getStreakColor = (streak) => {
        if (streak >= 30) return 'from-orange-500 to-red-500';
        if (streak >= 14) return 'from-yellow-500 to-orange-500';
        if (streak >= 7) return 'from-green-500 to-yellow-500';
        return 'from-blue-500 to-cyan-500';
    };

    const getStreakMessage = (streak) => {
        if (streak === 0) return "Start your learning journey!";
        if (streak === 1) return "Great start! Keep it going!";
        if (streak < 7) return "Building momentum!";
        if (streak < 14) return "You're on fire! 🔥";
        if (streak < 30) return "Incredible dedication!";
        return "LEGENDARY STREAK! 🏆";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Streak - Main Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-2xl p-6"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Flame className="w-6 h-6 text-orange-400" />
                            <h3 className="text-lg font-bold text-white">Current Streak</h3>
                        </div>
                        <p className="text-sm text-gray-400">{getStreakMessage(currentStreak)}</p>
                    </div>

                    <motion.div
                        animate={{
                            scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
                            rotate: currentStreak > 0 ? [0, 5, -5, 0] : 0
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    >
                        <Flame
                            className={`w-16 h-16 ${
                                currentStreak > 0 ? 'text-orange-400' : 'text-gray-600'
                            }`}
                            fill={currentStreak > 0 ? "currentColor" : "none"}
                        />
                    </motion.div>
                </div>

                <div className="flex items-end gap-3">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className={`text-6xl font-black bg-gradient-to-r ${getStreakColor(currentStreak)} bg-clip-text text-transparent`}
                    >
                        {currentStreak}
                    </motion.div>
                    <div className="text-gray-400 mb-2 font-semibold">
                        {currentStreak === 1 ? 'day' : 'days'}
                    </div>
                </div>

                {currentStreak > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-orange-400 font-medium">
                        <TrendingUp className="w-4 h-4" />
                        Don't break the streak! Learn today to keep it going!
                    </div>
                )}
            </motion.div>

            {/* Stats Cards */}
            <div className="space-y-4">
                {/* Longest Streak */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400 font-medium">Best Streak</span>
                    </div>
                    <div className="text-3xl font-black text-yellow-400">
                        {longestStreak}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {longestStreak === 1 ? 'day' : 'days'}
                    </div>
                </motion.div>

                {/* Total Lessons */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm text-gray-400 font-medium">Total Lessons</span>
                    </div>
                    <div className="text-3xl font-black text-cyan-400">
                        {totalLessonsCompleted}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">completed</div>
                </motion.div>
            </div>
        </div>
    );
};

export default StreakDisplay;
