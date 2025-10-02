import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Github, ExternalLink, TrendingUp, Star, GitFork } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

const LandingPage = ({ setCurrentPage }) => {
  const [courses, setCourses] = useState([]);
  const [devArticles, setDevArticles] = useState([]);
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentPage('home');
    fetchAllData();
  }, [setCurrentPage]);

  const fetchAllData = async () => {
    try {
      const coursesData = await ApiService.getAllCourses();
      setCourses(coursesData);

      // Dev.to latest articles
      const devResponse = await fetch('https://dev.to/api/articles?tag=programming&per_page=6');
      const devData = await devResponse.json();
      setDevArticles(devData);

      // GitHub trending
      const githubResponse = await fetch('https://gh-trending-api.herokuapp.com/repositories?since=daily&spoken_language_code=en');
      const githubData = await githubResponse.json();
      setTrendingRepos(githubData.slice(0, 5));

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Simple Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-orbitron font-bold text-white mb-4">
            Eat and Repeat
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn programming through tutorials, examples, and real-world projects
          </p>
        </motion.div>

        {/* Course Categories */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Link key={course.courseId} to={`/course/${course.courseId}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-neon-cyan/50 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                      <Code size={20} className="text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{course.courseTitle}</h3>
                      <span className="text-xs text-gray-500">{course.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {course.courseDescription}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded ${
                      course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {course.difficulty}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Dev Articles */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
            <a 
              href="https://dev.to" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-cyan text-sm hover:underline flex items-center gap-1"
            >
              More on Dev.to <ExternalLink size={14} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devArticles.map((article, index) => (
              <motion.a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-neon-purple/50 transition-all block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={article.user.profile_image_90} 
                    alt={article.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white text-sm font-medium">{article.user.name}</p>
                    <p className="text-gray-500 text-xs">{article.readable_publish_date}</p>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {article.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>❤️ {article.public_reactions_count}</span>
                  <span>💬 {article.comments_count}</span>
                  <span>{article.reading_time_minutes} min</span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* GitHub Trending */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Trending Repositories</h2>
            <a 
              href="https://github.com/trending" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-cyan text-sm hover:underline flex items-center gap-1"
            >
              <Github size={16} />
              View on GitHub
            </a>
          </div>
          <div className="space-y-4">
            {trendingRepos.map((repo, index) => (
              <motion.a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="block bg-white/5 rounded-xl p-6 border border-white/10 hover:border-neon-cyan/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Github size={18} className="text-gray-400" />
                      <h3 className="text-white font-semibold">
                        {repo.author} / {repo.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star size={14} />
                        {repo.stars.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={14} />
                        {repo.forks.toLocaleString()}
                      </span>
                      <span className="text-neon-pink flex items-center gap-1">
                        <TrendingUp size={14} />
                        {repo.currentPeriodStars} today
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Learning Resources */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Documentation & References</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', desc: 'HTML, CSS, JavaScript' },
              { name: 'W3Schools', url: 'https://www.w3schools.com', desc: 'Web tutorials' },
              { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org', desc: 'CS & Programming' },
              { name: 'Stack Overflow', url: 'https://stackoverflow.com', desc: 'Q&A Community' },
              { name: 'React Docs', url: 'https://react.dev', desc: 'Official React docs' },
              { name: 'Node.js Docs', url: 'https://nodejs.org/docs', desc: 'Node.js reference' },
              { name: 'GitHub', url: 'https://github.com', desc: 'Code hosting' },
              { name: 'DevDocs', url: 'https://devdocs.io', desc: 'API Documentation' }
            ].map((resource, index) => (
              <motion.a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-all"
              >
                <h3 className="text-white font-semibold mb-1 text-sm">{resource.name}</h3>
                <p className="text-gray-500 text-xs">{resource.desc}</p>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
