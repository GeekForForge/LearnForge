// src/components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, Sparkles, ArrowLeft, Image, Smile, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Replace your ChatWindow component with this fixed version:

// Replace your ChatWindow component with this simplified version:

const ChatWindow = ({ chatId, otherUser, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch messages for the selected chat
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

            {/* Messages Area - NO AUTO SCROLLING */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
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
                                        className={`px-4 py-3 rounded-2xl ${
                                            isSender
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
export default ChatWindow;