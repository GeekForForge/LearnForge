import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Play, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const LessonSidebar = ({ lessons, currentLesson, onLessonSelect }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['1']));

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Group lessons by sections
  const lessonSections = lessons.reduce((acc, lesson) => {
    const sectionId = lesson.sectionId || '1';
    const sectionName = lesson.sectionName || 'Introduction';
    
    if (!acc[sectionId]) {
      acc[sectionId] = {
        id: sectionId,
        name: sectionName,
        lessons: []
      };
    }
    
    acc[sectionId].lessons.push(lesson);
    return acc;
  }, {});

  const sections = Object.values(lessonSections);

  return (
    <div className="h-full bg-dark-800/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-orbitron font-bold text-white mb-6 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Course Content
        </h2>
        
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden">
              {/* Section Header */}
              <motion.button
                onClick={() => toggleSection(section.id)}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className="w-full px-4 py-3 bg-white/5 text-left flex items-center justify-between interactive"
              >
                <div>
                  <h3 className="font-semibold text-white">{section.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {section.lessons.length} lessons
                  </p>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </motion.button>

              {/* Lessons List */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedSections.has(section.id) ? 'auto' : 0,
                  opacity: expandedSections.has(section.id) ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 p-2">
                  {section.lessons.map((lesson, index) => (
                    <motion.button
                      key={lesson.id}
                      onClick={() => onLessonSelect(lesson)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-300 interactive ${
                        currentLesson?.id === lesson.id
                          ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30'
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Lesson Status Icon */}
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-green-500'
                            : lesson.id === currentLesson?.id
                            ? 'bg-neon-purple'
                            : 'bg-gray-600'
                        }`}>
                          {lesson.completed ? (
                            <Check size={14} className="text-white" />
                          ) : (
                            <Play size={12} className="text-white" />
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium truncate ${
                            currentLesson?.id === lesson.id ? 'text-neon-cyan' : 'text-white'
                          }`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{lesson.duration}</span>
                            {lesson.type && (
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                lesson.type === 'video' ? 'bg-red-500/20 text-red-400' :
                                lesson.type === 'reading' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {lesson.type}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Indicator */}
                        {lesson.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-lg border border-white/10"
        >
          <h4 className="font-semibold text-white mb-2">Your Progress</h4>
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Completed</span>
            <span>
              {lessons.filter(l => l.completed).length} / {lessons.length}
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(lessons.filter(l => l.completed).length / lessons.length) * 100}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonSidebar;