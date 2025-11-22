import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, TrendingUp, Target, Clock, CheckCircle,
    User, Mail, Calendar, Settings, Edit3, ChevronRight, Flame, Trophy,
    Code, Star, Zap, Crown, Medal, Link as LinkIcon, Loader // <-- Import Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';
import StreakDisplay from '../components/StreakDisplay';
import ApiService from '../services/api';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';


const ProfilePage = ({ setCurrentPage }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated, fetchUser } = useAuth();
    const { summary, progressData, refreshSummary, refreshProgress } = useProgress();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalLessonsCompleted: 0
    });

    // LeetCode State
    const [leetcodeStats, setLeetcodeStats] = useState(null);
    const [leetcodeLoading, setLeetcodeLoading] = useState(true);

    // --- ADDED: GFG & CodeChef State ---
    const [gfgStats, setGfgStats] = useState(null);
    const [gfgLoading, setGfgLoading] = useState(false);
    const [codechefStats, setCodechefStats] = useState(null);
    const [codechefLoading, setCodechefLoading] = useState(false);
    // --- END ADDED ---

    const [handleInput, setHandleInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // This is now dynamic from AuthContext
    const leetcodeHandle = user?.leetcodeHandle;
    const gfgUrl = user?.gfgUrl; // <-- ADDED
    const codechefUrl = user?.codechefUrl; // <-- ADDED
    const codechefHandle = user?.codechefHandle;
    useEffect(() => {
        setCurrentPage('profile');
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
    }, [isAuthenticated, setCurrentPage, navigate]);

    useEffect(() => {
        if (user) {
            loadProfileData();
        }
    }, [user]); // user dependency is correct

    // --- ADDED: Handle Extractors ---
    const extractGfgHandle = (url) => {
        if (!url) return null;
        try {
            // Handles both geeksforgeeks.org/user/ and geeksforgeeks.org/auth/
            const match = url.match(/geeksforgeeks\.org\/(user|auth)\/([a-zA-Z0-9_-]+)/);
            return match ? match[2] : null;
        } catch (e) { return null; }
    };

    const extractCodeChefHandle = (url) => {
        if (!url) return null;
        try {
            const match = url.match(/codechef\.com\/users\/([a-zA-Z0-9_-]+)/);
            return match ? match[1] : null;
        } catch (e) { return null; }
    };

    useEffect(() => {
        if (leetcodeHandle) {
            loadLeetcodeData(leetcodeHandle);
        } else {
            setLeetcodeLoading(false);
        }
    }, [leetcodeHandle]);

    // --- ADDED: GFG & CodeChef Loaders ---
    // GFG Loader
    useEffect(() => {
        const handle = extractGfgHandle(gfgUrl);
        if (handle) {
            const loadData = async () => {
                setGfgLoading(true);
                try {
                    const data = await ApiService.getGfgMetrics(handle);
                    setGfgStats(data);
                } catch (e) {
                    console.error("Failed to load GFG stats", e);
                    setGfgStats(null);
                } finally {
                    setGfgLoading(false);
                }
            };
            loadData();
        } else {
            setGfgStats(null);
        }
    }, [gfgUrl]);

    useEffect(() => {
        if (codechefHandle) {
            const loadData = async () => {
                setCodechefLoading(true);
                try {
                    const data = await ApiService.getCodeChefMetrics(codechefHandle);
                    setCodechefStats(data);
                } catch (e) {
                    setCodechefStats(null);
                } finally {
                    setCodechefLoading(false);
                }
            };
            loadData();
        } else {
            setCodechefStats(null);
        }
    }, [codechefHandle]);


    const loadLeetcodeData = async (handle) => {
        setLeetcodeLoading(true);
        try {
            const data = await ApiService.getLeetCodeMetrics(handle);
            setLeetcodeStats(data);
        } catch (error) {
            console.error('❌ Error fetching LeetCode stats:', error);
            setLeetcodeStats(null);
        } finally {
            setLeetcodeLoading(false);
        }
    };

    const loadProfileData = async () => {
        if (!user) return;

        try {
            if (enrolledCourses.length === 0) {
                setLoading(true);
            }

            await refreshProgress();
            await refreshSummary();

            const allCourses = await ApiService.getAllCourses();
            const coursesWithProgress = allCourses.filter(course =>
                progressData[course.courseId]
            );
            setEnrolledCourses(coursesWithProgress);

            if (user.userId) {
                try {
                    const streak = await ApiService.getUserStreak(user.userId);
                    setStreakData(streak); // This is correct, no mapping needed
                } catch (error) {
                    console.error('❌ Error fetching streak:', error);
                }
            }
        } catch (error) {
            console.error('❌ Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // This function is no longer needed on this page, as SettingsPage handles it
    /*
    const handleSaveHandle = async (e) => {
        e.preventDefault();
        // ...
    };
    */

    const getCourseProgress = async (courseId) => {
        try {
            const lessons = await ApiService.getLessonsByCourse(courseId);
            const progress = progressData[courseId];
            if (!progress || !lessons.length) return 0;
            const completedCount = progress.completedLessons?.length || 0;
            return Math.round((completedCount / lessons.length) * 100);
        } catch (error) {
            console.error('Error calculating progress:', error);
            return 0;
        }
    };

    const getHeatmapData = (calendar) => {
        if (!calendar) return [];
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        return Object.keys(calendar).map(timestamp => {
            const date = new Date(parseInt(timestamp) * 1000);
            return {
                date: date.toISOString().split('T')[0], // 'YYYY-MM-DD'
                count: calendar[timestamp]
            };
        }).filter(item => new Date(item.date) >= oneYearAgo);
    };

    const calculateOverallProgress = () => {
        if (!summary || !summary.totalLessons) return 0;
        return Math.round((summary.completedLessons / summary.totalLessons) * 100);
    };

    if (loading) { // Simplified loading check
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading Profile...</p>
                </div>
            </div>
        );
    }

    // This check is for after loading, if user somehow still null
    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* === YOUR PROFILE HEADER (Unchanged) === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-3xl p-8 mb-8 border border-white/10"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <img
                            src={user.avatarUrl || 'https://via.placeholder.com/120'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-neon-cyan shadow-lg shadow-neon-cyan/30"
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>{user.email}</span>
                                </div>
                                {user.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            {summary && summary.totalLessons > 0 && (
                                <div className="max-w-md">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-300">Overall Progress</span>
                                        <span className="text-sm font-bold text-neon-cyan">{calculateOverallProgress()}%</span>
                                    </div>
                                    <ProgressBar
                                        progress={calculateOverallProgress()}
                                        color="cyan"
                                        size="md"
                                        animated={true}
                                        showLabel={false}
                                    />
                                    <p className="text-xs text-gray-400 mt-2">
                                        {summary.completedLessons} of {summary.totalLessons} lessons completed
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium flex items-center gap-2 transition-all border border-white/20"
                        >
                            <Settings size={18} />
                            Settings
                        </button>
                    </div>
                </motion.div>

                {/* === CODING STATS - NOW DYNAMIC === */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl">
                            <Code className="text-white" size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Problem Solving Stats</h2>
                    </div>

                    {/* === CONDITIONAL RENDER: CONNECT OR SHOW STATS === */}
                    { !leetcodeHandle && !gfgUrl && !codechefUrl ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-900 rounded-3xl p-8 border border-neon-purple/30 text-center"
                        >
                            <LinkIcon size={48} className="mx-auto text-neon-cyan mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Connect Your Profiles</h3>
                            <p className="text-gray-400 mb-6">
                                Go to Settings > Connected Accounts to link your LeetCode, GFG, and CodeChef handles.
                            </p>
                            <button
                                onClick={() => navigate('/settings')}
                                className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl transition-opacity hover:opacity-90"
                            >
                                Go to Settings
                            </button>
                        </motion.div>
                    ) : (
                        // --- 4. SHOW STATS GRID ---
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Stats Card - NOW DYNAMIC */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-neon-purple/30 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-white">
                                            {leetcodeHandle ? `LeetCode Stats (${leetcodeHandle})` : "LeetCode Stats"}
                                        </h3>
                                    </div>

                                    {/* === STATS HEADER GRID (NOW FULLY DYNAMIC) === */}
                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        {/* 1. LEETCODE */}
                                        <div className="text-center">
                                            {leetcodeLoading ? (
                                                <Loader className="animate-spin text-green-400 mx-auto mt-4" />
                                            ) : (
                                                <>
                                                    <div className={`text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2 ${!leetcodeStats ? 'opacity-50' : ''}`}>
                                                        {leetcodeStats?.totalSolved || 0}
                                                    </div>
                                                    <div className={`flex items-center justify-center gap-2 text-gray-300 ${!leetcodeStats ? 'opacity-50' : ''}`}>
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm">LeetCode</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* 2. GEEKSFORGEEKS (Replaced placeholder) */}
                                        <div className="text-center">
                                            {gfgLoading ? (
                                                <Loader className="animate-spin text-green-400 mx-auto mt-4" />
                                            ) : (
                                                <>
                                                    <div className={`text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2 ${!gfgStats ? 'opacity-50' : ''}`}>
                                                        {gfgStats?.totalProblemsSolved || 0}
                                                    </div>
                                                    <div className={`flex items-center justify-center gap-2 text-gray-300 ${!gfgStats ? 'opacity-50' : ''}`}>
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <span className="text-sm">GeeksforGeeks</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* 3. CODECHEF (Replaced placeholder) */}
                                        <div className="text-center">
                                            {codechefLoading ? (
                                                <Loader className="animate-spin text-yellow-400 mx-auto mt-4" />
                                            ) : (
                                                <>
                                                    <div className={`text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2 ${!codechefStats ? 'opacity-50' : ''}`}>
                                                        {codechefStats?.currentRating || 0}
                                                    </div>
                                                    <div className={`flex items-center justify-center gap-2 text-gray-300 ${!codechefStats ? 'opacity-50' : ''}`}>
                                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                        <span className="text-sm">CodeChef</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* LeetCode Specifics */}
                                    {leetcodeLoading ? (
                                        <div className="text-center p-4">
                                            <Loader className="animate-spin text-neon-cyan mx-auto" />
                                        </div>
                                    ) : !leetcodeStats ? (
                                        <div className="text-center p-6 bg-black/50 rounded-2xl border border-white/10">
                                            <p className="text-gray-400">
                                                {leetcodeHandle ? `Could not load LeetCode stats for "${leetcodeHandle}".` : "LeetCode not connected."}
                                            </p>
                                            <button
                                                onClick={() => navigate('/settings')}
                                                className="mt-4 px-4 py-2 text-xs bg-white/10 rounded-lg text-white hover:bg-white/20"
                                            >
                                                {leetcodeHandle ? "Check Handle" : "Connect"}
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-black/50 rounded-2xl p-6 border border-white/10 mb-8">
                                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <Zap className="text-yellow-400" size={20} />
                                                    LeetCode Difficulty Breakdown
                                                </h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-400 mb-1">
                                                            {leetcodeStats.easy}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Easy</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                                                            {leetcodeStats.medium}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Medium</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-red-400 mb-1">
                                                            {leetcodeStats.hard}
                                                        </div>
                                                        <div className="text-xs text-gray-400">Hard</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-black/50 rounded-2xl p-6 border border-white/10">
                                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                    <Calendar size={20} className="text-cyan-400" />
                                                    LeetCode Activity Heatmap
                                                </h4>
                                                <div className="heatmap-container">
                                                    <CalendarHeatmap
                                                        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                                        endDate={new Date()}
                                                        values={getHeatmapData(leetcodeStats.calendar)}
                                                        classForValue={(value) => {
                                                            if (!value || value.count === 0) return 'color-empty';
                                                            if (value.count > 4) return 'color-github-4';
                                                            return `color-github-${value.count}`;
                                                        }}
                                                        tooltipDataAttrs={value => {
                                                            const date = value.date ? new Date(value.date).toDateString() : 'No data';
                                                            const count = value.count || 0;
                                                            return { 'data-tip': `${date}: ${count} submissions` };
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {/* === YOUR AWARDS SECTION (Unchanged) === */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-yellow-500/30 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Crown className="text-yellow-400" size={28} />
                                        Awards & Achievements
                                    </h3>
                                    <div className="text-center mb-6">
                                        <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                                            2
                                        </div>
                                        <p className="text-gray-400 text-sm">Badges Earned</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                                <Medal className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">Problem Solver</div>
                                                <div className="text-yellow-400 text-sm">100+ Questions</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                                                <Star className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">Consistency King</div>
                                                <div className="text-purple-400 text-sm">7-Day Streak</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 transition-all">
                                        View All Achievements
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* === YOUR STREAK SECTION (Unchanged) === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Flame className="text-orange-400" size={28} />
                        Your Learning Streak
                    </h2>
                    <StreakDisplay
                        currentStreak={streakData.currentStreak}
                        longestStreak={streakData.longestStreak}
                        totalLessonsCompleted={streakData.totalLessonsCompleted}
                    />
                </motion.div>

                {/* === YOUR STATS CARDS (Unchanged) === */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<BookOpen className="text-neon-purple" size={28} />}
                        label="Total Courses"
                        value={summary?.totalCourses || 0}
                        color="purple"
                    />
                    <StatCard
                        icon={<CheckCircle className="text-green-400" size={28} />}
                        label="Completed Courses"
                        value={summary?.completedCourses || 0}
                        color="green"
                    />
                    <StatCard
                        icon={<Target className="text-neon-cyan" size={28} />}
                        label="Lessons Done"
                        value={`${summary?.completedLessons || 0}/${summary?.totalLessons || 0}`}
                        color="cyan"
                    />
                    <StatCard
                        icon={<TrendingUp className="text-yellow-400" size={28} />}
                        label="Avg Progress"
                        value={`${calculateOverallProgress()}%`}
                        color="yellow"
                    />
                </div>

                {/* === YOUR ENROLLED COURSES (Unchanged) === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-white">My Courses</h2>
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-neon-cyan hover:text-white transition-colors flex items-center gap-2"
                        >
                            Browse More
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {enrolledCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course) => (
                                <CourseCard
                                    key={course.courseId}
                                    course={course}
                                    progressData={progressData}
                                    getCourseProgress={getCourseProgress}
                                    navigate={navigate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                            <BookOpen size={64} className="mx-auto text-gray-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Courses Yet</h3>
                            <p className="text-gray-400 mb-6">Start learning by enrolling in a course!</p>
                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
                            >
                                Explore Courses
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
    const colorClasses = {
        purple: 'bg-neon-purple/20 border-neon-purple/30',
        cyan: 'bg-neon-cyan/20 border-neon-cyan/30',
        green: 'bg-green-500/20 border-green-500/30',
        yellow: 'bg-yellow-500/20 border-yellow-500/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`${colorClasses[color]} border backdrop-blur-sm rounded-2xl p-6 transition-all`}
        >
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Course Card Component
const CourseCard = ({ course, progressData, getCourseProgress, navigate }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadProgress = async () => {
            const p = await getCourseProgress(course.courseId);
            setProgress(p);
        };
        loadProgress();
    }, [course.courseId, progressData, getCourseProgress]); // Added getCourseProgress to deps

    const courseProgress = progressData[course.courseId];
    const completedCount = courseProgress?.completedLessons?.length || 0;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/course/${course.courseId}`)}
            className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-neon-cyan/50 cursor-pointer transition-all group"
        >
            <div className="h-32 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center relative">
                <BookOpen size={48} className="text-white opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
          }`}>
            {course.difficulty}
          </span>
                </div>
            </div>
            <div className="p-6">
        <span className="text-xs text-neon-cyan font-medium uppercase tracking-wider">
          {course.category}
        </span>
                <h3 className="text-lg font-bold text-white mt-2 mb-2 group-hover:text-neon-cyan transition-colors">
                    {course.courseTitle}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    {completedCount > 0 ? `${completedCount} lessons completed` : 'Just started'}
                </p>
                <ProgressBar
                    progress={progress}
                    color="purple"
                    size="sm"
                    animated={false}
                    showLabel={false}
                />
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs font-bold text-white">{progress}%</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;