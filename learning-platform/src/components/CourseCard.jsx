import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

const CourseCard = ({ course, index }) => {
  const difficultyColors = {
    Beginner: 'from-green-500 to-emerald-500',
    Intermediate: 'from-yellow-500 to-orange-500',
    Advanced: 'from-red-500 to-pink-500',
  };

  const difficultyGlow = {
    Beginner: 'shadow-green-500/30',
    Intermediate: 'shadow-yellow-500/30',
    Advanced: 'shadow-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        rotateX: 5,
      }}
      className="group relative"
    >
      <Link to={`/course/${course.id}`} className="block interactive">
        {/* Card Container */}
        <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 tilt-card h-full">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Course Image/Icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan p-0.5">
              <div className="w-full h-full rounded-xl bg-dark-800 flex items-center justify-center">
                <span className="text-2xl font-orbitron font-bold text-white">
                  {course.title.charAt(0)}
                </span>
              </div>
            </div>
            
            {/* Difficulty Badge */}
            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${difficultyColors[course.difficulty]} ${difficultyGlow[course.difficulty]}`}>
              {course.difficulty}
            </div>
          </div>

          {/* Course Content */}
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-neon-cyan transition-colors">
              {course.title}
            </h3>
            
            <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
              {course.description}
            </p>

            {/* Course Stats */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{course.students}k</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <ProgressBar 
                progress={course.progress} 
                color={course.progress > 75 ? 'cyan' : course.progress > 50 ? 'purple' : 'pink'}
                size="sm"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center justify-between text-neon-cyan group-hover:text-neon-purple transition-colors"
            >
              <span className="font-medium">
                {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </span>
              <ArrowRight size={18} />
            </motion.div>
          </div>

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
            <div className="w-full h-full rounded-2xl bg-dark-900" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;