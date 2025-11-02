import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Rocket, Code, Heart, Zap, Target, Award,
    BookOpen, Users, TrendingUp, Coffee, Brain,
    Sparkles, Globe, Shield, ChevronRight,
    GraduationCap, Lightbulb, Compass
} from 'lucide-react';
import ApiService from '../services/api';

const AboutPage = ({ setCurrentPage }) => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalLessons: 0
    });

    useEffect(() => {
        setCurrentPage('about');
        fetchStats();
    }, [setCurrentPage]);

    const fetchStats = async () => {
        try {
            const courses = await ApiService.getAllCourses();
            setStats({
                totalCourses: courses.length,
                totalLessons: 25
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const values = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Made with Love",
            description: "Every course is handcrafted with attention to detail and real-world relevance",
            color: "text-red-400"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "No Fake Promises",
            description: "Straightforward learning without exaggerated claims or hidden costs",
            color: "text-blue-400"
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Project-Based",
            description: "Learn by building real applications that solve actual problems",
            color: "text-green-400"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community Driven",
            description: "Built for developers, by developers who understand the learning journey",
            color: "text-purple-400"
        }
    ];

    const journey = [
        {
            year: "2023",
            title: "The Spark",
            description: "Started collecting and organizing learning resources while learning to code",
            icon: <Lightbulb className="w-6 h-6" />,
            color: "from-yellow-400 to-orange-500"
        },
        {
            year: "2024",
            title: "Structured Learning",
            description: "Transformed personal notes into structured courses with clear learning paths",
            icon: <Compass className="w-6 h-6" />,
            color: "from-blue-400 to-cyan-500"
        },
        {
            year: "Present",
            title: "LearnForge Today",
            description: "A growing platform focused on making quality education accessible to all",
            icon: <Rocket className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-12">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.4, 0.2, 0.4],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-sm text-gray-300 mb-8"
                        >
                            <Sparkles size={14} className="text-neon-cyan" />
                            Authentic Learning Journey
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
                About LearnForge
              </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                            A personal mission to create the learning platform
                            <span className="text-neon-cyan font-semibold"> I wish existed</span> when I started coding
                        </p>

                        {/* Simple Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-8 flex-wrap"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{stats.totalCourses}+</div>
                                <div className="text-gray-400 text-sm">Handpicked Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">100%</div>
                                <div className="text-gray-400 text-sm">Free Forever</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">Real</div>
                                <div className="text-gray-400 text-sm">Projects</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 relative">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            The Story Behind{' '}
                            <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                LearnForge
              </span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            From personal notes to a platform that helps developers worldwide
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Personal Intro */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center">
                                    <Brain className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Hey, I'm Samarth 👋</h3>
                                    <p className="text-neon-cyan">Creator & Developer</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    LearnForge started as my personal collection of programming tutorials and resources.
                                    I was frustrated with courses that were either outdated, too theoretical, or filled with empty promises.
                                </p>

                                <p>
                                    So I decided to build something different—a platform focused on
                                    <span className="text-neon-cyan font-semibold"> real skills</span>,
                                    <span className="text-neon-purple font-semibold"> practical projects</span>, and
                                    <span className="text-neon-pink font-semibold"> honest learning</span>.
                                </p>

                                <p>
                                    Every course here is something I wish I had when I started learning.
                                    No fluff, no fake testimonials—just quality content that actually helps you build real things.
                                </p>
                            </div>
                        </motion.div>

                        {/* Journey Timeline */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {journey.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0`}>
                                        <div className="text-white">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-neon-cyan font-bold text-lg mb-1">{step.year}</div>
                                        <h4 className="text-white font-semibold text-lg mb-2">{step.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 relative bg-gradient-to-b from-transparent to-white/[0.02]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Our <span className="text-gradient">Values</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            The principles that guide everything we create and share
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className={`${value.color} mb-4 group-hover:scale-110 transition-transform`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 relative">
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <Target className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Our <span className="text-gradient">Mission</span>
                        </h2>

                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                            <p className="text-2xl text-gray-300 leading-relaxed mb-8">
                                To create a learning platform where quality education is
                                <span className="text-neon-cyan font-semibold"> free</span>,
                                <span className="text-neon-purple font-semibold"> accessible</span>, and
                                <span className="text-neon-pink font-semibold"> honest</span>
                            </p>

                            <p className="text-lg text-gray-400 leading-relaxed">
                                We believe that everyone deserves access to quality programming education without
                                financial barriers or misleading promises. LearnForge is our commitment to making
                                that belief a reality—one course, one project, one developer at a time.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 relative">
                <div className="container mx-auto px-6 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center bg-gradient-to-br from-neon-purple/10 via-neon-cyan/10 to-neon-pink/10 backdrop-blur-xl rounded-3xl p-16 border border-white/10"
                    >
                        <Coffee className="w-16 h-16 text-neon-cyan mx-auto mb-8" />

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Learning?
                        </h2>

                        <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                            Join developers worldwide who are building real skills with practical, project-based courses
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/courses">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-3"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Explore Courses
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </Link>

                            <Link to="/community">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-3"
                                >
                                    <Users className="w-5 h-5" />
                                    Join Community
                                </motion.button>
                            </Link>
                        </div>

                        <p className="text-gray-400 text-sm mt-8">
                            Have questions or want to contribute? I'd love to hear from you! 💙
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;