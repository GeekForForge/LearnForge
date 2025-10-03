import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Github, ExternalLink, TrendingUp, Star, GitFork } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

const LandingPage = ({ setCurrentPage }) => {
  const [courses, setCourses] = useState([]);
  const [devArticles, setDevArticles] = useState([]);
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [yourGithub, setYourGithub] = useState(null); // ✅ Added
  const [topDevs, setTopDevs] = useState([]); // ✅ Added
  const [dailyMeme, setDailyMeme] = useState(null); // ✅ Added
  const [loading, setLoading] = useState(true);

  const YOUR_GITHUB = 'sam1302-sks'; // ✅ Your GitHub username

  useEffect(() => {
    setCurrentPage('home');
    fetchAllData();
  }, [setCurrentPage]);

  const fetchAllData = async () => {
    try {
      // 1. Your courses from your backend
      const coursesData = await ApiService.getAllCourses();
      setCourses(coursesData.slice(0, 6));

      // 2. Dev.to articles via proxy
      try {
        const devResponse = await fetch('http://localhost:8080/api/external/dev-articles');
        const devData = await devResponse.json();
        setDevArticles(devData);
      } catch (error) {
        console.log('Dev.to API failed:', error);
      }

      // 3. GitHub Trending Repos via proxy
      try {
        const githubTrendingResponse = await fetch('http://localhost:8080/api/external/trending-repos');
        const githubTrendingData = await githubTrendingResponse.json();
        setTrendingRepos(githubTrendingData.slice(0, 5));
      } catch (error) {
        console.log('GitHub trending API failed:', error);
      }

      // 4. Your GitHub Stats via proxy
      try {
        const userResponse = await fetch(`http://localhost:8080/api/external/github-user/${YOUR_GITHUB}`);
        const userData = await userResponse.json();
        
        const reposResponse = await fetch(`http://localhost:8080/api/external/github-repos/${YOUR_GITHUB}`);
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0);

        setYourGithub({
          user: userData,
          repos: reposData.slice(0, 5),
          totalStars,
          totalForks,
          totalRepos: userData.public_repos
        });
      } catch (error) {
        console.log('GitHub user API failed:', error);
      }

      // 5. Top Devs to Compare via proxy
      try {
        const topDevsResponse = await fetch('http://localhost:8080/api/external/trending-devs');
        const topDevsRepos = await topDevsResponse.json();
        
        const topDevsData = [];
        for (let i = 0; i < 3 && i < topDevsRepos.length; i++) {
          try {
            const devResponse = await fetch(`http://localhost:8080/api/external/github-user/${topDevsRepos[i].author}`);
            const devData = await devResponse.json();
            topDevsData.push({
              ...devData,
              trendingRepo: topDevsRepos[i]
            });
          } catch (error) {
            console.log('Dev fetch failed:', error);
          }
        }
        setTopDevs(topDevsData);
      } catch (error) {
        console.log('Top devs API failed:', error);
      }

      // 6. Daily Programming Meme via proxy
      try {
        const memeResponse = await fetch('http://localhost:8080/api/external/programming-meme');
        const memeData = await memeResponse.json();
        setDailyMeme(memeData);
      } catch (error) {
        console.log('Meme API failed:', error);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
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
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
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
                {article.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {article.description}
                  </p>
                )}
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
                        {repo.stars?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={14} />
                        {repo.forks?.toLocaleString() || 0}
                      </span>
                      <span className="text-neon-pink flex items-center gap-1">
                        <TrendingUp size={14} />
                        {repo.currentPeriodStars || 0} today
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
