import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, BookOpen, TrendingUp } from 'lucide-react';
import ApiService from '../services/api';

const Footer = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      // Fetch all courses
      const coursesData = await ApiService.getAllCourses();
      
      // Get top 4 popular courses (sorted by rating or students)
      const sortedCourses = coursesData
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);
      
      setPopularCourses(sortedCourses);
      
      // Calculate stats
      let totalLessons = 0;
      for (const course of coursesData) {
        try {
          const lessons = await ApiService.getLessonsByCourse(course.courseId);
          totalLessons += lessons.length;
        } catch (error) {
          console.error(`Error fetching lessons for course ${course.courseId}:`, error);
        }
      }
      
      setStats({
        totalCourses: coursesData.length,
        totalLessons: totalLessons
      });
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Social links with your actual profiles
  const socialLinks = [
    { 
      icon: Github, 
      href: 'https://github.com/sam1302-sks', 
      label: 'GitHub',
      color: 'hover:text-white'
    },
    { 
      icon: Twitter, 
      href: 'https://x.com/SamarthSachinP?t=YcZDm2CDWv4Xu4-BFroFwA&s=08', 
      label: 'Twitter',
      color: 'hover:text-blue-400'
    },
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/samarth-patil-905125332/', 
      label: 'LinkedIn',
      color: 'hover:text-blue-500'
    },
    {
      icon: Mail,
      href: 'mailto:patilsamarthsachin@gmail.com?subject=Let%27s%20Connect&body=Hi%20Samarth%2C%0AI%20wanted%20to%20reach%20out%20after%20seeing%20LearnForge.',
      label: 'Email',
      color: 'hover:text-neon-pink'
    }
  ];

  // Navigation links
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'Admin', path: '/admin' },
    { label: 'About', path: '/about' }
  ];

  return (
    <footer className="relative z-10 bg-dark-800/50 backdrop-blur-sm border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h3 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent mb-4">
                LearnForge
              </h3>
              <p className="text-gray-400 max-w-md leading-relaxed mb-4">
                Your free roadmap to becoming a developer. Handpicked courses by developers, for developers.
              </p>
              
              {/* Platform Stats */}
              {!loading && (
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-neon-cyan" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">{stats.totalCourses}</span> Courses
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-neon-purple" />
                    <span className="text-sm text-gray-300">
                      <span className="font-bold text-white">{stats.totalLessons}</span> Lessons
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' 
                  }}
                  className="interactive p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon 
                    size={20} 
                    className={`text-gray-400 ${social.color} transition-colors`}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="interactive text-gray-400 hover:text-neon-cyan transition-colors duration-300 cursor-pointer"
                      >
                        {link.label}
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Popular Courses - Dynamic */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold text-white mb-6">Popular Courses</h4>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {popularCourses.map((course) => (
                    <li key={course.courseId}>
                      <Link to={`/course/${course.courseId}`}>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="interactive text-gray-400 hover:text-neon-pink transition-colors duration-300 cursor-pointer line-clamp-1 text-sm"
                          title={course.courseTitle}
                        >
                          {course.courseTitle}
                        </motion.div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LearnForge. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Made For Geeks <span className="text-neon-cyan">Samarth Patil</span>
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <motion.a
              href="#privacy"
              whileHover={{ color: '#8B5CF6' }}
              className="interactive text-gray-400 hover:text-neon-purple text-sm transition-colors"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#terms"
              whileHover={{ color: '#06B6D4' }}
              className="interactive text-gray-400 hover:text-neon-cyan text-sm transition-colors"
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#cookies"
              whileHover={{ color: '#EC4899' }}
              className="interactive text-gray-400 hover:text-neon-pink text-sm transition-colors"
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Animated bottom border */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-50"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "linear" 
        }}
        style={{ backgroundSize: '200% 100%' }}
      />
    </footer>
  );
};

export default Footer;
