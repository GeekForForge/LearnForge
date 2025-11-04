// src/pages/Feed.jsx

// ... (other imports like React)

import { db } from '../firebase';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    where,
    runTransaction,
    increment,
    deleteDoc,
    setDoc,
    getDoc,
    getDocs
} from 'firebase/firestore';
import {
    Heart, MessageCircle, Share2, Bookmark, Send, Smile,
    Award, TrendingUp, Users, Flame, BookOpen, Code,
    MoreHorizontal, Search, UserPlus, UserCheck, Rocket,
    Sparkles, Zap, Image, Video, GitBranch, Eye,
    MapPin, Calendar, Clock, Star, Target, Coffee,
    Home, Bell, MessageSquare, Briefcase, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Make sure useNavigate is here
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Helper function to format Firebase Timestamps
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';

    const date = timestamp.toDate();
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
};


const Feed = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('forYou');
    const [postText, setPostText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for dynamic profile card
    const [postCount, setPostCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // State for dynamic Discover/Follow logic
    const [discoverUsers, setDiscoverUsers] = useState([]); // Replaces mock 'users'
    const [followingList, setFollowingList] = useState([]); // To track who user follows
    const [loadingDiscover, setLoadingDiscover] = useState(true);

    // Mock data for 'trendingTopics' (still hardcoded)
    const trendingTopics = [
        { tag: '#JavaScript', posts: '2.4K', trend: 'up', growth: '+12%' },
        { tag: '#React', posts: '1.8K', trend: 'up', growth: '+8%' },
        { tag: '#Python', posts: '1.5K', trend: 'same', growth: '+2%' },
        { tag: '#DSA', posts: '1.2K', trend: 'up', growth: '+15%' },
        { tag: '#WebDev', posts: '980', trend: 'down', growth: '-3%' }
    ];

    // --- UseEffects for fetching data ---

    // 1. Fetches posts
    useEffect(() => {
        setLoading(true);
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Fetches the logged-in user's social stats
    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.userId);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setFollowerCount(data.followersCount || 0);
                setFollowingCount(data.followingCount || 0);
            } else {
                console.log("No user document found! Please create one.");
            }
        });

        return () => unsubscribe();
    }, [user]);

    // 3. Fetches the user's total post count
    useEffect(() => {
        if (!user) return;

        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('userId', '==', user.userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPostCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [user]);

    // 4. Fetches the list of users for the "Discover" tab
    useEffect(() => {
        if (!user) {
            setLoadingDiscover(false);
            return;
        }
        setLoadingDiscover(true);

        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('userId', '!=', user.userId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDiscoverUsers(fetchedUsers);
            setLoadingDiscover(false);
        }, (error) => {
            console.error("Error fetching discover users: ", error);
            setLoadingDiscover(false);
        });

        return () => unsubscribe();
    }, [user]);

    // 5. Fetches the list of IDs the current user is following
    useEffect(() => {
        if (!user) return;

        const followingColRef = collection(db, 'users', user.userId, 'following');
        const unsubscribe = onSnapshot(followingColRef, (snapshot) => {
            const followingIds = snapshot.docs.map(doc => doc.id);
            setFollowingList(followingIds);
        });

        return () => unsubscribe();
    }, [user]);

    // --- Handler Functions ---

    // Updated to write to Firestore AND update post count
    const handleCreatePost = async () => {
        if (!postText.trim() || !user) return;

        const userDocRef = doc(db, 'users', user.userId);
        const newPostRef = doc(collection(db, 'posts'));

        const newPostData = {
            id: newPostRef.id,
            content: postText,
            timestamp: serverTimestamp(),
            userId: user.userId,
            userName: user.name,
            userAvatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=8B5CF6&color=fff`,
            userTitle: user.bio || '',
            likedBy: [],
            bookmarkedBy: [],
            type: 'text',
            tags: [],
            comments: 0,
            shares: 0,
            views: 0,
        };

        try {
            await runTransaction(db, async (transaction) => {
                transaction.set(newPostRef, newPostData);
                transaction.update(userDocRef, {
                    postsCount: increment(1)
                });
            });
            setPostText('');
        } catch (error) {
            console.error("Error creating post: ", error);
        }
    };
    const handleStartChat = async (targetUser) => {
        if (!user || !targetUser) return;

        const currentUserId = user.userId;
        const targetUserId = targetUser.id; // Assuming targetUser has .id

        // Create a unique, consistent chat ID
        const chatId = currentUserId > targetUserId
            ? `${currentUserId}_${targetUserId}`
            : `${targetUserId}_${currentUserId}`;

        const chatDocRef = doc(db, 'chats', chatId);

        try {
            // Check if chat already exists
            const docSnap = await getDoc(chatDocRef);

            if (!docSnap.exists()) {
                // Chat doesn't exist, create it
                console.log("Creating new chat...");
                await setDoc(chatDocRef, {
                    users: [currentUserId, targetUserId],
                    userNames: [user.name, targetUser.name],
                    userAvatars: [
                        user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`,
                        targetUser.avatarUrl || `https://ui-avatars.com/api/?name=${targetUser.name}`
                    ],
                    lastMessage: '',
                    lastTimestamp: serverTimestamp()
                });
            }

            // Navigate to the messages page
            // We pass the chat ID and other user info in state
            navigate('/messages', {
                state: {
                    selectedChatId: chatId
                }
            });

        } catch (error) {
            console.error("Error starting chat: ", error);
        }
    };
    // Updated to modify Firestore document
    const handleLike = async (postId) => {
        if (!user) return;

        const postRef = doc(db, 'posts', postId);
        const post = posts.find(p => p.id === postId);

        const isLiked = post.likedBy && post.likedBy.includes(user.userId);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likedBy: arrayRemove(user.userId)
                });
            } else {
                await updateDoc(postRef, {
                    likedBy: arrayUnion(user.userId)
                });
            }
        } catch (error) {
            console.error("Error updating like: ", error);
        }
    };

    // Updated to modify Firestore document
    const handleBookmark = async (postId) => {
        if (!user) return;

        const postRef = doc(db, 'posts', postId);
        const post = posts.find(p => p.id === postId);

        const isBookmarked = post.bookmarkedBy && post.bookmarkedBy.includes(user.userId);

        try {
            if (isBookmarked) {
                await updateDoc(postRef, {
                    bookmarkedBy: arrayRemove(user.userId)
                });
            } else {
                await updateDoc(postRef, {
                    bookmarkedBy: arrayUnion(user.userId)
                });
            }
        } catch (error) {
            console.error("Error updating bookmark: ", error);
        }
    };

    // Firebase logic for follow/unfollow
    const handleFollow = async (targetUserId, isCurrentlyFollowing) => {
        if (!user) return;

        const currentUserRef = doc(db, 'users', user.userId);
        const targetUserRef = doc(db, 'users', targetUserId);

        const followingRef = doc(db, 'users', user.userId, 'following', targetUserId);
        const followerRef = doc(db, 'users', targetUserId, 'followers', user.userId);

        try {
            await runTransaction(db, async (transaction) => {
                if (isCurrentlyFollowing) {
                    // --- Logic to UNFOLLOW ---
                    transaction.update(currentUserRef, { followingCount: increment(-1) });
                    transaction.update(targetUserRef, { followersCount: increment(-1) });
                    transaction.delete(followingRef);
                    transaction.delete(followerRef);
                } else {
                    // --- Logic to FOLLOW ---
                    transaction.update(currentUserRef, { followingCount: increment(1) });
                    transaction.update(targetUserRef, { followersCount: increment(1) });
                    transaction.set(followingRef, { timestamp: serverTimestamp() });
                    transaction.set(followerRef, { timestamp: serverTimestamp() });
                }
            });
        } catch (error) {
            console.error("Error following/unfollowing user: ", error);
        }
    };

    // Updated to use dynamic 'discoverUsers' state
    const filteredUsers = discoverUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
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
            <div className="max-w-screen-2xl mx-auto px-4 py-6">
                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR - Profile & Quick Actions */}
                    <div className="col-span-3 space-y-6">
                        {/* Profile Card - Dynamic */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            {user ? (
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff&size=128`}
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full border-4 border-neon-purple"
                                        />
                                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-800"></div>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">{user.name}</h3>
                                    <p className="text-gray-300 text-sm mb-4">{user.bio || 'A LearnForge User'}</p>

                                    {/* Level Progress (Hardcoded) */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-300">Level 15</span>
                                            <span className="text-neon-cyan font-semibold">2500/3000 XP</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full" style={{ width: '83%' }}></div>
                                        </div>
                                    </div>

                                    {/* Stats Grid - Dynamic */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="text-center p-3 bg-white/5 rounded-xl">
                                            <div className="text-white font-bold text-lg">{followerCount}</div>
                                            <div className="text-gray-300 text-xs">Followers</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/5 rounded-xl">
                                            <div className="text-white font-bold text-lg">{followingCount}</div>
                                            <div className="text-gray-300 text-xs">Following</div>
                                        </div>
                                        <div className="text-center p-3 bg-white/5 rounded-xl">
                                            <div className="text-white font-bold text-lg">{postCount}</div>
                                            <div className="text-gray-300 text-xs">Posts</div>
                                        </div>
                                    </div>

                                    {/* Quick Actions (Hardcoded) */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all">
                                            Edit Profile
                                        </button>
                                        <button className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
                                            Share
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-300">
                                    Loading profile...
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Navigation (Hardcoded) */}
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

                        {/* Recent Activity (Hardcoded) */}
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
                        {/* Enhanced Tab Navigation (Hardcoded) */}
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
                                    {/* ✅ RESTORED: Create Post Card */}
                                    {user && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=8B5CF6&color=fff`}
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
                                    )}

                                    {/* ✅ RESTORED: Posts Feed */}
                                    {loading && (
                                        <div className="text-center p-10 text-gray-300">
                                            <Sparkles className="w-8 h-8 mx-auto animate-spin" />
                                            <p className="mt-2">Loading latest posts...</p>
                                        </div>
                                    )}

                                    {!loading && posts.map((post, index) => {
                                        const isLiked = user && post.likedBy && post.likedBy.includes(user.userId);
                                        const likesCount = post.likedBy ? post.likedBy.length : 0;
                                        const isBookmarked = user && post.bookmarkedBy && post.bookmarkedBy.includes(user.userId);

                                        return (
                                            <motion.div
                                                key={post.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                                            >
                                                {/* Post Header - Dynamic Data */}
                                                <div className="p-6 pb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-3">
                                                            <div className="relative">
                                                                <img
                                                                    src={post.userAvatar}
                                                                    alt={post.userName}
                                                                    className="w-12 h-12 rounded-full border-2 border-neon-purple"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-white font-bold">{post.userName}</h4>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                                                    <span>@{post.userName.toLowerCase().replace(' ', '-')}</span>
                                                                    <span>•</span>
                                                                    <span>{formatTimestamp(post.timestamp)}</span>
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

                                                    {/* Post Content - Dynamic */}
                                                    <div className="mt-4">
                                                        <p className="text-white text-base leading-relaxed mb-3">
                                                            {post.content}
                                                        </p>

                                                        {/* Tags */}
                                                        {post.tags && post.tags.length > 0 && (
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

                                                {/* Post Stats (Static for now) */}
                                                <div className="px-6 py-3 border-t border-white/10 bg-white/2">
                                                    <div className="flex items-center gap-6 text-sm text-gray-300">
                                                        <span className="flex items-center gap-1">
                                                            <Eye size={14} />
                                                            {post.views || 0} views
                                                        </span>
                                                        <span>{post.comments || 0} comments</span>
                                                        <span>{post.shares || 0} shares</span>
                                                    </div>
                                                </div>

                                                {/* Post Actions - Dynamic */}
                                                <div className="px-6 py-4 border-t border-white/10">
                                                    <div className="flex items-center justify-between">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleLike(post.id)}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                                                                isLiked
                                                                    ? 'text-pink-500 bg-pink-500/10'
                                                                    : 'text-gray-300 hover:text-pink-500 hover:bg-pink-500/10'
                                                            }`}
                                                        >
                                                            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                                                            <span className="font-semibold">{likesCount}</span>
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                                                        >
                                                            <MessageCircle size={20} />
                                                            <span className="font-semibold">{post.comments || 0}</span>
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-neon-purple hover:bg-neon-purple/10 transition-all"
                                                        >
                                                            <Share2 size={20} />
                                                            <span className="font-semibold">{post.shares || 0}</span>
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleBookmark(post.id)}
                                                            className={`p-3 rounded-xl transition-all ${
                                                                isBookmarked
                                                                    ? 'text-neon-cyan bg-neon-cyan/10'
                                                                    : 'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10'
                                                            }`}
                                                        >
                                                            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                            )}

                            {/* DISCOVER TAB - Dynamic */}
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

                                    {/* User Cards Grid - Dynamic */}
                                    {loadingDiscover ? (
                                        <div className="text-center p-10 text-gray-300">
                                            <Sparkles className="w-8 h-8 mx-auto animate-spin" />
                                            <p className="mt-2">Finding developers...</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {filteredUsers.map((discoverUser, index) => {
                                                const isFollowing = followingList.includes(discoverUser.id);

                                                return (
                                                    <motion.div
                                                        key={discoverUser.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ y: -5 }}
                                                        className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                                                    >
                                                        <div className="flex items-start gap-4 mb-4">
                                                            <div className="relative">
                                                                <img
                                                                    src={discoverUser.avatarUrl || `https://ui-avatars.com/api/?name=${discoverUser.name}&background=10B981&color=fff`}
                                                                    alt={discoverUser.name}
                                                                    className="w-16 h-16 rounded-full border-2 border-neon-cyan"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-white font-bold text-lg truncate">{discoverUser.name}</h3>
                                                                </div>
                                                                <p className="text-gray-300 text-sm truncate">@{discoverUser.username || discoverUser.name.toLowerCase()}</p>
                                                                <p className="text-neon-cyan text-xs mt-1">{discoverUser.title || discoverUser.bio}</p>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{discoverUser.bio}</p>

                                                        {/* Skills (from user doc) */}
                                                        {discoverUser.skills && (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {discoverUser.skills.map((skill, idx) => (
                                                                    <span key={idx} className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Stats (from user doc) */}
                                                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                                            <div>
                                                                <div className="text-white font-bold text-sm">{discoverUser.followersCount || 0}</div>
                                                                <div className="text-gray-300 text-xs">Followers</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-sm">{discoverUser.coursesCompleted || 0}</div>
                                                                <div className="text-gray-300 text-xs">Courses</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-bold text-sm flex items-center justify-center gap-1">
                                                                    <Flame size={12} className="text-orange-500" />
                                                                    {discoverUser.streak || 0}
                                                                </div>
                                                                <div className="text-gray-300 text-xs">Streak</div>
                                                            </div>
                                                        </div>

                                                        {/* Dynamic Follow Button */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleFollow(discoverUser.id, isFollowing)}
                                                            className={`w-full py-3 rounded-xl font-semibold transition-all ${
                                                                isFollowing
                                                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                                                    : 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-cyan/20'
                                                            }`}
                                                        >
                                                            {isFollowing ? (
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
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => handleStartChat(discoverUser)}
                                                            className="py-3 px-4 rounded-xl font-semibold transition-all bg-white/10 text-white hover:bg-white/20"
                                                        >
                                                            <MessageSquare size={16} />
                                                        </motion.button>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* TRENDING TAB (Hardcoded) */}
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

                        {/* ✅ RESTORED: Trending Topics (Hardcoded) */}
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

                        {/* ✅ RESTORED: Weekly Progress (Hardcoded) */}
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

                        {/* ✅ RESTORED: Quick Stats (Hardcoded) */}
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

                        {/* Who to Follow - Dynamic */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                        >
                            <h3 className="text-white font-bold mb-4">Who to Follow</h3>
                            <div className="space-y-4">
                                {loadingDiscover ? (
                                    <div className="text-gray-300 text-sm">Loading...</div>
                                ) : (
                                    discoverUsers.length > 0 ? (
                                        discoverUsers.slice(0, 3).map((discoverUser) => {
                                            const isFollowing = followingList.includes(discoverUser.id);
                                            return (
                                                <div key={discoverUser.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={discoverUser.avatarUrl || `https://ui-avatars.com/api/?name=${discoverUser.name}&background=F59E0B&color=fff`}
                                                            alt={discoverUser.name}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                            <div className="text-white text-sm font-semibold">{discoverUser.name}</div>
                                                            <div className="text-gray-300 text-xs">{discoverUser.title || discoverUser.bio}</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleFollow(discoverUser.id, isFollowing)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                            isFollowing
                                                                ? 'bg-white/10 text-white'
                                                                : 'bg-neon-cyan text-dark-900'
                                                        }`}
                                                    >
                                                        {isFollowing ? 'Following' : 'Follow'}
                                                    </button>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-gray-300 text-sm">No new users to follow.</div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;