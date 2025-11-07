import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Clock,
    Trophy,
    Star,
    Zap,
    CheckCircle,
    XCircle,
    AlertCircle,
    Brain,
    Timer
} from "lucide-react";

const ArenaGame = () => {
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isAnswering, setIsAnswering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const prefs = JSON.parse(localStorage.getItem("arenaPreferences")) || {
            selectedTopic: "Computer Science",
            difficulty: "medium",
            count: 5,
        };

        // ✅ Map frontend topic name to backend topic
        const topicMap = {
            "Computer Science": "DSA",
            "Mathematics": "Algorithms",
            "General Knowledge": "General",
            "Science": "Operating Systems"
        };

        const topic = topicMap[prefs.selectedTopic] || "DSA";

        axios
            .get("http://localhost:8080/api/arena/start", {
                params: {
                    topic: topic,
                    difficulty: prefs.difficulty,
                    count: prefs.count,
                },
            })
            .then((res) => {
                const formatted = res.data.map((q) => ({
                    question: q.questionText,
                    options: [q.optionA, q.optionB, q.optionC, q.optionD],
                    answer: q.correctAnswer,
                }));
                setQuestions(formatted);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching questions:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!loading && questions.length > 0 && timeLeft > 0 && !isAnswering) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswering) {
            handleTimeUp();
        }
    }, [timeLeft, loading, isAnswering]);

    const handleTimeUp = () => {
        setIsAnswering(true);
        setSelected("timeup");
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const handleSelect = (option) => {
        if (selected || isAnswering) return;

        setIsAnswering(true);
        setSelected(option);

        if (option === questions[index].answer) {
            setScore(score + 1);
        }

        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    const nextQuestion = () => {
        if (index + 1 < questions.length) {
            setIndex(index + 1);
            setSelected(null);
            setIsAnswering(false);
            setTimeLeft(30);
        } else {
            localStorage.setItem("arenaResult", JSON.stringify({
                score,
                total: questions.length,
                timeSpent: (questions.length * 30) - timeLeft
            }));
            navigate("/arena/result");
        }
    };

    const getOptionColor = (option) => {
        if (!selected) return "from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50";
        if (option === questions[index].answer) return "from-green-500/20 to-green-600/20 border-green-400";
        if (option === selected && option !== questions[index].answer) return "from-red-500/20 to-red-600/20 border-red-400";
        return "from-gray-800/30 to-gray-700/30";
    };

    const getOptionIcon = (option) => {
        if (!selected) return <div className="w-6 h-6 rounded-full border-2 border-gray-500" />;
        if (option === questions[index].answer) return <CheckCircle className="text-green-400" size={20} />;
        if (option === selected && option !== questions[index].answer) return <XCircle className="text-red-400" size={20} />;
        return <div className="w-6 h-6 rounded-full border-2 border-gray-600" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
                    />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-4"
                    >
                        Preparing Your Battle
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 text-lg"
                    >
                        Loading challenging questions...
                    </motion.p>
                </div>
            </div>
        );
    }

    if (!loading && questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <h2>No questions found for this topic or difficulty.</h2>
            </div>
        );
    }

    const currentQuestion = questions[index];
    const progress = ((index + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-transparent pt-20 pb-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Header Stats */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    {/* Progress */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Progress</span>
                            <span className="text-cyan-400 font-bold">{index + 1}/{questions.length}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Score */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="text-yellow-400" size={18} />
                            <span className="text-gray-400 text-sm">Score</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{score}</div>
                    </div>

                    {/* Timer */}
                    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl p-4 border ${
                        timeLeft <= 10 ? 'border-red-400/50' : 'border-white/10'
                    }`}>
                        <div className="flex items-center gap-2 mb-1">
                            <Timer className={timeLeft <= 10 ? "text-red-400" : "text-cyan-400"} size={18} />
                            <span className="text-gray-400 text-sm">Time Left</span>
                        </div>
                        <div className={`text-2xl font-bold ${
                            timeLeft <= 10 ? 'text-red-400' : 'text-white'
                        }`}>
                            {timeLeft}s
                        </div>
                    </div>

                    {/* Streak */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="text-orange-400" size={18} />
                            <span className="text-gray-400 text-sm">Streak</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {score > 0 && selected === questions[index - 1]?.answer ? Math.min(score, 5) : 0}
                            {score > 0 && selected === questions[index - 1]?.answer && <span className="text-orange-400 text-lg">🔥</span>}
                        </div>
                    </div>
                </motion.div>

                {/* Question Card */}
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Brain className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-gray-400 text-sm font-semibold">Question {index + 1}</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <span className="text-cyan-400 text-sm">Battle in Progress</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                        {currentQuestion.question}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {currentQuestion.options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={!selected ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={!selected ? { scale: 0.98 } : {}}
                                    onClick={() => handleSelect(option)}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 bg-gradient-to-r ${getOptionColor(option)} ${
                                        !selected ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
                                    }`}
                                    disabled={!!selected}
                                >
                                    <div className="flex items-center gap-4">
                                        {getOptionIcon(option)}
                                        <span className="text-white font-semibold text-lg flex-1">
                      {option}
                    </span>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {selected === "timeup" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center gap-3"
                            >
                                <AlertCircle className="text-red-400" size={24} />
                                <div>
                                    <div className="text-red-400 font-semibold">Time's Up!</div>
                                    <div className="text-red-300 text-sm">Moving to next question...</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ArenaGame;
