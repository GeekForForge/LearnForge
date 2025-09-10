import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink } from 'lucide-react';
import LessonSidebar from '../components/LessonSidebar';
import ResourceCard from '../components/ResourceCard';
import VideoPlayer from '../components/VideoPlayer';
import ApiService from '../services/api';

const CourseDetailPage = ({ setCurrentPage }) => {
  const { id } = useParams();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentPage('course-detail');
    
    const fetchCourse = async () => {
      try {
        setLoading(true);
        console.log('Fetching course with ID:', id);
        
        // Fetch real course data from backend
        const courseData = await ApiService.getCourseById(id);
        console.log('Fetched course data:', courseData);
        
        // Add mock lessons since backend might not have them yet
        const courseWithLessons = {
          ...courseData,
          lessons: [
            {
              id: 1,
              title: 'Introduction to DSA',
              duration: '15 min',
              type: 'video',
              completed: false,
              sectionId: '1',
              sectionName: 'Getting Started',
              videoId: 'dQw4w9WgXcQ',
              resources: [
                {
                  id: 1,
                  title: 'DSA Cheat Sheet',
                  type: 'article',
                  url: 'https://example.com/cheatsheet',
                  description: 'Comprehensive reference for all data structures'
                },
                {
                  id: 2,
                  title: 'Setup Java Development Environment',
                  type: 'github',
                  url: 'https://github.com/example/java-setup',
                  description: 'Step-by-step guide to setup your coding environment'
                }
              ]
            },
            {
              id: 2,
              title: 'Arrays and Strings',
              duration: '25 min',
              type: 'video',
              completed: false,
              sectionId: '1',
              sectionName: 'Getting Started',
              videoId: 'dQw4w9WgXcQ',
              resources: [
                {
                  id: 3,
                  title: 'Array Manipulation Practice',
                  type: 'github',
                  url: 'https://github.com/example/array-practice',
                  description: 'Collection of array problems with solutions'
                }
              ]
            },
            {
              id: 3,
              title: 'Linked Lists Fundamentals',
              duration: '30 min',
              type: 'video',
              completed: false,
              sectionId: '2',
              sectionName: 'Linear Data Structures',
              videoId: 'dQw4w9WgXcQ',
              resources: [
                {
                  id: 4,
                  title: 'Visualizing Linked Lists',
                  type: 'article',
                  url: 'https://example.com/linkedlist-viz',
                  description: 'Interactive visualization of linked list operations'
                }
              ]
            },
            {
              id: 4,
              title: 'Stacks and Queues',
              duration: '28 min',
              type: 'video',
              completed: false,
              sectionId: '2',
              sectionName: 'Linear Data Structures',
              videoId: 'dQw4w9WgXcQ',
              resources: []
            },
            {
              id: 5,
              title: 'Trees and Binary Trees',
              duration: '35 min',
              type: 'video',
              completed: false,
              sectionId: '3',
              sectionName: 'Tree Data Structures',
              videoId: 'dQw4w9WgXcQ',
              resources: []
            }
          ],
          instructor: 'Sarah Chen',
          duration: '12 weeks',
          students: 25300,
          rating: 4.9
        };
        
        setCourse(courseWithLessons);
        setCurrentLesson(courseWithLessons.lessons[0]);
        
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, setCurrentPage]);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const markLessonComplete = () => {
    if (currentLesson && !currentLesson.completed) {
      setCourse(prev => ({
        ...prev,
        lessons: prev.lessons.map(lesson =>
          lesson.id === currentLesson.id
            ? { ...lesson, completed: true }
            : lesson
        )
      }));
      setCurrentLesson(prev => ({ ...prev, completed: true }));
    }
  };

  const handleVideoPlay = (lessonId) => {
    console.log(`Video played - Lesson ${lessonId}`);
  };

  const handleVideoPause = (lessonId) => {
    console.log(`Video paused - Lesson ${lessonId}`);
  };

  const handleVideoEnd = (lessonId) => {
    console.log(`Video completed - Lesson ${lessonId}`);
    markLessonComplete();
  };

  const handleVideoStateChange = (lessonId, state) => {
    console.log(`Video state changed - Lesson ${lessonId}, State: ${state}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course Not Found</h2>
          <p className="text-gray-400">{error || 'The requested course could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Course Header */}
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
              {course.courseTitle}
            </h1>
            <p className="text-gray-300 mb-4 max-w-3xl">
              {course.courseDescription}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span>Category: <span className="text-neon-cyan">{course.category}</span></span>
              <span>Instructor: <span className="text-neon-cyan">{course.instructor}</span></span>
              <span>{course.duration}</span>
              <span>{course.students?.toLocaleString()} students</span>
              <span>⭐ {course.rating}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 bg-dark-800/50 border-r border-white/10">
          <LessonSidebar
            lessons={course.lessons}
            currentLesson={currentLesson}
            onLessonSelect={handleLessonSelect}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-dark-900">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {currentLesson && (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Lesson Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-white">
                      {currentLesson.title}
                    </h2>
                    {!currentLesson.completed && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={markLessonComplete}
                        className="interactive px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-green-500/30 hover:shadow-lg transition-all flex items-center space-x-2"
                      >
                        <CheckCircle size={20} />
                        <span>Mark Complete</span>
                      </motion.button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{currentLesson.duration}</span>
                    <span className={`px-2 py-1 rounded ${
                      currentLesson.type === 'video' ? 'bg-red-500/20 text-red-400' :
                      currentLesson.type === 'reading' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {currentLesson.type}
                    </span>
                    {currentLesson.completed && (
                      <span className="text-green-400 flex items-center space-x-1">
                        <CheckCircle size={16} />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Video Player */}
                {currentLesson.type === 'video' && (
                  <div className="mb-8">
                    <div className="w-full" style={{ maxWidth: '1000px' }}>
                      <VideoPlayer
                        videoUrl={`https://www.youtube.com/watch?v=${currentLesson?.videoId}`}
                        lessonId={currentLesson?.id}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onEnd={handleVideoEnd}
                        onStateChange={handleVideoStateChange}
                      />
                    </div>
                  </div>
                )}

                {/* Lesson Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                      <ExternalLink size={20} className="text-neon-cyan" />
                      <span>Resources & Links</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {currentLesson.resources.map((resource, index) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Lesson Navigation */}
                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentLesson.id === 1}
                    className="interactive px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                    onClick={() => {
                      const prevLesson = course.lessons.find(l => l.id === currentLesson.id - 1);
                      if (prevLesson) setCurrentLesson(prevLesson);
                    }}
                  >
                    ← Previous Lesson
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentLesson.id === course.lessons.length}
                    className="interactive px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                    onClick={() => {
                      const nextLesson = course.lessons.find(l => l.id === currentLesson.id + 1);
                      if (nextLesson) setCurrentLesson(nextLesson);
                    }}
                  >
                    Next Lesson →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
