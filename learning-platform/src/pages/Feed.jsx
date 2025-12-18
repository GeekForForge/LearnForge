// src/pages/Feed.jsx

import { db } from '../firebase';
import {
    collection, query, onSnapshot, orderBy, addDoc, serverTimestamp,
    doc, updateDoc, arrayUnion, arrayRemove, where, runTransaction,
    increment, deleteDoc, setDoc, getDoc, getDocs
} from 'firebase/firestore';
import {
    Heart, MessageCircle, Share2, Bookmark, Send, Smile,
    Award, TrendingUp, Users, Flame, BookOpen, Code,
    MoreHorizontal, Search, UserPlus, UserCheck, Rocket,
    Sparkles, Zap, Image, Video, GitBranch, Eye,
    MapPin, Calendar, Clock, Star, Target, Coffee,
    Home, Bell, MessageSquare, Briefcase, User,
    ChevronLeft, ChevronRight, ArrowLeft, Paperclip,
    X, Calendar as CalendarIcon, ChevronDown, ChevronUp,
    Trash2, Clipboard, Check, Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// ✅ FIXED Calendar Component (now works properly)
const CalendarModal = ({ isOpen, onClose, onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Helper: get all days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty placeholders before first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add actual days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDateClick = (date) => {
        if (date) {
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            setSelectedDate(formattedDate);
        }
    };

    const handleConfirm = () => {
        if (selectedDate) {
            onDateSelect(selectedDate);
            onClose();
        }
    };

    const navigateMonth = (direction) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    // 🧠 Debugging (you can remove later)
    console.log("CalendarModal rendered → isOpen:", isOpen);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // ✅ raised z-index so modal always visible above Feed
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md mx-auto shadow-xl shadow-neon-purple/20"
                onClick={(e) => e.stopPropagation()} // ✅ prevents instant close
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold text-lg">Select Event Date</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <h4 className="text-white font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h4>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                            {day}
                        </div>
                    ))}
                    {days.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => handleDateClick(date)}
                            disabled={!date}
                            className={`p-2 rounded-xl text-sm transition-all ${date
                                ? selectedDate && date.toDateString() === new Date(selectedDate).toDateString()
                                    ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                    : 'text-white hover:bg-white/10'
                                : 'text-transparent'
                                }`}
                        >
                            {date ? date.getDate() : ''}
                        </button>
                    ))}
                </div>

                {/* Selected Date */}
                {selectedDate && (
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 text-neon-cyan mb-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-sm font-semibold">Selected Date</span>
                        </div>
                        <p className="text-white text-sm">{selectedDate}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDate}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Date
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Code Formatter Component with Syntax Highlighting & Copy
const CodeFormatter = ({ code, language = 'javascript' }) => {
    const [formattedCode, setFormattedCode] = useState(code);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        // Enhanced code formatting with language-specific patterns
        const formatCode = (code, lang) => {
            let lines = code.split('\n');
            let indentLevel = 0;
            let formattedLines = [];

            // Language-specific keywords for basic highlighting
            const keywords = {
                python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'as', 'return', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'],
                javascript: ['function', 'class', 'if', 'else', 'for', 'while', 'return', 'const', 'let', 'var', 'true', 'false', 'null', 'undefined', 'export', 'import', 'from', 'default', 'async', 'await'],
                java: ['public', 'private', 'class', 'static', 'void', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'null', 'new', 'this', 'import', 'package'],
                cpp: ['#include', 'using', 'namespace', 'std', 'int', 'float', 'double', 'char', 'void', 'class', 'public', 'private', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'nullptr'],
                html: ['<!DOCTYPE', '<html', '<head', '<body', '<div', '<span', '<p', '<h1', '<h2', '<h3', '<a', '<img', '<script', '<style', '<link'],
                css: ['@import', '@media', '@keyframes', '.', '#', 'margin', 'padding', 'color', 'background', 'font', 'display', 'position', 'width', 'height'],
                typescript: ['interface', 'type', 'enum', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'const', 'let', 'true', 'false', 'null', 'undefined', 'export', 'import', 'from']
            };

            const langKeywords = keywords[lang] || keywords.javascript;

            for (let line of lines) {
                const trimmedLine = line.trim();
                // Preserve empty lines
                if (lines.length > 1 && !trimmedLine) {
                    formattedLines.push('');
                    continue;
                }

                // Decrease indent for closing braces/brackets
                if (trimmedLine.endsWith('}') || trimmedLine.endsWith('];') || trimmedLine === ');' || trimmedLine.endsWith('>')) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }

                // Add current line with proper indentation and basic syntax highlighting
                let formattedLine = '  '.repeat(indentLevel);

                // Basic syntax highlighting
                const words = trimmedLine.split(/(\s+)/);
                const highlightedWords = words.map(word => {
                    if (langKeywords.includes(word.trim())) {
                        return `<span class="text-pink-400 font-bold">${word}</span>`;
                    } else if (word.match(/^["'].*["']$/) || word.match(/^\d+$/)) {
                        return `<span class="text-green-300">${word}</span>`;
                    } else if (word.match(/^[{}()\[\];,]$/)) {
                        return `<span class="text-yellow-200">${word}</span>`;
                    } else if (word.match(/^\/\/|\/\*|\*\/$/)) {
                        return `<span class="text-gray-500 italic">${word}</span>`;
                    }
                    // Function calls (heuristic)
                    else if (word.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*\($/)) {
                        return `<span class="text-blue-300">${word}</span>`;
                    }
                    return `<span class="text-gray-200">${word}</span>`;
                });

                formattedLine += highlightedWords.join('');
                formattedLines.push(formattedLine);

                // Increase indent for opening braces/brackets
                if (trimmedLine.endsWith('{') || trimmedLine.endsWith('=[') || trimmedLine.endsWith('(') || trimmedLine.endsWith('<')) {
                    indentLevel += 1;
                }
            }

            return formattedLines.join('\n');
        };

        setFormattedCode(formatCode(code, language));
    }, [code, language]);

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117] my-3 group">
            {/* MacOS-like Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                    {language}
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto bg-[#0d1117]">
                <pre className="text-sm font-mono whitespace-pre leading-relaxed font-normal">
                    <code
                        dangerouslySetInnerHTML={{ __html: formattedCode }}
                    />
                </pre>
            </div>
        </div>
    );
};

// Enhanced Read More Component with WhatsApp-style nested expansion
const ReadMore = ({ text, maxLength = 500, nestedLength = 1500 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFullyExpanded, setIsFullyExpanded] = useState(false);

    if (!text) return null;

    // If text is within first level limit
    if (text.length <= maxLength) {
        return (
            <p className="text-white text-base leading-relaxed whitespace-pre-line">
                {text}
            </p>
        );
    }

    // If text is within second level limit and expanded
    if (isExpanded && text.length <= nestedLength) {
        return (
            <div>
                <p className="text-white text-base leading-relaxed whitespace-pre-line">
                    {text}
                </p>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="mt-2 text-neon-cyan hover:text-neon-purple transition-colors font-semibold text-sm flex items-center gap-1"
                >
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                </button>
            </div>
        );
    }

    // If text exceeds second level limit and needs nested expansion
    if (text.length > nestedLength) {
        if (!isExpanded) {
            // First level - show truncated text
            return (
                <div>
                    <p className="text-white text-base leading-relaxed whitespace-pre-line">
                        {text.slice(0, maxLength)}...
                    </p>
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="mt-2 text-neon-cyan hover:text-neon-purple transition-colors font-semibold text-sm flex items-center gap-1"
                    >
                        <ChevronDown className="w-4 h-4" />
                        Read More
                    </button>
                </div>
            );
        } else if (!isFullyExpanded) {
            // Second level - show more content but not all
            return (
                <div>
                    <p className="text-white text-base leading-relaxed whitespace-pre-line">
                        {text.slice(0, nestedLength)}...
                    </p>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => setIsFullyExpanded(true)}
                            className="text-neon-cyan hover:text-neon-purple transition-colors font-semibold text-sm flex items-center gap-1"
                        >
                            <ChevronDown className="w-4 h-4" />
                            Read More
                        </button>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                        >
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </button>
                    </div>
                </div>
            );
        } else {
            // Fully expanded - show all content
            return (
                <div>
                    <p className="text-white text-base leading-relaxed whitespace-pre-line">
                        {text}
                    </p>
                    <button
                        onClick={() => {
                            setIsFullyExpanded(false);
                            setIsExpanded(false);
                        }}
                        className="mt-2 text-neon-cyan hover:text-neon-purple transition-colors font-semibold text-sm flex items-center gap-1"
                    >
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                    </button>
                </div>
            );
        }
    }

    // Fallback for normal expansion
    return (
        <div>
            <p className="text-white text-base leading-relaxed whitespace-pre-line">
                {isExpanded ? text : `${text.slice(0, maxLength)}...`}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-neon-cyan hover:text-neon-purple transition-colors font-semibold text-sm flex items-center gap-1"
            >
                {isExpanded ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        Read More
                    </>
                )}
            </button>
        </div>
    );
};

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';

    const date = timestamp.toDate();
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
};

// Chat Window Component
const ChatWindow = ({ chatId, otherUser, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        setLoading(true);
        const messagesCol = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesCol, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMessages);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !chatId) return;

        const messagesCol = collection(db, 'chats', chatId, 'messages');

        try {
            await addDoc(messagesCol, {
                text: newMessage,
                senderId: user.userId,
                senderName: user.name,
                timestamp: serverTimestamp()
            });

            const chatDocRef = doc(db, 'chats', chatId);
            await updateDoc(chatDocRef, {
                lastMessage: newMessage,
                lastTimestamp: serverTimestamp()
            });

            setNewMessage('');
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!chatId || !otherUser) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="text-center text-gray-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-neon-cyan" />
                    <h2 className="text-xl font-semibold text-white mb-2">Select a conversation</h2>
                    <p className="text-gray-300">Choose a friend to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        >
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onBack}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </motion.button>
                    <div className="relative">
                        <img
                            src={otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${otherUser.name}&background=8B5CF6&color=fff`}
                            alt={otherUser.name}
                            className="w-10 h-10 rounded-full border-2 border-neon-cyan"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-semibold">{otherUser.name}</h3>
                        <p className="text-neon-cyan text-sm">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
                {loading ? (
                    <div className="flex justify-center">
                        <div className="text-gray-400 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 animate-spin" />
                            <span>Loading messages...</span>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Sparkles className="w-12 h-12 mb-4 text-neon-purple" />
                        <h3 className="text-white font-semibold mb-2">No messages yet</h3>
                        <p className="text-center">Send a message to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isSender = msg.senderId === user.userId;
                        const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isSender && showAvatar && (
                                    <img
                                        src={otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${otherUser.name}&background=8B5CF6&color=fff`}
                                        alt={otherUser.name}
                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                    />
                                )}

                                {!isSender && !showAvatar && (
                                    <div className="w-8"></div>
                                )}

                                <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-xs md:max-w-md`}>
                                    {!isSender && showAvatar && (
                                        <span className="text-xs text-gray-400 mb-1">{msg.senderName}</span>
                                    )}
                                    <div
                                        className={`px-4 py-3 rounded-2xl ${isSender
                                            ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                            : 'bg-white/10 text-white'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">
                                        {formatMessageTime(msg.timestamp)}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            className="p-2 text-gray-400 hover:text-neon-cyan transition-all"
                        >
                            <Paperclip className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            className="p-2 text-gray-400 hover:text-neon-cyan transition-all"
                        >
                            <Image className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full bg-white/10 text-white rounded-2xl px-4 py-3 pr-12 border border-white/10 focus:border-neon-cyan focus:outline-none backdrop-blur-sm"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-all"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-xl hover:shadow-lg hover:shadow-neon-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

const Feed = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('forYou');
    const [postText, setPostText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [friendsSearchQuery, setFriendsSearchQuery] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [postType, setPostType] = useState('text'); // 'text', 'code', 'event'
    const [codeLanguage, setCodeLanguage] = useState('javascript');

    // Chat state
    const [selectedChat, setSelectedChat] = useState(null);
    const [otherUser, setOtherUser] = useState(null);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for dynamic profile card
    const [postCount, setPostCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // State for dynamic Discover/Follow logic
    const [discoverUsers, setDiscoverUsers] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [loadingDiscover, setLoadingDiscover] = useState(true);

    // Fetch posts
    useEffect(() => {
        setLoading(true);
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch user stats
    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.userId);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setFollowerCount(data.followersCount || 0);
                setFollowingCount(data.followingCount || 0);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch user's post count
    useEffect(() => {
        if (!user) return;

        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('userId', '==', user.userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPostCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch discover users
    useEffect(() => {
        if (!user) {
            setLoadingDiscover(false);
            return;
        }
        setLoadingDiscover(true);

        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('userId', '!=', user.userId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDiscoverUsers(fetchedUsers);
            setLoadingDiscover(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch following list
    useEffect(() => {
        if (!user) return;

        const followingColRef = collection(db, 'users', user.userId, 'following');
        const unsubscribe = onSnapshot(followingColRef, (snapshot) => {
            const followingIds = snapshot.docs.map(doc => doc.id);
            setFollowingList(followingIds);
        });

        return () => unsubscribe();
    }, [user]);

    // Handle calendar date selection
    const handleDateSelect = (date) => {
        const eventText = `🗓️ **Event Date:** ${date}\n\n`;
        setPostText(prev => eventText + (prev || ''));
        setPostType('event');
        setShowCalendar(false); // Close calendar after selection
    };

    // Handle code post creation
    const handleCodePost = () => {
        setPostType('code');
        const codeTemplate = `\`\`\`${codeLanguage}\n// Write your ${codeLanguage} code here\n\n\`\`\`\n`;
        setPostText(prev => prev + codeTemplate);
    };

    // Handle language change
    const handleLanguageChange = (newLanguage) => {
        setCodeLanguage(newLanguage);
        if (postType === 'code' && postText.includes('```')) {
            // Update the code block language in the existing text
            const updatedText = postText.replace(/```(\w+)?/, `\`\`\`${newLanguage}`);
            setPostText(updatedText);
        }
    };

    // Create post
    const handleCreatePost = async () => {
        if (!postText.trim() || !user) return;

        const userDocRef = doc(db, 'users', user.userId);
        const newPostRef = doc(collection(db, 'posts'));

        const newPostData = {
            id: newPostRef.id,
            content: postText,
            timestamp: serverTimestamp(),
            userId: user.userId,
            userName: user.name,
            userAvatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=8B5CF6&color=fff`,
            userTitle: user.bio || '',
            likedBy: [],
            bookmarkedBy: [],
            type: postType,
            language: postType === 'code' ? codeLanguage : null,
            tags: [],
            comments: 0,
            shares: 0,
            views: 0,
        };

        try {
            await runTransaction(db, async (transaction) => {
                transaction.set(newPostRef, newPostData);
                transaction.update(userDocRef, {
                    postsCount: increment(1)
                });
            });
            setPostText('');
            setPostType('text');
            setCodeLanguage('javascript');
        } catch (error) {
            console.error("Error creating post: ", error);
        }
    };

    // Start chat
    const handleStartChat = async (targetUser) => {
        if (!user || !targetUser) return;

        const currentUserId = user.userId;
        const targetUserId = targetUser.id;

        const chatId = currentUserId > targetUserId
            ? `${currentUserId}_${targetUserId}`
            : `${targetUserId}_${currentUserId}`;

        const chatDocRef = doc(db, 'chats', chatId);

        try {
            const docSnap = await getDoc(chatDocRef);

            if (!docSnap.exists()) {
                await setDoc(chatDocRef, {
                    users: [currentUserId, targetUserId],
                    userNames: [user.name, targetUser.name],
                    userAvatars: [
                        user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`,
                        targetUser.avatarUrl || `https://ui-avatars.com/api/?name=${targetUser.name}`
                    ],
                    lastMessage: '',
                    lastTimestamp: serverTimestamp()
                });
            }

            // Set chat state instead of navigating
            setSelectedChat(chatId);
            setOtherUser(targetUser);

        } catch (error) {
            console.error("Error starting chat: ", error);
        }
    };

    // Close chat
    const handleCloseChat = () => {
        setSelectedChat(null);
        setOtherUser(null);
    };

    // Like post
    const handleLike = async (postId) => {
        if (!user) return;

        const postRef = doc(db, 'posts', postId);
        const post = posts.find(p => p.id === postId);

        const isLiked = post.likedBy && post.likedBy.includes(user.userId);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likedBy: arrayRemove(user.userId)
                });
            } else {
                await updateDoc(postRef, {
                    likedBy: arrayUnion(user.userId)
                });
            }
        } catch (error) {
            console.error("Error updating like: ", error);
        }
    };

    // Bookmark post
    const handleBookmark = async (postId) => {
        if (!user) return;

        const postRef = doc(db, 'posts', postId);
        const post = posts.find(p => p.id === postId);

        const isBookmarked = post.bookmarkedBy && post.bookmarkedBy.includes(user.userId);

        try {
            if (isBookmarked) {
                await updateDoc(postRef, {
                    bookmarkedBy: arrayRemove(user.userId)
                });
            } else {
                await updateDoc(postRef, {
                    bookmarkedBy: arrayUnion(user.userId)
                });
            }
        } catch (error) {
            console.error("Error updating bookmark: ", error);
        }
    };

    // Follow user
    const handleFollow = async (targetUserId, isCurrentlyFollowing) => {
        if (!user) return;

        const currentUserRef = doc(db, 'users', user.userId);
        const targetUserRef = doc(db, 'users', targetUserId);

        const followingRef = doc(db, 'users', user.userId, 'following', targetUserId);
        const followerRef = doc(db, 'users', targetUserId, 'followers', user.userId);

        try {
            await runTransaction(db, async (transaction) => {
                if (isCurrentlyFollowing) {
                    transaction.update(currentUserRef, { followingCount: increment(-1) });
                    transaction.update(targetUserRef, { followersCount: increment(-1) });
                    transaction.delete(followingRef);
                    transaction.delete(followerRef);
                } else {
                    transaction.update(currentUserRef, { followingCount: increment(1) });
                    transaction.update(targetUserRef, { followersCount: increment(1) });
                    transaction.set(followingRef, { timestamp: serverTimestamp() });
                    transaction.set(followerRef, { timestamp: serverTimestamp() });
                }
            });
        } catch (error) {
            console.error("Error following/unfollowing user: ", error);
        }
    };

    // Render post content based on type
    const renderPostContent = (post) => {
        if (post.type === 'code' && post.content.includes('```')) {
            // Extract code from markdown code blocks
            const codeMatch = post.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
            if (codeMatch) {
                const code = codeMatch[1].trim();
                const beforeCode = post.content.split('```')[0];
                const afterCode = post.content.split('```')[2];

                return (
                    <div className="space-y-4">
                        {/* Text before code */}
                        {beforeCode && (
                            <ReadMore text={beforeCode} maxLength={300} nestedLength={800} />
                        )}
                        {/* Code block */}
                        <CodeFormatter code={code} language={post.language || 'javascript'} />
                        {/* Text after code */}
                        {afterCode && (
                            <ReadMore text={afterCode} maxLength={300} nestedLength={800} />
                        )}
                    </div>
                );
            }
        } else if (post.type === 'event') {
            // Extract date from content if it follows the "🗓️ **Event Date:** ..." pattern
            const dateMatch = post.content.match(/🗓️ \*\*Event Date:\*\* (.*?)\n/);
            const eventDate = dateMatch ? new Date(dateMatch[1]) : null;

            // Remove the raw date string from content display
            const cleanContent = post.content.replace(/🗓️ \*\*Event Date:\*\* .*?\n\n/, '');

            return (
                <div className="space-y-4">
                    {/* Compact Event Card */}
                    {eventDate && (
                        <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                            {/* Date Column */}
                            <div className="flex flex-col items-center justify-center w-24 bg-gradient-to-b from-neon-purple/20 to-neon-cyan/20 border-r border-white/10 p-2 text-center group-hover:from-neon-purple/30 group-hover:to-neon-cyan/30 transition-all">
                                <span className="text-xs uppercase font-bold text-neon-purple tracking-widest">
                                    {eventDate.toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="text-3xl font-bold text-white leading-none my-1">
                                    {eventDate.getDate()}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {eventDate.toLocaleString('default', { weekday: 'short' })}
                                </span>
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 p-4 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calendar className="w-4 h-4 text-neon-cyan" />
                                    <h4 className="font-bold text-white text-lg leading-tight">Upcoming Event</h4>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Mark your calendar
                                </p>
                            </div>

                            <div className="p-4 flex items-center border-l border-white/10">
                                <button className="p-2 rounded-full bg-white/5 hover:bg-neon-cyan hover:text-black text-gray-300 transition-all">
                                    <Bookmark size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Event Description (cleaned) */}
                    <div className="pl-1">
                        <ReadMore text={cleanContent || post.content} maxLength={300} nestedLength={800} />
                    </div>
                </div>
            );
        }

        // Default text post
        return <ReadMore text={post.content} maxLength={500} nestedLength={1500} />;
    };

    const filteredUsers = discoverUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    // Only show users that the current user is following
    const filteredFriends = discoverUsers.filter(friend =>
        followingList.includes(friend.id) && (
            friend.name.toLowerCase().includes(friendsSearchQuery.toLowerCase()) ||
            (friend.username && friend.username.toLowerCase().includes(friendsSearchQuery.toLowerCase()))
        )
    );

    // Delete post
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await deleteDoc(doc(db, 'posts', postId));

            // Verify user exists before updating
            if (user && user.userId) {
                const userRef = doc(db, 'users', user.userId);
                await updateDoc(userRef, {
                    postsCount: increment(-1)
                });
            }

            // Not strictly necessary since we have onSnapshot, but good for immediate UI feedback
            // setPosts(posts.filter(p => p.id !== postId)); 
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-16">
            <div className="max-w-screen-2xl mx-auto px-4 py-6">
                <div className="flex gap-6">

                    {/* COLLAPSIBLE LEFT SIDEBAR */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-20'
                            }`}
                        style={{ height: 'calc(100vh - 120px)' }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                {isSidebarOpen && (
                                    <h2 className="text-white font-bold text-lg">Following</h2>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                                >
                                    {isSidebarOpen ? (
                                        <ChevronLeft className="w-5 h-5 text-white" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-white" />
                                    )}
                                </motion.button>
                            </div>

                            {/* Search Friends - Only when sidebar is open */}
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4"
                                >
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-cyan" size={16} />
                                        <input
                                            type="text"
                                            value={friendsSearchQuery}
                                            onChange={(e) => setFriendsSearchQuery(e.target.value)}
                                            placeholder="Search following..."
                                            className="w-full bg-white/5 text-white rounded-xl pl-10 pr-4 py-2 text-sm border border-white/10 focus:border-neon-cyan focus:outline-none backdrop-blur-sm"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Scrollable Friends List */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {loadingDiscover ? (
                                <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                                    <Sparkles className="w-6 h-6 animate-spin" />
                                    <p className="text-sm mt-2">Loading...</p>
                                </div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-gray-300 px-4 text-center">
                                    <Users className="w-8 h-8 mb-2" />
                                    <p className="text-sm">You're not following anyone yet</p>
                                    <p className="text-xs mt-1">Discover users to follow in the Discover tab</p>
                                </div>
                            ) : (
                                <div className="space-y-1 px-2">
                                    {filteredFriends.slice(0, 15).map((friend) => (
                                        <motion.div
                                            key={friend.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleStartChat(friend)}
                                            className={`flex items-center p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer ${isSidebarOpen ? 'justify-between' : 'justify-center'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={friend.avatarUrl || `https://ui-avatars.com/api/?name=${friend.name}&background=8B5CF6&color=fff`}
                                                        alt={friend.name}
                                                        className="w-8 h-8 rounded-full border-2 border-neon-cyan"
                                                    />
                                                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-dark-800"></div>
                                                </div>
                                                {isSidebarOpen && (
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white font-semibold text-sm truncate">{friend.name}</h3>
                                                        <p className="text-gray-300 text-xs truncate">
                                                            {friend.title || 'Active now'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {isSidebarOpen && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFollow(friend.id, true);
                                                    }}
                                                    className="px-2 py-1 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
                                                >
                                                    Unfollow
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Profile at Bottom - Fixed */}
                        {user && (
                            <div className="p-3 border-t border-white/10 bg-white/2">
                                <motion.div
                                    className={`flex items-center gap-3 rounded-xl transition-all ${isSidebarOpen ? 'p-3 bg-white/5' : 'p-2 justify-center'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-neon-purple"
                                        />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-dark-800"></div>
                                    </div>
                                    {isSidebarOpen && (
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold text-sm truncate">{user.name}</h3>
                                            <p className="text-gray-300 text-xs truncate">
                                                {user.bio || 'LearnForge User'}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        )}
                    </motion.div>

                    {/* MAIN CONTENT - Either Feed or Chat */}
                    <div className="flex-1 space-y-6">
                        {selectedChat ? (
                            // CHAT VIEW
                            <ChatWindow
                                chatId={selectedChat}
                                otherUser={otherUser}
                                onBack={handleCloseChat}
                            />
                        ) : (
                            // FEED VIEW
                            <>
                                {/* Tab Navigation */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 mb-6 bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10"
                                >
                                    {[
                                        { id: 'forYou', label: 'For You', icon: <Sparkles className="w-4 h-4" />, color: 'from-neon-purple to-neon-cyan' },
                                        { id: 'discover', label: 'Discover', icon: <Users className="w-4 h-4" />, color: 'from-neon-cyan to-neon-blue' },
                                        { id: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4" />, color: 'from-orange-500 to-red-500' }
                                    ].map((tab) => (
                                        <motion.button
                                            key={tab.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all flex-1 justify-center ${activeTab === tab.id
                                                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </motion.button>
                                    ))}
                                </motion.div>

                                <AnimatePresence mode="wait">
                                    {/* FOR YOU TAB */}
                                    {activeTab === 'forYou' && (
                                        <motion.div
                                            key="forYou"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Create Post Card */}
                                            {user && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                                                >
                                                    <div className="flex gap-4">
                                                        <img
                                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`}
                                                            alt="Your avatar"
                                                            className="w-12 h-12 rounded-full border-2 border-neon-cyan"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="relative group">
                                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                                                <div className="relative bg-[#0d1117] rounded-2xl p-1">
                                                                    <textarea
                                                                        value={postText}
                                                                        onChange={(e) => setPostText(e.target.value)}
                                                                        placeholder="Share your learning journey..."
                                                                        className="w-full bg-transparent text-white rounded-xl p-4 min-h-[120px] focus:outline-none resize-none font-medium placeholder-gray-500 text-lg leading-relaxed"
                                                                    />

                                                                    <div className="flex items-center justify-between px-4 pb-3 pt-2 border-t border-white/5">
                                                                        <div className="flex gap-4 text-gray-500">
                                                                            {/* Placeholder icons for future features if needed, or keeping it clean */}
                                                                        </div>
                                                                        <motion.button
                                                                            onClick={handleCreatePost}
                                                                            whileHover={{ scale: 1.02 }}
                                                                            whileTap={{ scale: 0.98 }}
                                                                            disabled={!postText.trim()}
                                                                            className="px-8 py-2.5 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-xl font-bold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wide"
                                                                        >
                                                                            <Rocket className="w-4 h-4" />
                                                                            Post
                                                                        </motion.button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Posts Feed */}
                                            {loading && (
                                                <div className="text-center p-10 text-gray-300">
                                                    <Sparkles className="w-8 h-8 mx-auto animate-spin" />
                                                    <p className="mt-2">Loading latest posts...</p>
                                                </div>
                                            )}

                                            {!loading && posts.map((post, index) => {
                                                const isLiked = user && post.likedBy && post.likedBy.includes(user.userId);
                                                const likesCount = post.likedBy ? post.likedBy.length : 0;
                                                const isBookmarked = user && post.bookmarkedBy && post.bookmarkedBy.includes(user.userId);

                                                return (
                                                    <motion.div
                                                        key={post.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                                                    >
                                                        {/* Post Header */}
                                                        <div className="p-6 pb-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex gap-3">
                                                                    <div className="relative">
                                                                        <img
                                                                            src={post.userAvatar}
                                                                            alt={post.userName}
                                                                            onClick={() => navigate(`/user/${post.userId}`)} // ✅ ADD THIS
                                                                            className="w-12 h-12 rounded-full border-2 border-neon-purple cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all" // ✅ ADD cursor-pointer
                                                                        />
                                                                        {/* Post Type Badge */}
                                                                        {post.type !== 'text' && (
                                                                            <div className="absolute -top-1 -right-1">
                                                                                {post.type === 'code' && (
                                                                                    <div className="bg-neon-cyan text-white rounded-full p-1">
                                                                                        <Code className="w-3 h-3" />
                                                                                    </div>
                                                                                )}
                                                                                {post.type === 'event' && (
                                                                                    <div className="bg-neon-purple text-white rounded-full p-1">
                                                                                        <Calendar className="w-3 h-3" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <button
                                                                                onClick={() => navigate(`/user/${post.userId}`)}
                                                                                className="text-white font-bold hover:text-neon-cyan transition-colors cursor-pointer"
                                                                            >
                                                                                {post.userName}
                                                                            </button>
                                                                            {post.type === 'code' && post.language && (
                                                                                <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan text-xs rounded-full font-semibold">
                                                                                    {post.language}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                                            <span>@{post.userName.toLowerCase().replace(' ', '-')}</span>
                                                                            <span>•</span>
                                                                            <div className="flex items-center gap-1 text-gray-300">
                                                                                <Clock size={14} className="text-neon-cyan/70" />
                                                                                <span>{formatTimestamp(post.timestamp)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {user && user.userId === post.userId && (
                                                                    <button
                                                                        onClick={() => handleDeletePost(post.id)}
                                                                        className="text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-500/10 transition-all"
                                                                        title="Delete Post"
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                )}
                                                                {!(user && user.userId === post.userId) && (
                                                                    <button className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
                                                                        <MoreHorizontal size={20} />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Post Content */}
                                                            <div className="mt-4">
                                                                {renderPostContent(post)}

                                                                {/* Tags */}
                                                                {post.tags && post.tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                                        {post.tags.map((tag, idx) => (
                                                                            <span key={idx} className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full font-semibold">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Post Stats */}
                                                        <div className="px-6 py-3 border-t border-white/10 bg-white/2">
                                                            <div className="flex items-center gap-6 text-sm text-gray-300">
                                                                <span className="flex items-center gap-1">
                                                                    <Eye size={14} />
                                                                    {post.views || 0} views
                                                                </span>
                                                                <span>{post.comments || 0} comments</span>
                                                                <span>{post.shares || 0} shares</span>
                                                            </div>
                                                        </div>

                                                        {/* Post Actions */}
                                                        <div className="px-6 py-4 border-t border-white/10">
                                                            <div className="flex items-center justify-between">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleLike(post.id)}
                                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isLiked
                                                                        ? 'text-pink-500 bg-pink-500/10'
                                                                        : 'text-gray-300 hover:text-pink-500 hover:bg-pink-500/10'
                                                                        }`}
                                                                >
                                                                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                                                                    <span className="font-semibold">{likesCount}</span>
                                                                </motion.button>

                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                                                                >
                                                                    <MessageCircle size={20} />
                                                                    <span className="font-semibold">{post.comments || 0}</span>
                                                                </motion.button>

                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-neon-purple hover:bg-neon-purple/10 transition-all"
                                                                >
                                                                    <Share2 size={20} />
                                                                    <span className="font-semibold">{post.shares || 0}</span>
                                                                </motion.button>

                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleBookmark(post.id)}
                                                                    className={`p-3 rounded-xl transition-all ${isBookmarked
                                                                        ? 'text-neon-cyan bg-neon-cyan/10'
                                                                        : 'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10'
                                                                        }`}
                                                                >
                                                                    <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </motion.div>
                                    )}

                                    {/* DISCOVER TAB */}
                                    {activeTab === 'discover' && (
                                        <motion.div
                                            key="discover"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Search Section */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                                            >
                                                <div className="relative">
                                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-cyan" size={20} />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Search developers, skills, or interests..."
                                                        className="w-full bg-white/5 text-white rounded-2xl pl-12 pr-4 py-4 border border-white/10 focus:border-neon-cyan focus:outline-none backdrop-blur-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    {['JavaScript', 'React', 'Python', 'DSA', 'Web Dev', 'Machine Learning'].map((skill, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSearchQuery(skill)}
                                                            className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full hover:bg-neon-purple/30 transition-all"
                                                        >
                                                            {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* User Cards Grid */}
                                            {loadingDiscover ? (
                                                <div className="text-center p-10 text-gray-300">
                                                    <Sparkles className="w-8 h-8 mx-auto animate-spin" />
                                                    <p className="mt-2">Finding developers...</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {filteredUsers.map((discoverUser, index) => {
                                                        const isFollowing = followingList.includes(discoverUser.id);

                                                        return (
                                                            <motion.div
                                                                key={discoverUser.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                whileHover={{ y: -5 }}
                                                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                                                            >
                                                                <div className="flex items-start gap-4 mb-4">
                                                                    <div className="relative">
                                                                        <img
                                                                            src={discoverUser.avatarUrl || `https://ui-avatars.com/api/?name=${discoverUser.name}&background=10B981&color=fff`}
                                                                            alt={discoverUser.name}
                                                                            onClick={() => navigate(`/user/${discoverUser.id}`)}
                                                                            className="w-16 h-16 rounded-full border-2 border-neon-cyan cursor-pointer hover:ring-2 hover:ring-neon-cyan transition-all"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <button
                                                                            onClick={() => navigate(`/user/${discoverUser.id}`)}
                                                                            className="text-white font-bold text-lg truncate hover:text-neon-cyan transition-colors cursor-pointer"
                                                                        >
                                                                            {discoverUser.name}
                                                                        </button>
                                                                        <p className="text-gray-300 text-sm truncate">@{discoverUser.username || discoverUser.name.toLowerCase()}</p>
                                                                        <p className="text-neon-cyan text-xs mt-1">{discoverUser.title || discoverUser.bio}</p>
                                                                    </div>
                                                                </div>

                                                                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{discoverUser.bio}</p>

                                                                {/* Skills */}
                                                                {discoverUser.skills && (
                                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                                        {discoverUser.skills.map((skill, idx) => (
                                                                            <span key={idx} className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Stats */}
                                                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                                                    <div>
                                                                        <div className="text-white font-bold text-sm">{discoverUser.followersCount || 0}</div>
                                                                        <div className="text-gray-300 text-xs">Followers</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-white font-bold text-sm">{discoverUser.coursesCompleted || 0}</div>
                                                                        <div className="text-gray-300 text-xs">Courses</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-white font-bold text-sm flex items-center justify-center gap-1">
                                                                            <Flame size={12} className="text-orange-500" />
                                                                            {discoverUser.streak || 0}
                                                                        </div>
                                                                        <div className="text-gray-300 text-xs">Streak</div>
                                                                    </div>
                                                                </div>

                                                                {/* Follow Button */}
                                                                <motion.button
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => handleFollow(discoverUser.id, isFollowing)}
                                                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${isFollowing
                                                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                                                        : 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-cyan/20'
                                                                        }`}
                                                                >
                                                                    {isFollowing ? (
                                                                        <span className="flex items-center justify-center gap-2">
                                                                            <UserCheck size={16} />
                                                                            Following
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center justify-center gap-2">
                                                                            <UserPlus size={16} />
                                                                            Follow
                                                                        </span>
                                                                    )}
                                                                </motion.button>
                                                            </motion.div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* TRENDING TAB */}
                                    {activeTab === 'trending' && (
                                        <motion.div
                                            key="trending"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Trending Header */}
                                            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                                                        <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                                                        Trending Now
                                                    </h3>
                                                    <p className="text-gray-300 mt-1 text-sm">Top rated posts from the community this week</p>
                                                </div>
                                                <TrendingUp className="w-12 h-12 text-orange-500/50" />
                                            </div>

                                            {/* Sorted Posts */}
                                            {loading ? (
                                                <div className="text-center p-10 text-gray-300">
                                                    <Sparkles className="w-8 h-8 mx-auto animate-spin" />
                                                    <p className="mt-2">Calculating trends...</p>
                                                </div>
                                            ) : (
                                                [...posts]
                                                    .sort((a, b) => {
                                                        const likesA = a.likedBy ? a.likedBy.length : 0;
                                                        const likesB = b.likedBy ? b.likedBy.length : 0;
                                                        return likesB - likesA; // Descending order
                                                    })
                                                    .slice(0, 10) // Top 10
                                                    .map((post, index) => {
                                                        const isLiked = user && post.likedBy && post.likedBy.includes(user.userId);
                                                        const likesCount = post.likedBy ? post.likedBy.length : 0;
                                                        const isBookmarked = user && post.bookmarkedBy && post.bookmarkedBy.includes(user.userId);

                                                        return (
                                                            <motion.div
                                                                key={post.id}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all overflow-hidden relative"
                                                            >
                                                                {/* Rank Badge */}
                                                                <div className="absolute top-0 right-0 bg-orange-500 text-white font-bold px-3 py-1 rounded-bl-xl z-20 shadow-lg shadow-orange-500/20">
                                                                    #{index + 1}
                                                                </div>

                                                                {/* Post Header */}
                                                                <div className="p-6 pb-4">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex gap-3">
                                                                            <div className="relative">
                                                                                <img
                                                                                    src={post.userAvatar}
                                                                                    alt={post.userName}
                                                                                    onClick={() => navigate(`/user/${post.userId}`)}
                                                                                    className="w-12 h-12 rounded-full border-2 border-orange-500 cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <button
                                                                                        onClick={() => navigate(`/user/${post.userId}`)}
                                                                                        className="text-white font-bold hover:text-orange-400 transition-colors cursor-pointer"
                                                                                    >
                                                                                        {post.userName}
                                                                                    </button>
                                                                                    {post.type === 'code' && post.language && (
                                                                                        <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan text-xs rounded-full font-semibold">
                                                                                            {post.language}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                                                                    <span>@{post.userName.toLowerCase().replace(' ', '-')}</span>
                                                                                    <span>•</span>
                                                                                    <span>{formatTimestamp(post.timestamp)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Post Content */}
                                                                    <div className="mt-4">
                                                                        {renderPostContent(post)}
                                                                    </div>
                                                                </div>

                                                                {/* Post Actions (Simplified for Trending) */}
                                                                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => handleLike(post.id)}
                                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isLiked
                                                                            ? 'text-pink-500 bg-pink-500/10'
                                                                            : 'text-gray-300 hover:text-pink-500 hover:bg-pink-500/10'
                                                                            }`}
                                                                    >
                                                                        <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                                                                        <span className="font-semibold">{likesCount}</span>
                                                                    </motion.button>

                                                                    <div className="text-sm text-gray-400">
                                                                        🔥 Trending Score: <span className="text-orange-400 font-bold">{likesCount * 10 + (post.comments || 0) * 5}</span>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Calendar Modal - Moved to root level to avoid transform issues */}
            {showCalendar && (
                <CalendarModal
                    isOpen={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    onSelect={handleDateSelect}
                />
            )}
        </div>
    );
};

export default Feed;