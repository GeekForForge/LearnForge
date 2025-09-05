import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code, Zap, Star, Users, Play } from 'lucide-react';
import CourseCard from '../components/CourseCard';

const LandingPage = ({ setCurrentPage }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    setCurrentPage('home');
  }, [setCurrentPage]);

  // Sample featured courses
  const featuredCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms in Java',
      description: 'Master the fundamentals of DSA with Java. From basic arrays to advanced graph algorithms, build a solid foundation for technical interviews.',
      difficulty: 'Intermediate',
      duration: '12 weeks',
      students: 25.3,
      rating: 4.9,
      progress: 0,
      tags: ['Java', 'DSA', 'Algorithms', 'Problem Solving']
    },
    {
      id: 2,
      title: 'Spring Boot Mastery',
      description: 'Build enterprise-level applications with Spring Boot. Learn REST APIs, microservices, security, and deployment strategies.',
      difficulty: 'Advanced',
      duration: '10 weeks',
      students: 18.7,
      rating: 4.8,
      progress: 0,
      tags: ['Spring Boot', 'Java', 'REST API', 'Microservices']
    },
    {
      id: 3,
      title: 'React Frontend Development',
      description: 'Create modern, responsive web applications with React. Hooks, Context API, routing, and state management covered.',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      students: 32.1,
      rating: 4.9,
      progress: 0,
      tags: ['React', 'JavaScript', 'Frontend', 'UI/UX']
    },
  ];

  const features = [
    {
      icon: Code,
      title: 'Hands-on Projects',
      description: 'Build real-world applications and add them to your portfolio',
    },
    {
      icon: Zap,
      title: 'Fast-Track Learning',
      description: 'Accelerated curriculum designed for maximum retention',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join thousands of developers in our learning community',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="container mx-auto px-6 text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="hero-title text-5xl md:text-7xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Learn. Practice. Master.
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your complete free roadmap to become a developer. 
              Master programming with our immersive, futuristic learning platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/courses">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' 
                }}
                whileTap={{ scale: 0.95 }}
                className="interactive px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl btn-glow flex items-center space-x-2 text-lg"
              >
                <span>Explore Courses</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="interactive px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2 text-lg"
            >
              <Play size={20} />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { number: '50K+', label: 'Active Learners' },
              { number: '200+', label: 'Course Hours' },
              { number: '95%', label: 'Job Success Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          style={{ y: y2 }}
          className="absolute top-20 left-10 w-20 h-20 bg-neon-purple/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-40 right-20 w-32 h-32 bg-neon-cyan/20 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Why Choose LearnForge?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of programming education with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan p-0.5">
                    <div className="w-full h-full rounded-xl bg-dark-800 flex items-center justify-center">
                      <feature.icon size={32} className="text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-neon-cyan transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start your journey with our most popular programming courses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="interactive px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl btn-glow"
              >
                View All Courses
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-neon-purple/20 via-neon-cyan/10 to-neon-pink/20 backdrop-blur-lg border border-white/20 text-center overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who have transformed their careers with LearnForge
              </p>
              
              <Link to="/courses">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="interactive px-10 py-4 bg-white text-dark-900 font-semibold rounded-xl hover:bg-gray-100 transition-all text-lg"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>

            {/* Background Animation */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, #8B5CF6 0%, transparent 70%)',
                  'radial-gradient(circle at 80% 80%, #06B6D4 0%, transparent 70%)',
                  'radial-gradient(circle at 40% 40%, #EC4899 0%, transparent 70%)',
                  'radial-gradient(circle at 20% 20%, #8B5CF6 0%, transparent 70%)',
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;