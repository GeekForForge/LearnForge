import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, Grid, List } from 'lucide-react';
import CourseCard from '../components/CourseCard';

const CoursesPage = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    setCurrentPage('courses');
  }, [setCurrentPage]);

  // Sample courses data
  const allCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms in Java',
      description: 'Master the fundamentals of DSA with Java. From basic arrays to advanced graph algorithms, build a solid foundation for technical interviews.',
      difficulty: 'Intermediate',
      category: 'Programming',
      duration: '12 weeks',
      students: 25.3,
      rating: 4.9,
      progress: 65,
      tags: ['Java', 'DSA', 'Algorithms', 'Problem Solving']
    },
    {
      id: 2,
      title: 'Spring Boot Mastery',
      description: 'Build enterprise-level applications with Spring Boot. Learn REST APIs, microservices, security, and deployment strategies.',
      difficulty: 'Advanced',
      category: 'Backend',
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
      category: 'Frontend',
      duration: '8 weeks',
      students: 32.1,
      rating: 4.9,
      progress: 30,
      tags: ['React', 'JavaScript', 'Frontend', 'UI/UX']
    },
    {
      id: 4,
      title: 'TypeScript Fundamentals',
      description: 'Learn TypeScript from scratch. Type annotations, interfaces, generics, and advanced patterns for scalable applications.',
      difficulty: 'Beginner',
      category: 'Programming',
      duration: '6 weeks',
      students: 28.5,
      rating: 4.7,
      progress: 0,
      tags: ['TypeScript', 'JavaScript', 'Static Typing']
    },
    {
      id: 5,
      title: 'Node.js Backend Development',
      description: 'Build robust server-side applications with Node.js. Express.js, MongoDB, authentication, and deployment covered.',
      difficulty: 'Intermediate',
      category: 'Backend',
      duration: '9 weeks',
      students: 21.2,
      rating: 4.8,
      progress: 85,
      tags: ['Node.js', 'Express', 'MongoDB', 'Backend']
    },
    {
      id: 6,
      title: 'Python for Data Science',
      description: 'Dive into data science with Python. NumPy, Pandas, Matplotlib, and machine learning basics included.',
      difficulty: 'Beginner',
      category: 'Data Science',
      duration: '11 weeks',
      students: 34.8,
      rating: 4.9,
      progress: 15,
      tags: ['Python', 'Data Science', 'ML', 'Analytics']
    },
  ];

  // Filter and sort logic
  useEffect(() => {
    let filtered = allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, selectedDifficulty, selectedCategory, sortBy]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'Programming', 'Frontend', 'Backend', 'Data Science'];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover your next learning adventure with our comprehensive programming courses
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, topics, or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/30 focus:shadow-lg transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Difficulty Filter */}
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-purple appearance-none pr-8 interactive"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty} className="bg-dark-800">
                      {difficulty} Level
                    </option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-cyan appearance-none pr-8 interactive"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-dark-800">
                      {category}
                    </option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-neon-pink appearance-none pr-8 interactive"
                >
                  <option value="popular" className="bg-dark-800">Most Popular</option>
                  <option value="rating" className="bg-dark-800">Highest Rated</option>
                  <option value="newest" className="bg-dark-800">Newest</option>
                  <option value="progress" className="bg-dark-800">My Progress</option>
                </select>
                <SortAsc size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`interactive p-2 rounded transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-neon-purple text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`interactive p-2 rounded transition-all ${
                  viewMode === 'list' 
                    ? 'bg-neon-purple text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            Showing {filteredCourses.length} of {allCourses.length} courses
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          {filteredCourses.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              index={index}
            />
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No courses found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('All');
                setSelectedCategory('All');
              }}
              className="interactive px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-neon-purple/30 hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;