import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import ProgressBar from './ProgressBar';

const ProfileCard = ({ user }) => {
  const achievements = [
    { id: 1, title: 'First Course', icon: Trophy, color: 'from-yellow-500 to-orange-500', earned: true },
    { id: 2, title: 'Week Streak', icon: Calendar, color: 'from-green-500 to-emerald-500', earned: true },
    { id: 3, title: 'Fast Learner', icon: TrendingUp, color: 'from-blue-500 to-cyan-500', earned: false },
    { id: 4, title: 'Goal Crusher', icon: Target, color: 'from-purple-500 to-pink-500', earned: false },
  ];

  const stats = [
    { label: 'Courses Completed', value: user.coursesCompleted, icon: Trophy },
    { label: 'Hours Learned', value: user.hoursLearned, icon: Clock },
    { label: 'Current Streak', value: `${user.streak} days`, icon: Calendar },
    { label: 'Skill Level', value: user.skillLevel, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-cyan/10" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan p-1"
              >
                <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center">
                  <span className="text-3xl font-orbitron font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </motion.div>
              
              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-dark-800 shadow-green-400/50 shadow-lg" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
                {user.name}
              </h2>
              <p className="text-gray-400 mb-2">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
              
              {/* Level Badge */}
              <div className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full text-white font-medium">
                <TrendingUp size={16} className="mr-2" />
                Level {user.level} Developer
              </div>
            </div>

            {/* Overall Progress Circle */}
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative w-32 h-32"
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: user.overallProgress / 100 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * user.overallProgress) / 100}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.overallProgress}%</div>
                    <div className="text-xs text-gray-400">Overall</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-center group hover:border-white/20 transition-all duration-300"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center group-hover:shadow-neon-purple/30 group-hover:shadow-lg transition-all">
              <stat.icon size={24} className="text-neon-cyan" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
      >
        <h3 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center space-x-2">
          <Trophy size={24} className="text-yellow-400" />
          <span>Achievements</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                achievement.earned
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-white/5 border border-white/10 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${achievement.color} p-0.5`}>
                <div className={`w-full h-full rounded-lg ${achievement.earned ? 'bg-transparent' : 'bg-dark-800'} flex items-center justify-center`}>
                  <achievement.icon size={20} className={achievement.earned ? 'text-white' : 'text-gray-600'} />
                </div>
              </div>
              <div className={`text-sm font-medium ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                {achievement.title}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Current Courses Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
      >
        <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
          Course Progress
        </h3>
        
        <div className="space-y-6">
          {user.currentCourses.map((course, index) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{course.title}</h4>
                <span className="text-sm text-gray-400">{course.progress}%</span>
              </div>
              <ProgressBar 
                progress={course.progress} 
                color={index % 2 === 0 ? 'purple' : 'cyan'}
                size="md"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;