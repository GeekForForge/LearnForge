import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, TrendingUp, Target, Clock, CheckCircle,
    User, Mail, Calendar, Settings, Edit3, ChevronRight, Flame, Trophy,
    Code, Star, Zap, Crown, Medal, Link as LinkIcon, Loader,
    Brain, TrendingUp as TrendingUpIcon, Target as TargetIcon, Clock as ClockIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';
import StreakDisplay from '../components/StreakDisplay';
import ApiService from '../services/api';

const ProfilePage = ({ setCurrentPage }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
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
    const leetcodeHandle = user?.leetcodeHandle;

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
    }, [user]);

    useEffect(() => {
        if (leetcodeHandle) {
            loadLeetcodeData(leetcodeHandle);
        } else {
            setLeetcodeLoading(false);
        }
    }, [leetcodeHandle]);

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
                    setStreakData(streak);
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

    const calculateOverallProgress = () => {
        if (!summary || !summary.totalLessons) return 0;
        return Math.round((summary.completedLessons / summary.totalLessons) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* === PROFILE HEADER === */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/30 backdrop-blur-md rounded-3xl p-6 md:p-8 mb-8 border border-white/20 shadow-2xl shadow-neon-cyan/10"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-2xl blur-md opacity-50"></div>
                            <img
                                src={user.avatarUrl || 'https://via.placeholder.com/120'}
                                alt={user.name}
                                className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white/30 shadow-lg shadow-neon-cyan/30"
                            />
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg">
                                <User size={18} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{user.name}</h1>
                                <p className="text-gray-300 text-lg md:text-xl">
                                    Learning to code, one lesson at a time
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-base text-gray-300">
                                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                                    <Mail size={16} />
                                    <span>{user.email}</span>
                                </div>
                                {user.createdAt && (
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                                        <Calendar size={16} />
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                            {summary && summary.totalLessons > 0 && (
                                <div className="max-w-md">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-medium text-gray-300">Overall Progress</span>
                                        <span className="text-lg font-bold text-neon-cyan">{calculateOverallProgress()}%</span>
                                    </div>
                                    <ProgressBar
                                        progress={calculateOverallProgress()}
                                        color="cyan"
                                        size="md"
                                        animated={true}
                                        showLabel={false}
                                    />
                                    <p className="text-base text-gray-300 mt-3">
                                        {summary.completedLessons} of {summary.totalLessons} lessons completed
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl text-white font-medium flex items-center gap-2 transition-all border border-white/20 shadow-lg hover:shadow-neon-cyan/20 self-start md:self-center"
                        >
                            <Settings size={18} />
                            Settings
                        </button>
                    </div>
                </motion.div>

                {/* === MAIN CONTENT GRID === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* LEFT COLUMN - Stats & Streak */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            <StatCard
                                icon={<BookOpen className="text-neon-purple" size={24} />}
                                label="Total Courses"
                                value={summary?.totalCourses || 0}
                                color="purple"
                                trend="+2"
                            />
                            <StatCard
                                icon={<CheckCircle className="text-green-400" size={24} />}
                                label="Completed"
                                value={summary?.completedCourses || 0}
                                color="green"
                                trend="+1"
                            />
                            <StatCard
                                icon={<Target className="text-neon-cyan" size={24} />}
                                label="Lessons Done"
                                value={summary?.completedLessons || 0}
                                color="cyan"
                                trend="+5"
                            />
                            <StatCard
                                icon={<TrendingUp className="text-yellow-400" size={24} />}
                                label="Progress"
                                value={`${calculateOverallProgress()}%`}
                                color="yellow"
                            />
                        </motion.div>

                        {/* Learning Streak */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-orange-500/10 to-red-500/5 backdrop-blur-md rounded-2xl p-6 border border-orange-500/30 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                                    <Flame className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Learning Streak</h2>
                                    <p className="text-sm text-gray-300">Keep learning daily to maintain your streak!</p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-xl blur-sm"></div>
                                <StreakDisplay
                                    currentStreak={streakData.currentStreak}
                                    longestStreak={streakData.longestStreak}
                                    totalLessonsCompleted={streakData.totalLessonsCompleted}
                                />
                            </div>
                        </motion.div>

                        {/* Enrolled Courses */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg shadow-lg">
                                        <BookOpen className="text-white" size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">My Courses</h2>
                                </div>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="text-neon-cyan hover:text-white transition-colors text-sm font-medium flex items-center gap-1 hover:underline"
                                >
                                    View All
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {enrolledCourses.length > 0 ? (
                                <div className="space-y-4">
                                    {enrolledCourses.slice(0, 3).map((course) => (
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
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <BookOpen size={32} className="text-neon-cyan" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">No Courses Yet</h3>
                                    <p className="text-gray-300 mb-6">Start your learning journey today!</p>
                                    <button
                                        onClick={() => navigate('/courses')}
                                        className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all shadow-lg"
                                    >
                                        Explore Courses
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN - Coding Stats & Awards */}
                    <div className="space-y-6">
                        {/* LeetCode Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg">
                                    <Code className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Problem Solving</h2>
                                    <p className="text-sm text-gray-300">
                                        {leetcodeHandle ? `@${leetcodeHandle}` : "Connect your LeetCode"}
                                    </p>
                                </div>
                            </div>

                            {!leetcodeHandle ? (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                                        <LinkIcon size={32} className="text-cyan-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Connect LeetCode</h3>
                                    <p className="text-gray-300 text-sm mb-4">Track your coding progress</p>
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all w-full shadow-lg"
                                    >
                                        Connect Now
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {leetcodeLoading ? (
                                        <div className="text-center py-8">
                                            <Loader className="animate-spin text-cyan-400 mx-auto" size={32} />
                                            <p className="text-gray-300 mt-2">Loading stats...</p>
                                        </div>
                                    ) : leetcodeStats ? (
                                        <>
                                            <div className="text-center mb-8 relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-cyan-400/5 rounded-xl blur-md"></div>
                                                <div className="relative py-4">
                                                    <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                                                        {leetcodeStats.totalSolved || 0}
                                                    </div>
                                                    <p className="text-lg text-gray-300">Problems Solved</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 gap-3">
                                                    <DifficultyBadge
                                                        level="Easy"
                                                        count={leetcodeStats.easy}
                                                        color="green"
                                                    />
                                                    <DifficultyBadge
                                                        level="Medium"
                                                        count={leetcodeStats.medium}
                                                        color="yellow"
                                                    />
                                                    <DifficultyBadge
                                                        level="Hard"
                                                        count={leetcodeStats.hard}
                                                        color="red"
                                                    />
                                                </div>


                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-300">Could not load LeetCode stats</p>
                                            <button
                                                onClick={() => loadLeetcodeData(leetcodeHandle)}
                                                className="mt-3 px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>

                        {/* Awards & Achievements */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30 shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg">
                                    <Trophy className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Achievements</h2>
                                    <p className="text-sm text-gray-300">Earn badges by completing milestones</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <AchievementBadge
                                    icon={<Medal className="text-yellow-400" size={20} />}
                                    title="Quick Learner"
                                    description="Complete 10 lessons in one week"
                                    achieved={true}
                                    color="yellow"
                                />
                                <AchievementBadge
                                    icon={<Brain className="text-purple-400" size={20} />}
                                    title="Problem Solver"
                                    description="Solve 50+ coding problems"
                                    achieved={leetcodeStats?.totalSolved >= 50}
                                    color="purple"
                                />
                                <AchievementBadge
                                    icon={<Star className="text-cyan-400" size={20} />}
                                    title="Consistency King"
                                    description="7-day learning streak"
                                    achieved={streakData.currentStreak >= 7}
                                    color="cyan"
                                />
                            </div>

                            <button className="w-full mt-6 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all shadow-lg">
                                View All Badges
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Updated Stat Card Component
const StatCard = ({ icon, label, value, color, trend }) => {
    const colorClasses = {
        purple: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30',
        cyan: 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30',
        green: 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30',
        yellow: 'bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/30'
    };

    return (
        <div className={`${colorClasses[color]} backdrop-blur-md rounded-xl p-4 border shadow-lg`}>
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color === 'green' ? 'bg-green-500/20 text-green-400' :
                        color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                            color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                                'bg-purple-500/20 text-purple-400'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-4xl font-bold text-white mb-2">{value}</p>
            <p className="text-base text-gray-300">{label}</p>
        </div>
    );
};

// New Difficulty Badge Component
const DifficultyBadge = ({ level, count, color }) => {
    const colorClasses = {
        green: 'bg-green-500/10 border-green-500/30 text-green-400',
        yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        red: 'bg-red-500/10 border-red-500/30 text-red-400'
    };

    return (
        <div className={`${colorClasses[color]} backdrop-blur-sm border rounded-xl p-4 text-center shadow-lg`}>
            <div className="text-2xl font-bold">{count || 0}</div>
            <div className="text-sm opacity-90">{level}</div>
        </div>
    );
};

// New Achievement Badge Component
const AchievementBadge = ({ icon, title, description, achieved, color }) => {
    const achievedClasses = achieved
        ? {
            purple: 'bg-purple-500/10 border-purple-500/40',
            cyan: 'bg-cyan-500/10 border-cyan-500/40',
            yellow: 'bg-yellow-500/10 border-yellow-500/40'
        }[color]
        : 'bg-white/5 border-white/20 opacity-60';

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm ${achievedClasses} transition-all hover:scale-[1.02]`}>
            <div className={`w-12 h-12 rounded-lg ${achieved ? 'bg-gradient-to-br from-white/10 to-white/5' : 'bg-white/5'
                } flex items-center justify-center shadow-lg`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className={`font-medium ${achieved ? 'text-white' : 'text-gray-400'}`}>{title}</div>
                <div className="text-xs text-gray-300">{description}</div>
            </div>
            {achieved && (
                <CheckCircle size={16} className="text-green-400" />
            )}
        </div>
    );
};

// Updated Course Card Component
const CourseCard = ({ course, progressData, getCourseProgress, navigate }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadProgress = async () => {
            const p = await getCourseProgress(course.courseId);
            setProgress(p);
        };
        loadProgress();
    }, [course.courseId, progressData, getCourseProgress]);

    const courseProgress = progressData[course.courseId];
    const completedCount = courseProgress?.completedLessons?.length || 0;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            onClick={() => navigate(`/course/${course.courseId}`)}
            className="group bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md hover:from-white/10 hover:to-white/15 rounded-xl p-4 border border-white/20 hover:border-neon-cyan/40 cursor-pointer transition-all shadow-lg hover:shadow-neon-cyan/10"
        >
            <div className="flex items-start gap-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-lg blur-sm"></div>
                    <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center">
                        <BookOpen size={20} className="text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white truncate group-hover:text-neon-cyan transition-colors">
                            {course.courseTitle}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                            {course.difficulty}
                        </span>
                    </div>
                    <p className="text-xs text-gray-300 mb-3">
                        {completedCount > 0 ? `${completedCount} lessons completed` : 'Not started yet'}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <ProgressBar
                                progress={progress}
                                color="purple"
                                size="sm"
                                animated={false}
                                showLabel={false}
                            />
                        </div>
                        <span className="text-xs font-bold text-white whitespace-nowrap">{progress}%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;