import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Code, Zap, Users, Play, Star, 
  TrendingUp, BookOpen, ExternalLink, BarChart3,
  Rocket, Target, Award, Clock, Globe, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

const LandingPage = ({ setCurrentPage }) => {
  const [courses, setCourses] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalHours: 0,
    popularCategory: 'Programming'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage('home');
    fetchPlatformData();
  }, [setCurrentPage]);

  const fetchPlatformData = async () => {
    try {
      const coursesData = await ApiService.getAllCourses();
      setCourses(coursesData.slice(0, 3));
      
      const stats = {
        totalCourses: coursesData.length,
        totalLessons: coursesData.reduce((acc, course) => acc + (course.lessons || 0), 0),
        totalHours: coursesData.reduce((acc, course) => acc + (course.durationHours || 0), 0),
        popularCategory: getPopularCategory(coursesData)
      };
      
      setPlatformStats(stats);
    } catch (error) {
      console.error('Error fetching platform data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPopularCategory = (courses) => {
    if (!courses.length) return 'Programming';
    const categories = {};
    courses.forEach(course => {
      categories[course.category] = (categories[course.category] || 0) + 1;
    });
    return Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
  };

  // Enhanced tech trends data
  const techTrends = [
    { name: 'React', value: 35, color: '#61DAFB', growth: '+12%' },
    { name: 'Node.js', value: 25, color: '#68A063', growth: '+8%' },
    { name: 'Python', value: 20, color: '#3776AB', growth: '+15%' },
    { name: 'TypeScript', value: 15, color: '#3178C6', growth: '+25%' },
    { name: 'Rust', value: 5, color: '#DEA584', growth: '+40%' }
  ];

  const skillDemand = [
    { skill: 'Full Stack', demand: 95, jobs: '120K+' },
    { skill: 'React', demand: 88, jobs: '85K+' },
    { skill: 'Python', demand: 82, jobs: '110K+' },
    { skill: 'Node.js', demand: 78, jobs: '65K+' },
    { skill: 'DevOps', demand: 75, jobs: '70K+' }
  ];

  // Developer facts and insights
  const developerFacts = [
    {
      icon: <Zap className="text-yellow-400" />,
      title: "90% Faster Learning",
      description: "Project-based learners master skills 90% faster than traditional methods"
    },
    {
      icon: <Rocket className="text-neon-cyan" />,
      title: "6-Month Job Ready",
      description: "Average time for our students to land their first developer job"
    },
    {
      icon: <Target className="text-neon-pink" />,
      title: "95% Success Rate",
      description: "Of our students complete courses and build portfolio projects"
    },
    {
      icon: <Award className="text-green-400" />,
      title: "Industry Validated",
      description: "Curriculum designed with input from FAANG engineers"
    }
  ];

  // Enhanced blog links with more engaging content
  const blogLinks = [
    {
      title: "AI in 2025: How Developers Can Stay Relevant",
      source: "TechCrunch",
      url: "https://www.ironhack.com/us/blog/ai-skills-every-developer-needs-in-2024",
      trending: true,
      readTime: "5 min",
      category: "Future Tech"
    },
    {
      title: "The 10 Highest Paying Programming Languages of 2025",
      source: "Stack Overflow",
      url: "https://survey.stackoverflow.co/2025/technology",
      trending: true,
      readTime: "7 min",
      category: "Careers"
    },
    {
      title: "Why Project-Based Learning Beats Tutorials Every Time",
      source: "FreeCodeCamp",
      url: "https://www.freecodecamp.org/news/project-based-learning/",
      trending: false,
      readTime: "6 min",
      category: "Learning"
    },
    {
      title: "The Rise of Remote Work: Developer Salaries in 2025",
      source: "Remote.co",
      url: "https://remote.co/remote-work-statistics/",
      trending: true,
      readTime: "8 min",
      category: "Careers"
    },
    {
      title: "Building Your First SaaS: A Complete Roadmap",
      source: "Indie Hackers",
      url: "https://www.indiehackers.com/post/building-your-first-saas-a-complete-roadmap-4f5c5e5c5e5c",
      trending: false,
      readTime: "10 min",
      category: "Projects"
    },
    {
      title: "The Psychology of Learning Programming Effectively",
      source: "Psychology Today",
      url: "https://codefinity.com/blog/The-Psychology-of-Programming-or-Understanding-the-Mindset-of-Developers",
      trending: false,
      readTime: "12 min",
      category: "Learning"
    }
  ];

  // Learning path milestones
  const learningPath = [
    { stage: "Beginner", duration: "1-2 months", skills: ["HTML/CSS", "JavaScript Basics", "Git"], projects: 2 },
    { stage: "Intermediate", duration: "3-4 months", skills: ["React", "Node.js", "Databases"], projects: 5 },
    { stage: "Advanced", duration: "5-6 months", skills: ["Full Stack", "DevOps", "Testing"], projects: 8 },
    { stage: "Job Ready", duration: "6+ months", skills: ["System Design", "Interview Prep", "Portfolio"], projects: 12 }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-neon-pink/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center z-10"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent leading-tight">
              CODE YOUR<br />FUTURE
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              From <span className="text-neon-cyan font-bold">zero to hired</span> in 6 months. 
              Join <span className="text-neon-pink font-bold"></span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-2xl flex items-center space-x-3 text-xl relative overflow-hidden group"
              >
                <span className="relative z-10">Start Learning Free</span>
                <ArrowRight size={24} className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 border-2 border-neon-cyan text-neon-cyan font-bold rounded-2xl text-xl hover:bg-neon-cyan/10 transition-colors"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Enhanced Real-time Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { value: `${platformStats.totalCourses}+`, label: "Courses", icon: <BookOpen className="text-neon-cyan" /> },
              { value: `${platformStats.totalLessons}+`, label: "Lessons", icon: <Code className="text-neon-purple" /> },
              { value: `${platformStats.totalHours}+`, label: "Hours", icon: <Clock className="text-neon-pink" /> },
              { value: "95%", label: "Success Rate", icon: <Award className="text-yellow-400" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-4 bg-white/5 rounded-2xl backdrop-blur-lg"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 text-sm flex flex-col items-center"
          >
            <span>Scroll to explore</span>
            <ArrowRight size={16} className="rotate-90 mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* Developer Facts Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Why LearnForge Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Science-backed learning methods that actually get results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developerFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex justify-center mb-4 text-4xl">
                  {fact.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                  {fact.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {fact.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 relative bg-dark-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Your 6-Month Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Structured learning path from beginner to job-ready developer
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-neon-purple to-neon-cyan hidden lg:block" />
            
            <div className="space-y-12 lg:space-y-0">
              {learningPath.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'} mb-8 lg:mb-0`}>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-white">{stage.stage}</span>
                        <span className="text-neon-cyan font-semibold">{stage.duration}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">Skills You'll Learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {stage.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-3 py-1 bg-neon-purple/20 text-neon-cyan rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Projects: {stage.projects}</span>
                        <div className="flex items-center text-yellow-400">
                          <Star size={16} className="fill-current" />
                          <span className="ml-1">Milestone</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-neon-cyan rounded-full border-4 border-dark-900 hidden lg:block z-10" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Trends Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              What's Trending in 2025?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay ahead with the latest technology trends and in-demand skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Tech Stack Popularity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-neon-purple" />
                Hottest Technologies
              </h3>
              
              <div className="space-y-4">
                {techTrends.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tech.color }}
                      />
                      <span className="text-white font-medium">{tech.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-cyan font-bold">{tech.value}%</div>
                      <div className="text-green-400 text-sm">{tech.growth}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Skill Demand Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
            >
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-neon-cyan" />
                Job Market Demand
              </h3>

              <div className="space-y-6">
                {skillDemand.map((skill, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.skill}</span>
                      <div className="text-right">
                        <span className="text-neon-cyan font-bold">{skill.demand}%</span>
                        <span className="text-gray-400 text-sm ml-2">{skill.jobs} jobs</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.demand}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-gradient-to-r from-neon-purple to-neon-cyan h-3 rounded-full relative"
                      >
                        <motion.div
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Developer Insights Hub */}
      <section className="py-20 relative bg-dark-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Developer Insights Hub
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Curated content from top tech publications and industry experts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogLinks.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-neon-cyan text-sm font-semibold">{article.source}</span>
                    <span className="text-gray-500 text-sm ml-2">• {article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {article.trending && (
                      <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30">
                        🔥 Trending
                      </span>
                    )}
                    <span className="text-gray-500 text-xs bg-white/10 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-white font-semibold mb-4 line-clamp-3 group-hover:text-neon-cyan transition-colors leading-relaxed">
                  {article.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400 group-hover:text-white transition-colors text-sm">
                    <span>Read article</span>
                    <ExternalLink size={14} className="ml-2" />
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-neon-purple"
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-neon-cyan text-neon-cyan font-semibold rounded-xl hover:bg-neon-cyan/10 transition-colors"
            >
              View All Articles
            </motion.button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Handpicked courses to kickstart your development journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {course.difficulty || 'Beginner'}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-sm">{course.rating || '5.0'}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {course.courseTitle}
                </h3>

                <p className="text-gray-300 mb-4 line-clamp-2">
                  {course.courseDescription}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>📁 {course.category}</span>
                  <span>⏱️ {course.duration || 'Self-paced'}</span>
                </div>

                <Link to={`/course/${course.courseId}`}>
                  <button className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Play size={16} />
                    Start Learning
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-xl"
              >
                View All Courses
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Join Our Global Community
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              10,000+ developers from 50+ countries learning together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Active Learners", icon: <Users className="text-neon-cyan" /> },
              { number: "50+", label: "Countries", icon: <Globe className="text-neon-purple" /> },
              { number: "24/7", label: "Support", icon: <Heart className="text-neon-pink" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl"
              >
                <div className="text-4xl mb-4 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Enhanced CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-3xl p-12 max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who started with zero experience and now work at top tech companies
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/courses">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-white text-dark-900 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg"
                  >
                    Start Learning Free
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Talk to Alumni
                </motion.button>
              </div>
              
              <p className="text-gray-400 text-sm mt-6">
                No credit card required • Start instantly • Join 10,000+ developers
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
