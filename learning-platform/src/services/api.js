const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
    // ============================================
    // COURSE METHODS
    // ============================================

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

    // ============================================
    // LESSON METHODS (WITH RESOURCES)
    // ============================================

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
            console.log('✅ ApiService: Found lessons with resources:', lessons);
            return lessons;
        } catch (error) {
            console.error('❌ ApiService: Error fetching lessons:', error);
            return [];
        }
    }

    async getLessonById(courseId, lessonId) {
        try {
            console.log('🎯 ApiService: Fetching lesson:', lessonId, 'from course:', courseId);
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const lesson = await response.json();
            console.log('✅ ApiService: Lesson with resources:', lesson);
            return lesson;
        } catch (error) {
            console.error('❌ ApiService: Error fetching lesson:', error);
            throw error;
        }
    }

    // ============================================
    // RESOURCE METHODS
    // ============================================

    async getResourcesByLesson(courseId, lessonId) {
        try {
            console.log('🎯 ApiService: Fetching resources for lesson:', lessonId);
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/resources`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resources = await response.json();
            console.log('✅ ApiService: Found resources:', resources);
            return resources;
        } catch (error) {
            console.error('❌ ApiService: Error fetching resources:', error);
            return [];
        }
    }

    async addResourceToLesson(courseId, lessonId, resource) {
        try {
            console.log('🎯 ApiService: Adding resource to lesson:', lessonId);
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resource),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const savedResource = await response.json();
            console.log('✅ ApiService: Resource added:', savedResource);
            return savedResource;
        } catch (error) {
            console.error('❌ ApiService: Error adding resource:', error);
            throw error;
        }
    }

    async deleteResource(courseId, lessonId, resourceId) {
        try {
            console.log('🎯 ApiService: Deleting resource:', resourceId);
            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/resources/${resourceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('✅ ApiService: Resource deleted');
            return true;
        } catch (error) {
            console.error('❌ ApiService: Error deleting resource:', error);
            throw error;
        }
    }

    // ============================================
    // PROGRESS TRACKING APIs
    // ============================================

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

    // ============================================
    // AUTH METHODS
    // ============================================

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
