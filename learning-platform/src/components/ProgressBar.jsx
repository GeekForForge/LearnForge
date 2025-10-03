import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress, 
  percentage, // Accept both props for backwards compatibility
  color = 'purple', 
  size = 'md', 
  animated = true,
  showLabel = true 
}) => {
  // Use either progress or percentage prop
  const value = progress !== undefined ? progress : percentage || 0;
  
  // Ensure value is valid number between 0-100
  const validProgress = isNaN(value) ? 0 : Math.min(Math.max(value, 0), 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    purple: 'from-neon-purple to-purple-600',
    cyan: 'from-neon-cyan to-cyan-600',
    pink: 'from-neon-pink to-pink-600',
    blue: 'from-neon-blue to-blue-600',
  };

  const glowClasses = {
    purple: 'shadow-neon-purple',
    cyan: 'shadow-neon-cyan',
    pink: 'shadow-neon-pink',
    blue: 'shadow-neon-blue',
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className={`w-full bg-dark-700/50 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${validProgress}%` }}
          transition={{ duration: animated ? 1.5 : 0, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} ${glowClasses[color]} relative`}
        >
          {/* Animated shine effect */}
          {animated && validProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
          )}
        </motion.div>
      </div>

      {/* Progress Text */}
      {showLabel && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-400">Progress</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: animated ? 0.5 : 0 }}
            className="text-sm font-semibold text-white"
          >
            {Math.round(validProgress)}%
          </motion.span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
