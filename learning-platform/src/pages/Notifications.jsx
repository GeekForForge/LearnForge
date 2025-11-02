// src/pages/Notifications.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    UserPlus, MessageCircle, Award, BookOpen, Heart,
    TrendingUp, Users, Bell, Check, Trash2, Filter,
    CheckCheck, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'friend_request',
            user: {
                name: 'Priya Sharma',
                username: '@priya-dev',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=06B6D4&color=fff'
            },
            message: 'sent you a friend request',
            time: '2 minutes ago',
            unread: true,
            actionable: true
        },
        {
            id: 2,
            type: 'message',
            user: {
                name: 'Rahul Kumar',
                username: '@rahul-code',
                avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=EC4899&color=fff'
            },
            message: 'replied to your discussion: "Great explanation about React hooks!"',
            time: '1 hour ago',
            unread: true,
            actionable: false
        },
        {
            id: 3,
            type: 'achievement',
            message: 'You earned the "7 Day Streak" badge! Keep up the momentum! 🔥',
            time: '3 hours ago',
            unread: true,
            actionable: false
        },
        {
            id: 4,
            type: 'course_update',
            message: 'New lesson added to "React Complete Course": Advanced Hooks Patterns',
            time: '5 hours ago',
            unread: false,
            actionable: false,
            course: {
                name: 'React Complete Course',
                id: 123
            }
        },
        {
            id: 5,
            type: 'like',
            user: {
                name: 'Ananya Singh',
                username: '@ananya-learns',
                avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=10B981&color=fff'
            },
            message: 'liked your post: "My journey learning JavaScript"',
            time: '1 day ago',
            unread: false,
            actionable: false
        },
        {
            id: 6,
            type: 'follow',
            user: {
                name: 'Vikram Patel',
                username: '@vikram-dev',
                avatar: 'https://ui-avatars.com/api/?name=Vikram+Patel&background=F59E0B&color=fff'
            },
            message: 'started following you',
            time: '1 day ago',
            unread: false,
            actionable: false
        },
        {
            id: 7,
            type: 'achievement',
            message: 'Congratulations! You completed 5 courses this month! 🎉',
            time: '2 days ago',
            unread: false,
            actionable: false
        },
        {
            id: 8,
            type: 'course_update',
            message: 'Certificate ready for download: "JavaScript Complete Course"',
            time: '3 days ago',
            unread: false,
            actionable: false,
            course: {
                name: 'JavaScript Complete Course',
                id: 456
            }
        },
        {
            id: 9,
            type: 'message',
            user: {
                name: 'Neha Gupta',
                username: '@neha-codes',
                avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=8B5CF6&color=fff'
            },
            message: 'mentioned you in a comment',
            time: '4 days ago',
            unread: false,
            actionable: false
        }
    ]);

    const getIcon = (type) => {
        const iconStyle = { size: 20 };
        switch (type) {
            case 'friend_request':
                return <UserPlus {...iconStyle} className="text-neon-cyan" />;
            case 'message':
                return <MessageCircle {...iconStyle} className="text-neon-purple" />;
            case 'achievement':
                return <Award {...iconStyle} className="text-yellow-500" />;
            case 'course_update':
                return <BookOpen {...iconStyle} className="text-blue-500" />;
            case 'like':
                return <Heart {...iconStyle} className="text-pink-500" />;
            case 'follow':
                return <Users {...iconStyle} className="text-green-500" />;
            default:
                return <Bell {...iconStyle} className="text-gray-400" />;
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, unread: false } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return notif.unread;
        return notif.type === filter;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0f',
            paddingTop: '100px',
            paddingBottom: '64px'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(to right, #8B5CF6, #06B6D4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Notifications
                        </h1>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '8px',
                                    color: '#8B5CF6',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                <CheckCheck size={16} />
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
                        You have <span style={{ color: '#8B5CF6', fontWeight: '600' }}>{unreadCount}</span> unread notifications
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    flexWrap: 'wrap'
                }}>
                    {[
                        { key: 'all', label: 'All', icon: Bell },
                        { key: 'unread', label: 'Unread', icon: Filter },
                        { key: 'friend_request', label: 'Friend Requests', icon: UserPlus },
                        { key: 'message', label: 'Messages', icon: MessageCircle },
                        { key: 'achievement', label: 'Achievements', icon: Award },
                        { key: 'course_update', label: 'Courses', icon: BookOpen },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setFilter(item.key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    backgroundColor: filter === item.key
                                        ? 'rgba(139, 92, 246, 0.2)'
                                        : 'rgba(19, 19, 24, 0.5)',
                                    color: filter === item.key ? '#8B5CF6' : '#9CA3AF',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={16} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Notifications List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredNotifications.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '64px 24px',
                            backgroundColor: 'rgba(19, 19, 24, 0.5)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <Bell size={48} style={{
                                color: '#6B7280',
                                marginBottom: '16px',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }} />
                            <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '8px' }}>
                                No notifications
                            </h3>
                            <p style={{ color: '#9CA3AF' }}>
                                You're all caught up! Check back later.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '16px',
                                    backgroundColor: notif.unread
                                        ? 'rgba(139, 92, 246, 0.05)'
                                        : 'rgba(19, 19, 24, 0.5)',
                                    border: `1px solid ${notif.unread ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    borderRadius: '12px',
                                    position: 'relative',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(26, 26, 36, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {notif.user ? (
                                        <img
                                            src={notif.user.avatar}
                                            alt={notif.user.name}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    ) : (
                                        getIcon(notif.type)
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ marginBottom: '8px' }}>
                                        {notif.user && (
                                            <span style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                marginRight: '4px'
                                            }}>
                                                {notif.user.name}
                                            </span>
                                        )}
                                        <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                                            {notif.message}
                                        </span>
                                    </div>
                                    <p style={{
                                        color: '#6B7280',
                                        fontSize: '13px',
                                        marginBottom: '12px'
                                    }}>
                                        {notif.time}
                                    </p>

                                    {/* Action Buttons */}
                                    {notif.actionable && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button style={{
                                                padding: '6px 16px',
                                                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: 'white',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}>
                                                Accept
                                            </button>
                                            <button style={{
                                                padding: '6px 16px',
                                                backgroundColor: 'rgba(26, 26, 36, 1)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '6px',
                                                color: '#9CA3AF',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}>
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    alignItems: 'flex-end'
                                }}>
                                    {notif.unread && (
                                        <button
                                            onClick={() => markAsRead(notif.id)}
                                            style={{
                                                padding: '6px',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#8B5CF6'
                                            }}
                                            title="Mark as read"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notif.id)}
                                        style={{
                                            padding: '6px',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#9CA3AF'
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Unread indicator */}
                                {notif.unread && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: '#8B5CF6',
                                        borderRadius: '50%'
                                    }}></div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Load More */}
                {filteredNotifications.length > 0 && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '32px'
                    }}>
                        <button style={{
                            padding: '12px 32px',
                            backgroundColor: 'rgba(19, 19, 24, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}>
                            Load More Notifications
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
