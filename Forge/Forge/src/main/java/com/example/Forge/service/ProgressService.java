package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Lesson;
import com.example.Forge.entity.Progress;
import com.example.Forge.entity.User;
import com.example.Forge.repository.CourseRepository;
import com.example.Forge.repository.LessonRepository;
import com.example.Forge.repository.ProgressRepository;
import com.example.Forge.repository.UserRepository;
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

    public Progress markLessonComplete(String userId, Long courseId, Integer lessonId) {
        Progress progress = getUserCourseProgress(userId, courseId);

        if (progress.getCompletedLessons() == null) {
            progress.setCompletedLessons(new HashSet<>());
        }

        progress.getCompletedLessons().add(lessonId);
        progress.setUpdatedAt(LocalDateTime.now());

        return progressRepository.save(progress);
    }

    public Progress markLessonIncomplete(String userId, Long courseId, Integer lessonId) {
        Progress progress = getUserCourseProgress(userId, courseId);

        if (progress.getCompletedLessons() != null) {
            progress.getCompletedLessons().remove(lessonId);
            progress.setUpdatedAt(LocalDateTime.now());
        }

        return progressRepository.save(progress);
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
