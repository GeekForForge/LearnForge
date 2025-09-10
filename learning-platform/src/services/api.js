const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // Existing course methods
  async getAllCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`);
    return response.json();
  }

  async getCourseById(id) {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) {
      throw new Error(`Course not found: ${response.status}`);
    }
    return response.json();
  }

  // Progress Tracking APIs
  async recordVideoPlay(userId, lessonId) {
    const response = await fetch(`${API_BASE_URL}/progress/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userId=${userId}&lessonId=${lessonId}`
    });
    return response.json();
  }

  async recordVideoPause(userId, lessonId, currentPosition) {
    const response = await fetch(`${API_BASE_URL}/progress/pause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userId=${userId}&lessonId=${lessonId}&currentPosition=${currentPosition}`
    });
    return response.json();
  }

  async markLessonComplete(userId, lessonId) {
    const response = await fetch(`${API_BASE_URL}/progress/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userId=${userId}&lessonId=${lessonId}`
    });
    return response.json();
  }

  async updateWatchTime(userId, lessonId, watchTimeSeconds) {
    const response = await fetch(`${API_BASE_URL}/progress/watch-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `userId=${userId}&lessonId=${lessonId}&watchTimeSeconds=${watchTimeSeconds}`
    });
    return response.json();
  }

  async getUserProgress(userId) {
    const response = await fetch(`${API_BASE_URL}/progress/users/${userId}/dashboard`);
    return response.json();
  }
}

export default new ApiService();
