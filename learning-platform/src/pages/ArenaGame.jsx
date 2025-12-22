// src/pages/ArenaGame.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Trophy,
    Zap,
    CheckCircle,
    XCircle,
    AlertCircle,
    Brain,
    Timer,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const ArenaGame = () => {
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isAnswering, setIsAnswering] = useState(false);
    const [error, setError] = useState(null);

    const [userAnswers, setUserAnswers] = useState({});

    // Accurate time spent calculation
    const [questionStart, setQuestionStart] = useState(Date.now());
    const [totalElapsed, setTotalElapsed] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const prefs = JSON.parse(localStorage.getItem("arenaPreferences")) || {
            selectedTopic: "Data Structures",
            difficulty: "medium",
            count: 5,
        };

        setLoading(true);
        setError(null);

        axios
            .get(`${API_BASE_URL}/arena/start`, {
                params: {
                    topic: prefs.selectedTopic,
                    difficulty: prefs.difficulty,
                    count: prefs.count,
                },
                withCredentials: true,
            })
            .then((res) => {
                const formatted = res.data.map((q) => ({
                    id: q.id,
                    question: q.questionText,
                    options: [q.optionA, q.optionB, q.optionC, q.optionD],
                    answer: q.correctAnswer,
                }));
                setQuestions(formatted);
                setLoading(false);
                setIndex(0);
                setScore(0);
                setUserAnswers({});
                setQuestionStart(Date.now());
                setTotalElapsed(0);
            })
            .catch((err) => {
                setLoading(false);
                setError(
                    err?.response?.data?.message ||
                    "Failed to load questions. Try again!"
                );
            });
    }, []);

    useEffect(() => {
        if (!loading && questions.length > 0 && timeLeft > 0 && !isAnswering) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswering) {
            handleTimeUp();
        }
    }, [timeLeft, loading, isAnswering, questions]);

    const handleTimeUp = () => {
        setIsAnswering(true);
        setSelected("timeup");
        setTimeout(() => {
            nextQuestion("timeup");
        }, 1500);
    };

    const handleSelect = (option) => {
        if (selected || isAnswering) return;

        setIsAnswering(true);
        setSelected(option);

        setTimeout(() => {
            nextQuestion(option);
        }, 1200);
    };

    // The fix: always compute the correct final score and accurate time spent
    const nextQuestion = (selectedOption) => {
        const now = Date.now();
        const spentThisQuestion = Math.round((now - questionStart) / 1000); // seconds
        const newElapsed = totalElapsed + spentThisQuestion;

        const currentQ = questions[index];
        // Record Answer
        const updatedAnswers = { ...userAnswers };
        if (currentQ && currentQ.id) {
            // If timeup, we might send "TIMEUP" or empty.
            // Backend expects string.
            updatedAnswers[currentQ.id] = selectedOption === "timeup" ? "SKIP" : selectedOption;
        }
        setUserAnswers(updatedAnswers);

        let isCurrentCorrect = false;
        if (
            selectedOption &&
            selectedOption !== "timeup" &&
            currentQ &&
            selectedOption === currentQ.answer
        ) {
            isCurrentCorrect = true;
        }
        const newScore = isCurrentCorrect ? score + 1 : score;

        if (index + 1 < questions.length) {
            setIndex(index + 1);
            setSelected(null);
            setIsAnswering(false);
            setTimeLeft(30);
            setScore(newScore);
            setTotalElapsed(newElapsed);
            setQuestionStart(now); // reset for next question
        } else {
            // On last question, save last elapsed
            localStorage.setItem(
                "arenaResult",
                JSON.stringify({
                    score: newScore,
                    total: questions.length,
                    timeSpent: newElapsed, // total seconds user actually spent
                })
            );
            localStorage.setItem("arenaAnswers", JSON.stringify(updatedAnswers));

            setScore(newScore);
            setTotalElapsed(newElapsed);
            setTimeout(() => {
                navigate("/arena/result");
            }, 400);
        }
    };

    const getOptionColor = (option) => {
        if (!selected) return "from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50";
        if (option === questions[index].answer) return "from-green-500/20 to-green-600/20 border-green-400";
        if (option === selected && option !== questions[index].answer) return "from-red-500/20 to-red-600/20 border-red-400";
        return "from-gray-800/30 to-gray-700/30";
    };

    const getOptionIcon = (option) => {
        if (!selected)
            return <div className="w-6 h-6 rounded-full border-2 border-gray-500" />;
        if (option === questions[index].answer)
            return <CheckCircle className="text-green-400" size={24} />;
        if (option === selected && option !== questions[index].answer)
            return <XCircle className="text-red-400" size={24} />;
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

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <AlertCircle className="text-red-400 mb-4" size={48} />
                <h2 className="text-red-300 font-bold text-2xl mb-2">Error</h2>
                <p className="max-w-md text-center text-gray-300 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg"
                >
                    Retry
                </button>
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
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
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="text-yellow-400" size={20} />
                            <span className="text-gray-400 text-sm">Score</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{score}</div>
                    </div>
                    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl p-4 border ${timeLeft <= 10 ? 'border-red-400/50' : 'border-white/10'
                        }`}>
                        <div className="flex items-center gap-2 mb-1">
                            <Timer className={timeLeft <= 10 ? "text-red-400" : "text-cyan-400"} size={20} />
                            <span className="text-gray-400 text-sm">Time Left</span>
                        </div>
                        <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'
                            }`}>
                            {timeLeft}s
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="text-orange-400" size={20} />
                            <span className="text-gray-400 text-sm">Streak</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{score}</div>
                    </div>
                </motion.div>

                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Brain className="text-white" size={28} />
                        </div>
                        <div>
                            <h2 className="text-gray-400 text-base font-semibold">Question {index + 1}</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                <span className="text-cyan-400 text-base">Battle in Progress</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-relaxed">
                        {currentQuestion.question}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {currentQuestion.options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={!selected ? { scale: 1.03, y: -3 } : {}}
                                    whileTap={!selected ? { scale: 0.98 } : {}}
                                    onClick={() => handleSelect(option)}
                                    className={`p-7 rounded-2xl border-2 text-left transition-all duration-300 bg-gradient-to-r text-xl md:text-2xl ${getOptionColor(option)} ${!selected ? 'cursor-pointer hover:shadow-xl' : 'cursor-default'
                                        }`}
                                    disabled={!!selected}
                                >
                                    <div className="flex items-center gap-5">
                                        {getOptionIcon(option)}
                                        <span className="text-white font-semibold flex-1">
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
                                className="mt-8 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center gap-3"
                            >
                                <AlertCircle className="text-red-400" size={28} />
                                <div>
                                    <div className="text-red-400 font-semibold text-lg">Time's Up!</div>
                                    <div className="text-red-300 text-base">Moving to next question...</div>
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
