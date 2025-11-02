// src/pages/Home.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Share2, Bookmark, Send, Smile,
    Award, TrendingUp, Users, Flame, BookOpen, Code,
    MoreHorizontal, MapPin, Calendar, Image, Video, Link as LinkIcon,
    Rocket, Sparkles, Zap, Eye, EyeOff, GitBranch
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [postText, setPostText] = useState('');
    const [activeTab, setActiveTab] = useState('for-you');
    const [expandedPost, setExpandedPost] = useState(null);

    const [posts, setPosts] = useState([
        {
            id: 1,
            user: {
                name: 'Samarth Patil',
                username: '@samarth-sachin',
                avatar: 'https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff',
                level: 15,
                badge: '🔥',
                online: true
            },
            content: 'Just completed the Advanced React course! The custom hooks section completely changed how I think about state management. 🚀',
            type: 'achievement',
            course: 'React Masterclass',
            timestamp: '2 hours ago',
            likes: 45,
            comments: 8,
            shares: 3,
            views: 245,
            isLiked: false,
            isBookmarked: false,
            tags: ['#React', '#WebDev', '#Learning'],
            media: null
        },
        {
            id: 2,
            user: {
                name: 'Priya Sharma',
                username: '@priya-dev',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=06B6D4&color=fff',
                level: 12,
                badge: '⭐',
                online: true
            },
            content: 'Looking for study partners for DSA! Planning to solve 3 problems daily and discuss solutions. Anyone interested in joining? 💪',
            type: 'collaboration',
            timestamp: '5 hours ago',
            likes: 23,
            comments: 15,
            shares: 5,
            views: 189,
            isLiked: true,
            isBookmarked: false,
            tags: ['#DSA', '#StudyGroup', '#Programming'],
            media: null
        },
        {
            id: 3,
            user: {
                name: 'Rahul Kumar',
                username: '@rahul-code',
                avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=EC4899&color=fff',
                level: 18,
                badge: '💎',
                online: false
            },
            content: 'Just built a full-stack e-commerce app using the MERN stack! Learned so much about authentication, payment integration, and deployment.',
            type: 'project',
            project: 'E-Commerce Platform',
            timestamp: '1 day ago',
            likes: 89,
            comments: 12,
            shares: 18,
            views: 542,
            isLiked: false,
            isBookmarked: true,
            tags: ['#MERN', '#FullStack', '#Project'],
            media: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop'
        }
    ]);

    const trendingTopics = [
        { tag: '#JavaScript', posts: '2.4K', trend: 'up' },
        { tag: '#React', posts: '1.8K', trend: 'up' },
        { tag: '#Python', posts: '1.5K', trend: 'same' },
        { tag: '#DSA', posts: '1.2K', trend: 'up' },
        { tag: '#WebDev', posts: '980', trend: 'down' }
    ];

    const suggestedUsers = [
        {
            name: 'Ananya Singh',
            username: '@ananya-learns',
            avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=10B981&color=fff',
            level: 10,
            mutuals: 12,
            online: true
        },
        {
            name: 'Vikram Patel',
            username: '@vikram-dev',
            avatar: 'https://ui-avatars.com/api/?name=Vikram+Patel&background=F59E0B&color=fff',
            level: 14,
            mutuals: 8,
            online: false
        },
        {
            name: 'Neha Gupta',
            username: '@neha-codes',
            avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=8B5CF6&color=fff',
            level: 16,
            mutuals: 15,
            online: true
        }
    ];

    const handleCreatePost = () => {
        if (postText.trim()) {
            const newPost = {
                id: posts.length + 1,
                user: {
                    name: 'You',
                    username: '@you',
                    avatar: 'https://ui-avatars.com/api/?name=You&background=8B5CF6&color=fff',
                    level: 15,
                    badge: '🔥',
                    online: true
                },
                content: postText,
                type: 'text',
                timestamp: 'Just now',
                likes: 0,
                comments: 0,
                shares: 0,
                views: 0,
                isLiked: false,
                isBookmarked: false,
                tags: [],
                media: null
            };
            setPosts([newPost, ...posts]);
            setPostText('');
        }
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const handleBookmark = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isBookmarked: !post.isBookmarked }
                : post
        ));
    };

    const getPostTypeIcon = (type) => {
        switch (type) {
            case 'achievement': return <Award className="w-4 h-4 text-green-400" />;
            case 'project': return <Code className="w-4 h-4 text-blue-400" />;
            case 'collaboration': return <Users className="w-4 h-4 text-purple-400" />;
            default: return <Sparkles className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR - Enhanced */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Enhanced Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <img
                                        src="https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff&size=128"
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full border-4 border-neon-purple"
                                    />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-800"></div>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1">Samarth Patil</h3>
                                <p className="text-gray-400 text-sm mb-4">Full Stack Developer</p>

                                {/* Level Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Level 15</span>
                                        <span className="text-neon-cyan font-semibold">2500/3000 XP</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full" style={{ width: '83%' }}></div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-white font-bold text-lg">245</div>
                                        <div className="text-gray-400 text-xs">Followers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white font-bold text-lg">180</div>
                                        <div className="text-gray-400 text-xs">Following</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white font-bold text-lg">45</div>
                                        <div className="text-gray-400 text-xs">Posts</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
                                        Edit Profile
                                    </button>
                                    <button className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-3"
                        >
                            {[
                                { icon: <BookOpen className="w-5 h-5" />, label: 'My Courses', count: 12, color: 'text-blue-400' },
                                { icon: <Code className="w-5 h-5" />, label: 'Projects', count: 8, color: 'text-green-400' },
                                { icon: <Award className="w-5 h-5" />, label: 'Achievements', count: 15, color: 'text-yellow-400' },
                                { icon: <Users className="w-5 h-5" />, label: 'Study Groups', count: 3, color: 'text-purple-400' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                >
                                    <div className={`p-2 rounded-xl bg-white/10 ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-semibold text-sm">{item.label}</div>
                                        <div className="text-gray-400 text-xs">{item.count} items</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* MAIN FEED - Enhanced */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Enhanced Create Post */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="flex gap-4">
                                <img
                                    src="https://ui-avatars.com/api/?name=You&background=8B5CF6&color=fff"
                                    alt="Your avatar"
                                    className="w-12 h-12 rounded-full border-2 border-neon-cyan"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={postText}
                                        onChange={(e) => setPostText(e.target.value)}
                                        placeholder="Share your learning journey..."
                                        className="w-full bg-white/5 text-white rounded-2xl p-4 border border-white/10 focus:border-neon-purple focus:outline-none resize-none backdrop-blur-sm"
                                        rows="3"
                                    />
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex gap-2">
                                            {[
                                                { icon: <Image className="w-5 h-5" />, label: 'Photo' },
                                                { icon: <Video className="w-5 h-5" />, label: 'Video' },
                                                { icon: <Code className="w-5 h-5" />, label: 'Code' },
                                                { icon: <Link className="w-5 h-5" />, label: 'Link' }
                                            ].map((item, index) => (
                                                <button key={index} className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                    {item.icon}
                                                    <span className="text-xs">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <motion.button
                                            onClick={handleCreatePost}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all flex items-center gap-2"
                                        >
                                            <Rocket className="w-4 h-4" />
                                            Post
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Enhanced Feed Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-1 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10"
                        >
                            {[
                                { id: 'for-you', label: 'For You', icon: <Sparkles className="w-4 h-4" /> },
                                { id: 'following', label: 'Following', icon: <Users className="w-4 h-4" /> },
                                { id: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4" /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all flex-1 justify-center ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </motion.div>

                        {/* Enhanced Posts */}
                        <div className="space-y-6">
                            <AnimatePresence>
                                {posts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        layout
                                        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                                    >
                                        {/* Post Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src={post.user.avatar}
                                                            alt={post.user.name}
                                                            className="w-12 h-12 rounded-full border-2 border-neon-purple"
                                                        />
                                                        {post.user.online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-white font-bold">{post.user.name}</h4>
                                                            <span className="text-lg">{post.user.badge}</span>
                                                            <span className="text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-full">
                                                                Lv {post.user.level}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                            <span>{post.user.username}</span>
                                                            <span>•</span>
                                                            <span>{post.timestamp}</span>
                                                            {post.type !== 'text' && (
                                                                <>
                                                                    <span>•</span>
                                                                    <div className="flex items-center gap-1">
                                                                        {getPostTypeIcon(post.type)}
                                                                        <span className="capitalize">{post.type}</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>

                                            {/* Post Content */}
                                            <div className="mt-4">
                                                <p className="text-white text-base leading-relaxed mb-3">
                                                    {post.content}
                                                </p>

                                                {/* Course/Project Info */}
                                                {(post.course || post.project) && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-sm text-neon-cyan mb-3">
                                                        <BookOpen size={14} />
                                                        {post.course || post.project}
                                                    </div>
                                                )}

                                                {/* Tags */}
                                                {post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tags.map((tag, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full font-semibold">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Media */}
                                                {post.media && (
                                                    <div className="rounded-2xl overflow-hidden mb-4">
                                                        <img
                                                            src={post.media}
                                                            alt="Post media"
                                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Post Stats */}
                                        <div className="px-6 py-3 border-t border-white/10 bg-white/2">
                                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                                <span>{post.views} views</span>
                                                <span>{post.comments} comments</span>
                                                <span>{post.shares} shares</span>
                                            </div>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="px-6 py-4 border-t border-white/10">
                                            <div className="flex items-center justify-between">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                                        post.isLiked
                                                            ? 'text-pink-500 bg-pink-500/10'
                                                            : 'text-gray-400 hover:text-pink-500 hover:bg-pink-500/10'
                                                    }`}
                                                >
                                                    <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                                                    <span className="font-semibold">{post.likes}</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                                                >
                                                    <MessageCircle size={20} />
                                                    <span className="font-semibold">{post.comments}</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-neon-purple hover:bg-neon-purple/10 transition-all"
                                                >
                                                    <Share2 size={20} />
                                                    <span className="font-semibold">{post.shares}</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleBookmark(post.id)}
                                                    className={`p-3 rounded-xl transition-all ${
                                                        post.isBookmarked
                                                            ? 'text-neon-cyan bg-neon-cyan/10'
                                                            : 'text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10'
                                                    }`}
                                                >
                                                    <Bookmark size={20} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - Enhanced */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Enhanced Trending Topics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                <Flame className="w-5 h-5 text-orange-500" />
                                Trending Topics
                            </h3>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                topic.trend === 'up' ? 'bg-green-500' :
                                                    topic.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`} />
                                            <span className="text-neon-cyan font-semibold group-hover:text-neon-purple transition-colors">
                                                {topic.tag}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <span>{topic.posts}</span>
                                            <TrendingUp size={14} className={
                                                topic.trend === 'up' ? 'text-green-500' :
                                                    topic.trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                                            } />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Enhanced Suggested Users */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                <Users className="w-5 h-5 text-neon-purple" />
                                Suggested Developers
                            </h3>
                            <div className="space-y-4">
                                {suggestedUsers.map((user, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                                    >
                                        <div className="relative">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full border-2 border-neon-cyan"
                                            />
                                            {user.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                                            <p className="text-gray-400 text-xs">Lv {user.level} • {user.mutuals} mutuals</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-lg text-xs font-semibold hover:bg-neon-purple/30 transition-all"
                                        >
                                            Follow
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Learning Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Weekly Progress
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Courses Completed', value: 3, total: 5 },
                                    { label: 'Hours Learned', value: 12, total: 20 },
                                    { label: 'Projects Built', value: 2, total: 3 }
                                ].map((stat, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">{stat.label}</span>
                                            <span className="text-neon-cyan font-semibold">{stat.value}/{stat.total}</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${(stat.value / stat.total) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;