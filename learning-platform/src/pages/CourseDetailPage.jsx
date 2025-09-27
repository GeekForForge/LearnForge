import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Clock, Users, Star, CheckCircle, 
  Book, Code, Download, Share2, Bookmark 
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

  useEffect(() => {
    setCurrentPage('course-detail');
    fetchCourseDetail();
    fetchLessons();
  }, [setCurrentPage, id]);

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
      console.log('🎯 Lessons loaded:', lessonsData);
      setLessons(lessonsData);
      
      // Set first lesson as selected by default
      if (lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (err) {
      console.error('❌ Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded mb-4 w-3/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-600 rounded-xl mb-6"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-48 bg-gray-600 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <Book size={40} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Course Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg transition-all"
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
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Course Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {course.difficulty || 'Beginner'}
                  </span>
                  <span className="text-neon-cyan text-sm">📁 {course.category}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                  {course.courseTitle}
                </h1>
                
                <p className="text-lg text-gray-300 mb-6">
                  {course.courseDescription}
                </p>

                <div className="flex items-center gap-6 text-gray-400 mb-8">
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
              </div>

              {/* Video Player */}
              <div className="mb-8">
                {selectedLesson && selectedLesson.videoUrl ? (
                  <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {selectedLesson.lessonName}
                    </h3>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedLesson.videoUrl)}`}
                        title={selectedLesson.lessonName}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="mt-4 text-gray-400">
                      <span>Duration: {selectedLesson.duration}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-600 flex items-center justify-center">
                      <Play size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Lessons Yet</h3>
                    <p className="text-gray-400">Lessons will be added soon!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Enrollment Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-neon-cyan mb-2">FREE</div>
                  <p className="text-gray-400 text-sm">Complete access to all content</p>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl hover:shadow-lg transition-all mb-4">
                  Start Learning Now
                </button>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Book size={20} />
                  Course Content
                </h4>
                
                {lessons.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {lessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.lessonId}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedLesson?.lessonId === lesson.lessonId
                            ? 'bg-neon-purple/20 border border-neon-purple/40'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedLesson?.lessonId === lesson.lessonId
                              ? 'bg-neon-purple'
                              : 'bg-white/10'
                          }`}>
                            <Play size={12} className="text-white ml-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-white text-sm font-medium truncate">
                              {lesson.lessonName}
                            </h5>
                            <p className="text-gray-400 text-xs">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm">No lessons available</p>
                    <p className="text-gray-500 text-xs mt-1">Check back later!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
