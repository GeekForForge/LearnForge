import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Link to={`/course/${course.courseId}`}>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-neon-purple/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-neon-purple/20 h-full">
          
          {/* Course Category Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs font-semibold rounded-full">
              {course.category}
            </span>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-300">4.9</span>
            </div>
          </div>

          {/* Course Title - Using courseTitle from backend */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">
            {course.courseTitle}
          </h3>

          {/* Course Description - Using courseDescription from backend */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {course.courseDescription}
          </p>

          {/* Course Stats - Using mock data since backend doesn't have these yet */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>12 weeks</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>25.3K students</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen size={14} />
              <span>5 lessons</span>
            </div>
          </div>

          {/* Progress Bar (Mock) */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Progress</span>
              <span className="text-xs text-neon-cyan">40%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-purple/30"
          >
            Continue Learning
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
