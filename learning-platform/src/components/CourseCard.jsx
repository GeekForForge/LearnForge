import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, Award } from 'lucide-react';
import ApiService from '../services/api';

const CourseCard = ({ course, index }) => {
  const [lessonCount, setLessonCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessonCount();
  }, [course.courseId]);

  const fetchLessonCount = async () => {
    try {
      const lessons = await ApiService.getLessonsByCourse(course.courseId);
      setLessonCount(lessons.length);
    } catch (error) {
      console.error('Error fetching lesson count:', error);
      setLessonCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total duration from lessons (if available)
  const calculateTotalDuration = () => {
    if (course.duration) return course.duration;
    return 'Self-paced';
  };

  // Format rating
  const formatRating = () => {
    return course.rating ? course.rating.toFixed(1) : '5.0';
  };

  // Format students count
  const formatStudents = () => {
    if (!course.students) return 'New Course';
    if (course.students >= 1000) {
      return `${(course.students / 1000).toFixed(1)}K students`;
    }
    return `${course.students} students`;
  };

  // Get difficulty badge color
  const getDifficultyColor = () => {
    switch (course.difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  // Mock progress (you can replace this with real user progress data)
  const userProgress = 0; // Replace with actual user progress from backend

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group h-full"
    >
      <Link to={`/course/${course.courseId}`}>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-neon-purple/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-neon-purple/20 h-full flex flex-col">
          
          {/* Course Header - Category & Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs font-semibold rounded-full border border-neon-purple/30">
                📁 {course.category}
              </span>
              {course.difficulty && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor()}`}>
                  {course.difficulty}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-300 font-medium">{formatRating()}</span>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">
            {course.courseTitle}
          </h3>

          {/* Course Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
            {course.courseDescription}
          </p>

          {/* Instructor (if available) */}
          {course.instructor && (
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
              <Award size={14} className="text-neon-cyan" />
              <span>By {course.instructor}</span>
            </div>
          )}

          {/* Course Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4 flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <Clock size={14} className="text-neon-purple" />
              <span>{calculateTotalDuration()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} className="text-neon-cyan" />
              <span>{formatStudents()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen size={14} className="text-neon-pink" />
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
              )}
            </div>
          </div>

          {/* Progress Bar (Show only if user has started) */}
          {userProgress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Your Progress</span>
                <span className="text-xs text-neon-cyan font-semibold">{userProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${userProgress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </motion.div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-purple/30 mt-auto"
          >
            {userProgress > 0 ? 'Continue Learning' : 'Start Learning'}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
