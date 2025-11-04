// src/components/ChatSidebar.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';

const ChatSidebar = ({ chats, selectedChatId, onSelectChat }) => {
    const { user } = useAuth();

    // Helper to get the *other* user's info from a chat
    const getOtherUserInfo = (chat) => {
        if (!user || !chat.users || chat.users.length < 2) {
            return { name: 'Unknown', avatar: '' };
        }

        const otherUserId = chat.users.find(uid => uid !== user.userId);
        const otherUserIndex = chat.users.indexOf(otherUserId);

        return {
            id: otherUserId,
            name: chat.userNames[otherUserIndex] || 'Unknown User',
            avatar: chat.userAvatars[otherUserIndex] || `https://ui-avatars.com/api/?name=Unknown`
        };
    };

    // Helper to format the timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="w-full h-full bg-white/5 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-white text-xl font-bold">Messages</h2>
                {/* You can add a search bar here later */}
            </div>

            {/* Chat List */}
            <div className="flex flex-col">
                {chats.length === 0 && (
                    <p className="text-gray-400 text-center p-4">No conversations yet.</p>
                )}
                {chats.map(chat => {
                    const otherUser = getOtherUserInfo(chat);
                    const isSelected = chat.id === selectedChatId;

                    return (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat.id)}
                            className={`flex items-center p-4 gap-3 cursor-pointer transition-all ${
                                isSelected
                                    ? 'bg-neon-purple/20'
                                    : 'hover:bg-white/10'
                            }`}
                        >
                            <img
                                src={otherUser.avatar}
                                alt={otherUser.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-white font-semibold truncate">{otherUser.name}</h3>
                                    <span className="text-gray-400 text-xs flex-shrink-0 ml-2">
                                        {formatTimestamp(chat.lastTimestamp)}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm truncate">
                                    {chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatSidebar;