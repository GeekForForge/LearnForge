import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Users, Star, Book, Code, 
  Share2, Bookmark, Github, ChevronRight, 
  FileText, Save, Edit3
} from 'lucide-react';
import ApiService from '../services/api';

const CourseDetailPage = ({ setCurrentPage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    setCurrentPage('course-detail');
    fetchCourseDetail();
    fetchLessons();
  }, [setCurrentPage, id]);

  useEffect(() => {
    // Load notes for selected lesson from localStorage
    if (selectedLesson) {
      const savedNotes = localStorage.getItem(`notes_${id}_${selectedLesson.lessonId}`);
      setNotes(savedNotes || '');
    }
  }, [selectedLesson, id]);

  const fetchCourseDetail = async () => {
    try {
      const courseData = await ApiService.getCourseById(id);
      if (courseData) {
        setCourse(courseData);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      console.error('❌ Error fetching course:', err);
      setError('Failed to load course details');
    }
  };

  const fetchLessons = async () => {
    try {
      const lessonsData = await ApiService.getLessonsByCourse(id);
      setLessons(lessonsData);
      
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (err) {
      console.error('❌ Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const saveNotes = () => {
    if (selectedLesson) {
      localStorage.setItem(`notes_${id}_${selectedLesson.lessonId}`, notes);
      setIsSavingNotes(true);
      setTimeout(() => setIsSavingNotes(false), 1500);
    }
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: course.courseTitle,
        text: course.courseDescription,
        url: window.location.href
      });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-3/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-white/10 rounded-xl"></div>
              </div>
              <div className="h-96 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !course) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Book size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg"
          >
            Browse Courses
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <button onClick={() => navigate('/')} className="hover:text-neon-cyan transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/courses')} className="hover:text-neon-cyan transition-colors">
              Courses
            </button>
            <span>/</span>
            <span className="text-white">{course.courseTitle}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty || 'Beginner'}
                </span>
                <span className="text-neon-cyan text-sm">📁 {course.category}</span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={shareContent}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Share2 size={16} className="text-gray-400" />
                  </button>
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                    <Bookmark size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-orbitron font-bold text-white mb-4">
                {course.courseTitle}
              </h1>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {course.courseDescription}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-white">{course.rating || '4.9'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{course.duration || '12 weeks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{lessons.length} lessons</span>
                </div>
              </div>
            </motion.div>

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              {selectedLesson && selectedLesson.videoUrl ? (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {selectedLesson.lessonName}
                  </h3>
                  
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-white/10">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedLesson.videoUrl)}`}
                      title={selectedLesson.lessonName}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <Clock size={14} />
                    <span>{selectedLesson.duration}</span>
                  </div>

                  {/* Lesson Resources */}
                  {(selectedLesson.githubUrl || selectedLesson.leetcodeUrl) && (
                    <div className="flex gap-3">
                      {selectedLesson.githubUrl && (
                        <a
                          href={selectedLesson.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Github size={18} />
                          <span className="font-medium">View Code</span>
                        </a>
                      )}
                      {selectedLesson.leetcodeUrl && (
                        <a
                          href={selectedLesson.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Code size={18} />
                          <span className="font-medium">Practice</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Play size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">No lessons available yet</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Notes Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Edit3 size={20} className="text-neon-cyan" />
                  Quick Notes
                </h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveNotes}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    isSavingNotes 
                      ? 'bg-green-500 text-white' 
                      : 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30'
                  }`}
                >
                  <Save size={14} />
                  {isSavingNotes ? 'Saved!' : 'Save'}
                </motion.button>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes while learning... (auto-saved per lesson)"
                className="w-full h-48 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Notes are saved locally for each lesson
              </p>
            </motion.div>

            {/* Course Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Book size={20} />
                Course Content
              </h4>

              {lessons.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.lessonId}
                      whileHover={{ x: 2 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedLesson?.lessonId === lesson.lessonId
                          ? 'bg-neon-purple/20 border border-neon-purple/40'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedLesson?.lessonId === lesson.lessonId
                            ? 'bg-neon-purple'
                            : 'bg-white/10'
                        }`}>
                          <Play size={12} className="text-white ml-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400">Lesson {index + 1}</span>
                            {lesson.githubUrl && <Github size={10} className="text-gray-400" />}
                            {lesson.leetcodeUrl && <Code size={10} className="text-orange-400" />}
                          </div>
                          <h5 className="text-white text-sm font-medium truncate">
                            {lesson.lessonName}
                          </h5>
                          <p className="text-gray-400 text-xs">{lesson.duration}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm">No lessons available</p>
                </div>
              )}
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
