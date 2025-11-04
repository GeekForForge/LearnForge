import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code, ExternalLink, Sparkles, Zap, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

const LandingPage = ({ setCurrentPage }) => {
    const [courses, setCourses] = useState([]);
    const [devArticles, setDevArticles] = useState([]);
    const [trendingRepos, setTrendingRepos] = useState([]);


    const heroRef = useRef(null);
    const whyRef = useRef(null);
    const coursesRef = useRef(null);
    const articlesRef = useRef(null);
    const reposRef = useRef(null);

    // Hero parallax
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

    // Section reveals
    const { scrollYProgress: whyProgress } = useScroll({
        target: whyRef,
        offset: ["start end", "start center"]
    });
    const whyOpacity = useTransform(whyProgress, [0, 1], [0, 1]);
    const whyY = useTransform(whyProgress, [0, 1], ["15%", "0%"]);

    const { scrollYProgress: coursesProgress } = useScroll({
        target: coursesRef,
        offset: ["start end", "start center"]
    });
    const coursesOpacity = useTransform(coursesProgress, [0, 1], [0, 1]);
    const coursesY = useTransform(coursesProgress, [0, 1], ["15%", "0%"]);

    const { scrollYProgress: articlesProgress } = useScroll({
        target: articlesRef,
        offset: ["start end", "start center"]
    });
    const articlesOpacity = useTransform(articlesProgress, [0, 1], [0, 1]);

    const { scrollYProgress: reposProgress } = useScroll({
        target: reposRef,
        offset: ["start end", "start center"]
    });
    const reposOpacity = useTransform(reposProgress, [0, 1], [0, 1]);

    useEffect(() => {
        setCurrentPage('home');
        fetchAllData();
    }, [setCurrentPage]);

    const fetchAllData = async () => {
        try {
            const coursesData = await ApiService.getAllCourses();
            setCourses(coursesData.slice(0, 6));

            try {
                const devResponse = await fetch('https://dev.to/api/articles?tag=programming&per_page=6');
                const devData = await devResponse.json();
                setDevArticles(devData);
            } catch (error) {
                console.log('Dev.to API failed:', error);
            }

            try {
                const githubTrendingResponse = await fetch('https://ghapi.huchen.dev/repositories?language=javascript&since=weekly');
                const githubTrendingData = await githubTrendingResponse.json();
                setTrendingRepos(githubTrendingData.slice(0, 5));
            } catch (error) {
                console.log('GitHub trending API failed:', error);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="min-h-screen">
            {/* HERO - Refined & Minimal */}
            <section
                ref={heroRef}
                className="relative h-screen flex items-center justify-center overflow-hidden"
            >
                {/* Subtle background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 text-center px-6 max-w-6xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium text-gray-400">
                            <Sparkles size={12} />
                            Open Source Learning Platform
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-7xl md:text-[10rem] font-black leading-none mb-8 tracking-tight"
                    >
                        <span className="text-gradient">LearnForge</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light"
                    >
                        Master development through real-world projects.
                        <br />
                        <span className="text-neon-cyan">No fluff. Just skills.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <Link to="/courses">
                            <button className="group px-8 py-3.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2">
                                Start Learning
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <a href="#courses">
                            <button className="px-8 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 text-white rounded-full font-semibold text-sm transition-all">
                                Explore Courses
                            </button>
                        </a>
                    </motion.div>

                    {/* Minimal scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-16 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2"
                        >
                            <div className="w-1 h-2 bg-white/40 rounded-full" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* WHY SECTION - Compact */}
            <section ref={whyRef} className="py-24 relative">
                <motion.div
                    style={{ opacity: whyOpacity, y: whyY }}
                    className="container mx-auto px-6 max-w-6xl"
                >
                    <div className="mb-16">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                            Built for <br className="md:hidden" />
                            <span className="text-gradient">Real Developers</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl">
                            No false promises. Just pure learning that builds actual skills.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Code size={32} />,
                                title: 'Project-Based',
                                description: 'Build real applications by solving actual problems.'
                            },
                            {
                                icon: <Zap size={32} />,
                                title: 'Modern Stack',
                                description: 'Learn technologies used by top companies worldwide.'
                            },
                            {
                                icon: <Target size={32} />,
                                title: 'Track Progress',
                                description: 'Monitor your journey and growth in real-time.'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                className="group"
                            >
                                <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.05] transition-all h-full">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-neon-cyan group-hover:bg-white/10 transition-all">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* COURSES - Sequential Reveal */}
            <section id="courses" ref={coursesRef} className="py-24 relative">
                <motion.div
                    style={{ opacity: coursesOpacity, y: coursesY }}
                    className="container mx-auto px-6 max-w-7xl"
                >
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-xs font-semibold text-neon-purple uppercase tracking-wider mb-3 block">
                                Start Learning
                            </span>
                            <h2 className="text-5xl md:text-7xl font-bold text-white">
                                Featured Courses
                            </h2>
                        </div>
                        <Link to="/courses" className="hidden md:block">
                            <button className="group px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 text-white rounded-full text-sm font-medium transition-all flex items-center gap-2">
                                View All
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <Link key={course.courseId} to={`/course/${course.courseId}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{
                                        once: true,
                                        margin: "-100px",
                                        amount: 0.3
                                    }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.5,
                                        ease: [0.21, 0.47, 0.32, 0.98]
                                    }}
                                    whileHover={{ y: -4 }}
                                    className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/10 transition-all cursor-pointer h-full"
                                >
                                    {/* Course Header - Compact */}
                                    <div className="h-40 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 flex items-center justify-center relative">
                                        <Code size={40} className="text-white/20 group-hover:text-white/30 transition-colors" />
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                                                course.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                                                    course.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                                                        'bg-red-500/20 text-red-300 border border-red-400/30'
                                            }`}>
                                                {course.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Course Content - Tight */}
                                    <div className="p-5">
                                        <span className="text-[10px] text-neon-cyan font-semibold uppercase tracking-wider">
                                            {course.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-white mt-2 mb-2 group-hover:text-neon-cyan transition-colors line-clamp-1">
                                            {course.courseTitle}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {course.courseDescription}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{course.duration || '12 weeks'}</span>
                                            <ArrowRight size={14} className="text-neon-cyan group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-8 md:hidden">
                        <Link to="/courses">
                            <button className="px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full text-sm font-medium">
                                View All Courses
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ARTICLES - Sequential Reveal */}
            <section ref={articlesRef} className="py-24 relative">
                <motion.div
                    style={{ opacity: articlesOpacity }}
                    className="container mx-auto px-6 max-w-7xl"
                >
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="text-xs font-semibold text-neon-cyan uppercase tracking-wider mb-3 block">
                                Stay Updated
                            </span>
                            <h2 className="text-5xl md:text-7xl font-bold text-white">
                                Latest Articles
                            </h2>
                        </div>
                        <a
                            href="https://dev.to"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <span>Dev.to</span>
                            <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devArticles.slice(0, 6).map((article, index) => (
                            <motion.a
                                key={article.id}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{
                                    once: true,
                                    margin: "-100px",
                                    amount: 0.3
                                }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: [0.21, 0.47, 0.32, 0.98]
                                }}
                                whileHover={{ y: -4 }}
                                className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.05] hover:border-white/10 transition-all block"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={article.user.profile_image_90}
                                        alt={article.user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-xs truncate">{article.user.name}</p>
                                        <p className="text-gray-500 text-[10px]">{article.readable_publish_date}</p>
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-sm mb-3 line-clamp-2 group-hover:text-neon-purple transition-colors leading-snug">
                                    {article.title}
                                </h3>
                                <div className="flex items-center gap-4 text-[10px] text-gray-500">
                                    <span>❤️ {article.public_reactions_count}</span>
                                    <span>💬 {article.comments_count}</span>
                                    <span>📖 {article.reading_time_minutes}m</span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* REPOS - Sequential Reveal */}
            {/*<section ref={reposRef} className="py-24 relative">*/}
            {/*    <motion.div*/}
            {/*        style={{ opacity: reposOpacity }}*/}
            {/*        className="container mx-auto px-6 max-w-7xl"*/}
            {/*    >*/}
            {/*        <div className="flex items-end justify-between mb-12">*/}
            {/*            <div>*/}
            {/*                <span className="text-xs font-semibold text-neon-pink uppercase tracking-wider mb-3 block">*/}
            {/*                    Trending Now*/}
            {/*                </span>*/}
            {/*                <h2 className="text-5xl md:text-7xl font-bold text-white">*/}
            {/*                    Hot Repos*/}
            {/*                </h2>*/}
            {/*            </div>*/}
            {/*            <a*/}
            {/*                href="https://github.com/trending"*/}
            {/*                target="_blank"*/}
            {/*                rel="noopener noreferrer"*/}
            {/*                className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"*/}
            {/*            >*/}
            {/*                <Github size={16} />*/}
            {/*                <span>GitHub</span>*/}
            {/*            </a>*/}
            {/*        </div>*/}

            {/*        <div className="space-y-4">*/}
            {/*            {trendingRepos.map((repo, index) => (*/}
            {/*                <motion.a*/}
            {/*                    key={index}*/}
            {/*                    href={repo.url}*/}
            {/*                    target="_blank"*/}
            {/*                    rel="noopener noreferrer"*/}
            {/*                    initial={{ opacity: 0, y: 60 }}*/}
            {/*                    whileInView={{ opacity: 1, y: 0 }}*/}
            {/*                    viewport={{*/}
            {/*                        once: true,*/}
            {/*                        margin: "-100px",*/}
            {/*                        amount: 0.5*/}
            {/*                    }}*/}
            {/*                    transition={{*/}
            {/*                        delay: index * 0.15,*/}
            {/*                        duration: 0.5,*/}
            {/*                        ease: [0.21, 0.47, 0.32, 0.98]*/}
            {/*                    }}*/}
            {/*                    whileHover={{ x: 4 }}*/}
            {/*                    className="block bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.05] hover:border-white/10 transition-all"*/}
            {/*                >*/}
            {/*                    <div className="flex items-start gap-4">*/}
            {/*                        <Github size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />*/}
            {/*                        <div className="flex-1 min-w-0">*/}
            {/*                            <h3 className="text-white font-bold text-base mb-2 truncate">*/}
            {/*                                {repo.author} / {repo.name}*/}
            {/*                            </h3>*/}
            {/*                            <p className="text-gray-400 text-sm mb-3 line-clamp-1">*/}
            {/*                                {repo.description}*/}
            {/*                            </p>*/}
            {/*                            <div className="flex items-center gap-6 text-xs text-gray-500">*/}
            {/*                                {repo.language && (*/}
            {/*                                    <span className="flex items-center gap-1.5">*/}
            {/*                                        <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>*/}
            {/*                                        {repo.language}*/}
            {/*                                    </span>*/}
            {/*                                )}*/}
            {/*                                <span className="flex items-center gap-1">*/}
            {/*                                    <Star size={12} />*/}
            {/*                                    {repo.stars?.toLocaleString() || 0}*/}
            {/*                                </span>*/}
            {/*                                <span className="flex items-center gap-1">*/}
            {/*                                    <GitFork size={12} />*/}
            {/*                                    {repo.forks?.toLocaleString() || 0}*/}
            {/*                                </span>*/}
            {/*                                <span className="text-neon-pink flex items-center gap-1 font-semibold">*/}
            {/*                                    <TrendingUp size={12} />*/}
            {/*                                    {repo.currentPeriodStars || 0} today*/}
            {/*                                </span>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </motion.a>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </motion.div>*/}
            {/*</section>*/}



            {/* FINAL CTA - Modified for Leetcode Company Wise */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center bg-white/[0.03] backdrop-blur-xl rounded-3xl p-16 border border-white/[0.05] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-neon-cyan/5 to-neon-pink/5" />
                        <div className="relative z-10">
                            <Sparkles size={32} className="mx-auto text-neon-cyan mb-6" />
                            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
                                Leetcode Company Wise
                            </h2>
                            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                                Company-focused Leetcode interview lists—find and practice questions by company!
                            </p>
                            <Link to="/resources">
                                <button className="group px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all inline-flex items-center gap-2">
                                    Explore Resources
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>



            <div className="h-20" />
        </div>
    );
};

export default LandingPage;
