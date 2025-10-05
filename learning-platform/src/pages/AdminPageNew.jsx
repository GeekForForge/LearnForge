import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, Edit, Trash2, Save, X,
    Code, Github, BookOpen, ExternalLink,
    ChevronUp, ChevronDown, Eye, Settings,
    AlertCircle
} from 'lucide-react';
import ApiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminPageNew = ({ setCurrentPage }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'lessons', 'resources'
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    // Course form state
    const [courseForm, setCourseForm] = useState({
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
    const [lessonForm, setLessonForm] = useState({
        lessonName: '',
        videoUrl: '',
        duration: '',
        courseId: null
    });

    // Resource form state
    const [resourceForm, setResourceForm] = useState({
        resourceType: 'LEETCODE',
        resourceUrl: '',
        resourceTitle: '',
        displayOrder: 1
    });

    // Resources for selected lesson
    const [lessonResources, setLessonResources] = useState([]);

    useEffect(() => {
        setCurrentPage('admin');
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessonsForCourse = async (courseId) => {
        try {
            const data = await ApiService.getLessonsByCourse(courseId);
            console.log('📚 Lessons fetched:', data);
            setLessons(data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const fetchResourcesForLesson = async (courseId, lessonId) => {
        try {
            const data = await ApiService.getResourcesByLesson(courseId, lessonId);
            console.log('🔗 Resources fetched:', data);
            setLessonResources(data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    // ========================================
    // COURSE CRUD OPERATIONS
    // ========================================

    const handleCreateCourse = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseForm)
            });

            if (response.ok) {
                alert('✅ Course created successfully!');
                fetchCourses();
                setShowCourseModal(false);
                resetCourseForm();
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('❌ Failed to create course');
        }
    };

    const handleUpdateCourse = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/courses/${editingCourse.courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseForm)
            });

            if (response.ok) {
                alert('✅ Course updated successfully!');
                fetchCourses();
                setShowCourseModal(false);
                setEditingCourse(null);
                resetCourseForm();
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('❌ Failed to update course');
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('✅ Course deleted successfully!');
                fetchCourses();
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('❌ Failed to delete course');
        }
    };

    // ========================================
    // LESSON CRUD OPERATIONS
    // ========================================

    const handleCreateLesson = async () => {
        if (!selectedCourse) {
            alert('Please select a course first');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/courses/${selectedCourse.courseId}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lessonForm)
            });

            if (response.ok) {
                alert('✅ Lesson created successfully!');
                fetchLessonsForCourse(selectedCourse.courseId);
                setShowLessonModal(false);
                resetLessonForm();
            }
        } catch (error) {
            console.error('Error creating lesson:', error);
            alert('❌ Failed to create lesson');
        }
    };

    const handleUpdateLesson = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/courses/${selectedCourse.courseId}/lessons/${editingLesson.lessonId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(lessonForm)
                }
            );

            if (response.ok) {
                alert('✅ Lesson updated successfully!');
                fetchLessonsForCourse(selectedCourse.courseId);
                setShowLessonModal(false);
                setEditingLesson(null);
                resetLessonForm();
            }
        } catch (error) {
            console.error('Error updating lesson:', error);
            alert('❌ Failed to update lesson');
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/courses/${selectedCourse.courseId}/lessons/${lessonId}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                alert('✅ Lesson deleted successfully!');
                fetchLessonsForCourse(selectedCourse.courseId);
            }
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert('❌ Failed to delete lesson');
        }
    };

    // ========================================
    // RESOURCE CRUD OPERATIONS
    // ========================================

    const handleCreateResource = async () => {
        if (!selectedLesson) {
            alert('Please select a lesson first');
            return;
        }

        // Validate resource limits
        const leetcodeCount = lessonResources.filter(r => r.resourceType === 'LEETCODE').length;
        const githubCount = lessonResources.filter(r => r.resourceType === 'GITHUB').length;
        const gfgCount = lessonResources.filter(r => r.resourceType === 'GFG').length;

        if (resourceForm.resourceType === 'LEETCODE' && leetcodeCount >= 3) {
            alert('⚠️ Maximum 3 LeetCode links allowed per lesson');
            return;
        }
        if (resourceForm.resourceType === 'GITHUB' && githubCount >= 1) {
            alert('⚠️ Maximum 1 GitHub link allowed per lesson');
            return;
        }
        if (resourceForm.resourceType === 'GFG' && gfgCount >= 1) {
            alert('⚠️ Maximum 1 GFG link allowed per lesson');
            return;
        }

        try {
            const resource = await ApiService.addResourceToLesson(
                selectedCourse.courseId,
                selectedLesson.lessonId,
                resourceForm
            );

            console.log('✅ Resource created:', resource);
            alert('✅ Resource added successfully!');
            fetchResourcesForLesson(selectedCourse.courseId, selectedLesson.lessonId);
            setShowResourceModal(false);
            resetResourceForm();
        } catch (error) {
            console.error('Error creating resource:', error);
            alert('❌ Failed to add resource');
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            await ApiService.deleteResource(
                selectedCourse.courseId,
                selectedLesson.lessonId,
                resourceId
            );

            alert('✅ Resource deleted successfully!');
            fetchResourcesForLesson(selectedCourse.courseId, selectedLesson.lessonId);
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('❌ Failed to delete resource');
        }
    };

    // ========================================
    // FORM RESET HELPERS
    // ========================================

    const resetCourseForm = () => {
        setCourseForm({
            courseTitle: '',
            courseDescription: '',
            category: '',
            difficulty: 'Beginner',
            instructor: '',
            duration: '',
            students: 0,
            rating: 4.0
        });
    };

    const resetLessonForm = () => {
        setLessonForm({
            lessonName: '',
            videoUrl: '',
            duration: '',
            courseId: null
        });
    };

    const resetResourceForm = () => {
        setResourceForm({
            resourceType: 'LEETCODE',
            resourceUrl: '',
            resourceTitle: '',
            displayOrder: lessonResources.length + 1
        });
    };

    // ========================================
    // MODAL HANDLERS
    // ========================================

    const openCreateCourseModal = () => {
        resetCourseForm();
        setEditingCourse(null);
        setShowCourseModal(true);
    };

    const openEditCourseModal = (course) => {
        setCourseForm({
            courseTitle: course.courseTitle,
            courseDescription: course.courseDescription,
            category: course.category,
            difficulty: course.difficulty,
            instructor: course.instructor,
            duration: course.duration,
            students: course.students,
            rating: course.rating
        });
        setEditingCourse(course);
        setShowCourseModal(true);
    };

    const openCreateLessonModal = () => {
        if (!selectedCourse) {
            alert('Please select a course first');
            return;
        }
        resetLessonForm();
        setEditingLesson(null);
        setShowLessonModal(true);
    };

    const openEditLessonModal = (lesson) => {
        setLessonForm({
            lessonName: lesson.lessonName,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            courseId: selectedCourse.courseId
        });
        setEditingLesson(lesson);
        setShowLessonModal(true);
    };

    const openResourceModal = (lesson) => {
        setSelectedLesson(lesson);
        fetchResourcesForLesson(selectedCourse.courseId, lesson.lessonId);
        resetResourceForm();
        setShowResourceModal(true);
    };

    const getResourceIcon = (type) => {
        switch(type) {
            case 'LEETCODE': return <Code className="text-orange-400" size={20} />;
            case 'GITHUB': return <Github className="text-white" size={20} />;
            case 'GFG': return <BookOpen className="text-green-400" size={20} />;
            default: return <ExternalLink size={20} />;
        }
    };

    const getResourceColor = (type) => {
        switch(type) {
            case 'LEETCODE': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
            case 'GITHUB': return 'bg-gray-700/50 border-gray-600 text-white';
            case 'GFG': return 'bg-green-500/10 border-green-500/30 text-green-400';
            default: return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-gray-400">
                        Welcome back, <span className="text-neon-cyan font-semibold">{user?.username}</span>!
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'courses'
                                ? 'bg-neon-purple text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        Courses ({courses.length})
                    </button>
                    <button
                        onClick={() => {
                            if (!selectedCourse) {
                                alert('Select a course first');
                                return;
                            }
                            setActiveTab('lessons');
                            fetchLessonsForCourse(selectedCourse.courseId);
                        }}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'lessons'
                                ? 'bg-neon-purple text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        Lessons {selectedCourse && `(${lessons.length})`}
                    </button>
                </div>

                {/* COURSES TAB */}
                {activeTab === 'courses' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Manage Courses</h2>
                            <button
                                onClick={openCreateCourseModal}
                                className="px-6 py-3 bg-neon-cyan text-white rounded-xl font-semibold hover:bg-neon-cyan/80 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Create Course
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.courseId}
                                    className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border transition-all cursor-pointer ${
                                        selectedCourse?.courseId === course.courseId
                                            ? 'border-neon-cyan'
                                            : 'border-white/10 hover:border-white/20'
                                    }`}
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <h3 className="text-xl font-bold text-white mb-2">{course.courseTitle}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.courseDescription}</p>

                                    <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                                        <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs font-semibold rounded-full">
                      {course.difficulty}
                    </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditCourseModal(course);
                                            }}
                                            className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCourse(course.courseId);
                                            }}
                                            className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* LESSONS TAB */}
                {activeTab === 'lessons' && selectedCourse && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Manage Lessons</h2>
                                <p className="text-gray-400">Course: {selectedCourse.courseTitle}</p>
                            </div>
                            <button
                                onClick={openCreateLessonModal}
                                className="px-6 py-3 bg-neon-cyan text-white rounded-xl font-semibold hover:bg-neon-cyan/80 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Create Lesson
                            </button>
                        </div>

                        <div className="space-y-4">
                            {lessons.map((lesson, index) => (
                                <div
                                    key={lesson.lessonId}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-white/10 rounded-lg text-sm font-bold text-gray-400">
                          #{index + 1}
                        </span>
                                                <h3 className="text-xl font-bold text-white">{lesson.lessonName}</h3>
                                            </div>

                                            <p className="text-gray-400 text-sm mb-3">
                                                📹 Video: {lesson.videoUrl || 'No video URL'}
                                            </p>
                                            <p className="text-gray-400 text-sm mb-4">
                                                ⏱️ Duration: {lesson.duration}
                                            </p>

                                            {/* Resources Display */}
                                            {lesson.resources && lesson.resources.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-400 mb-2">
                                                        📎 Resources: {lesson.resources.length}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {lesson.resources.map((resource) => (
                                                            <span
                                                                key={resource.id}
                                                                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getResourceColor(resource.resourceType)}`}
                                                            >
                                {resource.resourceType}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => openResourceModal(lesson)}
                                                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
                                            >
                                                <Settings size={16} />
                                                Resources
                                            </button>
                                            <button
                                                onClick={() => openEditLessonModal(lesson)}
                                                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2"
                                            >
                                                <Edit size={16} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.lessonId)}
                                                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* COURSE MODAL */}
                {showCourseModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-dark-800 rounded-2xl p-8 max-w-2xl w-full border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCourseModal(false);
                                        setEditingCourse(null);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Course Title</label>
                                    <input
                                        type="text"
                                        value={courseForm.courseTitle}
                                        onChange={(e) => setCourseForm({...courseForm, courseTitle: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                        placeholder="e.g., Complete Web Development Bootcamp"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                                    <textarea
                                        value={courseForm.courseDescription}
                                        onChange={(e) => setCourseForm({...courseForm, courseDescription: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan h-32 resize-none"
                                        placeholder="Course description..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                                        <input
                                            type="text"
                                            value={courseForm.category}
                                            onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                            placeholder="e.g., Web Development"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty</label>
                                        <select
                                            value={courseForm.difficulty}
                                            onChange={(e) => setCourseForm({...courseForm, difficulty: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Instructor</label>
                                        <input
                                            type="text"
                                            value={courseForm.instructor}
                                            onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                            placeholder="Instructor name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                                        <input
                                            type="text"
                                            value={courseForm.duration}
                                            onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                            placeholder="e.g., 12 weeks"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => {
                                            setShowCourseModal(false);
                                            setEditingCourse(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}
                                        className="flex-1 px-6 py-3 bg-neon-cyan text-white rounded-xl hover:bg-neon-cyan/80 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={20} />
                                        {editingCourse ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* LESSON MODAL */}
                {showLessonModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-dark-800 rounded-2xl p-8 max-w-2xl w-full border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowLessonModal(false);
                                        setEditingLesson(null);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Lesson Name</label>
                                    <input
                                        type="text"
                                        value={lessonForm.lessonName}
                                        onChange={(e) => setLessonForm({...lessonForm, lessonName: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                        placeholder="e.g., Introduction to React"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">YouTube Video URL</label>
                                    <input
                                        type="text"
                                        value={lessonForm.videoUrl}
                                        onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                        placeholder="https://youtu.be/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                                    <input
                                        type="text"
                                        value={lessonForm.duration}
                                        onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                        placeholder="e.g., 15 min"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => {
                                            setShowLessonModal(false);
                                            setEditingLesson(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                                        className="flex-1 px-6 py-3 bg-neon-cyan text-white rounded-xl hover:bg-neon-cyan/80 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={20} />
                                        {editingLesson ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* RESOURCE MODAL */}
                {showResourceModal && selectedLesson && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-dark-800 rounded-2xl p-8 max-w-4xl w-full border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Manage Resources</h2>
                                    <p className="text-gray-400 text-sm">Lesson: {selectedLesson.lessonName}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowResourceModal(false);
                                        setSelectedLesson(null);
                                        setLessonResources([]);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Resource Limits Info */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-300">
                                        <p className="font-semibold mb-1">Resource Limits:</p>
                                        <ul className="space-y-1 text-blue-400">
                                            <li>• Maximum 3 LeetCode problems</li>
                                            <li>• Maximum 1 GitHub repository</li>
                                            <li>• Maximum 1 GeeksforGeeks article</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Add Resource Form */}
                            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4">Add New Resource</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Resource Type</label>
                                        <select
                                            value={resourceForm.resourceType}
                                            onChange={(e) => setResourceForm({...resourceForm, resourceType: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                        >
                                            <option value="LEETCODE">LeetCode Problem</option>
                                            <option value="GITHUB">GitHub Repository</option>
                                            <option value="GFG">GeeksforGeeks Article</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Resource Title</label>
                                        <input
                                            type="text"
                                            value={resourceForm.resourceTitle}
                                            onChange={(e) => setResourceForm({...resourceForm, resourceTitle: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                            placeholder="e.g., Two Sum Problem"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Resource URL</label>
                                        <input
                                            type="text"
                                            value={resourceForm.resourceUrl}
                                            onChange={(e) => setResourceForm({...resourceForm, resourceUrl: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-neon-cyan"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleCreateResource}
                                        className="w-full px-6 py-3 bg-neon-cyan text-white rounded-xl hover:bg-neon-cyan/80 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} />
                                        Add Resource
                                    </button>
                                </div>
                            </div>

                            {/* Existing Resources */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Existing Resources ({lessonResources.length})
                                </h3>

                                {lessonResources.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No resources added yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {lessonResources.map((resource) => (
                                            <div
                                                key={resource.id}
                                                className={`p-4 rounded-xl border flex items-center justify-between ${getResourceColor(resource.resourceType)}`}
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    {getResourceIcon(resource.resourceType)}
                                                    <div>
                                                        <p className="font-semibold">{resource.resourceTitle}</p>
                                                        <p className="text-xs opacity-70 truncate max-w-md">{resource.resourceUrl}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={resource.resourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteResource(resource.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} className="text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageNew;
