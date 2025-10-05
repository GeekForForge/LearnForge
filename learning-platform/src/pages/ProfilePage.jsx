import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, TrendingUp, Target, Clock, CheckCircle,
    User, Mail, Calendar, Settings, Edit3, ChevronRight, Flame, Trophy
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

    useEffect(() => {
        setCurrentPage('profile');

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        loadProfileData();
    }, [isAuthenticated, setCurrentPage]);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            // Refresh progress data
            await refreshProgress();
            await refreshSummary();

            // Get all courses
            const allCourses = await ApiService.getAllCourses();

            // Filter courses where user has progress
            const coursesWithProgress = allCourses.filter(course =>
                progressData[course.courseId]
            );

            setEnrolledCourses(coursesWithProgress);
            console.log('✅ Enrolled courses:', coursesWithProgress);

            // ✅ Fetch streak data
            if (user && user.userId) {
                try {
                    const streak = await ApiService.getUserStreak(user.userId);
                    setStreakData(streak);
                    console.log('🔥 Streak data:', streak);
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
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-xl">Please login to view profile</p>
                </div>
            </div>
        );
    }

    const calculateOverallProgress = () => {
        if (!summary || !summary.totalLessons) return 0;
        return Math.round((summary.completedLessons / summary.totalLessons) * 100);
    };

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-3xl p-8 mb-8 border border-white/10"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <img
                            src={user.avatarUrl || 'https://via.placeholder.com/120'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-neon-cyan shadow-lg shadow-neon-cyan/30"
                        />

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Overall Progress */}
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

                        {/* Edit Button */}
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium flex items-center gap-2 transition-all border border-white/20"
                        >
                            <Settings size={18} />
                            Settings
                        </button>
                    </div>
                </motion.div>

                {/* ✅ STREAK SECTION - NEW! */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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

                {/* Stats Cards */}
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

                {/* Enrolled Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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
    }, [course.courseId, progressData]);

    const courseProgress = progressData[course.courseId];
    const completedCount = courseProgress?.completedLessons?.length || 0;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/course/${course.courseId}`)}
            className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-neon-cyan/50 cursor-pointer transition-all group"
        >
            {/* Course Header */}
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

            {/* Course Info */}
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

                {/* Progress Bar */}
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
