package com.learnforge.service;

import com.learnforge.entity.Course;
import com.learnforge.entity.Lesson;
import com.learnforge.entity.Resource;
import com.learnforge.repository.CourseRepository;
import com.learnforge.repository.LessonRepository;
import com.learnforge.repository.ResourceRepository;
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

    /**
     * ✅ Fetch all lessons for a course, including their resources
     */
    public List<Lesson> getLessonsByCourseId(Long courseId) {
        System.out.println("📚 Fetching lessons for course " + courseId);
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByLessonIdAsc(courseId);
        System.out.println("✅ Found " + lessons.size() + " lessons");

        // Resources will be automatically fetched if you use FetchType.LAZY and call lesson.getResources()
        for (Lesson lesson : lessons) {
            List<Resource> resources = resourceRepository.findByLesson_LessonId(lesson.getLessonId());
            lesson.setResources(resources);
            System.out.println("  → Lesson " + lesson.getLessonId() + ": " + lesson.getLessonName() +
                    " | Resources: " + resources.size());
        }

        return lessons;
    }

    /**
     * ✅ Fetch a single lesson with its resources
     */
    public Lesson getLessonById(Long lessonId) {
        System.out.println("📖 Fetching lesson " + lessonId);
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        List<Resource> resources = resourceRepository.findByLesson_LessonId(lessonId);
        lesson.setResources(resources);
        System.out.println("✅ Lesson found with " + resources.size() + " resources");

        return lesson;
    }

    /**
     * ✅ Fetch the first lesson of a course (with resources)
     */
    public Lesson getFirstLessonOfCourse(Long courseId) {
        Lesson lesson = lessonRepository.findFirstByCourseId(courseId)
                .orElseThrow(() -> new RuntimeException("No lessons found"));

        List<Resource> resources = resourceRepository.findByLesson_LessonId(lesson.getLessonId());
        lesson.setResources(resources);
        return lesson;
    }

    /**
     * ✅ Count lessons by course ID
     */
    public Long countLessonsByCourseId(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }

    /**
     * ✅ Create a new lesson for a course
     */
    @Transactional
    public Lesson createLesson(Long courseId, Lesson lesson) {
        System.out.println("➕ Creating lesson for course " + courseId);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        lesson.setCourse(course);
        Lesson saved = lessonRepository.save(lesson);
        saved.setResources(List.of()); // empty list for new lessons

        System.out.println("✅ Lesson created with ID: " + saved.getLessonId());
        return saved;
    }

    /**
     * ✅ Update lesson details (and reload resources)
     */
    @Transactional
    public Lesson updateLesson(Long lessonId, Lesson lessonDetails) {
        System.out.println("📝 Updating lesson " + lessonId);
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setLessonName(lessonDetails.getLessonName());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());
        lesson.setDuration(lessonDetails.getDuration());

        Lesson updated = lessonRepository.save(lesson);
        List<Resource> resources = resourceRepository.findByLesson_LessonId(lessonId);
        updated.setResources(resources);

        System.out.println("✅ Lesson updated");
        return updated;
    }

    /**
     * ✅ Delete lesson and all associated resources
     */
    @Transactional
    public void deleteLesson(Long lessonId) {
        System.out.println("🗑️ Deleting lesson " + lessonId);

        // Delete resources first to maintain referential integrity
        resourceRepository.deleteByLesson_LessonId(lessonId);

        lessonRepository.deleteById(lessonId);
        System.out.println("✅ Lesson and related resources deleted");
    }

    // ✅ Compatibility methods for ProgressService
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
