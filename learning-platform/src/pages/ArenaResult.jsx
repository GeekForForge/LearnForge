// src/pages/ArenaResult.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
    Trophy,
    Star,
    Crown,
    Zap,
    Sparkles,
    RotateCcw,
    Home,
    Share,
    Medal,
    Target,
    Clock,
    CheckCircle,
    Award
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const ArenaResult = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const submittedRef = useRef(false);

    const result = JSON.parse(localStorage.getItem("arenaResult")) || {
        score: 0,
        total: 5,
        timeSpent: 120
    };

    const percentage = Math.round((result.score / result.total) * 100);
    const timeSpentMinutes = Math.floor(result.timeSpent / 60);
    const timeSpentSeconds = result.timeSpent % 60;

    useEffect(() => {
        const answers = JSON.parse(localStorage.getItem("arenaAnswers"));

        if (user && user.userId && answers && !submittedRef.current) {
            submittedRef.current = true;
            setSubmitting(true);

            axios.post(`${API_BASE_URL}/arena/submit?userId=${user.userId}`, answers, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
                .then(res => {
                    console.log("XP Updated:", res.data);
                    setSubmitting(false);
                    // Optional: Clear answers to prevent re-submission on refresh? 
                    // localStorage.removeItem("arenaAnswers"); 
                    // Keeping it might be safer for now if user refreshes immediately.
                })
                .catch(err => {
                    console.error("Failed to submit result:", err);
                    setSubmitting(false);
                    submittedRef.current = false; // Allow retry?
                });
        }
    }, [user]);

    // Performance evaluation
    const getPerformance = () => {
        if (percentage >= 90) return {
            title: "LEGENDARY VICTORY!",
            color: "from-yellow-400 to-orange-500",
            bgColor: "from-yellow-500/20 to-orange-500/20",
            borderColor: "border-yellow-500/50",
            icon: <Crown className="text-yellow-400" size={32} />,
            message: "You are a coding master! Incredible performance!",
            badge: "🏆 Grand Master"
        };
        if (percentage >= 70) return {
            title: "GREAT SUCCESS!",
            color: "from-green-400 to-cyan-500",
            bgColor: "from-green-500/20 to-cyan-500/20",
            borderColor: "border-green-500/50",
            icon: <Trophy className="text-green-400" size={32} />,
            message: "Outstanding performance! You're getting stronger!",
            badge: "⭐ Advanced Warrior"
        };
        if (percentage >= 50) return {
            title: "GOOD JOB!",
            color: "from-blue-400 to-purple-500",
            bgColor: "from-blue-500/20 to-purple-500/20",
            borderColor: "border-blue-500/50",
            icon: <Star className="text-blue-400" size={32} />,
            message: "Solid performance! Keep practicing!",
            badge: "🎯 Skilled Fighter"
        };
        return {
            title: "GOOD ATTEMPT!",
            color: "from-gray-400 to-gray-600",
            bgColor: "from-gray-500/20 to-gray-600/20",
            borderColor: "border-gray-500/50",
            icon: <Target className="text-gray-400" size={32} />,
            message: "Every battle makes you stronger. Try again!",
            badge: "🔥 Rookie Warrior"
        };
    };

    const performance = getPerformance();

    const shareResult = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Arena Battle Result',
                text: `I scored ${result.score}/${result.total} (${percentage}%) in Code Arena! ${performance.badge}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(`I scored ${result.score}/${result.total} (${percentage}%) in Code Arena! ${performance.badge}`);
            alert('Result copied to clipboard!');
        }
    };

    const stats = [
        {
            icon: <Target className="text-cyan-400" size={20} />,
            label: "Accuracy",
            value: `${percentage}%`,
            color: "text-cyan-400"
        },
        {
            icon: <Clock className="text-purple-400" size={20} />,
            label: "Time Spent",
            value: `${timeSpentMinutes}:${timeSpentSeconds.toString().padStart(2, '0')}`,
            color: "text-purple-400"
        },
        {
            icon: <Zap className="text-yellow-400" size={20} />,
            label: "Performance",
            value: performance.badge.split(' ')[1],
            color: "text-yellow-400"
        }
    ];

    return (
        <div className="min-h-screen bg-transparent pt-20 pb-12 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Celebration Particles */}
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, -200],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Gradient Orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Main Result Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className={`bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border-2 ${performance.borderColor} relative overflow-hidden`}
                >
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white to-transparent rounded-full" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400 to-transparent rounded-full" />
                    </div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                            >
                                <Trophy className="text-white" size={48} />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent mb-4`}
                            >
                                {performance.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-300 text-lg mb-2"
                            >
                                {performance.message}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, type: "spring" }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20"
                            >
                                {performance.icon}
                                <span className="text-white font-semibold">{performance.badge}</span>
                            </motion.div>
                        </div>

                        {/* Score Display */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-center mb-8"
                        >
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="text-right">
                                    <div className="text-6xl md:text-7xl font-bold text-white">
                                        {result.score}
                                    </div>
                                    <div className="text-gray-400 text-sm">SCORE</div>
                                </div>

                                <div className="text-4xl text-gray-500">/</div>

                                <div className="text-left">
                                    <div className="text-6xl md:text-7xl font-bold text-gray-400">
                                        {result.total}
                                    </div>
                                    <div className="text-gray-400 text-sm">TOTAL</div>
                                </div>
                            </div>

                            {/* Progress Circle */}
                            <div className="max-w-xs mx-auto mb-6">
                                <div className="relative w-48 h-48 mx-auto">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {/* Background Circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#374151"
                                            strokeWidth="8"
                                        />
                                        {/* Progress Circle */}
                                        <motion.circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * percentage) / 100}
                                            transform="rotate(-90 50 50)"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                                            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#06b6d4" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">{percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
                                >
                                    <div className="flex justify-center mb-2">{stat.icon}</div>
                                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/arena")}
                                className="py-4 bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10"
                            >
                                <Home size={20} />
                                Back to Arena
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={shareResult}
                                className="py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                            >
                                <Share size={20} />
                                Share Result
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/arena/survey")}
                                className="py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                            >
                                <RotateCcw size={20} />
                                Play Again
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Achievement Unlocked */}
                {percentage >= 70 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.6, type: "spring" }}
                        className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Award className="text-yellow-400" size={28} />
                            <span className="text-yellow-400 font-bold text-xl">Achievement Unlocked!</span>
                            <Sparkles className="text-yellow-400" size={28} />
                        </div>
                        <p className="text-yellow-200">
                            {percentage >= 90
                                ? "Legendary Master - You've achieved the highest honor!"
                                : "Rising Star - You're climbing the ranks rapidly!"
                            }
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ArenaResult;