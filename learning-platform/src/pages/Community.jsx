// src/pages/Community.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Users, MapPin, Award,
    BookOpen, MessageCircle, UserPlus, UserCheck,
    TrendingUp, Star, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Community = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [followedUsers, setFollowedUsers] = useState(new Set());

    // Mock user data
    const users = [
        {
            id: 1,
            name: 'Samarth Patil',
            username: '@samarth-sachin',
            avatar: 'https://ui-avatars.com/api/?name=Samarth+Patil&background=8B5CF6&color=fff',
            level: 15,
            xp: 2500,
            location: 'Mumbai, India',
            bio: 'Full Stack Developer | React & Node.js Enthusiast',
            courses: ['React', 'Node.js', 'MongoDB'],
            followers: 245,
            following: 180,
            streak: 45,
            online: true,
            badges: ['🔥', '⭐', '💎'],
            skills: ['JavaScript', 'React', 'Node.js']
        },
        {
            id: 2,
            name: 'Priya Sharma',
            username: '@priya-dev',
            avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=06B6D4&color=fff',
            level: 12,
            xp: 1800,
            location: 'Bangalore, India',
            bio: 'UI/UX Designer | Frontend Developer',
            courses: ['CSS', 'Figma', 'React'],
            followers: 189,
            following: 156,
            streak: 30,
            online: true,
            badges: ['✨', '🎨', '🚀'],
            skills: ['CSS', 'Figma', 'Design']
        },
        {
            id: 3,
            name: 'Rahul Kumar',
            username: '@rahul-code',
            avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=EC4899&color=fff',
            level: 18,
            xp: 3200,
            location: 'Delhi, India',
            bio: 'Data Science & ML Engineer',
            courses: ['Python', 'Machine Learning', 'TensorFlow'],
            followers: 342,
            following: 210,
            streak: 60,
            online: false,
            badges: ['🤖', '📊', '🏆'],
            skills: ['Python', 'ML', 'Data Science']
        },
        {
            id: 4,
            name: 'Ananya Singh',
            username: '@ananya-learns',
            avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=10B981&color=fff',
            level: 10,
            xp: 1500,
            location: 'Pune, India',
            bio: 'DevOps Enthusiast | Cloud Computing',
            courses: ['AWS', 'Docker', 'Kubernetes'],
            followers: 156,
            following: 134,
            streak: 25,
            online: true,
            badges: ['☁️', '🐳', '⚙️'],
            skills: ['AWS', 'Docker', 'DevOps']
        },
        {
            id: 5,
            name: 'Vikram Patel',
            username: '@vikram-dev',
            avatar: 'https://ui-avatars.com/api/?name=Vikram+Patel&background=F59E0B&color=fff',
            level: 14,
            xp: 2100,
            location: 'Hyderabad, India',
            bio: 'Mobile App Developer | React Native',
            courses: ['React Native', 'Flutter', 'Firebase'],
            followers: 198,
            following: 167,
            streak: 38,
            online: false,
            badges: ['📱', '⚡', '💡'],
            skills: ['React Native', 'Flutter', 'Mobile']
        },
        {
            id: 6,
            name: 'Neha Gupta',
            username: '@neha-codes',
            avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=8B5CF6&color=fff',
            level: 16,
            xp: 2700,
            location: 'Chennai, India',
            bio: 'Blockchain Developer | Web3 Explorer',
            courses: ['Blockchain', 'Solidity', 'Web3'],
            followers: 267,
            following: 189,
            streak: 50,
            online: true,
            badges: ['🔗', '💰', '🌐'],
            skills: ['Blockchain', 'Solidity', 'Web3']
        }
    ];

    const [filteredUsers, setFilteredUsers] = useState(users);

    // Filter users based on search and filters
    useEffect(() => {
        let result = users;

        // Search filter
        if (searchTerm) {
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Level filter
        if (selectedLevel !== 'all') {
            if (selectedLevel === 'beginner') result = result.filter(user => user.level < 10);
            if (selectedLevel === 'intermediate') result = result.filter(user => user.level >= 10 && user.level < 15);
            if (selectedLevel === 'advanced') result = result.filter(user => user.level >= 15);
        }

        setFilteredUsers(result);
    }, [searchTerm, selectedLevel]);

    const handleFollow = (userId) => {
        setFollowedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-16">
            <div className="container mx-auto px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                        Discover Learners
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Connect with fellow learners, share knowledge, and grow together
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, skills, or interests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-all duration-300"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg hover:border-neon-cyan transition-all duration-300"
                        >
                            <Filter size={18} className="text-neon-cyan" />
                            <span className="text-white">Filters</span>
                            <ChevronDown
                                size={16}
                                className={`text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Level Filter Pills */}
                        {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-4 py-2 rounded-lg transition-all duration-300 capitalize ${
                                    selectedLevel === level
                                        ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                        : 'bg-dark-800/50 border border-white/10 text-gray-400 hover:text-white hover:border-neon-cyan'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    {/* Extended Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-dark-800/50 border border-white/10 rounded-xl p-6 max-w-2xl mx-auto"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Location</label>
                                        <select className="w-full px-4 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-cyan">
                                            <option>All Locations</option>
                                            <option>Mumbai</option>
                                            <option>Bangalore</option>
                                            <option>Delhi</option>
                                            <option>Pune</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
                                        <select className="w-full px-4 py-2 bg-dark-700 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-cyan">
                                            <option>Most Active</option>
                                            <option>Highest Level</option>
                                            <option>Most Followers</option>
                                            <option>Longest Streak</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Count */}
                <div className="text-center mb-6">
                    <p className="text-gray-400">
                        Found <span className="text-neon-cyan font-semibold">{filteredUsers.length}</span> learners
                    </p>
                </div>

                {/* User Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-dark-800/50 border border-white/10 rounded-xl p-6 hover:border-neon-cyan transition-all duration-300 group"
                        >
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-16 h-16 rounded-full border-2 border-neon-cyan"
                                        />
                                        {user.online && (
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-800"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                                        <p className="text-gray-400 text-sm">{user.username}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Level & XP */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Award size={16} className="text-neon-purple" />
                                    <span className="text-white text-sm font-semibold">Lv {user.level}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star size={16} className="text-yellow-500" />
                                    <span className="text-white text-sm">{user.xp} XP</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <TrendingUp size={16} className="text-orange-500" />
                                    <span className="text-white text-sm">{user.streak}d</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{user.bio}</p>

                            {/* Location */}
                            <div className="flex items-center space-x-2 mb-4 text-gray-400 text-sm">
                                <MapPin size={14} />
                                <span>{user.location}</span>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {user.skills.slice(0, 3).map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mb-4 text-sm">
                                <div className="text-center">
                                    <p className="text-white font-semibold">{user.followers}</p>
                                    <p className="text-gray-400 text-xs">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-semibold">{user.following}</p>
                                    <p className="text-gray-400 text-xs">Following</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-semibold">{user.courses.length}</p>
                                    <p className="text-gray-400 text-xs">Courses</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleFollow(user.id)}
                                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                        followedUsers.has(user.id)
                                            ? 'bg-dark-700 border border-white/10 text-gray-400'
                                            : 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                    }`}
                                >
                                    {followedUsers.has(user.id) ? (
                                        <>
                                            <UserCheck size={16} />
                                            <span>Following</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            <span>Follow</span>
                                        </>
                                    )}
                                </motion.button>
                                <Link to={`/messages?user=${user.id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 bg-dark-700 border border-white/10 rounded-lg hover:border-neon-cyan transition-all duration-300"
                                    >
                                        <MessageCircle size={18} className="text-neon-cyan" />
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Load More Button */}
                {filteredUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <button className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg hover:shadow-neon-cyan transition-all duration-300">
                            Load More Learners
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Community;