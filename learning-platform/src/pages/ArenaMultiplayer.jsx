import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Trophy, Users, Star, Crown, Zap, Clock, Globe, Target, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ArenaMultiplayer = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const features = [
        {
            icon: Zap,
            title: "Real-time Battles",
            description: "Compete against developers worldwide in live 1v1 coding duels",
            gradient: "from-purple-600 to-cyan-500",
            iconBg: "from-purple-500 to-cyan-400"
        },
        {
            icon: Trophy,
            title: "Global Rankings",
            description: "Climb the leaderboards and showcase your coding supremacy",
            gradient: "from-orange-500 to-pink-500",
            iconBg: "from-orange-400 to-pink-400"
        },
        {
            icon: Globe,
            title: "Spectator Mode",
            description: "Watch epic battles and learn from top-tier developers",
            gradient: "from-blue-600 to-indigo-500",
            iconBg: "from-blue-500 to-indigo-400"
        }
    ];

    const timeline = [
        { phase: "Phase 1", title: "Core Infrastructure", status: "In Progress", progress: 75 },
        { phase: "Phase 2", title: "Real-time Sync", status: "Planning", progress: 30 },
        { phase: "Phase 3", title: "Global Launch", status: "Upcoming", progress: 0 }
    ];

    return (
        <div className="min-h-screen bg-transparent pt-20 pb-12 relative overflow-hidden">
            {/* Animated Background */}
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
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-16"
                >
                    {/* Icon */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center justify-center mb-8"
                    >
                        <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 border-2 border-cyan-400/30">
                                <Users className="text-white" size={44} />
                            </div>
                            <motion.div
                                className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-3xl blur-xl opacity-30"
                                animate={{ opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent leading-tight"
                    >
                        MULTIPLAYER ARENA
                    </motion.h1>

                    {/* Status Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-400/20 mb-6 backdrop-blur-xl"
                    >
                        <Clock size={24} className="text-orange-400" />
                        <span className="text-orange-400 text-xl font-bold tracking-wide">COMING SOON</span>
                        <Sparkles size={20} className="text-pink-400" />
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4"
                    >
                        The ultimate real-time coding battleground is under construction. Get ready to face developers from around the globe in intense head-to-head programming challenges.
                    </motion.p>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        We're building something extraordinary. A platform where code meets competition.
                    </motion.p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative"
                        >
                            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all h-full">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${feature.iconBg} shadow-lg mb-6 mx-auto`}>
                                    <feature.icon size={32} />
                                </div>

                                {/* Content */}
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Decorative gradient */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Development Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center gap-3 mb-8">
                            <Target size={28} className="text-cyan-400" />
                            <h2 className="text-3xl font-bold text-white">Development Roadmap</h2>
                        </div>

                        <div className="space-y-6">
                            {timeline.map((item, index) => (
                                <div key={index} className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-cyan-400 font-bold">{item.phase}</span>
                                            <span className="text-white font-semibold">{item.title}</span>
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${item.status === 'In Progress'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : item.status === 'Planning'
                                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.progress}%` }}
                                            transition={{ duration: 1, delay: 1 + index * 0.2 }}
                                            className="h-full bg-gradient-to-r from-purple-600 to-cyan-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <div className="inline-flex flex-col items-center gap-6">
                        <p className="text-gray-400 text-lg">
                            Stay sharp. The arena will open soon.
                        </p>

                        <motion.button
                            onClick={() => navigate('/arena')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                            <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl text-white font-bold text-lg shadow-xl">
                                <Star size={20} />
                                Return to Arena Home
                                <Sparkles size={20} />
                            </div>
                        </motion.button>

                        <p className="text-sm text-gray-500 font-mono">
                            ESTIMATED LAUNCH: Q2 2026
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ArenaMultiplayer;