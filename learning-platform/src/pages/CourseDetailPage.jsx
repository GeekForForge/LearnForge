import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Book, Code, Github, ArrowLeft, 
  CheckCircle, Circle, Save, Edit3, Star, Users
} from 'lucide-react';
import ApiService from '../services/api';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

const CourseDetailPage = ({ setCurrentPage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { 
    progressData, 
    markLessonComplete, 
    markLessonIncomplete, 
    isLessonCompleted, 
    getCourseProgress 
  } = useProgress();

  useEffect(() => {
    setCurrentPage('course-detail');
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (selectedLesson) {
      const savedNotes = localStorage.getItem(`notes_${id}_${selectedLesson.lessonId}`);
      setNotes(savedNotes || '');
    }
  }, [selectedLesson, id]);

  const fetchCourseData = async () => {
    try {
      const [courseData, lessonsData] = await Promise.all([
        ApiService.getCourseById(id),
        ApiService.getLessonsByCourse(id)
      ]);

      setCourse(courseData);
      setLessons(lessonsData);
      
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }

      if (isAuthenticated && user) {
        await getCourseProgress(id);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonToggle = async (lessonId) => {
    if (!isAuthenticated) {
      alert('Please login to track your progress');
      navigate('/login');
      return;
    }

    try {
      console.log('🔄 Toggling lesson:', lessonId);
      const isCompleted = isLessonCompleted(parseInt(id), lessonId);
      
      if (isCompleted) {
        const success = await markLessonIncomplete(parseInt(id), lessonId);
        console.log('✅ Unmarked:', success);
      } else {
        const success = await markLessonComplete(parseInt(id), lessonId);
        console.log('✅ Marked complete:', success);
      }
    } catch (error) {
      console.error('❌ Error toggling lesson:', error);
      alert('Failed to update progress');
    }
  };

  const calculateProgress = () => {
    if (!isAuthenticated || !lessons || lessons.length === 0) return 0;
    
    const progress = progressData[id];
    if (!progress || !progress.completedLessons) return 0;
    
    const completedCount = progress.completedLessons.length;
    const percentage = Math.round((completedCount / lessons.length) * 100);
    
    console.log('📊 Progress:', completedCount, '/', lessons.length, '=', percentage + '%');
    return percentage;
  };

  const saveNotes = () => {
    if (selectedLesson) {
      localStorage.setItem(`notes_${id}_${selectedLesson.lessonId}`, notes);
      setIsSavingNotes(true);
      setTimeout(() => setIsSavingNotes(false), 1500);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    }
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

  return (
    <div className="min-h-screen pt-20 pb-12 bg-dark-900">
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
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty || 'Beginner'}
            </span>
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30">
              {course.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {course.courseTitle}
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg mb-6 max-w-3xl">
            {course.courseDescription}
          </p>

          {/* Stats */}
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

          {/* Progress Bar */}
         {/* Progress Bar Section */}
{isAuthenticated && lessons.length > 0 && (
  <div className="max-w-md mt-6">
    <ProgressBar 
      percentage={calculateProgress()} 
      color="purple" 
      size="md" 
      animated={true}
      showLabel={true}
    />
  </div>
)}
        </motion.div>

        {/* Main Grid: Video (Left) + Lessons (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Video & Notes (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Player Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
            >
              {selectedLesson && selectedLesson.videoUrl ? (
                <>
                  {/* Video */}
                  <div className="aspect-video bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedLesson.videoUrl)}`}
                      title={selectedLesson.lessonName}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {selectedLesson.lessonName}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock size={16} />
                          <span>{selectedLesson.duration}</span>
                        </div>
                      </div>

                      {/* Mark Complete Button */}
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

                    {/* Resource Links */}
                    {(selectedLesson.githubUrl || selectedLesson.leetcodeUrl) && (
                      <div className="flex gap-3 mt-4">
                        {selectedLesson.githubUrl && (
                          <a
                            href={selectedLesson.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                          >
                            <Github size={20} />
                            View Code
                          </a>
                        )}
                        {selectedLesson.leetcodeUrl && (
                          <a
                            href={selectedLesson.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
                          >
                            <Code size={20} />
                            Practice
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
                  <Play size={64} className="text-gray-500 mb-4" />
                  <p className="text-gray-400 text-lg">Select a lesson to start learning</p>
                </div>
              )}
            </motion.div>

            {/* Quick Notes Card */}
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

              <div className="space-y-2 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
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
                        {/* Checkbox */}
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

                        {/* Lesson Info */}
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
                          </div>
                        </div>

                        {/* Play Icon */}
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

      {/* Custom Scrollbar */}
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
      `}</style>
    </div>
  );
};

export default CourseDetailPage;
