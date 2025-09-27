const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
   async getLessonsByCourse(courseId) {
    try {
      console.log('🎯 ApiService: Fetching lessons for course:', courseId);
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const lessons = await response.json();
      console.log('✅ ApiService: Found lessons:', lessons);
      return lessons;
    } catch (error) {
      console.error('❌ ApiService: Error fetching lessons:', error);
      return [];
    }
  }
  // Course methods
  async getAllCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      return [];
    }
  }
   async getLessonsByCourse(courseId) {
    try {
      console.log('🎯 Fetching lessons for course:', courseId);
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const lessons = await response.json();
      console.log('✅ Found lessons:', lessons);
      return lessons;
    } catch (error) {
      console.error('❌ Error fetching lessons:', error);
      return [];
    }
  }

  async getLessonById(lessonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error fetching lesson:', error);
      throw error;
    }
  }

  // 🎯 SINGLE getCourseById method (removed duplicate)
  async getCourseById(id) {
    try {
      console.log('🎯 ApiService: Fetching course ID:', id);
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const course = await response.json();
      console.log('✅ ApiService: Course received:', course);
      return course;
    } catch (error) {
      console.error('❌ ApiService: Error fetching course:', error);
      throw error;
    }
  }

  // Progress Tracking APIs
  async recordVideoPlay(userId, lessonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userId=${userId}&lessonId=${lessonId}`
      });
      return response.json();
    } catch (error) {
      console.error('❌ Error recording video play:', error);
      return null;
    }
  }

  async recordVideoPause(userId, lessonId, currentPosition) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userId=${userId}&lessonId=${lessonId}&currentPosition=${currentPosition}`
      });
      return response.json();
    } catch (error) {
      console.error('❌ Error recording video pause:', error);
      return null;
    }
  }

  async markLessonComplete(userId, lessonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userId=${userId}&lessonId=${lessonId}`
      });
      return response.json();
    } catch (error) {
      console.error('❌ Error marking lesson complete:', error);
      return null;
    }
  }

  async updateWatchTime(userId, lessonId, watchTimeSeconds) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/watch-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `userId=${userId}&lessonId=${lessonId}&watchTimeSeconds=${watchTimeSeconds}`
      });
      return response.json();
    } catch (error) {
      console.error('❌ Error updating watch time:', error);
      return null;
    }
  }

  async getUserProgress(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/users/${userId}/dashboard`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error fetching user progress:', error);
      return null;
    }
  }

  // Auth methods (currently not used since auth is disabled)
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      return null;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Error during logout:', error);
      return false;
    }
  }
}

export default new ApiService();
