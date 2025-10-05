package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Lesson;
import com.example.Forge.entity.Resource;
import com.example.Forge.repository.CourseRepository;
import com.example.Forge.repository.LessonRepository;
import com.example.Forge.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        System.out.println("📚 Fetching lessons for course " + courseId);
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByLessonIdAsc(courseId);
        System.out.println("✅ Found " + lessons.size() + " lessons");

        // ✅ Add resources to each lesson
        for (Lesson lesson : lessons) {
            List<Resource> resources = resourceRepository.findByLessonId(lesson.getLessonId());
            lesson.setResources(resources);
            System.out.println("  → Lesson " + lesson.getLessonId() + ": " + lesson.getLessonName() + " | Resources: " + resources.size());
        }

        return lessons;
    }

    public Lesson getLessonById(Long lessonId) {
        System.out.println("📖 Fetching lesson " + lessonId);
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // ✅ Add resources
        List<Resource> resources = resourceRepository.findByLessonId(lessonId);
        lesson.setResources(resources);
        System.out.println("✅ Lesson found with " + resources.size() + " resources");

        return lesson;
    }

    public Lesson getFirstLessonOfCourse(Long courseId) {
        Lesson lesson = lessonRepository.findFirstByCourseId(courseId)
                .orElseThrow(() -> new RuntimeException("No lessons found"));

        // ✅ Add resources
        List<Resource> resources = resourceRepository.findByLessonId(lesson.getLessonId());
        lesson.setResources(resources);

        return lesson;
    }

    public Long countLessonsByCourseId(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }

    @Transactional
    public Lesson createLesson(Long courseId, Lesson lesson) {
        System.out.println("➕ Creating lesson for course " + courseId);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        lesson.setCourse(course);
        Lesson saved = lessonRepository.save(lesson);
        saved.setResources(List.of()); // Empty resources for new lesson
        System.out.println("✅ Lesson created with ID: " + saved.getLessonId());
        return saved;
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, Lesson lessonDetails) {
        System.out.println("📝 Updating lesson " + lessonId);
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setLessonName(lessonDetails.getLessonName());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());
        lesson.setDuration(lessonDetails.getDuration());

        Lesson updated = lessonRepository.save(lesson);

        // ✅ Add resources
        List<Resource> resources = resourceRepository.findByLessonId(lessonId);
        updated.setResources(resources);

        System.out.println("✅ Lesson updated");
        return updated;
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        System.out.println("🗑️ Deleting lesson " + lessonId);

        // Delete associated resources first
        resourceRepository.deleteByLessonId(lessonId);

        lessonRepository.deleteById(lessonId);
        System.out.println("✅ Lesson deleted");
    }

    // For ProgressService compatibility
    public List<Lesson> getLessonsByCourse(Course course) {
        return lessonRepository.findByCourse(course);
    }

    public Long countLessonsByCourse(Course course) {
        return lessonRepository.countByCourse(course);
    }

    public Lesson getFirstLessonOfCourse(Course course) {
        return lessonRepository.findFirstByCourseOrderByLessonIdAsc(course)
                .orElseThrow(() -> new RuntimeException("No lessons found"));
    }
}
