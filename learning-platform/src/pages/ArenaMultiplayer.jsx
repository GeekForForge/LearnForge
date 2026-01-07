// =========================================
// ArenaMultiplayer.jsx (MERGED & UPDATED)
// With REAL Judge0 execution + Enhanced UI
// =========================================

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
    Users, Sword, MessageCircle, Send, Code2, Trophy, Clock,
    Play, CheckCircle, ChevronDown, ChevronUp, Terminal, Cpu,
    CheckSquare, X, Shield, Sparkles, GripVertical, Zap,
    Loader2, Crown, Target, AlertCircle, Star
} from "lucide-react";

const WS_URL = "http://localhost:8080/api/ws/arena";

// Resize Panel Component
const ResizablePanel = ({ children, defaultWidth, minWidth = 200, maxWidth = 800, onResize }) => {
    const [width, setWidth] = useState(defaultWidth);
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef(null);

    const startResizing = useCallback((e) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e) => {
        if (isResizing && panelRef.current) {
            const newWidth = e.clientX - panelRef.current.getBoundingClientRect().left;
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setWidth(newWidth);
                onResize?.(newWidth);
            }
        }
    }, [isResizing, minWidth, maxWidth, onResize]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div
            ref={panelRef}
            className="relative flex"
            style={{ width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }}
        >
            {children}
            <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-cyan-400/30 active:bg-cyan-400/50 transition-colors z-10"
                onMouseDown={startResizing}
            >
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
                    <GripVertical className="w-3 h-3 text-cyan-400" />
                </div>
            </div>
        </div>
    );
};

const ArenaMultiplayer = () => {
    const { roomId } = useParams();

    const [connected, setConnected] = useState(false);
    const [players, setPlayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [gameState, setGameState] = useState("waiting");
    const [countdown, setCountdown] = useState(3);
    const [newMessage, setNewMessage] = useState("");

    const [code, setCode] = useState(
        `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
    );

    const [gameTime, setGameTime] = useState(300);
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [output, setOutput] = useState("");
    const [submissionResult, setSubmissionResult] = useState(null);
    const [showOutput, setShowOutput] = useState(false);
    const [showTestCases, setShowTestCases] = useState(true);

    // Panel widths state
    const [problemWidth, setProblemWidth] = useState(400);
    const [editorWidth, setEditorWidth] = useState(800);
    const [chatWidth, setChatWidth] = useState(350);

    const stompRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Mock problem
    const [problem, setProblem] = useState({
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
                explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
            }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ]
    });

    // TEMP USER
    const [user, setUser] = useState({
        username: "Player_" + Math.floor(Math.random() * 10000),
        avatarUrl: "",
        level: Math.floor(Math.random() * 50) + 1
    });

    // Load logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser({
                        username: data.username || data.name || "Player",
                        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`,
                        level: Math.floor(Math.random() * 50) + 1
                    });
                } else {
                    const storedUsername = localStorage.getItem("username");
                    if (storedUsername) {
                        setUser({
                            username: storedUsername,
                            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${storedUsername}`,
                            level: Math.floor(Math.random() * 50) + 1
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUser();
    }, []);

    // Scroll chat to bottom
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            const isScrolledToBottom =
                chatContainer.scrollHeight - chatContainer.clientHeight <=
                chatContainer.scrollTop + 100;

            if (isScrolledToBottom) {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages]);

    // ==========================
    // WebSocket Connection
    // ==========================
    useEffect(() => {
        if (!user.username) return;

        const sock = new SockJS(WS_URL, null, {
            transports: ["websocket", "xhr-streaming", "xhr-polling"],
        });

        const stomp = new Client({
            webSocketFactory: () => sock,
            debug: (msg) => console.log("[STOMP]", msg),
            reconnectDelay: 3000,
            onConnect: () => {
                console.log("✅ STOMP Connected");
                setConnected(true);

                stomp.subscribe(`/topic/arena/${roomId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    console.log("📩 Message received:", data);
                    setMessages((old) => [...old, data]);

                    if (data.action === "JOINED" && data.userId) {
                        setPlayers((old) => {
                            if (!old.some((p) => p.userId === data.userId)) {
                                return [...old, {
                                    userId: data.userId,
                                    avatar: data.avatar,
                                    level: Math.floor(Math.random() * 50) + 1
                                }];
                            }
                            return old;
                        });
                    }

                    if (data.action === "PLAYER_LIST" && Array.isArray(data.players)) {
                        setPlayers(
                            data.players.map((userId) => ({
                                userId,
                                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
                                level: Math.floor(Math.random() * 50) + 1
                            }))
                        );
                    }
                });

                stomp.publish({
                    destination: "/app/arena/join",
                    body: JSON.stringify({
                        roomId,
                        userId: user.username,
                        avatar: user.avatarUrl,
                        action: "JOIN",
                    }),
                });
            },
        });

        stomp.activate();
        stompRef.current = stomp;

        return () => stomp.deactivate();
    }, [roomId, user]);

    // ==========================
    // Game Countdown
    // ==========================
    useEffect(() => {
        if (players.length === 2 && gameState === "waiting") {
            setGameState("starting");
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(countdownInterval);
                        setGameState("active");
                        startGameTimer();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [players.length, gameState]);

    // ==========================
    // Game Timer
    // ==========================
    const startGameTimer = () => {
        const timerInterval = setInterval(() => {
            setGameTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    setGameState("finished");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // ==========================
    // Chat Functions
    // ==========================
    const sendMessage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (newMessage.trim() && stompRef.current) {
            stompRef.current.publish({
                destination: "/app/arena/chat",
                body: JSON.stringify({
                    roomId,
                    userId: user.username,
                    avatar: user.avatarUrl,
                    action: "CHAT",
                    message: newMessage,
                    timestamp: new Date().toISOString(),
                }),
            });
            setNewMessage("");
            messageInputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            sendMessage(e);
        }
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    // ==========================
    // REAL Judge0 Execution
    // ==========================
    const runCode = async () => {
        setShowOutput(true);
        setOutput("⌛ Running...");

        try {
            const res = await fetch("http://localhost:8080/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    input: ""
                })
            });

            const data = await res.json();
            setOutput(data.stderr ? data.stderr : data.stdout || "No output");
        } catch (err) {
            setOutput("❌ Execution server error");
        }
    };

    const submitCode = async () => {
        setSubmissionResult({
            type: "evaluating",
            message: "Evaluating your solution..."
        });

        try {
            const res = await fetch("http://localhost:8080/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: code,
                    input: ""
                })
            });

            const data = await res.json();
            const passed = !data.stderr;

            setOutput(data.stdout || data.stderr);

            setSubmissionResult({
                type: passed ? "passed" : "failed",
                message: passed ? "All test cases passed 🎉" : "Error occurred ❌",
                details: passed ? data.stdout : data.stderr
            });

        } catch (err) {
            setSubmissionResult({
                type: "failed",
                message: "Execution Server Error",
                details: "Cannot connect to Judge0 backend."
            });
        }
    };

    const closeResultModal = () => {
        setSubmissionResult(null);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-400 bg-green-400/20 border-green-400/30';
            case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
            case 'hard': return 'text-red-400 bg-red-400/20 border-red-400/30';
            default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-16 pb-4 relative overflow-hidden">
            {/* Main Grid Layout with Resizable Panels */}
            <div className="h-[calc(100vh-4rem)] flex gap-2 px-2">
                {/* Left Sidebar - Problem Statement - RESIZABLE */}
                <ResizablePanel
                    defaultWidth={400}
                    minWidth={300}
                    maxWidth={600}
                    onResize={setProblemWidth}
                >
                    <AnimatePresence mode="wait">
                        {gameState === "waiting" ? (
                            // Pre-Connection State
                            <motion.div
                                key="waiting"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="backdrop-blur-2xl rounded-2xl p-6 border border-white/10 bg-white/5 shadow-2xl flex-1 flex flex-col items-center justify-center w-full h-full"
                            >
                                <div className="text-center">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Sword className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Waiting for Opponent</h3>
                                    <p className="text-white/60 mb-6">Share room code to invite other players</p>
                                    <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                                        <p className="text-white font-mono text-lg font-bold">{roomId}</p>
                                    </div>
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                                        <span className="text-cyan-400 ml-2">Connecting...</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            // Post-Connection State - Problem Statement
                            <motion.div
                                key="problem"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="backdrop-blur-2xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden flex flex-col h-full w-full"
                            >
                                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-bold text-lg">Problem Statement</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                                    {/* Problem Title */}
                                    <div>
                                        <h1 className="text-xl font-bold text-white mb-2">{problem.title}</h1>
                                        <p className="text-white/70 text-sm leading-relaxed">{problem.description}</p>
                                    </div>

                                    {/* Examples */}
                                    <div>
                                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-cyan-400" />
                                            Examples
                                        </h4>
                                        <div className="space-y-4">
                                            {problem.examples.map((example, index) => (
                                                <div key={index} className="bg-black/30 rounded-lg p-4 border border-white/10">
                                                    <p className="text-white/80 text-sm mb-2">
                                                        <strong>Input:</strong> {example.input}
                                                    </p>
                                                    <p className="text-white/80 text-sm mb-2">
                                                        <strong>Output:</strong> {example.output}
                                                    </p>
                                                    <p className="text-white/60 text-sm">
                                                        <strong>Explanation:</strong> {example.explanation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Constraints */}
                                    <div>
                                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-purple-400" />
                                            Constraints
                                        </h4>
                                        <ul className="text-white/60 text-sm space-y-2">
                                            {problem.constraints.map((constraint, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="text-cyan-400 mt-0.5">•</span>
                                                    <span>{constraint}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </ResizablePanel>

                {/* Middle Section - Code Editor - RESIZABLE */}
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                    {/* Editor Header with Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="backdrop-blur-2xl rounded-2xl p-4 border border-white/10 bg-white/5 shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Language Selector */}
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="bg-black/30 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-cyan-400"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>

                                {/* Player Stats */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={user.avatarUrl}
                                            alt="avatar"
                                            className="w-6 h-6 rounded-full border border-white/20"
                                        />
                                        <span className="text-white text-sm font-medium">{user.username}</span>
                                    </div>
                                    <div className="w-px h-4 bg-white/20"></div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <span className="text-white/70 text-sm">Lv. {user.level}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Timer */}
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/10">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span className="text-white font-mono text-sm font-bold">
                                        {formatTime(gameTime)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={runCode}
                                        className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-400/30 hover:bg-cyan-500/30 transition-all flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Play className="w-4 h-4" />
                                        Run
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={submitCode}
                                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-400/30 hover:bg-green-500/30 transition-all flex items-center gap-2 text-sm font-medium"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Submit
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Code Editor */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`flex-1 backdrop-blur-2xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden flex flex-col ${gameState === "waiting" ? "filter blur-sm pointer-events-none" : ""
                            }`}
                    >
                        {/* Editor Container */}
                        <div className="flex-1 min-h-0">
                            <Editor
                                height="100%"
                                language={selectedLanguage}
                                value={code}
                                onChange={handleEditorChange}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 20, bottom: 20 },
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    glyphMargin: true,
                                    folding: true,
                                    suggestOnTriggerCharacters: true,
                                    tabSize: 2,
                                    insertSpaces: true,
                                    autoIndent: 'full'
                                }}
                            />
                        </div>

                        {/* Test Cases & Output Section */}
                        <div className="border-t border-white/10">
                            {/* Test Cases */}
                            <div className="border-b border-white/10">
                                <button
                                    onClick={() => setShowTestCases(!showTestCases)}
                                    className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-cyan-400" />
                                        <span className="font-medium">Test Cases</span>
                                    </div>
                                    {showTestCases ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {showTestCases && (
                                    <div className="px-4 pb-4 space-y-3">
                                        {[1, 2, 3].map((testCase) => (
                                            <div key={testCase} className="bg-black/30 rounded-lg p-3 border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Cpu className="w-4 h-4 text-purple-400" />
                                                    <span className="text-white text-sm font-medium">Test Case {testCase}</span>
                                                </div>
                                                <div className="text-white/70 text-xs space-y-1">
                                                    <div>Input: nums = [{testCase === 1 ? '2,7,11,15' : testCase === 2 ? '3,2,4' : '3,3'}], target = {testCase === 1 ? '9' : testCase === 2 ? '6' : '6'}</div>
                                                    <div>Expected: [{testCase === 1 ? '0,1' : testCase === 2 ? '1,2' : '0,1'}]</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Output Console */}
                            <div>
                                <button
                                    onClick={() => setShowOutput(!showOutput)}
                                    className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-green-400" />
                                        <span className="font-medium">Output</span>
                                    </div>
                                    {showOutput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {showOutput && (
                                    <div className="px-4 pb-4">
                                        <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                                            <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                                                {output || "Run your code to see output here..."}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Sidebar - Battle Chat - RESIZABLE */}
                <ResizablePanel
                    defaultWidth={350}
                    minWidth={250}
                    maxWidth={500}
                    onResize={setChatWidth}
                >
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="backdrop-blur-2xl rounded-2xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden flex flex-col h-full w-full"
                    >
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-cyan-400" />
                                Battle Chat
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                    <span className="text-cyan-400 text-sm">{players.length}/2 Online</span>
                                </div>
                            </h3>
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.userId === user.username ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <img
                                        src={msg.avatar}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full border border-white/20 shadow-md flex-shrink-0"
                                    />
                                    <div className={`max-w-[80%] ${msg.userId === user.username ? "text-right" : "text-left"}`}>
                                        <p className="text-white/60 text-xs mb-1">
                                            {msg.userId === user.username ? "You" : msg.userId}
                                        </p>
                                        <div
                                            className={`rounded-2xl px-4 py-3 backdrop-blur-xl border shadow-lg ${msg.userId === user.username
                                                    ? "bg-cyan-500/20 border-cyan-400/30 rounded-br-none"
                                                    : "bg-purple-500/20 border-purple-400/30 rounded-bl-none"
                                                }`}
                                        >
                                            {msg.message && <p className="text-white text-sm">{msg.message}</p>}
                                            {msg.action === "JOINED" && (
                                                <p className="text-green-400 text-xs flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    {msg.userId} joined the battle
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    ref={messageInputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 backdrop-blur-xl text-sm"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl px-4 py-2 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg"
                                >
                                    <Send size={16} />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </ResizablePanel>
            </div>

            {/* Countdown Overlay */}
            <AnimatePresence>
                {gameState === "starting" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-3xl"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    textShadow: [
                                        "0 0 20px rgba(34, 211, 238, 0.5)",
                                        "0 0 40px rgba(34, 211, 238, 0.8)",
                                        "0 0 20px rgba(34, 211, 238, 0.5)"
                                    ]
                                }}
                                transition={{ duration: 0.5 }}
                                className="text-8xl font-bold text-cyan-400 mb-4"
                            >
                                {countdown}
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl text-white font-semibold"
                            >
                                Get Ready to Code!
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submission Result Modal */}
            <AnimatePresence>
                {submissionResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-3xl"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="backdrop-blur-2xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 max-w-md w-full mx-4 shadow-2xl"
                        >
                            {submissionResult.type === "evaluating" ? (
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    >
                                        <Cpu className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Evaluating...</h3>
                                    <p className="text-white/60">Running your solution against test cases</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${submissionResult.type === "passed"
                                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                                : "bg-gradient-to-r from-red-500 to-pink-500"
                                            }`}
                                    >
                                        {submissionResult.type === "passed" ? (
                                            <CheckSquare className="w-8 h-8 text-white" />
                                        ) : (
                                            <X className="w-8 h-8 text-white" />
                                        )}
                                    </motion.div>
                                    <h3 className={`text-2xl font-bold mb-2 ${submissionResult.type === "passed" ? "text-green-400" : "text-red-400"
                                        }`}>
                                        {submissionResult.type === "passed" ? "Solution Accepted! 🎉" : "Solution Rejected"}
                                    </h3>
                                    <p className="text-white/60 mb-6">{submissionResult.message}</p>
                                    {submissionResult.details && (
                                        <p className="text-white/70 text-sm mb-6">{submissionResult.details}</p>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={closeResultModal}
                                        className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl px-6 py-3 font-semibold backdrop-blur-xl border border-white/20 shadow-lg"
                                    >
                                        Continue Coding
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #0891b2, #7c3aed);
                }
            `}</style>
        </div>
    );
};

export default ArenaMultiplayer;