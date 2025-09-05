import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative z-10 bg-dark-800/50 backdrop-blur-sm border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
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
              <p className="text-gray-400 max-w-md leading-relaxed">
                Empowering the next generation of developers with immersive, 
                futuristic learning experiences. Master programming skills 
                through our cutting-edge platform.
              </p>
            </motion.div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
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
                    className="text-gray-400 group-hover:text-neon-purple transition-colors" 
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
                {['Home', 'Courses', 'About', 'Contact'].map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="interactive text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Courses */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold text-white mb-6">Popular Courses</h4>
              <ul className="space-y-3">
                {['DSA in Java', 'Spring Boot', 'React Mastery', 'TypeScript'].map((course) => (
                  <li key={course}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="interactive text-gray-400 hover:text-neon-pink transition-colors duration-300"
                    >
                      {course}
                    </motion.a>
                  </li>
                ))}
              </ul>
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
          <p className="text-gray-400 text-sm">
            © 2025 LearnForge. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <motion.a
              href="#"
              whileHover={{ color: '#8B5CF6' }}
              className="interactive text-gray-400 hover:text-neon-purple text-sm transition-colors"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: '#06B6D4' }}
              className="interactive text-gray-400 hover:text-neon-cyan text-sm transition-colors"
            >
              Terms of Service
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: '#EC4899' }}
              className="interactive text-gray-400 hover:text-neon-pink text-sm transition-colors"
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-50" />
    </footer>
  );
};

export default Footer;