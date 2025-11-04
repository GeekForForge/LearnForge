import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Play, Clock, Book, Code, Github, ArrowLeft,
    CheckCircle, Circle, Save, Edit3, Star, Users, Info, ExternalLink, BookOpen
} from 'lucide-react';
import ApiService from '../services/api';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import axios from 'axios';

const CourseDetailPage = ({ setCurrentPage }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [notes, setNotes] = useState('');
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const [lastWatchedTime, setLastWatchedTime] = useState(0);
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const watchTimeRef = useRef(0);
    const saveIntervalRef = useRef(null);

    const { isAuthenticated, user } = useAuth();
    const {
        progressData,
        markLessonComplete,
        markLessonIncomplete,
        isLessonCompleted,
        getCourseProgress
    } = useProgress();

    const API_BASE_URL = 'http://localhost:8080/api';

    useEffect(() => {
        setCurrentPage('course-detail');
        fetchCourseData();
    }, [id]);

    useEffect(() => {
        if (selectedLesson) {
            const savedNotes = localStorage.getItem(`notes_${id}_${selectedLesson.lessonId}`);
            setNotes(savedNotes || '');
            loadLastWatchedTime();
        }

        return () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
            }
            saveCurrentWatchTime();
        };
    }, [selectedLesson, id]);

    useEffect(() => {
        if (selectedLesson && isAuthenticated) {
            saveIntervalRef.current = setInterval(() => {
                saveCurrentWatchTime();
            }, 10000);

            return () => {
                if (saveIntervalRef.current) {
                    clearInterval(saveIntervalRef.current);
                }
            };
        }
    }, [selectedLesson, isAuthenticated]);

    const fetchCourseData = async () => {
        try {
            console.log('🎯 Fetching course data for ID:', id);

            const [courseData, lessonsData] = await Promise.all([
                ApiService.getCourseById(id),
                ApiService.getLessonsByCourse(id)
            ]);

            console.log('✅ Course data:', courseData);
            console.log('✅ Lessons data:', lessonsData);

            setCourse(courseData);
            setLessons(lessonsData);

            if (lessonsData && lessonsData.length > 0) {
                console.log('🎬 First lesson:', lessonsData[0]);
                console.log('🎬 Video URL:', lessonsData[0].videoUrl);
                console.log('🎬 Resources count:', lessonsData[0].resources?.length || 0);
                setSelectedLesson(lessonsData[0]);
            }

            if (isAuthenticated && user) {
                await getCourseProgress(id);
            }
        } catch (error) {
            console.error('❌ Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ADDED: Fetch detailed lesson data when selected lesson changes
    useEffect(() => {
        const fetchLessonData = async () => {
            if (!selectedLesson || !id) return;

            try {
                const lessonData = await ApiService.getLessonById(id, selectedLesson.lessonId);
                console.log('📦 Detailed lesson data:', lessonData);
                console.log('📦 Resources:', lessonData.resources);

                // Update the selected lesson with detailed data
                setSelectedLesson(prev => ({
                    ...prev,
                    ...lessonData
                }));
            } catch (error) {
                console.error('Error fetching detailed lesson:', error);
            }
        };

        fetchLessonData();
    }, [selectedLesson?.lessonId, id]);

    const loadLastWatchedTime = async () => {
        if (!isAuthenticated || !user || !selectedLesson) return;

        try {
            const response = await axios.get(
                `${API_BASE_URL}/video-progress/get/${user.userId}/${selectedLesson.lessonId}`
            );

            const savedProgress = response.data;

            if (savedProgress.currentTime && savedProgress.currentTime > 10) {
                setLastWatchedTime(savedProgress.currentTime);
                setShowResumePrompt(true);
                console.log('📹 Found saved progress:', Math.floor(savedProgress.currentTime), 'seconds');
            } else {
                setLastWatchedTime(0);
                setShowResumePrompt(false);
            }
        } catch (error) {
            console.error('Error loading video progress:', error);
            setLastWatchedTime(0);
            setShowResumePrompt(false);
        }
    };

    const saveCurrentWatchTime = async () => {
        if (!isAuthenticated || !user || !selectedLesson || watchTimeRef.current < 5) return;

        try {
            await axios.post(`${API_BASE_URL}/video-progress/save`, {
                userId: user.userId,
                lessonId: selectedLesson.lessonId,
                currentTime: watchTimeRef.current,
                duration: null
            });

            console.log('💾 Saved watch time:', Math.floor(watchTimeRef.current), 'seconds');
        } catch (error) {
            console.error('Error saving video progress:', error);
        }
    };

    const updateWatchTime = (seconds) => {
        watchTimeRef.current = seconds;
    };

    const handleLessonToggle = async (lessonId) => {
        if (!isAuthenticated) {
            alert('Please login to track your progress');
            navigate('/login');
            return;
        }

        try {
            const isCompleted = isLessonCompleted(parseInt(id), lessonId);

            if (isCompleted) {
                await markLessonIncomplete(parseInt(id), lessonId);
            } else {
                await markLessonComplete(parseInt(id), lessonId);
            }
        } catch (error) {
            console.error('Error toggling lesson:', error);
            alert('Failed to update progress');
        }
    };

    const calculateProgress = () => {
        if (!isAuthenticated || !lessons || lessons.length === 0) return 0;

        const progress = progressData[id];
        if (!progress || !progress.completedLessons) return 0;

        const completedCount = progress.completedLessons.length;
        const percentage = Math.round((completedCount / lessons.length) * 100);

        return percentage;
    };

    const saveNotes = () => {
        if (selectedLesson) {
            localStorage.setItem(`notes_${id}_${selectedLesson.lessonId}`, notes);
            setIsSavingNotes(true);
            setTimeout(() => setIsSavingNotes(false), 1500);
        }
    };

    // ✅ IMPROVED YouTube Video ID Extraction
    const getYouTubeVideoId = (url) => {
        if (!url) return null;

        console.log('🎬 Extracting video ID from:', url);

        // Handle different YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/  // Direct video ID
        ];

        for (let pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                console.log('✅ Video ID found:', match[1]);
                return match[1];
            }
        }

        console.log('❌ No video ID found in URL');
        return null;
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'Advanced': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading Course...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-xl mb-4">Course not found</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-6 py-2 bg-neon-cyan text-white rounded-xl hover:bg-neon-cyan/80"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const videoId = selectedLesson?.videoUrl ? getYouTubeVideoId(selectedLesson.videoUrl) : null;
    const videoUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?start=${Math.floor(lastWatchedTime)}`
        : null;

    console.log('🎥 Current video ID:', videoId);
    console.log('🎥 Embed URL:', videoUrl);

    return (
        <div className="min-h-screen pt-20 pb-12">
            <div className="container mx-auto px-4 max-w-[1400px]">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/courses')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Courses</span>
                </motion.button>

                {/* Course Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty || 'Beginner'}
            </span>
                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30">
              {course.category}
            </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        {course.courseTitle}
                    </h1>

                    <p className="text-gray-400 text-lg mb-6 max-w-3xl">
                        {course.courseDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-white font-semibold">{course.rating || '4.9'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Users size={16} />
                            <span>{course.students || '1,234'} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock size={16} />
                            <span>{course.duration || '12 weeks'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Book size={16} />
                            <span>{lessons.length} lessons</span>
                        </div>
                    </div>

                    {isAuthenticated && lessons.length > 0 && (
                        <div className="max-w-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Your Progress</span>
                                <span className="text-sm font-bold text-white">{calculateProgress()}%</span>
                            </div>
                            <ProgressBar
                                percentage={calculateProgress()}
                                color="purple"
                                size="md"
                                animated={true}
                                showLabel={false}
                            />
                        </div>
                    )}
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column - Video & Notes (8/12) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Resume Prompt */}
                        {showResumePrompt && lastWatchedTime > 10 && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-4 flex items-center gap-3"
                            >
                                <Info size={20} className="text-neon-cyan flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-white font-semibold">Resume from where you left off?</p>
                                    <p className="text-gray-400 text-sm">
                                        Last watched at {formatTime(lastWatchedTime)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowResumePrompt(false)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors"
                                >
                                    Dismiss
                                </button>
                            </motion.div>
                        )}

                        {/* Video Player */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
                        >
                            {selectedLesson && videoId ? (
                                <>
                                    <div className="aspect-video bg-black">
                                        <iframe
                                            key={`${selectedLesson.lessonId}-${lastWatchedTime}`}
                                            src={videoUrl}
                                            title={selectedLesson.lessonName}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-2">
                                                    {selectedLesson.lessonName}
                                                </h3>
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>{selectedLesson.duration}</span>
                                                    </div>
                                                    {lastWatchedTime > 10 && (
                                                        <span className="text-neon-cyan text-sm font-medium">
                              ▶ Started from {formatTime(lastWatchedTime)}
                            </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isAuthenticated && (
                                                <button
                                                    onClick={() => handleLessonToggle(selectedLesson.lessonId)}
                                                    className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                                                        isLessonCompleted(parseInt(id), selectedLesson.lessonId)
                                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40 hover:bg-green-500/30'
                                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 border-2 border-white/20'
                                                    }`}
                                                >
                                                    {isLessonCompleted(parseInt(id), selectedLesson.lessonId) ? (
                                                        <>
                                                            <CheckCircle size={18} />
                                                            Completed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Circle size={18} />
                                                            Mark Complete
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Manual Time Input */}
                                        {isAuthenticated && (
                                            <div className="bg-white/5 rounded-xl p-4 mb-4">
                                                <p className="text-sm text-gray-400 mb-2">
                                                    📍 Save your current position:
                                                </p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Time in seconds"
                                                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-cyan"
                                                        onChange={(e) => updateWatchTime(parseInt(e.target.value) || 0)}
                                                    />
                                                    <button
                                                        onClick={saveCurrentWatchTime}
                                                        className="px-4 py-2 bg-neon-cyan text-white rounded-lg font-medium hover:bg-neon-cyan/80 transition-colors"
                                                    >
                                                        Save Position
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    💡 Tip: Pause the video and enter the timestamp to save your progress
                                                </p>
                                            </div>
                                        )}

                                        {/* ✅ FIXED Practice Resources Section */}
                                        <div className="bg-gray-800/50 rounded-lg p-6 mt-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Code className="w-5 h-5 text-cyan-400" />
                                                <h3 className="text-lg font-semibold text-white">Practice Resources</h3>
                                            </div>

                                            {selectedLesson?.resources && selectedLesson.resources.length > 0 ? (
                                                <div className="space-y-3">
                                                    {selectedLesson.resources.map((resource) => {
                                                        console.log('🔍 Resource data:', resource); // Debug log

                                                        return (
                                                            <a
                                                                key={resource.id}
                                                                href={resource.url} // ✅ Changed from resource.resourceUrl
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                                                            >
                                                                {/* Icon based on resource type */}
                                                                {resource.type?.toLowerCase() === 'leetcode' && ( // ✅ Changed from resourceType
                                                                    <div className="w-8 h-8 bg-yellow-500/20 rounded flex items-center justify-center">
                                                                        <Code className="w-5 h-5 text-yellow-400" />
                                                                    </div>
                                                                )}
                                                                {resource.type?.toLowerCase() === 'github' && (
                                                                    <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center">
                                                                        <Github className="w-5 h-5 text-purple-400" />
                                                                    </div>
                                                                )}
                                                                {resource.type?.toLowerCase() === 'gfg' && (
                                                                    <div className="w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                                                                        <BookOpen className="w-5 h-5 text-green-400" />
                                                                    </div>
                                                                )}

                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-white">{resource.title}</h4> {/* ✅ Changed from resourceTitle */}
                                                                    {resource.description && (
                                                                        <p className="text-sm text-gray-400 mt-1">{resource.description}</p>
                                                                    )}
                                                                    <p className="text-xs text-cyan-400 mt-1">{resource.type?.toUpperCase()}</p> {/* ✅ Changed from resourceType */}
                                                                </div>

                                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-center py-8">
                                                    No practice resources available for this lesson yet.
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                </>
                            ) : (
                                <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                                    <Play size={64} className="text-gray-500 mb-4" />
                                    <p className="text-gray-400 text-lg">
                                        {selectedLesson ? 'No video available for this lesson' : 'Select a lesson to start learning'}
                                    </p>
                                    {selectedLesson && (
                                        <p className="text-red-400 text-sm mt-2">⚠️ Video URL: {selectedLesson.videoUrl || 'Not found'}</p>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Edit3 size={18} className="text-neon-cyan" />
                                    Quick Notes
                                </h4>
                                <button
                                    onClick={saveNotes}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                                        isSavingNotes
                                            ? 'bg-green-500 text-white'
                                            : 'bg-neon-purple text-white hover:bg-neon-purple/80'
                                    }`}
                                >
                                    <Save size={16} />
                                    {isSavingNotes ? 'Saved!' : 'Save'}
                                </button>
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Take notes while learning... 📝"
                                className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">💡 Notes are saved locally for each lesson</p>
                        </motion.div>
                    </div>

                    {/* Right Column - Course Content (4/12) */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-24"
                        >
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Book size={18} className="text-neon-purple" />
                                Course Content
                                <span className="ml-auto text-sm text-neon-cyan font-semibold">{lessons.length}</span>
                            </h4>

                            {/* ✅ ENHANCED: Scroll container with Lenis compatibility and scroll chaining prevention */}
                            <div
                                className="space-y-2 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar"
                                data-lenis-prevent
                                style={{
                                    overscrollBehavior: 'contain'
                                }}
                            >
                                {lessons.map((lesson, index) => {
                                    const isCompleted = isAuthenticated && isLessonCompleted(parseInt(id), lesson.lessonId);
                                    const isActive = selectedLesson?.lessonId === lesson.lessonId;

                                    return (
                                        <div
                                            key={lesson.lessonId}
                                            onClick={() => setSelectedLesson(lesson)}
                                            className={`group p-4 rounded-xl cursor-pointer transition-all ${
                                                isActive
                                                    ? 'bg-neon-cyan/10 border-2 border-neon-cyan'
                                                    : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {isAuthenticated ? (
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLessonToggle(lesson.lessonId);
                                                        }}
                                                        className="cursor-pointer flex-shrink-0"
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle size={22} className="text-green-400" />
                                                        ) : (
                                                            <Circle size={22} className="text-gray-500 hover:text-gray-300 transition-colors" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                                                        {index + 1}
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-400 mb-1">Lesson {index + 1}</p>
                                                    <p className={`font-semibold text-sm mb-1 leading-snug ${
                                                        isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                                    }`}>
                                                        {lesson.lessonName}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock size={12} />
                                                        <span>{lesson.duration}</span>
                                                        {lesson.resources && lesson.resources.length > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{lesson.resources.length} resources</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {isActive && (
                                                    <Play size={18} className="text-neon-cyan flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8B5CF6, #06B6D4);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7C3AED, #0891B2);
                }
            `}</style>
        </div>
    );
};

export default CourseDetailPage;