// src/pages/ArenaLanding.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Sword,
    Users,
    Settings,
    Zap,
    Sparkles,
    Building,
    Trophy,
    Target
} from "lucide-react";

const ArenaLanding = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Play vs Computer",
            icon: <Sword size={48} />,
            gradient: "from-purple-600 to-cyan-500",
            onClick: () => navigate("/arena/survey"),
            desc: "Battle against AI and test your coding knowledge",
            badge: "POPULAR",
            delay: 0.1,
            featured: true
        },
        {
            title: "Multiplayer",
            icon: <Users size={48} />,
            gradient: "from-orange-500 to-pink-500",
            onClick: () => {
                // Generate a random roomId for the match
                const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
                navigate(`/arena/multiplayer/${roomId}`);
            },
            desc: "Compete live with friends around the world",
            badge: "BETA",
            delay: 0.2,
            featured: true
        },
        {
            title: "Company Questions",
            icon: <Building size={48} />,
            gradient: "from-blue-600 to-indigo-500",
            onClick: () => navigate("/resources"),
            desc: "Master LeetCode problems from top tech companies",
            badge: "HOT",
            delay: 0.3,
            featured: true
        },
        {
            title: "Setup Preferences",
            icon: <Settings size={48} />,
            gradient: "from-green-500 to-lime-400",
            onClick: () => navigate("/arena/survey"),
            desc: "Select topics and difficulty for your matches",
            badge: "CUSTOM",
            delay: 0.4
        },
    ];

    const featuredCards = cards.filter(card => card.featured);
    const regularCards = cards.filter(card => !card.featured);

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-12 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"
                    animate={{
                        x: [-50, 50, -50],
                        y: [-30, 30, -30],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                        animate={{
                            y: [0, -40, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                                <Sword className="text-white" size={36} />
                            </div>
                            <motion.div
                                className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur-md opacity-50"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent"
                    >
                        CODE ARENA
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Enter the learning battlefield. Choose your challenge and prove your skills.
                    </motion.p>
                </motion.div>

                {/* Featured Cards */}
                <div className="max-w-6xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <Target size={16} className="text-cyan-400" />
                            <span className="text-cyan-400 text-sm font-semibold">MOST POPULAR</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Featured Challenges</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {featuredCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: card.delay }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={card.onClick}
                                className="group cursor-pointer"
                            >
                                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all h-full shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-6 right-6">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                            card.badge === "POPULAR" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" :
                                                card.badge === "HOT" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" :
                                                    "bg-cyan-500/20 text-cyan-400"
                                        }`}>
                                            {card.badge}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-6">
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${card.gradient} shadow-lg`}>
                                            {card.icon}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                                {card.title}
                                            </h3>
                                            <p className="text-gray-300 mb-6 text-base">
                                                {card.desc}
                                            </p>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-semibold shadow-lg`}
                                            >
                                                Start Challenge
                                                <Sparkles size={16} />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Regular Cards */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">More Challenges</h2>
                        <p className="text-gray-400">Explore other ways to improve your skills</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {regularCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: card.delay }}
                                whileHover={{ y: -4, scale: 1.01 }}
                                onClick={card.onClick}
                                className="group cursor-pointer"
                            >
                                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all h-full">
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            card.badge === "SOON" ? "bg-orange-500/20 text-orange-400" :
                                                "bg-cyan-500/20 text-cyan-400"
                                        }`}>
                                            {card.badge}
                                        </span>
                                    </div>
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${card.gradient}`}>
                                        {card.icon}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-300 mb-4 text-sm">
                                            {card.desc}
                                        </p>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-semibold text-sm`}
                                        >
                                            Explore
                                            <Sparkles size={14} />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA - unchanged */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto overflow-hidden">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-400 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center"
                            >
                                <Trophy className="text-white" size={24} />
                            </motion.div>
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Ready to Dominate the Arena?
                            </h3>
                            <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
                                Join thousands of developers mastering algorithms, data structures, and company-specific questions to ace their technical interviews.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/arena/survey")}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all flex items-center gap-3"
                                >
                                    <Zap size={20} />
                                    Start Your First Battle
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/resources")}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center gap-3"
                                >
                                    <Building size={20} />
                                    Company Questions
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ArenaLanding;
