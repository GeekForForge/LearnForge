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
import { Send, Sparkles } from 'lucide-react';

const ChatWindow = ({ chatId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // To auto-scroll to bottom

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch messages for the selected chat
    useEffect(() => {
        if (!chatId) {
            setMessages([]);
            return;
        }

        const messagesCol = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesCol, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !chatId) return;

        const messagesCol = collection(db, 'chats', chatId, 'messages');

        try {
            // 1. Add the new message to the subcollection
            await addDoc(messagesCol, {
                text: newMessage,
                senderId: user.userId,
                timestamp: serverTimestamp()
            });

            // 2. Update the parent chat document's 'lastMessage'
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

    if (!chatId) {
        return (
            <div className="flex-1 flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Select a conversation</h2>
                    <p>Choose a chat from the sidebar to start messaging.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-dark-800">
            {/* Message Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map(msg => {
                    const isSender = msg.senderId === user.userId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-md ${
                                    isSender
                                        ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                        : 'bg-white/10 text-white'
                                }`}
                            >
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    );
                })}
                {/* Empty div to auto-scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 text-white rounded-xl px-4 py-3 border border-transparent focus:border-neon-cyan focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-xl hover:opacity-90 transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;