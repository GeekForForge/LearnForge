import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class ProgressService {
  // Get user's progress for a specific course
  async getUserCourseProgress(userId, courseId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/progress/user/${userId}/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  // Get all progress for a user
  async getAllUserProgress(userId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/progress/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all progress:', error);
      return [];
    }
  }

  // Mark lesson as complete
  async markLessonComplete(userId, courseId, lessonId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/progress/update`,
        {
          userId,
          courseId,
          lessonId
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      throw error;
    }
  }

  // Mark lesson as incomplete (undo)
  async markLessonIncomplete(userId, courseId, lessonId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/progress/undo`,
        {
          userId,
          courseId,
          lessonId
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking lesson incomplete:', error);
      throw error;
    }
  }

  // Get progress summary (dashboard stats)
  async getProgressSummary(userId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/progress/user/${userId}/summary`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching progress summary:', error);
      return {
        totalCourses: 0,
        completedCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        overallProgress: 0
      };
    }
  }

  // Calculate progress percentage for a course
  calculateProgressPercentage(completedLessons, totalLessons) {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  }
}

export default new ProgressService();
