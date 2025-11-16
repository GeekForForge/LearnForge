const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'https://learnforge.onrender.com/api';

class ApiService {

    async getAllCourses() {
        try {
            const response = await fetch(`${API_BASE_URL}/courses`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('❌ Error fetching courses:', error);
            return [];
        }
    }

    async getGfgMetrics(handle) {
        try {
            console.log(`🎯 ApiService: Fetching GFG stats for ${handle}`);
            const response = await fetch(`${API_BASE_URL}/gfg/${handle}`, { // Assumes /api/gfg
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch GFG metrics');
            }

            // --- UPDATED BLOCK ---
            // 1. Get response as text first
            const text = await response.text();

            // 2. Check if text is empty
            if (!text || text.trim() === '') {
                console.log('✅ ApiService: GFG user not found or not connected (empty response).');
                return null; // Return null, which is expected
            }

            // 3. Only parse if text is not empty
            const data = JSON.parse(text);
            console.log('✅ ApiService: GFG stats received:', data);
            return data;
            // --- END UPDATED BLOCK ---

        } catch (error) {
            console.error('❌ ApiService: Error in getGfgMetrics:', error);
            throw error;
        }
    }

    async syncGfgMetrics(handle) {
        try {
            const response = await fetch(`${API_BASE_URL}/gfg/sync/${handle}`, { // Assumes /api/gfg
                method: "POST",
                credentials: "include"
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to force sync GFG metrics");
            }
            return await response.json();
        } catch (error) {
            console.error("ApiService Error in syncGfgMetrics", error);
            throw error;
        }
    }

    // ============================================
    // CODECHEF METHODS (NEW)
    // ============================================
    async getCodeChefMetrics(handle) {
        try {
            console.log(`🎯 ApiService: Fetching CodeChef stats for ${handle}`);
            const response = await fetch(`${API_BASE_URL}/codechef/${handle}`, { // Assumes /api/codechef
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch CodeChef metrics');
            }

            // --- UPDATED BLOCK ---
            // 1. Get response as text first
            const text = await response.text();

            // 2. Check if text is empty
            if (!text || text.trim() === '') {
                console.log('✅ ApiService: CodeChef user not found or not connected (empty response).');
                return null; // Return null, which is expected
            }

            // 3. Only parse if text is not empty
            const data = JSON.parse(text); // This was line 72
            console.log('✅ ApiService: CodeChef stats received:', data);
            return data;
            // --- END UPDATED BLOCK ---

        } catch (error) {
            console.error('❌ ApiService: Error in getCodeChefMetrics:', error);
            throw error;
        }
    }

    async syncCodeChefMetrics(handle) {
        try {
            const response = await fetch(`${API_BASE_URL}/codechef/sync/${handle}`, { // Assumes /api/codechef
                method: "POST",
                credentials: "include"
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to force sync CodeChef metrics");
            }
            return await response.json();
        } catch (error) {
            console.error("ApiService Error in syncCodeChefMetrics", error);
            throw error;
        }
    }
    async getCourseById(id) {
        try {
            console.log('🎯 ApiService: Fetching course ID:', id);
            const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
                method: 'GET',
                credentials: 'include',
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
                credentials: 'include',
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
                credentials: 'include',
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
                credentials: 'include',
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

            const resourceData = {
                title: resource.title || resource.name || resource.resourceTitle || '',
                type: resource.type || resource.resourceType || '',
                url: resource.url || resource.resourceUrl || '',
                description: resource.description || ''
            };

            console.log('   📤 Sending to backend:', resourceData);

            const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/resources`, {
                method: 'POST',
                credentials: 'include',
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
                credentials: 'include',
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
                credentials: 'include',
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
                credentials: 'include',
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
                credentials: 'include',
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
                credentials: 'include',
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
            const response = await fetch(`${API_BASE_URL}/progress/users/${userId}/dashboard`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('❌ Error fetching user progress:', error);
            return null;
        }
    }

    // ✅ --- NEW FUNCTION ---
    // This is needed by SettingsPage.jsx
    async updateUser(userId, data) {
        try {
            console.log(`🎯 ApiService: Updating user ${userId}`);
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: You may need to add Authorization headers if your endpoint is secured
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update user');
            }
            return await response.json();
        } catch (error) {
            console.error('❌ Error updating user:', error);
            throw error;
        }
    }
    // --- END NEW FUNCTION ---


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

    async loginWithEmail(email, password) {
        try {
            console.log('🔐 ApiService: Email login attempt');
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('✅ ApiService: Email login successful');
            return { success: true, data };
        } catch (error) {
            console.error('❌ ApiService: Email login error:', error);
            return { success: false, error: error.message };
        }
    }

    async signupWithEmail(name, email, password) {
        try {
            console.log('🔐 ApiService: Email signup attempt');
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            const data = await response.json();
            console.log('✅ ApiService: Email signup successful');
            return { success: true, data };
        } catch (error) {
            console.error('❌ ApiService: Email signup error:', error);
            return { success: false, error: error.message };
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
                credentials: 'include',
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

    // ============================================
    // LEETCODE METHODS (NEW)
    // ============================================
    async getLeetCodeMetrics(handle) {
        try {
            console.log(`🎯 ApiService: Fetching LeetCode stats for ${handle}`);
            const response = await fetch(`${API_BASE_URL}/leetcode/${handle}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to fetch LeetCode metrics');
            }

            // --- UPDATED BLOCK ---
            const text = await response.text();
            if (!text || text.trim() === '') {
                console.log('✅ ApiService: LeetCode user not found or not connected (empty response).');
                return null;
            }
            const data = JSON.parse(text);
            // --- END UPDATED BLOCK ---

            console.log('✅ ApiService: LeetCode stats received:', data);
            return data;
        } catch (error) {
            console.error('❌ ApiService: Error in getLeetCodeMetrics:', error);
            throw error;
        }
    }

    async syncLeetCodeMetrics(handle) {
        try {
            const response = await fetch(`${API_BASE_URL}/leetcode/sync/${handle}`, {
                method: "POST",
                credentials: "include"
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to force sync LeetCode metrics");
            }
            const data = await response.json();
            console.log("ApiService: LeetCode stats forced sync received", data);
            return data;
        } catch (error) {
            console.error("ApiService Error in syncLeetCodeMetrics", error);
            throw error;
        }
    }
}

export default new ApiService();