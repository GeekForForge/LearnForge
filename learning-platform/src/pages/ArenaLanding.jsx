// src/pages/ArenaLanding.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Sword,
    Users,
    Settings,
    Zap,
    Sparkles
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
            badge: "NEW",
            delay: 0.1
        },
        {
            title: "Multiplayer",
            icon: <Users size={48} />,
            gradient: "from-orange-500 to-pink-500",
            onClick: () => alert("Multiplayer mode coming soon! 🚀"),
            desc: "Compete live with friends around the world",
            badge: "SOON",
            delay: 0.2
        },
        {
            title: "Setup Preferences",
            icon: <Settings size={48} />,
            gradient: "from-green-500 to-lime-400",
            onClick: () => navigate("/arena/survey"),
            desc: "Select topics and difficulty for your matches",
            badge: "CUSTOM",
            delay: 0.3
        },
    ];

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-12 relative overflow-hidden">
            {/* Simple Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>

                {/* Floating particles */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                            <Sword className="text-white" size={32} />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent"
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

                {/* Feature Cards - Centered without leaderboard */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {cards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: card.delay }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={card.onClick}
                                className="group cursor-pointer"
                            >
                                <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all h-full">
                                    {/* Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            card.badge === "NEW" ? "bg-green-500/20 text-green-400" :
                                                card.badge === "SOON" ? "bg-orange-500/20 text-orange-400" :
                                                    "bg-cyan-500/20 text-cyan-400"
                                        }`}>
                                            {card.badge}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${card.gradient}`}>
                                        {card.icon}
                                    </div>

                                    {/* Content */}
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
                                            Start Battle
                                            <Sparkles size={14} />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-center mt-12"
                >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                        <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Ready to Prove Your Skills?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Join thousands of developers in the ultimate coding battlefield
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/arena/survey")}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                        >
                            Start Your First Battle
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ArenaLanding;