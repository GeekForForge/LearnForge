package com.learnforge.service;

import com.learnforge.entity.Course;
import com.learnforge.entity.Lesson;
import com.learnforge.entity.Progress;
import com.learnforge.entity.User;
import com.learnforge.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserStreakService streakService;  // ✅ Fixed name

    // ✅ Get user progress for a course
    public Progress getUserCourseProgress(String userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return progressRepository.findByUserAndCourse(user, course)
                .orElseGet(() -> createNewProgress(user, course));
    }

    private Progress createNewProgress(User user, Course course) {
        Progress progress = new Progress();
        progress.setUser(user);
        progress.setCourse(course);
        progress.setCompletedLessons(new HashSet<>());
        progress.setCreatedAt(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        return progressRepository.save(progress);
    }

    public List<Progress> getAllUserProgress(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return progressRepository.findByUser(user);
    }

    // ✅ Main method to mark lesson complete
    @Transactional
    public Progress markLessonComplete(String userId, Long courseId, Integer lessonId) {
        System.out.println("✅ Marking lesson " + lessonId + " complete for user " + userId);

        Progress progress = getUserCourseProgress(userId, courseId);

        if (progress.getCompletedLessons() == null) {
            progress.setCompletedLessons(new HashSet<>());
        }

        progress.getCompletedLessons().add(lessonId);
        progress.setUpdatedAt(LocalDateTime.now());

        // ✅ Update streak when lesson is completed
        streakService.updateStreakOnLessonComplete(userId);

        return progressRepository.save(progress);  // ✅ Fixed: lowercase 'p'
    }

    @Transactional
    public Progress markLessonIncomplete(String userId, Long courseId, Integer lessonId) {
        System.out.println("❌ Marking lesson " + lessonId + " incomplete for user " + userId);

        Progress progress = getUserCourseProgress(userId, courseId);

        if (progress.getCompletedLessons() != null) {
            progress.getCompletedLessons().remove(lessonId);
            progress.setUpdatedAt(LocalDateTime.now());
        }

        return progressRepository.save(progress);  // ✅ Fixed: lowercase 'p'
    }

    public Map<String, Object> getProgressSummary(String userId) {
        List<Progress> progressList = getAllUserProgress(userId);

        int totalCourses = progressList.size();
        int completedCourses = 0;
        int totalLessons = 0;
        int completedLessons = 0;

        for (Progress progress : progressList) {
            Course course = progress.getCourse();
            List<Lesson> lessons = lessonRepository.findByCourse(course);

            int courseLessonCount = lessons.size();
            int courseCompletedCount = progress.getCompletedLessons() != null
                    ? progress.getCompletedLessons().size() : 0;

            totalLessons += courseLessonCount;
            completedLessons += courseCompletedCount;

            if (courseLessonCount > 0 && courseCompletedCount == courseLessonCount) {
                completedCourses++;
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCourses", totalCourses);
        summary.put("completedCourses", completedCourses);
        summary.put("totalLessons", totalLessons);
        summary.put("completedLessons", completedLessons);
        summary.put("overallProgress", totalLessons > 0 ? (completedLessons * 100.0 / totalLessons) : 0);

        return summary;
    }
}
