import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Plus, Edit, Trash2, Save, X,
    Youtube, Github, Link, FileText,
    ChevronUp, ChevronDown, Eye, BookOpen,
    Users, Star, Clock, Award, Settings,
    Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

const AdminPage = ({ setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Course form state
    const [newCourse, setNewCourse] = useState({
        courseTitle: '',
        courseDescription: '',
        category: '',
        difficulty: 'Beginner',
        instructor: '',
        duration: '',
        students: 0,
        rating: 4.0
    });

    // Lesson form state
    const [newLesson, setNewLesson] = useState({
        lessonName: '',
        videoUrl: '',
        duration: '',
        githubUrl: '',
        leetcodeUrl: '',
        description: '',
        difficulty: 'Beginner'
    });

    const [editingCourse, setEditingCourse] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        setCurrentPage('admin');
        checkAdminAccess();
    }, [setCurrentPage]);

    const checkAdminAccess = async () => {
        try {
            // Check if user is authenticated and has admin role
            if (!isAuthenticated || !user) {
                setIsAdmin(false);
                setCheckingAuth(false);
                return;
            }

            // For demo purposes, check if email contains admin or specific domains
            // In production, this should come from your backend/user role system
            const adminEmails = ['admin@', 'learnforge.com', 'github.com'];
            const isUserAdmin = adminEmails.some(email => user.email?.includes(email));

            setIsAdmin(isUserAdmin);

            if (isUserAdmin) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Error checking admin access:', error);
            setIsAdmin(false);
        } finally {
            setCheckingAuth(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const data = await ApiService.getAllCourses();
            setCourses(data);
            if (data.length > 0 && !selectedCourse) {
                setSelectedCourse(data[0]);
                fetchLessons(data[0].courseId);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async (courseId) => {
        try {
            const lessonsData = await ApiService.getLessonsByCourse(courseId);
            setLessons(lessonsData);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    // Course Management Functions
    const handleCreateCourse = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                fetchCourses();
                setNewCourse({
                    courseTitle: '',
                    courseDescription: '',
                    category: '',
                    difficulty: 'Beginner',
                    instructor: '',
                    duration: '',
                    students: 0,
                    rating: 4.0
                });
                alert('Course created successfully!');
            }
        } catch (error) {
            alert('Error creating course: ' + error.message);
        }
    };

    const handleUpdateCourse = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/courses/${editingCourse.courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCourse)
            });

            if (response.ok) {
                fetchCourses();
                setEditingCourse(null);
                alert('Course updated successfully!');
            }
        } catch (error) {
            alert('Error updating course: ' + error.message);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('⚠️ Delete this course? This will also delete all lessons!')) {
            try {
                await fetch(`http://localhost:8080/api/courses/${courseId}`, {
                    method: 'DELETE'
                });
                fetchCourses();
                if (selectedCourse?.courseId === courseId) {
                    setSelectedCourse(null);
                    setLessons([]);
                }
                alert('Course deleted successfully!');
            } catch (error) {
                alert('Error deleting course: ' + error.message);
            }
        }
    };

    // Lesson Management Functions
    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        fetchLessons(course.courseId);
    };

    const validateYouTubeUrl = (url) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        return regex.test(url);
    };

    const extractVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const handleCreateLesson = async (e) => {
        e.preventDefault();

        if (!selectedCourse) {
            alert('Please select a course first!');
            return;
        }

        if (!validateYouTubeUrl(newLesson.videoUrl)) {
            alert('Please enter a valid YouTube URL!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/courses/${selectedCourse.courseId}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLesson)
            });

            if (response.ok) {
                fetchLessons(selectedCourse.courseId);
                setNewLesson({
                    lessonName: '',
                    videoUrl: '',
                    duration: '',
                    githubUrl: '',
                    leetcodeUrl: '',
                    description: '',
                    difficulty: 'Beginner'
                });
                alert('Lesson created successfully!');
            }
        } catch (error) {
            alert('Error creating lesson: ' + error.message);
        }
    };

    const handleUpdateLesson = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/lessons/${editingLesson.lessonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingLesson)
            });

            if (response.ok) {
                fetchLessons(selectedCourse.courseId);
                setEditingLesson(null);
                alert('Lesson updated successfully!');
            }
        } catch (error) {
            alert('Error updating lesson: ' + error.message);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm('Delete this lesson?')) {
            try {
                await fetch(`http://localhost:8080/api/lessons/${lessonId}`, {
                    method: 'DELETE'
                });
                fetchLessons(selectedCourse.courseId);
                alert('Lesson deleted successfully!');
            } catch (error) {
                alert('Error deleting lesson: ' + error.message);
            }
        }
    };

    const handlePreview = (videoUrl) => {
        const videoId = extractVideoId(videoUrl);
        if (videoId) {
            setPreviewUrl(`https://www.youtube.com/embed/${videoId}`);
        }
    };

    const tabs = [
        { id: 'courses', name: 'Manage Courses', icon: BookOpen },
        { id: 'lessons', name: 'Manage Lessons', icon: Play }
    ];

    // Unauthorized Access Component
    if (checkingAuth) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-dark-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Checking Access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-24 bg-dark-900 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md w-full"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-orbitron font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent mb-8"
                    >
                        LearnForge
                    </motion.div>

                     Unauthorized Message
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4">Unauthorized</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            You don't have admin privileges to access this page.
                        </p>

                        {/* Go Home Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-neon-purple/30 transition-all flex items-center justify-center gap-3"
                        >
                            <Home size={20} />
                            Go Home
                        </motion.button>
                    </div>

                     Additional Info
                    <p className="text-gray-500 text-sm mt-6">
                        If you believe this is an error, please contact your administrator.
                    </p>
                </motion.div>
            </div>
        );
    }

    // Admin Panel Content
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 bg-dark-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mb-4">
                        🎓 LearnForge Admin Panel
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base">Complete control over your learning platform</p>
                </motion.div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 sm:p-2 w-full max-w-md">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all w-1/2 justify-center text-sm sm:text-base ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <tab.icon size={18} className="sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">{tab.name}</span>
                                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Management Tab */}
                {activeTab === 'courses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Add New Course */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6"
                        >
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                <Plus size={20} className="sm:w-6 sm:h-6 text-neon-cyan" />
                                Create New Course
                            </h3>

                            <form onSubmit={handleCreateCourse} className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Course Title *</label>
                                    <input
                                        type="text"
                                        value={newCourse.courseTitle}
                                        onChange={(e) => setNewCourse({...newCourse, courseTitle: e.target.value})}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                        placeholder="e.g., Advanced React Development"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Category *</label>
                                    <div className="relative">
                                        <select
                                            value={newCourse.category}
                                            onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-neon-cyan text-sm sm:text-base"
                                            required
                                        >
                                            <option value="" disabled>Select Category</option>
                                            <option value="Programming">📱 Programming</option>
                                            <option value="Frontend">🎨 Frontend</option>
                                            <option value="Backend">⚙️ Backend</option>
                                            <option value="Data Science">📊 Data Science</option>
                                            <option value="Mobile Development">📱 Mobile Development</option>
                                            <option value="DevOps">🚀 DevOps</option>
                                            <option value="AI/ML">🤖 AI/ML</option>
                                            <option value="Cybersecurity">🔐 Cybersecurity</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Description *</label>
                                    <textarea
                                        value={newCourse.courseDescription}
                                        onChange={(e) => setNewCourse({...newCourse, courseDescription: e.target.value})}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                        rows="3"
                                        placeholder="Describe what students will learn..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Difficulty</label>
                                        <select
                                            value={newCourse.difficulty}
                                            onChange={(e) => setNewCourse({...newCourse, difficulty: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base"
                                        >
                                            <option value="Beginner">🟢 Beginner</option>
                                            <option value="Intermediate">🟡 Intermediate</option>
                                            <option value="Advanced">🔴 Advanced</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Duration</label>
                                        <input
                                            type="text"
                                            value={newCourse.duration}
                                            onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            placeholder="e.g., 12 weeks"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Instructor</label>
                                        <input
                                            type="text"
                                            value={newCourse.instructor}
                                            onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            placeholder="Instructor Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base">Rating</label>
                                        <input
                                            type="number"
                                            value={newCourse.rating}
                                            onChange={(e) => setNewCourse({...newCourse, rating: parseFloat(e.target.value)})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            min="1"
                                            max="5"
                                            step="0.1"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-lg hover:shadow-lg hover:shadow-neon-purple/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <Plus size={18} className="sm:w-5 sm:h-5" />
                                    Create Course
                                </motion.button>
                            </form>
                        </motion.div>

                        {/* Existing Courses List */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6"
                        >
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
                                <BookOpen size={20} className="sm:w-6 sm:h-6 text-neon-pink" />
                                Existing Courses ({courses.length})
                            </h3>

                            <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
                                {courses.map((course) => (
                                    <motion.div
                                        key={course.courseId}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">{course.courseTitle}</h4>
                                                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">{course.courseDescription}</p>
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        fetchLessons(course.courseId);
                                                        setActiveTab('lessons');
                                                    }}
                                                    className="p-1 sm:p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                    title="Manage Lessons"
                                                >
                                                    <Play size={14} className="sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingCourse({...course})}
                                                    className="p-1 sm:p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                                                    title="Edit Course"
                                                >
                                                    <Edit size={14} className="sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCourse(course.courseId)}
                                                    className="p-1 sm:p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                          course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                              course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                      }`}>
                        {course.difficulty}
                      </span>
                                            <span className="text-neon-cyan">📁 {course.category}</span>
                                            <span className="text-gray-400 flex items-center gap-1">
                        <Clock size={10} className="sm:w-3 sm:h-3" />
                                                {course.duration || 'N/A'}
                      </span>
                                            <span className="text-gray-400 flex items-center gap-1">
                        <Star size={10} className="sm:w-3 sm:h-3 text-yellow-400" />
                                                {course.rating || '5.0'}
                      </span>
                                        </div>
                                    </motion.div>
                                ))}

                                {courses.length === 0 && (
                                    <div className="text-center py-8 sm:py-12">
                                        <BookOpen size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                                        <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">No Courses Yet</h4>
                                        <p className="text-gray-400 text-xs sm:text-sm">Create your first course to get started!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Lesson Management Tab */}
                {activeTab === 'lessons' && (
                    <>
                        {/* Course Selection for Lessons */}
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Settings size={20} className="sm:w-6 sm:h-6" />
                                Select Course for Lesson Management
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {courses.map((course) => (
                                    <motion.div
                                        key={course.courseId}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleCourseSelect(course)}
                                        className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all ${
                                            selectedCourse?.courseId === course.courseId
                                                ? 'bg-neon-purple/20 border-2 border-neon-purple'
                                                : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                        }`}
                                    >
                                        <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base truncate">{course.courseTitle}</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm">{lessons.filter(l => l.courseId === course.courseId).length} lessons</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {selectedCourse ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                {/* Add New Lesson */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6"
                                >
                                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <Plus size={20} className="sm:w-6 sm:h-6" />
                                        Add New Lesson
                                    </h3>

                                    <form onSubmit={handleCreateLesson} className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Lesson Name *</label>
                                            <input
                                                type="text"
                                                value={newLesson.lessonName}
                                                onChange={(e) => setNewLesson({...newLesson, lessonName: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                placeholder="e.g., Introduction to React Hooks"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">YouTube URL *</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={newLesson.videoUrl}
                                                    onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
                                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handlePreview(newLesson.videoUrl)}
                                                    className="px-3 sm:px-4 py-2 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                                                >
                                                    <Eye size={14} className="sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">Preview</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Duration</label>
                                                <input
                                                    type="text"
                                                    value={newLesson.duration}
                                                    onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                    placeholder="e.g., 15:30"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Difficulty</label>
                                                <select
                                                    value={newLesson.difficulty}
                                                    onChange={(e) => setNewLesson({...newLesson, difficulty: e.target.value})}
                                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                >
                                                    <option value="Beginner">🟢 Beginner</option>
                                                    <option value="Intermediate">🟡 Intermediate</option>
                                                    <option value="Advanced">🔴 Advanced</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">GitHub Repository</label>
                                            <input
                                                type="url"
                                                value={newLesson.githubUrl}
                                                onChange={(e) => setNewLesson({...newLesson, githubUrl: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">LeetCode Problem</label>
                                            <input
                                                type="url"
                                                value={newLesson.leetcodeUrl}
                                                onChange={(e) => setNewLesson({...newLesson, leetcodeUrl: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                placeholder="https://leetcode.com/problems/..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Description</label>
                                            <textarea
                                                value={newLesson.description}
                                                onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                rows="3"
                                                placeholder="What will students learn in this lesson?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                                        >
                                            <Plus size={18} className="sm:w-5 sm:h-5" />
                                            Add Lesson
                                        </button>
                                    </form>
                                </motion.div>

                                {/* Manage Existing Lessons */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6"
                                >
                                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileText size={20} className="sm:w-6 sm:h-6" />
                                        Manage Lessons ({lessons.length})
                                    </h3>

                                    <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
                                        {lessons.map((lesson, index) => (
                                            <motion.div
                                                key={lesson.lessonId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white/5 rounded-lg p-3 sm:p-4"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-white font-medium text-sm sm:text-base truncate">{lesson.lessonName}</h4>
                                                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                                                        <button
                                                            onClick={() => handlePreview(lesson.videoUrl)}
                                                            className="p-1 sm:p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                                            title="Preview Video"
                                                        >
                                                            <Youtube size={14} className="sm:w-4 sm:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingLesson({...lesson})}
                                                            className="p-1 sm:p-2 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                                                            title="Edit Lesson"
                                                        >
                                                            <Edit size={14} className="sm:w-4 sm:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLesson(lesson.lessonId)}
                                                            className="p-1 sm:p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                                            title="Delete Lesson"
                                                        >
                                                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                                                    <span>⏱️ {lesson.duration}</span>
                                                    {lesson.githubUrl && (
                                                        <a href={lesson.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                                            <Github size={12} className="sm:w-3 sm:h-3" /> Code
                                                        </a>
                                                    )}
                                                    {lesson.leetcodeUrl && (
                                                        <a href={lesson.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                                                            <Link size={12} className="sm:w-3 sm:h-3" /> LeetCode
                                                        </a>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {lessons.length === 0 && (
                                            <div className="text-center py-6 sm:py-8">
                                                <p className="text-gray-400 text-sm sm:text-base">No lessons yet for this course</p>
                                                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Add your first lesson above!</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <Play size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
                                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">No Course Selected</h3>
                                <p className="text-gray-400 text-xs sm:text-sm">Please select a course above to manage its lessons</p>
                            </div>
                        )}
                    </>
                )}

                {/* Edit Course Modal */}
                {editingCourse && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Edit size={20} className="sm:w-6 sm:h-6" />
                                    Edit Course
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Course Title</label>
                                        <input
                                            type="text"
                                            value={editingCourse.courseTitle}
                                            onChange={(e) => setEditingCourse({...editingCourse, courseTitle: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Description</label>
                                        <textarea
                                            value={editingCourse.courseDescription}
                                            onChange={(e) => setEditingCourse({...editingCourse, courseDescription: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Category</label>
                                            <select
                                                value={editingCourse.category}
                                                onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            >
                                                <option value="Programming">📱 Programming</option>
                                                <option value="Frontend">🎨 Frontend</option>
                                                <option value="Backend">⚙️ Backend</option>
                                                <option value="Data Science">📊 Data Science</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Difficulty</label>
                                            <select
                                                value={editingCourse.difficulty}
                                                onChange={(e) => setEditingCourse({...editingCourse, difficulty: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            >
                                                <option value="Beginner">🟢 Beginner</option>
                                                <option value="Intermediate">🟡 Intermediate</option>
                                                <option value="Advanced">🔴 Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                                        <button
                                            onClick={handleUpdateCourse}
                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                                        >
                                            <Save size={14} className="sm:w-4 sm:h-4" />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditingCourse(null)}
                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                                        >
                                            <X size={14} className="sm:w-4 sm:h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Lesson Modal */}
                {editingLesson && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                    <Edit size={20} className="sm:w-6 sm:h-6" />
                                    Edit Lesson
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Lesson Name</label>
                                        <input
                                            type="text"
                                            value={editingLesson.lessonName}
                                            onChange={(e) => setEditingLesson({...editingLesson, lessonName: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">YouTube URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={editingLesson.videoUrl}
                                                onChange={(e) => setEditingLesson({...editingLesson, videoUrl: e.target.value})}
                                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handlePreview(editingLesson.videoUrl)}
                                                className="px-3 sm:px-4 py-2 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1 text-sm sm:text-base"
                                            >
                                                <Eye size={14} className="sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Duration</label>
                                            <input
                                                type="text"
                                                value={editingLesson.duration}
                                                onChange={(e) => setEditingLesson({...editingLesson, duration: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                                placeholder="e.g., 15:30"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Difficulty</label>
                                            <select
                                                value={editingLesson.difficulty}
                                                onChange={(e) => setEditingLesson({...editingLesson, difficulty: e.target.value})}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            >
                                                <option value="Beginner">🟢 Beginner</option>
                                                <option value="Intermediate">🟡 Intermediate</option>
                                                <option value="Advanced">🔴 Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">GitHub Repository</label>
                                        <input
                                            type="url"
                                            value={editingLesson.githubUrl || ''}
                                            onChange={(e) => setEditingLesson({...editingLesson, githubUrl: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">LeetCode Problem</label>
                                        <input
                                            type="url"
                                            value={editingLesson.leetcodeUrl || ''}
                                            onChange={(e) => setEditingLesson({...editingLesson, leetcodeUrl: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            placeholder="https://leetcode.com/problems/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Description</label>
                                        <textarea
                                            value={editingLesson.description || ''}
                                            onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-neon-cyan focus:outline-none text-sm sm:text-base"
                                            rows="3"
                                            placeholder="What will students learn in this lesson?"
                                        />
                                    </div>

                                    <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                                        <button
                                            onClick={handleUpdateLesson}
                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                                        >
                                            <Save size={14} className="sm:w-4 sm:h-4" />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditingLesson(null)}
                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                                        >
                                            <X size={14} className="sm:w-4 sm:h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Preview Modal */}
                {previewUrl && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-dark-800 rounded-xl max-w-4xl w-full">
                            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-white/10">
                                <h3 className="text-lg sm:text-xl font-semibold text-white">Video Preview</h3>
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="p-1 sm:p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="aspect-video">
                                    <iframe
                                        src={previewUrl}
                                        title="Video Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full rounded-lg"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;