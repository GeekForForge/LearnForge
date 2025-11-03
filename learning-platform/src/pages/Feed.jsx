// src/pages/Feed.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Share2, Bookmark, Send, Smile,
    Award, TrendingUp, Users, Flame, BookOpen, Code,
    MoreHorizontal, Search, UserPlus, UserCheck, Rocket,
    Sparkles, Zap, Image, Video, GitBranch, Eye,
    MapPin, Calendar, Clock, Star, Target, Coffee,
    Home, Bell, MessageSquare, Briefcase, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Feed = () => {
    const [activeTab, setActiveTab] = useState('forYou');
    const [postText, setPostText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Enhanced mock data for posts
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: {
                name: 'Samarth Patil',
                username: '@samarth-sachin',
                avatar: 'https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff',
                level: 15,
                badge: '🔥',
                online: true,
                title: 'Full Stack Developer'
            },
            content: 'Just completed the Advanced React Patterns course! Finally mastered render props and compound components. The project was challenging but so rewarding! 🚀',
            type: 'achievement',
            course: 'React Masterclass',
            timestamp: '2 hours ago',
            likes: 45,
            comments: 8,
            shares: 3,
            views: 245,
            isLiked: false,
            isBookmarked: false,
            tags: ['#React', '#AdvancedPatterns', '#WebDev'],
            media: null,
            achievement: {
                title: 'React Patterns Master',
                xp: 250
            }
        },
        {
            id: 2,
            user: {
                name: 'Priya Sharma',
                username: '@priya-dev',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=06B6D4&color=fff',
                level: 12,
                badge: '⭐',
                online: true,
                title: 'UI/UX Designer'
            },
            content: 'Looking for study partners for Data Structures & Algorithms! Planning to solve 3 problems daily and discuss solutions. Anyone interested in joining this coding journey? 💪',
            type: 'collaboration',
            timestamp: '5 hours ago',
            likes: 23,
            comments: 15,
            shares: 5,
            views: 189,
            isLiked: true,
            isBookmarked: false,
            tags: ['#DSA', '#StudyGroup', '#Programming', '#LeetCode'],
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
                online: false,
                title: 'ML Engineer'
            },
            content: 'Just deployed my first machine learning model to production! Built a recommendation system using collaborative filtering. The journey from notebook to production was intense but worth it!',
            type: 'project',
            project: 'ML Recommendation System',
            timestamp: '1 day ago',
            likes: 89,
            comments: 12,
            shares: 18,
            views: 542,
            isLiked: false,
            isBookmarked: true,
            tags: ['#MachineLearning', '#Python', '#Production', '#MLOps'],
            media: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=300&fit=crop'
        },
        {
            id: 4,
            user: {
                name: 'Aisha Khan',
                username: '@aisha-dev',
                avatar: 'https://ui-avatars.com/api/?name=Aisha+Khan&background=10B981&color=fff',
                level: 20,
                badge: '🚀',
                online: true,
                title: 'Senior Frontend Engineer'
            },
            content: 'Just gave a talk about Micro-frontend architecture at the React Conference! So many great questions from the audience. The future of frontend development is modular!',
            type: 'event',
            timestamp: '3 hours ago',
            likes: 156,
            comments: 34,
            shares: 28,
            views: 890,
            isLiked: true,
            isBookmarked: false,
            tags: ['#MicroFrontends', '#React', '#Architecture'],
            media: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop'
        }
    ]);

    // Enhanced mock data for users
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Ananya Singh',
            username: '@ananya-learns',
            avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=10B981&color=fff',
            level: 10,
            xp: 1500,
            coursesCompleted: 3,
            followers: 120,
            following: 85,
            isFollowing: false,
            online: true,
            title: 'DevOps Enthusiast',
            bio: 'Passionate about cloud computing and automation | Learning AWS & Docker',
            skills: ['AWS', 'Docker', 'Linux'],
            streak: 7
        },
        {
            id: 2,
            name: 'Vikram Patel',
            username: '@vikram-dev',
            avatar: 'https://ui-avatars.com/api/?name=Vikram+Patel&background=F59E0B&color=fff',
            level: 14,
            xp: 2800,
            coursesCompleted: 7,
            followers: 245,
            following: 120,
            isFollowing: true,
            online: false,
            title: 'Competitive Programmer',
            bio: 'DSA enthusiast | 3⭐ CodeChef | Love solving complex problems',
            skills: ['C++', 'Algorithms', 'Data Structures'],
            streak: 21
        }
    ]);

    const trendingTopics = [
        { tag: '#JavaScript', posts: '2.4K', trend: 'up', growth: '+12%' },
        { tag: '#React', posts: '1.8K', trend: 'up', growth: '+8%' },
        { tag: '#Python', posts: '1.5K', trend: 'same', growth: '+2%' },
        { tag: '#DSA', posts: '1.2K', trend: 'up', growth: '+15%' },
        { tag: '#WebDev', posts: '980', trend: 'down', growth: '-3%' }
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
                    online: true,
                    title: 'Full Stack Developer'
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

    const handleFollow = (userId) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, isFollowing: !user.isFollowing }
                : user
        ));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getPostTypeIcon = (type) => {
        switch (type) {
            case 'achievement': return <Award className="w-4 h-4 text-green-400" />;
            case 'project': return <Code className="w-4 h-4 text-blue-400" />;
            case 'collaboration': return <Users className="w-4 h-4 text-purple-400" />;
            case 'event': return <Calendar className="w-4 h-4 text-orange-400" />;
            default: return <Sparkles className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-16">
            {/* Main Container - Full Width */}
            <div className="max-w-screen-2xl mx-auto px-4 py-6">
                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR - Profile & Quick Actions */}
                    <div className="col-span-3 space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
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
                                <p className="text-gray-300 text-sm mb-4">Full Stack Developer</p>

                                {/* Level Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-300">Level 15</span>
                                        <span className="text-neon-cyan font-semibold">2500/3000 XP</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full" style={{ width: '83%' }}></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 bg-white/5 rounded-xl">
                                        <div className="text-white font-bold text-lg">245</div>
                                        <div className="text-gray-300 text-xs">Followers</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-xl">
                                        <div className="text-white font-bold text-lg">180</div>
                                        <div className="text-gray-300 text-xs">Following</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-xl">
                                        <div className="text-white font-bold text-lg">45</div>
                                        <div className="text-gray-300 text-xs">Posts</div>
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

                        {/* Quick Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-3"
                        >
                            {[
                                { icon: <BookOpen className="w-5 h-5" />, label: 'My Courses', count: 12, color: 'text-blue-400', link: '/courses' },
                                { icon: <Code className="w-5 h-5" />, label: 'Projects', count: 8, color: 'text-green-400', link: '/projects' },
                                { icon: <Award className="w-5 h-5" />, label: 'Achievements', count: 15, color: 'text-yellow-400', link: '/achievements' },
                                { icon: <Users className="w-5 h-5" />, label: 'Study Groups', count: 3, color: 'text-purple-400', link: '/groups' },
                                { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', count: 24, color: 'text-orange-400', link: '/jobs' }
                            ].map((item, index) => (
                                <Link key={index} to={item.link}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                    >
                                        <div className={`p-2 rounded-xl bg-white/10 ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-semibold text-sm">{item.label}</div>
                                            <div className="text-gray-300 text-xs">{item.count} items</div>
                                        </div>
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { action: 'Completed React Course', time: '2h ago', xp: '+250 XP' },
                                    { action: 'Posted in DSA Group', time: '5h ago', xp: '+50 XP' },
                                    { action: 'Helped a peer', time: '1d ago', xp: '+100 XP' },
                                    { action: '7-day streak', time: '1d ago', xp: '+150 XP' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div>
                                            <div className="text-white text-sm font-medium">{activity.action}</div>
                                            <div className="text-gray-300 text-xs">{activity.time}</div>
                                        </div>
                                        <div className="text-neon-cyan text-sm font-semibold">{activity.xp}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* MAIN CONTENT - Feed Posts */}
                    <div className="col-span-6 space-y-6">
                        {/* Enhanced Tab Navigation */}
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
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all flex-1 justify-center ${
                                        activeTab === tab.id
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
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
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
                                                            { icon: <Calendar className="w-5 h-5" />, label: 'Event' }
                                                        ].map((item, index) => (
                                                            <button key={index} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
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

                                    {/* Posts Feed */}
                                    {posts.map((post, index) => (
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
                                                            <div className="flex items-center gap-2 text-gray-300 text-sm">
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
                                                    <button className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </div>

                                                {/* Post Content */}
                                                <div className="mt-4">
                                                    <p className="text-white text-base leading-relaxed mb-3">
                                                        {post.content}
                                                    </p>

                                                    {/* Achievement Badge */}
                                                    {post.achievement && (
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl text-green-300 mb-3">
                                                            <Award size={16} />
                                                            <span className="text-sm font-semibold">{post.achievement.title}</span>
                                                            <span className="text-xs bg-green-500/30 px-2 py-1 rounded-full">+{post.achievement.xp} XP</span>
                                                        </div>
                                                    )}

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
                                                                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Post Stats */}
                                            <div className="px-6 py-3 border-t border-white/10 bg-white/2">
                                                <div className="flex items-center gap-6 text-sm text-gray-300">
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={14} />
                                                        {post.views} views
                                                    </span>
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
                                                                : 'text-gray-300 hover:text-pink-500 hover:bg-pink-500/10'
                                                        }`}
                                                    >
                                                        <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                                                        <span className="font-semibold">{post.likes}</span>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                                                    >
                                                        <MessageCircle size={20} />
                                                        <span className="font-semibold">{post.comments}</span>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-neon-purple hover:bg-neon-purple/10 transition-all"
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
                                                                : 'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10'
                                                        }`}
                                                    >
                                                        <Bookmark size={20} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredUsers.map((user, index) => (
                                            <motion.div
                                                key={user.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ y: -5 }}
                                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                                            >
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="relative">
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.name}
                                                            className="w-16 h-16 rounded-full border-2 border-neon-cyan"
                                                        />
                                                        {user.online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-white font-bold text-lg truncate">{user.name}</h3>
                                                            <span className="text-xs text-neon-purple bg-neon-purple/10 px-2 py-1 rounded-full">
                                                                Lv {user.level}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-300 text-sm truncate">{user.username}</p>
                                                        <p className="text-neon-cyan text-xs mt-1">{user.title}</p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{user.bio}</p>

                                                {/* Skills */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {user.skills.map((skill, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                                    <div>
                                                        <div className="text-white font-bold text-sm">{user.followers}</div>
                                                        <div className="text-gray-300 text-xs">Followers</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm">{user.coursesCompleted}</div>
                                                        <div className="text-gray-300 text-xs">Courses</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm flex items-center justify-center gap-1">
                                                            <Flame size={12} className="text-orange-500" />
                                                            {user.streak}
                                                        </div>
                                                        <div className="text-gray-300 text-xs">Streak</div>
                                                    </div>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleFollow(user.id)}
                                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                                                        user.isFollowing
                                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                                            : 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-cyan/20'
                                                    }`}
                                                >
                                                    {user.isFollowing ? (
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
                                        ))}
                                    </div>
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
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/20 text-center"
                                    >
                                        <Flame size={64} className="text-orange-500 mx-auto mb-4" />
                                        <h3 className="text-white text-2xl font-bold mb-2">Trending Content</h3>
                                        <p className="text-gray-300 mb-6">Discover what's hot in the developer community</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center">
                                                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                                <div className="text-white font-bold text-lg">245</div>
                                                <div className="text-gray-300 text-sm">Active Posts</div>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center">
                                                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                                <div className="text-white font-bold text-lg">1.2K</div>
                                                <div className="text-gray-300 text-sm">Engaged Users</div>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center">
                                                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                                                <div className="text-white font-bold text-lg">89%</div>
                                                <div className="text-gray-300 text-sm">Growth Rate</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT SIDEBAR - Trending & Stats */}
                    <div className="col-span-3 space-y-6">
                        {/* Trending Topics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
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
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
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

                        {/* Weekly Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                <Target className="w-5 h-5 text-yellow-400" />
                                Weekly Progress
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Courses Completed', value: 3, total: 5, icon: <BookOpen size={14} /> },
                                    { label: 'Hours Learned', value: 12, total: 20, icon: <Clock size={14} /> },
                                    { label: 'Projects Built', value: 2, total: 3, icon: <Code size={14} /> }
                                ].map((stat, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300 flex items-center gap-2">
                                                {stat.icon}
                                                {stat.label}
                                            </span>
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

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                                <Zap className="w-5 h-5 text-neon-cyan" />
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300 text-sm">Learning Streak</span>
                                    <span className="text-orange-500 font-bold flex items-center gap-1">
                                        <Flame size={14} />
                                        7 days
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300 text-sm">Total XP</span>
                                    <span className="text-neon-cyan font-bold">2,500</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300 text-sm">Rank</span>
                                    <span className="text-yellow-400 font-bold">#42</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Who to Follow */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4">Who to Follow</h3>
                            <div className="space-y-4">
                                {users.slice(0, 3).map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <div className="text-white text-sm font-semibold">{user.name}</div>
                                                <div className="text-gray-300 text-xs">{user.title}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleFollow(user.id)}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                user.isFollowing
                                                    ? 'bg-white/10 text-white'
                                                    : 'bg-neon-cyan text-dark-900'
                                            }`}
                                        >
                                            {user.isFollowing ? 'Following' : 'Follow'}
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

export default Feed;