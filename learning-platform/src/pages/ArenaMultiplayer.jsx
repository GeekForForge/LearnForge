// src/pages/ArenaMultiplayer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Sword, Loader2, Crown, Zap, Target, Trophy, MessageCircle, Send, Sparkles, Code2 } from "lucide-react";

const WS_URL = "http://localhost:8080/api/ws/arena";

const ArenaMultiplayer = () => {
    const { roomId } = useParams();
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [players, setPlayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [gameState, setGameState] = useState("waiting");
    const [countdown, setCountdown] = useState(3);
    const [newMessage, setNewMessage] = useState("");
    const stompRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Get user info from localStorage
    const userId = localStorage.getItem("username") || "Guest";
    const avatarUrl = localStorage.getItem("avatarUrl") || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // WebSocket connection
    useEffect(() => {
        const sock = new SockJS(WS_URL);
        const stomp = new Client({
            webSocketFactory: () => sock,
            debug: () => {},
            reconnectDelay: 3000,
            onConnect: () => {
                setConnected(true);
                stomp.subscribe(`/topic/arena/${roomId}`, (msg) => {
                    const data = JSON.parse(msg.body);
                    setMessages((old) => [...old, data]);
                    if (data.action === "JOINED" && data.userId) {
                        setPlayers((old) => {
                            if (!old.some(p => p.userId === data.userId)) {
                                return [...old, { userId: data.userId, avatar: data.avatar }];
                            }
                            return old;
                        });
                    }
                });
                stomp.publish({
                    destination: "/app/arena/join",
                    body: JSON.stringify({
                        roomId,
                        userId,
                        avatar: avatarUrl,
                        action: "JOIN"
                    })
                });
            }
        });
        stomp.activate();
        setClient(stomp);
        stompRef.current = stomp;
        return () => stomp.deactivate();
    }, [roomId, userId, avatarUrl]);

    // Start game when 2 players join
    useEffect(() => {
        if (players.length === 2 && gameState === "waiting") {
            setGameState("starting");
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(countdownInterval);
                        setGameState("active");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [players.length, gameState]);

    const sendMessage = () => {
        if (newMessage.trim() && stompRef.current) {
            stompRef.current.publish({
                destination: "/app/arena/chat",
                body: JSON.stringify({
                    roomId,
                    userId,
                    avatar: avatarUrl,
                    action: "CHAT",
                    message: newMessage,
                    timestamp: new Date().toISOString()
                })
            });
            setNewMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-6 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Grid Layout - Using full screen with proper navbar spacing */}
            <div className="h-[calc(100vh-8rem)] px-6 grid grid-cols-12 gap-6">

                {/* Left Sidebar - Battle Participants & Status */}
                <div className="col-span-3 flex flex-col gap-6">
                    {/* Battle Participants */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="backdrop-blur-2xl rounded-3xl p-6 border border-white/10 bg-white/5 shadow-2xl flex-1"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Users size={24} className="text-cyan-400" />
                            <h3 className="text-white font-bold text-xl">Battle Participants</h3>
                            <div className="ml-auto px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                <span className="text-white/80 text-sm font-medium">{players.length}/2</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {players.map((player, index) => (
                                <motion.div
                                    key={player.userId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 backdrop-blur-xl ${
                                        player.userId === userId
                                            ? 'border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 to-cyan-500/5'
                                            : 'border-purple-400/40 bg-gradient-to-r from-purple-500/15 to-purple-500/5'
                                    } shadow-lg`}
                                >
                                    <div className="relative">
                                        <img
                                            src={player.avatar}
                                            alt="avatar"
                                            className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
                                        />
                                        {index === 0 && (
                                            <Crown size={16} className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400/20" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate text-sm">
                                            {player.userId === userId ? "You" : `Player ${index + 1}`}
                                        </p>
                                        <p className="text-white/60 text-xs truncate">{player.userId}</p>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full border border-white/10">
                                        <Zap size={14} className="text-yellow-400" />
                                        <span className="text-white/80 text-xs font-medium">Lv. {Math.floor(Math.random() * 50) + 1}</span>
                                    </div>
                                </motion.div>
                            ))}

                            {players.length < 2 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-xl"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                        <Loader2 className="animate-spin text-cyan-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-sm">Waiting for opponent</p>
                                        <p className="text-white/60 text-xs">Share room code to invite</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Battle Status */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="backdrop-blur-2xl rounded-3xl p-6 border border-white/10 bg-white/5 shadow-2xl"
                    >
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                            <Target size={20} className="text-purple-400" />
                            Battle Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-white/70 text-sm">Game State</span>
                                <span className="text-cyan-400 font-medium capitalize text-sm">{gameState}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70 text-sm">Players Ready</span>
                                <span className="text-green-400 font-medium text-sm">{players.length}/2</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70 text-sm">Room Code</span>
                                <span className="text-yellow-400 font-mono font-medium text-sm">{roomId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/70 text-sm">Connection</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                                    <span className="text-white/80 text-sm">{connected ? 'Connected' : 'Connecting'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Center Arena - Main Game Area */}
                <div className="col-span-6 flex flex-col">
                    {/* Header - Moved down to avoid navbar clash */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="relative">
                                <Sword size={40} className="text-cyan-400 drop-shadow-lg" />
                                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                                Code Arena
                            </h1>
                        </div>
                        <p className="text-white/70 text-lg font-light">
                            Real-time coding battles where skills are tested and champions are crowned
                        </p>
                    </motion.div>

                    {/* Main Game Arena */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/10 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex-1 flex items-center justify-center shadow-2xl"
                    >
                        <AnimatePresence>
                            {gameState === "waiting" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2 }}
                                    className="text-center w-full max-w-2xl"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="mb-8"
                                    >
                                        <Target size={80} className="mx-auto text-cyan-400/80" />
                                    </motion.div>
                                    <h3 className="text-3xl font-bold text-white mb-4">
                                        Waiting for Warriors
                                    </h3>
                                    <p className="text-white/70 text-lg mb-2">
                                        {players.length === 1 ? "1 champion ready" : "Awaiting contenders..."}
                                    </p>
                                    <div className="flex justify-center gap-2 mt-6">
                                        {[1, 2, 3].map((dot) => (
                                            <motion.div
                                                key={dot}
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: dot * 0.3
                                                }}
                                                className="w-2 h-2 bg-cyan-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {gameState === "starting" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="mb-8"
                                    >
                                        <Sword size={100} className="mx-auto text-purple-400" />
                                    </motion.div>
                                    <motion.h3
                                        key={countdown}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-8xl font-bold text-white mb-4 font-mono"
                                    >
                                        {countdown}
                                    </motion.h3>
                                    <p className="text-white/70 text-xl">Prepare for Battle!</p>
                                </motion.div>
                            )}

                            {gameState === "active" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full max-w-4xl mx-auto"
                                >
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-center mb-8"
                                    >
                                        <Trophy size={50} className="mx-auto text-yellow-400 mb-3" />
                                        <h3 className="text-3xl font-bold text-white mb-2">
                                            Battle Commenced!
                                        </h3>
                                        <p className="text-white/70 text-lg">
                                            First to solve wins the round
                                        </p>
                                    </motion.div>

                                    <div className="backdrop-blur-2xl rounded-2xl p-6 border border-white/10 bg-white/5 shadow-lg">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Code2 size={20} className="text-green-400" />
                                            <h4 className="text-white font-bold text-lg">Challenge: String Reversal</h4>
                                        </div>
                                        <p className="text-white/80 mb-4 text-sm">
                                            Implement a function that reverses a string without using built-in reverse methods.
                                        </p>
                                        <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-4">
                                            <pre className="text-cyan-300 text-sm font-mono">
{`function reverseString(str) {
    // Your implementation here
    // Example: "hello" -> "olleh"
    // Return the reversed string
}`}
                                            </pre>
                                        </div>
                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white py-3 rounded-xl font-semibold backdrop-blur-xl border border-white/20 text-sm"
                                            >
                                                Submit Solution
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 bg-white/10 text-white py-3 rounded-xl font-semibold backdrop-blur-xl border border-white/20 text-sm"
                                            >
                                                Hint
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Right Sidebar - Chat */}
                <div className="col-span-3">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="backdrop-blur-2xl rounded-3xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden flex flex-col h-full"
                    >
                        <div className="p-4 border-b border-white/10 bg-white/5">
                            <h3 className="text-white font-bold text-lg flex items-center gap-3">
                                <MessageCircle size={20} className="text-cyan-400" />
                                Arena Chat
                                <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.userId === userId ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <img
                                        src={msg.avatar}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0 shadow-md"
                                    />
                                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 backdrop-blur-xl border ${
                                        msg.userId === userId
                                            ? 'bg-cyan-500/20 border-cyan-400/30 rounded-br-none'
                                            : 'bg-purple-500/20 border-purple-400/30 rounded-bl-none'
                                    }`}>
                                        {msg.message && (
                                            <p className="text-white text-sm">{msg.message}</p>
                                        )}
                                        {msg.action === "JOINED" && (
                                            <p className="text-green-400 text-sm flex items-center gap-1 text-xs">
                                                🎉 {msg.userId} joined the battle
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-cyan-400/50 backdrop-blur-xl text-sm"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={sendMessage}
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl px-3 py-2 flex items-center gap-1 backdrop-blur-xl border border-white/20 shadow-lg"
                                >
                                    <Send size={14} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ArenaMultiplayer;