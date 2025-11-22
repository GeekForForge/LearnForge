// src/pages/ArenaSurvey.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Target,
    Zap,
    Clock,
    Star,
    Trophy,
    Sparkles,
    Sword,
    Brain,
    Calculator,
    Globe,
    Atom,
    Settings,
    Database,
    Play,
    AlertCircle
} from "lucide-react";

// API Base URL - Update this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const topics = [
    {
        name: "Data Structures",
        apiValue: "Data Structures",
        icon: <Brain size={24} />,
        description: "Stacks, Queues, Trees, Graphs",
        color: "from-blue-500 to-cyan-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30"
    },
    {
        name: "Algorithms",
        apiValue: "Algorithms",
        icon: <Zap size={24} />,
        description: "Sorting, Searching, Dynamic Programming",
        color: "from-green-500 to-emerald-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30"
    },
    {
        name: "Operating Systems",
        apiValue: "Operating Systems",
        icon: <Settings size={24} />,
        description: "Processes, Scheduling, Memory Management",
        color: "from-orange-500 to-yellow-400",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30"
    },
    {
        name: "DBMS",
        apiValue: "DBMS",
        icon: <Database size={24} />,
        description: "SQL, Transactions, Normalization",
        color: "from-purple-500 to-pink-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30"
    },
    {
        name: "Computer Networks",
        apiValue: "Computer Networks",
        icon: <Globe size={24} />,
        description: "Protocols, TCP/IP, OSI Layers",
        color: "from-red-500 to-orange-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30"
    }
];

const difficulties = [
    {
        level: "easy",
        label: "Beginner",
        color: "from-green-500 to-emerald-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/50",
        description: "Warm up with simpler challenges"
    },
    {
        level: "medium",
        label: "Intermediate",
        color: "from-yellow-500 to-orange-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50",
        description: "Balanced difficulty for most players"
    },
    {
        level: "hard",
        label: "Expert",
        color: "from-red-500 to-pink-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/50",
        description: "For the true coding warriors"
    }
];

const ArenaSurvey = () => {
    const [selectedTopic, setSelectedTopic] = useState("Data Structures");
    const [difficulty, setDifficulty] = useState("medium");
    const [count, setCount] = useState(5);
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleStart = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get the API value for the selected topic
            const topicObj = topics.find(t => t.name === selectedTopic);
            const topicValue = topicObj?.apiValue || selectedTopic;

            // Fetch questions from backend
            const response = await fetch(
                `${API_BASE_URL}/arena/start?topic=${encodeURIComponent(topicValue)}&difficulty=${difficulty}&count=${count}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include' // Include credentials for CORS
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
            }

            const questions = await response.json();

            if (!questions || questions.length === 0) {
                throw new Error('No questions available for the selected criteria');
            }

            // Store questions and preferences in localStorage
            localStorage.setItem(
                "arenaQuestions",
                JSON.stringify(questions)
            );
            localStorage.setItem(
                "arenaPreferences",
                JSON.stringify({
                    selectedTopic: topicValue,
                    difficulty,
                    count
                })
            );

            // Navigate to play page
            navigate("/arena/play", {
                state: {
                    questions,
                    topic: topicValue,
                    difficulty,
                    count
                }
            });

        } catch (err) {
            console.error("Error starting arena:", err);
            setError(err.message || "Failed to start the arena. Please try again.");
            setIsLoading(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
    const prevStep = () => {
        setError(null); // Clear error when going back
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const getStepIcon = (step) => {
        switch(step) {
            case 0: return <Target className="text-cyan-400" />;
            case 1: return <Zap className="text-yellow-400" />;
            case 2: return <Clock className="text-purple-400" />;
            default: return <Settings className="text-gray-400" />;
        }
    };

    const steps = [
        {
            title: "Choose Your Battlefield",
            subtitle: "Select your preferred topic domain"
        },
        {
            title: "Set The Challenge Level",
            subtitle: "How hard do you want to fight?"
        },
        {
            title: "Battle Duration",
            subtitle: "Number of questions to conquer"
        }
    ];

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden pt-24 pb-12">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Particles */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
                        animate={{
                            y: [0, -100, -200],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                            <Sword className="text-white" size={32} />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent"
                    >
                        BATTLE SETUP
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Configure your arena and prepare for combat
                    </motion.p>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="text-red-400" size={20} />
                            <p className="text-red-300 flex-1">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-300"
                            >
                                ×
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mb-12 overflow-x-auto"
                >
                    <div className="flex items-center gap-4 md:gap-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <motion.div
                                    className={`flex items-center gap-3 ${
                                        index <= currentStep ? 'text-cyan-400' : 'text-gray-500'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                                        index <= currentStep
                                            ? 'bg-cyan-500/20 border-cyan-400'
                                            : 'bg-gray-500/20 border-gray-500'
                                    }`}>
                                        {getStepIcon(index)}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <div className="text-sm font-semibold">{step.title}</div>
                                        <div className="text-xs text-gray-400">{step.subtitle}</div>
                                    </div>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 ${
                                        index < currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Topic Selection */}
                        {currentStep === 0 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Choose Your Battlefield</h2>
                                    <p className="text-gray-400">Select the domain where you want to prove your skills</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {topics.map((topic) => (
                                        <motion.div
                                            key={topic.name}
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedTopic(topic.name)}
                                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                                selectedTopic === topic.name
                                                    ? `${topic.bgColor} ${topic.borderColor} border-2 shadow-lg`
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${topic.color} flex items-center justify-center text-white`}>
                                                    {topic.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white mb-1">{topic.name}</h3>
                                                    <p className="text-sm text-gray-400">{topic.description}</p>
                                                </div>
                                                {selectedTopic === topic.name && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                                    >
                                                        <Star size={12} className="text-white fill-white" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Difficulty Selection */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Set The Challenge Level</h2>
                                    <p className="text-gray-400">How intense do you want the battle to be?</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {difficulties.map((diff) => (
                                        <motion.div
                                            key={diff.level}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setDifficulty(diff.level)}
                                            className={`p-6 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                                                difficulty === diff.level
                                                    ? `${diff.bgColor} ${diff.borderColor} border-2 shadow-lg`
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                                                difficulty === diff.level
                                                    ? `bg-gradient-to-r ${diff.color} text-white`
                                                    : 'bg-white/10 text-gray-400'
                                            }`}>
                                                <Trophy size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{diff.label}</h3>
                                            <p className="text-sm text-gray-400">{diff.description}</p>
                                            {difficulty === diff.level && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="mt-3"
                                                >
                                                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                                        SELECTED
                                                    </span>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Question Count */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">Battle Duration</h2>
                                    <p className="text-gray-400">How many challenges can you handle?</p>
                                </div>

                                <div className="max-w-md mx-auto">
                                    {/* Slider */}
                                    <div className="mb-8">
                                        <input
                                            type="range"
                                            min="3"
                                            max="15"
                                            value={count}
                                            onChange={(e) => setCount(parseInt(e.target.value))}
                                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                            style={{
                                                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(count - 3) / 12 * 100}%, #374151 ${(count - 3) / 12 * 100}%, #374151 100%)`
                                            }}
                                        />
                                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                                            <span>Quick (3)</span>
                                            <span>Standard (5)</span>
                                            <span>Marathon (15)</span>
                                        </div>
                                    </div>

                                    {/* Visual Display */}
                                    <motion.div
                                        className="text-center p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        key={count}
                                    >
                                        <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                            {count}
                                        </div>
                                        <div className="text-white font-semibold">BATTLE QUESTIONS</div>
                                        <div className="text-cyan-400 text-sm mt-2">
                                            {count <= 5 && "Quick skirmish - Perfect for warmup"}
                                            {count > 5 && count <= 10 && "Standard battle - Test your skills"}
                                            {count > 10 && "Marathon mode - Ultimate endurance test"}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-white/10">
                        <motion.button
                            whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                            whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                            onClick={prevStep}
                            className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                                currentStep === 0
                                    ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </motion.button>

                        {currentStep < 2 ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={nextStep}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25"
                            >
                                Continue
                                <Sparkles size={16} />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                                onClick={handleStart}
                                disabled={isLoading}
                                className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Settings size={20} />
                                        </motion.div>
                                        LOADING...
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} />
                                        START BATTLE
                                        <Zap size={16} />
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                >
                    {[
                        { icon: <Clock className="text-cyan-400" />, label: "Avg. Time", value: `${count * 2} min` },
                        { icon: <Target className="text-purple-400" />, label: "Difficulty", value: difficulty.toUpperCase() },
                        { icon: <Brain className="text-green-400" />, label: "Topic", value: selectedTopic }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
                        >
                            <div className="flex justify-center mb-2">{stat.icon}</div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Custom Slider Styles */}
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: linear-gradient(to right, #06b6d4, #8b5cf6);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
                }
                
                .slider::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: linear-gradient(to right, #06b6d4, #8b5cf6);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
                }
            `}</style>
        </div>
    );
};

export default ArenaSurvey;
