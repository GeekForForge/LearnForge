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
            console.log('✅ ApiService: Found lessons:', lessons);
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
            console.log('✅ ApiService: Lesson received:', lesson);
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
            console.log('   📦 Resource data received:', resource);

            // ✅ Map frontend field names to backend field names
            const resourceData = {
                title: resource.title || resource.name || resource.resourceTitle || '',
                type: resource.type || resource.resourceType || '',
                url: resource.url || resource.resourceUrl || '',
                description: resource.description || ''
            };

            console.log('   📤 Sending to backend:', resourceData);

            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/resources`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resourceData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend error:', errorText);
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
            console.log('🔐 Fetching current user...');
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.log('❌ Response not OK:', response.status);
                return null;
            }

            const data = await response.json();
            console.log('✅ User data received:', data);
            console.log('  - isAdmin:', data.isAdmin);
            return data;
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
    // ============================================
// STREAK METHODS
// ============================================

    async getUserStreak(userId) {
        try {
            console.log('🔥 ApiService: Fetching streak for user:', userId);
            const response = await fetch(`${API_BASE_URL}/streaks/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const streak = await response.json();
            console.log('✅ ApiService: Streak data:', streak);
            return streak;
        } catch (error) {
            console.error('❌ ApiService: Error fetching streak:', error);
            return {
                currentStreak: 0,
                longestStreak: 0,
                totalLessonsCompleted: 0
            };
        }
    }

}

export default new ApiService();
