package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Lesson;
import com.example.Forge.repository.CourseRepository;
import com.example.Forge.repository.LessonRepository;
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

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        System.out.println("📚 Fetching lessons for course " + courseId);
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByLessonIdAsc(courseId);
        System.out.println("✅ Found " + lessons.size() + " lessons");
        return lessons;
    }

    public Lesson getLessonById(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public Lesson getFirstLessonOfCourse(Long courseId) {
        return lessonRepository.findFirstByCourseId(courseId)
                .orElseThrow(() -> new RuntimeException("No lessons found"));
    }

    public Long countLessonsByCourseId(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }

    @Transactional
    public Lesson createLesson(Long courseId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, Lesson lessonDetails) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        lesson.setLessonName(lessonDetails.getLessonName());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());
        lesson.setDuration(lessonDetails.getDuration());
        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    // For ProgressService
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
