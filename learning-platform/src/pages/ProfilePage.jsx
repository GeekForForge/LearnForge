import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit, Download, Share2 } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';

const ProfilePage = ({ setCurrentPage }) => {
  useEffect(() => {
    setCurrentPage('profile');
  }, [setCurrentPage]);

  // Sample user data - in real app, fetch from API/context
  const userData = {
    name: 'Alex Developer',
    email: 'alex@example.com',
    joinDate: '2024-01-15',
    level: 7,
    skillLevel: 'Intermediate',
    coursesCompleted: 12,
    hoursLearned: 156,
    streak: 23,
    overallProgress: 78,
    currentCourses: [
      {
        id: 1,
        title: 'Data Structures & Algorithms in Java',
        progress: 65
      },
      {
        id: 2,
        title: 'React Frontend Development',
        progress: 30
      },
      {
        id: 3,
        title: 'Node.js Backend Development',
        progress: 85
      }
    ]
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Track your learning journey and celebrate your achievements
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="interactive p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all group"
              title="Settings"
            >
              <Settings size={20} className="text-gray-400 group-hover:text-neon-cyan transition-colors" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="interactive p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all group"
              title="Edit Profile"
            >
              <Edit size={20} className="text-gray-400 group-hover:text-neon-purple transition-colors" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="interactive p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all group"
              title="Download Certificate"
            >
              <Download size={20} className="text-gray-400 group-hover:text-neon-pink transition-colors" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="interactive px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-neon-purple/30 hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Share2 size={18} />
              <span>Share Profile</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Profile Content */}
        <ProfileCard user={userData} />

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl"
        >
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {[
              {
                id: 1,
                action: 'Completed lesson',
                target: 'Arrays and Strings',
                course: 'DSA in Java',
                time: '2 hours ago',
                type: 'completion'
              },
              {
                id: 2,
                action: 'Started course',
                target: 'Node.js Backend Development',
                time: '1 day ago',
                type: 'start'
              },
              {
                id: 3,
                action: 'Earned achievement',
                target: 'Week Streak',
                time: '3 days ago',
                type: 'achievement'
              },
              {
                id: 4,
                action: 'Completed course',
                target: 'TypeScript Fundamentals',
                time: '1 week ago',
                type: 'completion'
              }
            ].map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
              >
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'completion' ? 'bg-green-400' :
                  activity.type === 'start' ? 'bg-blue-400' :
                  activity.type === 'achievement' ? 'bg-yellow-400' :
                  'bg-gray-400'
                }`} />
                
                <div className="flex-1">
                  <p className="text-white">
                    <span className="opacity-70">{activity.action}</span>{' '}
                    <span className="font-medium text-neon-cyan">{activity.target}</span>
                    {activity.course && (
                      <span className="opacity-70"> in {activity.course}</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 p-8 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 backdrop-blur-lg border border-white/20 rounded-2xl"
        >
          <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
            Learning Streak 🔥
          </h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({ length: 21 }, (_, i) => {
              const isActive = i < 18; // Mock streak data
              const isToday = i === 17;
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                    isToday
                      ? 'bg-neon-cyan text-dark-900 ring-2 ring-neon-cyan shadow-neon-cyan/50 shadow-lg'
                      : isActive
                      ? 'bg-gradient-to-br from-neon-purple to-neon-cyan text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {i + 1}
                </motion.div>
              );
            })}
          </div>
          
          <p className="text-gray-300">
            You're on a <span className="text-neon-cyan font-semibold">{userData.streak}-day</span> learning streak! 
            Keep it up to unlock special achievements.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;