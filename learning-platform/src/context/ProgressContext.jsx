import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'https://learnforge.onrender.com/api';

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      console.log('🔄 Loading progress for user:', user.userId);
      loadAllProgress();
      loadSummary();
    }
  }, [isAuthenticated, user]);

  const loadAllProgress = async () => {
    if (!user?.userId) {
      console.warn('⚠️ No userId, skipping progress load');
      return;
    }
    
    try {
      setLoading(true);
      console.log('📡 Fetching all progress for user:', user.userId);
      
      const response = await axios.get(`${API_BASE_URL}/progress/user/${user.userId}`);
      const allProgress = response.data;
      
      console.log('✅ Progress loaded:', allProgress);
      
      const progressMap = {};
      allProgress.forEach(progress => {
        progressMap[progress.course.courseId] = progress;
      });
      
      setProgressData(progressMap);
      console.log('💾 Progress stored in state:', progressMap);
    } catch (error) {
      console.error('❌ Error loading progress:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/user/${user.userId}/summary`);
      setSummary(response.data);
      console.log('📊 Summary loaded:', response.data);
    } catch (error) {
      console.error('❌ Error loading summary:', error);
    }
  };

  const getCourseProgress = async (courseId) => {
    if (!user?.userId) {
      console.warn('⚠️ No user, cannot get progress');
      return null;
    }
    
    // Return cached if available
    if (progressData[courseId]) {
      console.log('💾 Using cached progress for course:', courseId);
      return progressData[courseId];
    }

    // Fetch if not cached
    try {
      console.log('📡 Fetching progress for course:', courseId);
      const response = await axios.get(
        `${API_BASE_URL}/progress/user/${user.userId}/course/${courseId}`
      );
      const progress = response.data;
      
      console.log('✅ Course progress loaded:', progress);
      
      setProgressData(prev => ({
        ...prev,
        [courseId]: progress
      }));
      
      return progress;
    } catch (error) {
      console.error('❌ Error getting course progress:', error);
      return null;
    }
  };

  const markLessonComplete = async (courseId, lessonId) => {
    if (!user?.userId) {
      console.error('❌ No user logged in!');
      alert('Please login to track progress');
      return false;
    }
    
    try {
      console.log('🚀 Marking lesson complete:', {
        userId: user.userId,
        courseId: parseInt(courseId),
        lessonId: parseInt(lessonId)
      });
      
      const response = await axios.post(
        `${API_BASE_URL}/progress/update`,
        {
          userId: user.userId,
          courseId: parseInt(courseId),
          lessonId: parseInt(lessonId)
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedProgress = response.data;
      console.log('✅ Lesson marked complete! Response:', updatedProgress);

      // Update local state immediately
      setProgressData(prev => ({
        ...prev,
        [courseId]: updatedProgress
      }));

      // Reload summary
      loadSummary();
      
      return true;
    } catch (error) {
      console.error('❌ Failed to mark lesson complete:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      alert('Failed to update progress: ' + (error.response?.data || error.message));
      return false;
    }
  };

  const markLessonIncomplete = async (courseId, lessonId) => {
    if (!user?.userId) return false;
    
    try {
      console.log('🔄 Unmarking lesson:', {
        userId: user.userId,
        courseId: parseInt(courseId),
        lessonId: parseInt(lessonId)
      });
      
      const response = await axios.post(
        `${API_BASE_URL}/progress/undo`,
        {
          userId: user.userId,
          courseId: parseInt(courseId),
          lessonId: parseInt(lessonId)
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedProgress = response.data;
      console.log('✅ Lesson unmarked! Response:', updatedProgress);

      // Update local state
      setProgressData(prev => ({
        ...prev,
        [courseId]: updatedProgress
      }));

      // Reload summary
      loadSummary();
      
      return true;
    } catch (error) {
      console.error('❌ Error unmarking lesson:', error.response?.data || error.message);
      alert('Failed to undo progress: ' + (error.response?.data || error.message));
      return false;
    }
  };

  const isLessonCompleted = (courseId, lessonId) => {
    const progress = progressData[courseId];
    if (!progress || !progress.completedLessons) {
      console.log('🔍 No progress found for course:', courseId);
      return false;
    }
    
    const isCompleted = progress.completedLessons.includes(parseInt(lessonId));
    console.log('🔍 Lesson', lessonId, 'completed?', isCompleted);
    return isCompleted;
  };

  return (
    <ProgressContext.Provider value={{
      progressData,
      summary,
      loading,
      getCourseProgress,
      markLessonComplete,
      markLessonIncomplete,
      isLessonCompleted,
      refreshProgress: loadAllProgress,
      refreshSummary: loadSummary
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
