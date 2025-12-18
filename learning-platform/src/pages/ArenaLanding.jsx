// src/pages/ArenaLanding.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Sword,
    Users,
    Building,
    Zap,
    Sparkles,
    Crown
} from "lucide-react";

const ArenaLanding = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "MCQ",
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
        }
    ];

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

                {/* Featured Challenges - Only Section */}
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-xl">
                            <Crown size={20} className="text-cyan-400" />
                            <span className="text-cyan-400 text-lg font-semibold">CHOOSE YOUR BATTLE</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Start Coding Challenge</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Select your preferred mode to begin your coding journey
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {cards.map((card, index) => (
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
            </div>
        </div>
    );
};

export default ArenaLanding;