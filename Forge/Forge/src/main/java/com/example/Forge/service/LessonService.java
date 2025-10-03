package com.example.Forge.service;

import com.example.Forge.entity.Course;
import com.example.Forge.entity.Lesson;
import com.example.Forge.repository.CourseRepository;
import com.example.Forge.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Lesson getLessonById(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseIdOrderByLessonIdAsc(courseId);
    }

    public List<Lesson> getLessonsByCourse(Course course) {
        return lessonRepository.findByCourseOrderByLessonIdAsc(course);
    }

    public Lesson getFirstLessonOfCourse(Long courseId) {
        return lessonRepository.findFirstByCourseId(courseId)
                .orElseThrow(() -> new RuntimeException("No lessons found for course: " + courseId));
    }

    public Long countLessonsByCourseId(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }

    @Transactional
    public Lesson createLesson(Long courseId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        lesson.setCourse(course);
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, Lesson lessonDetails) {
        Lesson lesson = getLessonById(lessonId);

        lesson.setLessonName(lessonDetails.getLessonName());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());
        lesson.setDuration(lessonDetails.getDuration());
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = getLessonById(lessonId);
        lessonRepository.delete(lesson);
    }

    @Transactional
    public void deleteAllLessonsInCourse(Long courseId) {
        lessonRepository.deleteByCourseId(courseId);
    }

    public List<Lesson> searchLessons(String keyword) {
        return lessonRepository.findByLessonNameContainingIgnoreCase(keyword);
    }

    public boolean lessonExistsInCourse(Long lessonId, Long courseId) {
        return lessonRepository.existsByLessonIdAndCourse_CourseId(lessonId, courseId);
    }
}
