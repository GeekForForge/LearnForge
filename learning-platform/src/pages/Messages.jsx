// src/pages/Messages.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Send, Smile, Paperclip, MoreVertical,
    Check, CheckCheck
} from 'lucide-react';

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock chat data
    const chats = [
        {
            id: 1,
            user: {
                name: 'Samarth Patil',
                username: '@samarth-sachin',
                avatar: 'https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff',
                online: true
            },
            lastMessage: {
                text: 'Hey! Can you help me with React hooks?',
                time: '2m ago',
                unread: 2,
                sent: false
            },
            messages: [
                { id: 1, text: 'Hey! How are you?', sent: false, time: '10:30 AM', read: true },
                { id: 2, text: 'I am good! How about you?', sent: true, time: '10:32 AM', read: true },
                { id: 3, text: 'Can you help me with React hooks?', sent: false, time: '10:35 AM', read: false },
            ]
        },
        {
            id: 2,
            user: {
                name: 'Priya Sharma',
                username: '@priya-dev',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=06B6D4&color=fff',
                online: true
            },
            lastMessage: {
                text: 'Thanks for the DSA notes!',
                time: '1h ago',
                unread: 0,
                sent: true
            },
            messages: [
                { id: 1, text: 'Do you have notes for DSA?', sent: false, time: '9:00 AM', read: true },
                { id: 2, text: 'Yes! Let me send you', sent: true, time: '9:05 AM', read: true },
                { id: 3, text: 'Thanks for the DSA notes!', sent: false, time: '9:30 AM', read: true },
            ]
        },
        {
            id: 3,
            user: {
                name: 'Rahul Kumar',
                username: '@rahul-code',
                avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=EC4899&color=fff',
                online: false
            },
            lastMessage: {
                text: 'Let\'s start a study group',
                time: '3h ago',
                unread: 1,
                sent: false
            },
            messages: [
                { id: 1, text: 'Hey! Want to learn together?', sent: false, time: '8:00 AM', read: true },
                { id: 2, text: 'Sure! That would be great', sent: true, time: '8:15 AM', read: true },
                { id: 3, text: 'Let\'s start a study group', sent: false, time: '8:30 AM', read: false },
            ]
        },
        {
            id: 4,
            user: {
                name: 'Ananya Singh',
                username: '@ananya-learns',
                avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=10B981&color=fff',
                online: true
            },
            lastMessage: {
                text: 'Check out this course!',
                time: '5h ago',
                unread: 0,
                sent: false
            },
            messages: [
                { id: 1, text: 'Hey! Check out this course!', sent: false, time: '7:00 AM', read: true },
                { id: 2, text: 'Thanks! Will check it out', sent: true, time: '7:10 AM', read: true },
            ]
        }
    ];

    const [allChats, setAllChats] = useState(chats);
    const [currentMessages, setCurrentMessages] = useState([]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setCurrentMessages(chat.messages);
    };

    const handleSendMessage = () => {
        if (messageText.trim() && selectedChat) {
            const newMessage = {
                id: currentMessages.length + 1,
                text: messageText,
                sent: true,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                read: false
            };
            setCurrentMessages([...currentMessages, newMessage]);
            setMessageText('');
        }
    };

    const filteredChats = allChats.filter(chat =>
        chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'transparent',
            paddingTop: '80px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                height: 'calc(100vh - 80px)',
                display: 'flex',
                gap: '0'
            }}>

                {/* Conversations Sidebar */}
                <div style={{
                    width: '350px',
                    backgroundColor: 'rgba(19, 19, 24, 0.5)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: 'blur(10px)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <h2 style={{
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '16px'
                        }}>
                            Messages
                        </h2>

                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <Search
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#9CA3AF'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    backgroundColor: 'rgba(26, 26, 36, 0.5)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Chat List */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto'
                    }}>
                        {filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleChatSelect(chat)}
                                style={{
                                    padding: '16px 20px',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                    cursor: 'pointer',
                                    backgroundColor: selectedChat?.id === chat.id
                                        ? 'rgba(139, 92, 246, 0.1)'
                                        : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedChat?.id !== chat.id) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedChat?.id !== chat.id) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {/* Avatar */}
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={chat.user.avatar}
                                            alt={chat.user.name}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%'
                                            }}
                                        />
                                        {chat.user.online && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '0',
                                                right: '0',
                                                width: '12px',
                                                height: '12px',
                                                backgroundColor: '#10B981',
                                                borderRadius: '50%',
                                                border: '2px solid #131318'
                                            }}></div>
                                        )}
                                    </div>

                                    {/* Chat Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '4px'
                                        }}>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {chat.user.name}
                                            </h3>
                                            <span style={{
                                                color: '#9CA3AF',
                                                fontSize: '12px'
                                            }}>
                                                {chat.lastMessage.time}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <p style={{
                                                color: chat.lastMessage.unread > 0 ? 'white' : '#9CA3AF',
                                                fontSize: '14px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                fontWeight: chat.lastMessage.unread > 0 ? '500' : '400'
                                            }}>
                                                {chat.lastMessage.sent ? 'You: ' : ''}{chat.lastMessage.text}
                                            </p>
                                            {chat.lastMessage.unread > 0 && (
                                                <span style={{
                                                    backgroundColor: '#8B5CF6',
                                                    color: 'white',
                                                    fontSize: '11px',
                                                    padding: '2px 6px',
                                                    borderRadius: '10px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {chat.lastMessage.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(13, 13, 18, 0.5)',
                    backdropFilter: 'blur(10px)'
                }}>
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                padding: '16px 24px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: 'rgba(19, 19, 24, 0.5)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={selectedChat.user.avatar}
                                            alt={selectedChat.user.name}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%'
                                            }}
                                        />
                                        {selectedChat.user.online && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '0',
                                                right: '0',
                                                width: '10px',
                                                height: '10px',
                                                backgroundColor: '#10B981',
                                                borderRadius: '50%',
                                                border: '2px solid #131318'
                                            }}></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            color: 'white',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}>
                                            {selectedChat.user.name}
                                        </h3>
                                        <p style={{
                                            color: selectedChat.user.online ? '#10B981' : '#9CA3AF',
                                            fontSize: '12px'
                                        }}>
                                            {selectedChat.user.online ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '8px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#9CA3AF'
                                    }}>
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                {currentMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: message.sent ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            maxWidth: '60%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: message.sent ? 'flex-end' : 'flex-start'
                                        }}>
                                            <div style={{
                                                padding: '12px 16px',
                                                borderRadius: message.sent
                                                    ? '16px 16px 4px 16px'
                                                    : '16px 16px 16px 4px',
                                                background: message.sent
                                                    ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
                                                    : 'rgba(26, 26, 36, 0.8)',
                                                color: 'white',
                                                fontSize: '14px',
                                                lineHeight: '1.5'
                                            }}>
                                                {message.text}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '4px'
                                            }}>
                                                <span style={{
                                                    color: '#6B7280',
                                                    fontSize: '11px'
                                                }}>
                                                    {message.time}
                                                </span>
                                                {message.sent && (
                                                    message.read ? (
                                                        <CheckCheck size={14} color="#06B6D4" />
                                                    ) : (
                                                        <Check size={14} color="#6B7280" />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div style={{
                                padding: '16px 24px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                backgroundColor: 'rgba(19, 19, 24, 0.5)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center'
                                }}>
                                    <button style={{
                                        padding: '10px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9CA3AF'
                                    }}>
                                        <Paperclip size={20} />
                                    </button>

                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            backgroundColor: 'rgba(26, 26, 36, 0.8)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '24px',
                                            color: 'white',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />

                                    <button style={{
                                        padding: '10px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9CA3AF'
                                    }}>
                                        <Smile size={20} />
                                    </button>

                                    <button
                                        onClick={handleSendMessage}
                                        style={{
                                            padding: '10px 20px',
                                            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                            border: 'none',
                                            borderRadius: '24px',
                                            cursor: 'pointer',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <Send size={18} />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // No Chat Selected
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Search size={36} color="white" />
                            </div>
                            <h3 style={{
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}>
                                Select a conversation
                            </h3>
                            <p style={{
                                color: '#9CA3AF',
                                fontSize: '14px',
                                textAlign: 'center',
                                maxWidth: '400px'
                            }}>
                                Choose from your existing conversations or start a new one to begin messaging
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;