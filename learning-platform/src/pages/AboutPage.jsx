import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Rocket, Code, Heart, Zap, Target, Award, 
  BookOpen, Users, TrendingUp, Coffee, Brain,
  Sparkles, Globe, Shield, ChevronRight
} from 'lucide-react';
import ApiService from '../services/api';

const AboutPage = ({ setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalHours: 0
  });

  useEffect(() => {
    setCurrentPage('about');
    fetchStats();
  }, [setCurrentPage]);

    const fetchStats = async () => {
        try {
            const courses = await ApiService.getAllCourses();

            let totalLessons = 0;

            for (const course of courses) {
                try {
                    const lessons = await ApiService.getLessonsByCourse(course.courseId);
                    totalLessons += lessons.length;
                } catch (error) {
                    console.error(`Error fetching lessons for course ${course.courseId}:`, error);
                }
            }

            setStats({
                totalCourses: courses.length,
                totalLessons: totalLessons,
                totalHours: Math.ceil(totalLessons / 5) // approximate hours per 5 lessons
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };


    const journey = [
    {
      year: "2023",
      title: "The Beginning",
      description: "Started collecting development resources while learning to code myself",
      icon: <Sparkles className="text-neon-purple" />
    },
    {
      year: "2024",
      title: "First Course Created",
      description: "Decided to organize my learning path into structured courses",
      icon: <BookOpen className="text-neon-cyan" />
    },
    {
      year: "2025",
      title: "LearnForge Launch",
      description: "Made the platform public - free learning for everyone",
      icon: <Rocket className="text-neon-pink" />
    }
  ];

  const values = [
    {
      icon: <Shield className="text-neon-cyan" />,
      title: "No BS Policy",
      description: "Straight to the point. No fake promises, no inflated numbers, just real learning."
    },
    {
      icon: <Heart className="text-neon-pink" />,
      title: "Always Free",
      description: "Education should be accessible. Everything on LearnForge is 100% free, forever."
    },
    {
      icon: <Code className="text-neon-purple" />,
      title: "Project-Based",
      description: "Learn by building real projects. Theory is important, but practice makes perfect."
    },
    {
      icon: <Users className="text-yellow-400" />,
      title: "Community First",
      description: "Built by developers, for developers. We're all learning together."
    }
  ];

  const techStack = [
    { name: "React", color: "#61DAFB" },
    { name: "Spring Boot", color: "#6DB33F" },
    { name: "Tailwind CSS", color: "#06B6D4" },
    { name: "Framer Motion", color: "#FF0055" },
    { name: "MySQL", color: "#4479A1" },
    { name: "Java", color: "#ED8B00" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              About LearnForge
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Where passion meets code. A personal mission to make quality programming education 
              <span className="text-neon-cyan font-bold"> free and accessible</span> for everyone.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[
                { icon: <BookOpen size={20} />, label: `${stats.totalCourses}+ Courses` },
                { icon: <Code size={20} />, label: `${stats.totalLessons}+ Lessons` },
                { icon: <Users size={20} />, label: "100% Free" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full"
                >
                  <span className="text-neon-cyan">{stat.icon}</span>
                  <span className="text-white font-semibold">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-8 text-center bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              The Story Behind LearnForge
            </h2>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center">
                  <Brain size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Hey, I'm Samarth! 👋</h3>
                  <p className="text-neon-cyan">Creator of LearnForge</p>
                </div>
              </div>

              <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                <p>
                  LearnForge started as my personal collection of programming tutorials and resources. 
                  I was tired of paying for courses that were either outdated, too theoretical, or just 
                  didn't teach what actually matters in real development work.
                </p>

                <p className="text-white font-semibold">
                  So I decided to build something different.
                </p>

                <p>
                  Every course here is handpicked. Every project is tested. Every lesson has a purpose. 
                  No fake testimonials, no inflated success rates, no "get hired in 30 days" promises.
                </p>

                <p>
                  Just <span className="text-neon-cyan font-bold">real content</span>, built by someone 
                  who's still learning (because let's be honest, we're all still learning), for people 
                  who want to actually <span className="text-neon-pink font-bold">build things</span>.
                </p>

                <div className="pt-6 border-t border-white/20">
                  <p className="text-neon-purple font-semibold italic">
                    "The best way to learn is to build. The best way to grow is to share what you've learned."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              The Journey
            </h2>
            <p className="text-gray-300 text-lg">How a personal project became a learning platform</p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-purple via-neon-cyan to-neon-pink transform -translate-x-1/2 hidden md:block" />

            {journey.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition-all">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <span className="text-neon-cyan font-bold text-lg">{item.year}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>

                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-dark-900 z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              What We Stand For
            </h2>
            <p className="text-gray-300 text-lg">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-neon-purple/50 transition-all"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-orbitron font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Built With Modern Tech
            </h2>
            <p className="text-gray-300 text-lg">The technologies powering LearnForge</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-neon-purple/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="text-white font-semibold text-lg">{tech.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Target size={64} className="text-neon-purple mx-auto mb-8" />
            <h2 className="text-4xl font-orbitron font-bold mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-2xl text-gray-300 leading-relaxed mb-8">
              To make quality programming education <span className="text-neon-cyan font-bold">free and accessible</span> 
              {' '}for everyone, without fake promises or hidden paywalls.
            </p>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <p className="text-gray-300 leading-relaxed text-lg">
                Every developer deserves access to quality learning resources. No one should be held back 
                by expensive courses or subscription models. LearnForge exists to level the playing field 
                and give everyone a fair shot at learning to code.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-3xl p-12 text-center border border-white/20">
              <Coffee size={64} className="text-neon-cyan mx-auto mb-8" />
              <h2 className="text-4xl font-orbitron font-bold text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers learning and building real projects. 
                No credit card required. Start learning in 30 seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-white text-dark-900 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg flex items-center gap-2"
                  >
                    Browse Courses
                    <ChevronRight size={20} />
                  </motion.button>
                </Link>
                
                <a 
                  href="mailto:patilsamarthsachin@gmail.com?subject=Let's Connect&body=Hi Samarth, I loved LearnForge!"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Get in Touch
                  </motion.button>
                </a>
              </div>

              <p className="text-gray-400 text-sm mt-8">
                Have questions? Want to contribute? Just want to say hi? I'd love to hear from you! 💙
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
