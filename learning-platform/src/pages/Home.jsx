// src/pages/Home.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Heart, MessageCircle, Share2, Bookmark, Send, Smile,
    Award, TrendingUp, Users, Flame, BookOpen, Code,
    MoreHorizontal, MapPin, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: {
                name: 'Samarth Patil',
                username: '@samarth-sachin',
                avatar: 'https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff',
                level: 15,
                badge: '🔥'
            },
            content: 'Just completed React Complete Course! The hooks section was mind-blowing 🚀 Thanks to the amazing instructor! #React #WebDev',
            type: 'achievement',
            timestamp: '2 hours ago',
            likes: 45,
            comments: 8,
            shares: 3,
            isLiked: false,
            isBookmarked: false
        },
        {
            id: 2,
            user: {
                name: 'Priya Sharma',
                username: '@priya-dev',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=06B6D4&color=fff',
                level: 12,
                badge: '⭐'
            },
            content: 'Anyone learning DSA? Let\'s form a study group! Looking for serious learners who can solve problems daily 💪',
            type: 'text',
            timestamp: '5 hours ago',
            likes: 23,
            comments: 15,
            shares: 5,
            isLiked: true,
            isBookmarked: false
        },
        {
            id: 3,
            user: {
                name: 'Rahul Kumar',
                username: '@rahul-code',
                avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=EC4899&color=fff',
                level: 18,
                badge: '💎'
            },
            content: 'Pro tip for beginners: Always code along with tutorials, don\'t just watch! Your fingers need to remember the syntax. #CodingTips',
            type: 'text',
            timestamp: '1 day ago',
            likes: 89,
            comments: 12,
            shares: 18,
            isLiked: false,
            isBookmarked: true
        }
    ]);

    const handleCreatePost = () => {
        if (postText.trim()) {
            const newPost = {
                id: posts.length + 1,
                user: {
                    name: 'You',
                    username: '@you',
                    avatar: 'https://ui-avatars.com/api/?name=You&background=8B5CF6&color=fff',
                    level: 15,
                    badge: '🔥'
                },
                content: postText,
                type: 'text',
                timestamp: 'Just now',
                likes: 0,
                comments: 0,
                shares: 0,
                isLiked: false,
                isBookmarked: false
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

    return (
        <div className="min-h-screen bg-dark-900 pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-800 rounded-2xl p-6 border border-white/10"
                        >
                            <div className="text-center">
                                <img
                                    src="https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff&size=128"
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-neon-purple"
                                />
                                <h3 className="text-white font-bold text-lg mb-1">Samarth Patil</h3>
                                <p className="text-gray-400 text-sm mb-4">@samarth-sachin</p>

                                <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                                    <div className="text-center">
                                        <p className="text-white font-bold">245</p>
                                        <p className="text-gray-400 text-xs">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold">180</p>
                                        <p className="text-gray-400 text-xs">Following</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-left">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Level</span>
                                        <span className="text-neon-purple font-bold">15</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">XP</span>
                                        <span className="text-neon-cyan font-bold">2500</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Streak</span>
                                        <span className="text-orange-500 font-bold flex items-center gap-1">
                                            <Flame size={14} />
                                            7 days
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-dark-800 rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <TrendingUp size={18} className="text-neon-cyan" />
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <BookOpen size={14} />
                                        Courses
                                    </span>
                                    <span className="text-white font-semibold">12</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Award size={14} />
                                        Completed
                                    </span>
                                    <span className="text-white font-semibold">5</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <Code size={14} />
                                        Projects
                                    </span>
                                    <span className="text-white font-semibold">8</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* MAIN FEED */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Create Post */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-800 rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex gap-4">
                                <img
                                    src="https://ui-avatars.com/api/?name=You&background=8B5CF6&color=fff"
                                    alt="Your avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={postText}
                                        onChange={(e) => setPostText(e.target.value)}
                                        placeholder="What's on your mind?"
                                        className="w-full bg-dark-700 text-white rounded-xl p-4 border border-white/10 focus:border-neon-purple focus:outline-none resize-none"
                                        rows="3"
                                    />
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                                                <Smile size={20} className="text-gray-400" />
                                            </button>
                                            <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
                                                <Code size={20} className="text-gray-400" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleCreatePost}
                                            className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feed Filter */}
                        <div className="flex gap-4 border-b border-white/10">
                            <button className="pb-4 px-2 text-white border-b-2 border-neon-purple font-semibold">
                                For You
                            </button>
                            <button className="pb-4 px-2 text-gray-400 hover:text-white transition-colors">
                                Following
                            </button>
                            <button className="pb-4 px-2 text-gray-400 hover:text-white transition-colors">
                                Trending
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="space-y-6">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-dark-800 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-3">
                                            <img
                                                src={post.user.avatar}
                                                alt={post.user.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-white font-semibold">{post.user.name}</h4>
                                                    <span className="text-lg">{post.user.badge}</span>
                                                    <span className="text-xs text-gray-500">• Lv {post.user.level}</span>
                                                </div>
                                                <p className="text-gray-400 text-sm">{post.user.username} • {post.timestamp}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-white">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <p className="text-white text-base leading-relaxed mb-4">
                                        {post.content}
                                    </p>

                                    {/* Post Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                                post.isLiked
                                                    ? 'text-pink-500 bg-pink-500/10'
                                                    : 'text-gray-400 hover:text-pink-500 hover:bg-pink-500/10'
                                            }`}
                                        >
                                            <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                                            <span className="text-sm font-semibold">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all">
                                            <MessageCircle size={18} />
                                            <span className="text-sm font-semibold">{post.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-neon-purple hover:bg-neon-purple/10 transition-all">
                                            <Share2 size={18} />
                                            <span className="text-sm font-semibold">{post.shares}</span>
                                        </button>
                                        <button
                                            onClick={() => handleBookmark(post.id)}
                                            className={`p-2 rounded-lg transition-all ${
                                                post.isBookmarked
                                                    ? 'text-neon-cyan bg-neon-cyan/10'
                                                    : 'text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10'
                                            }`}
                                        >
                                            <Bookmark size={18} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Trending Topics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-dark-800 rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Flame size={18} className="text-orange-500" />
                                Trending Topics
                            </h3>
                            <div className="space-y-3">
                                {['#JavaScript', '#React', '#Python', '#DSA', '#WebDev'].map((tag, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm hover:bg-dark-700 p-2 rounded-lg cursor-pointer transition-colors">
                                        <span className="text-neon-cyan font-semibold">{tag}</span>
                                        <span className="text-gray-500">{Math.floor(Math.random() * 500 + 100)} posts</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Suggested Users */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-dark-800 rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Users size={18} className="text-neon-purple" />
                                Suggested For You
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Ananya Singh', username: '@ananya-learns', level: 10 },
                                    { name: 'Vikram Patel', username: '@vikram-dev', level: 14 }
                                ].map((user, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=${index === 0 ? '10B981' : 'F59E0B'}&color=fff`}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                            <p className="text-gray-400 text-xs">Lv {user.level}</p>
                                        </div>
                                        <button className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-lg text-xs font-semibold hover:bg-neon-purple/30 transition-colors">
                                            Follow
                                        </button>
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
