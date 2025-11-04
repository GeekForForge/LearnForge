// src/pages/Messages.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import ChatSidebar from '../components/ChatSidebar'; // Adjust path if needed
import ChatWindow from '../components/ChatWindow';   // Adjust path if needed
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy
} from 'firebase/firestore';

const Messages = () => {
    const { user } = useAuth();
    const location = useLocation(); // Get location object

    const [chats, setChats] = useState([]);

    // Check location state for a pre-selected chat ID
    const [selectedChatId, setSelectedChatId] = useState(location.state?.selectedChatId || null);

    const [loading, setLoading] = useState(true);

    // Fetch all chat rooms for the current user
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const chatsCol = collection(db, 'chats');

        // Query for chats where the 'users' array contains our user's ID
        const q = query(
            chatsCol,
            where('users', 'array-contains', user.userId),
            orderBy('lastTimestamp', 'desc') // Show most recent chats first
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedChats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setChats(fetchedChats);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching chats: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="pt-16 min-h-screen">
            {/* Main container */}
            <div
                className="flex"
                style={{ height: 'calc(100vh - 4rem)' }} // Full height minus navbar
            >
                {/* Sidebar */}
                <div className="w-1/3 max-w-sm h-full">
                    <ChatSidebar
                        chats={chats}
                        selectedChatId={selectedChatId}
                        onSelectChat={setSelectedChatId}
                    />
                </div>

                {/* Chat Window */}
                <div className="flex-1 h-full">
                    <ChatWindow chatId={selectedChatId} />
                </div>
            </div>
        </div>
    );
};

export default Messages;