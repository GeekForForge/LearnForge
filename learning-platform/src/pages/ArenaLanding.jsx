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
    Crown,
    Shield
} from "lucide-react";

const ArenaLanding = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Play vs Computer",
            icon: <Sword size={48} />,
            gradient: "from-purple-600 to-cyan-500",
            borderGradient: "from-purple-400 to-cyan-400",
            onClick: () => navigate("/arena/survey"),
            desc: "Battle against AI and test your coding knowledge with adaptive difficulty",
            badge: "POPULAR",
            delay: 0.1,
            featured: true
        },
        {
            title: "Multiplayer Arena",
            icon: <Users size={48} />,
            gradient: "from-orange-500 to-pink-500",
            borderGradient: "from-orange-400 to-pink-400",
            onClick: () => {
                const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
                navigate(`/arena/multiplayer/${roomId}`);
            },
            desc: "Compete live with developers around the world in real-time",
            badge: "LIVE",
            delay: 0.2,
            featured: true
        },
        {
            title: "Company Questions",
            icon: <Building size={48} />,
            gradient: "from-blue-600 to-indigo-500",
            borderGradient: "from-blue-400 to-indigo-400",
            onClick: () => navigate("/resources"),
            desc: "Master LeetCode problems from FAANG and top tech companies",
            badge: "PREMIUM",
            delay: 0.3,
            featured: true
        },
        {
            title: "Setup Preferences",
            icon: <Settings size={48} />,
            gradient: "from-green-500 to-emerald-400",
            borderGradient: "from-green-400 to-emerald-300",
            onClick: () => navigate("/arena/survey"),
            desc: "Customize topics, difficulty, and time limits for your matches",
            badge: "CUSTOM",
            delay: 0.4
        },
    ];

    const featuredCards = cards.filter(card => card.featured);
    const regularCards = cards.filter(card => !card.featured);

    return (
        <div className="min-h-screen bg-transparent pt-20 pb-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
                    className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
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
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center mb-8"
                    >
                        <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 border-2 border-cyan-400/30">
                                <Sword className="text-white" size={44} />
                            </div>
                            <motion.div
                                className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl blur-xl opacity-30"
                                animate={{ opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent leading-tight"
                    >
                        CODE ARENA
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Enter the ultimate coding battlefield. Challenge AI, compete with developers worldwide, and master technical interviews through real-time battles.
                    </motion.p>
                </motion.div>

                {/* Featured Challenges */}
                <div className="max-w-6xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-xl">
                            <Crown size={20} className="text-cyan-400" />
                            <span className="text-cyan-400 text-lg font-semibold">FEATURED CHALLENGES</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Choose Your Battle Mode</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Select from our most popular challenge modes to start your coding journey
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {featuredCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: card.delay }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                onClick={card.onClick}
                                className="group cursor-pointer relative"
                            >
                                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all h-full flex flex-col">
                                    {/* Badge */}
                                    <div className="absolute top-6 right-6">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-xl border ${
                                            card.badge === "POPULAR" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/30" :
                                                card.badge === "LIVE" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400/30" :
                                                    "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400/30"
                                        }`}>
                                            {card.badge}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${card.gradient} shadow-lg mb-6 mx-auto`}>
                                        {card.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 text-center">
                                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-300 mb-6 text-base leading-relaxed">
                                            {card.desc}
                                        </p>

                                        {/* CTA Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`inline-flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-bold shadow-lg group-hover:shadow-xl transition-all`}
                                        >
                                            <Zap size={20} />
                                            Start Challenge
                                            <Sparkles size={16} />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Additional Options */}
                <div className="max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                            <Shield size={16} className="text-purple-400" />
                            <span className="text-purple-400 text-sm font-semibold">MORE OPTIONS</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Customize Your Experience</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Tailor your learning journey with personalized settings and preferences
                        </p>
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
                                <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${card.gradient}`}>
                                            {card.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                                {card.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                        {card.desc}
                                    </p>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-semibold text-sm w-full justify-center`}
                                    >
                                        Configure Settings
                                        <Settings size={16} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden">
                        <div className="relative z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center border-2 border-cyan-400/30"
                            >
                                <Trophy className="text-white" size={32} />
                            </motion.div>

                            <h3 className="text-4xl font-bold text-white mb-6">
                                Ready to Dominate the Arena?
                            </h3>

                            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                                Join our community of elite developers mastering algorithms, data structures, and system design through interactive coding battles.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/arena/survey")}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all flex items-center gap-3 border-2 border-cyan-400/30"
                                >
                                    <Zap size={24} />
                                    Start Your First Battle
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate("/resources")}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center gap-3 border-2 border-indigo-400/30"
                                >
                                    <Building size={24} />
                                    Explore Questions
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