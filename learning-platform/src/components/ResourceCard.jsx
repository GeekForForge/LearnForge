import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, BookOpen } from 'lucide-react';

const ResourceCard = ({ resource, index }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'video':
        return Play;
      case 'article':
        return BookOpen;
      case 'github':
        return Github;
      default:
        return ExternalLink;
    }
  };

  const getColorScheme = (type) => {
    switch (type) {
      case 'video':
        return {
          gradient: 'from-red-500 to-pink-500',
          glow: 'shadow-red-500/30',
          hover: 'hover:shadow-red-500/50',
        };
      case 'article':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          glow: 'shadow-blue-500/30',
          hover: 'hover:shadow-blue-500/50',
        };
      case 'github':
        return {
          gradient: 'from-gray-600 to-gray-800',
          glow: 'shadow-gray-500/30',
          hover: 'hover:shadow-gray-500/50',
        };
      default:
        return {
          gradient: 'from-neon-purple to-neon-cyan',
          glow: 'shadow-neon-purple/30',
          hover: 'hover:shadow-neon-purple/50',
        };
    }
  };

  const Icon = getIcon(resource.type);
  const colorScheme = getColorScheme(resource.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative"
    >
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="interactive block"
      >
        <div className={`relative p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 ${colorScheme.glow} ${colorScheme.hover}`}>
          {/* Background Glow */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colorScheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          <div className="relative z-10 flex items-center space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${colorScheme.gradient} p-0.5`}>
              <div className="w-full h-full rounded-lg bg-dark-800 flex items-center justify-center">
                <Icon size={20} className="text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate group-hover:text-neon-cyan transition-colors">
                {resource.title}
              </h4>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {resource.description}
              </p>
              
              {/* Resource Type Badge */}
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white bg-gradient-to-r ${colorScheme.gradient}`}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
                {resource.duration && (
                  <span className="ml-2 text-xs text-gray-400">
                    {resource.duration}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              className="flex-shrink-0"
            >
              <ExternalLink size={16} className="text-gray-400 group-hover:text-neon-cyan transition-colors" />
            </motion.div>
          </div>

          {/* Hover Border Effect */}
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colorScheme.gradient} p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}>
            <div className="w-full h-full rounded-xl bg-dark-900" />
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default ResourceCard;