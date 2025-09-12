import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, Grid, List } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import ApiService from '../services/api';

const CoursesPage = ({ setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [courses, setCourses] = useState([]); // 🎯 Initialize as empty array
  const [filteredCourses, setFilteredCourses] = useState([]); // 🎯 Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentPage('courses');
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllCourses();
        console.log('Fetched courses:', data);
        
        // 🎯 Ensure data is an array
        const coursesArray = Array.isArray(data) ? data : [];
        setCourses(coursesArray);
        setFilteredCourses(coursesArray);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
        // 🎯 Set empty arrays on error
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [setCurrentPage]);

  useEffect(() => {
    // 🎯 Ensure courses is an array before filtering
    if (!Array.isArray(courses)) {
      setFilteredCourses([]);
      return;
    }

    let filtered = courses.filter(course => {
      const matchesSearch =
        (course.courseTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.courseDescription || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.students || 0) - (a.students || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.courseId || 0) - (a.courseId || 0);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [searchTerm, selectedDifficulty, selectedCategory, sortBy, courses]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'Programming', 'Frontend', 'Backend', 'Data Science'];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <h2 className="text-2xl font-bold mb-2">Error Loading Courses</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

        {/* Search & Filters */}
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
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan/30 transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Difficulty */}
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white appearance-none pr-8 focus:outline-none focus:border-neon-purple"
                >
                  {difficulties.map(d => (
                    <option key={d} value={d} className="bg-dark-800">
                      {d} Level
                    </option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white appearance-none pr-8 focus:outline-none focus:border-neon-cyan"
                >
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-dark-800">{c}</option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white appearance-none pr-8 focus:outline-none focus:border-neon-pink"
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
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-neon-purple text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-neon-purple text-white' : 'text-gray-400 hover:text-white'}`}
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
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </motion.div>

        {/* Courses Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`gap-8 ${viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid grid-cols-1'}`}
        >
          {/* 🎯 Safe mapping with fallback */}
          {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
            filteredCourses.map((course, idx) => (
              <CourseCard 
                key={course.courseId || idx} 
                course={course} 
                index={idx} 
              />
            ))
          ) : (
            <div className="col-span-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
                  <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {courses.length === 0 ? 'No courses available' : 'No courses found'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {courses.length === 0 
                    ? 'Courses are being loaded or there are no courses in the database.'
                    : 'Try adjusting your search terms or filters.'
                  }
                </p>
                {courses.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDifficulty('All');
                      setSelectedCategory('All');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold rounded-lg hover:shadow-neon-purple/30 hover:shadow-lg transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CoursesPage;
