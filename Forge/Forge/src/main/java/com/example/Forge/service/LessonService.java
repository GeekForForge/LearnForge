package com.example.Forge.service;

import com.example.Forge.entity.Lesson;
import com.example.Forge.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    // Get lessons by course ID
    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseIdOrderByLessonIdAsc(courseId);
    }

    // Get lesson by ID
    public Optional<Lesson> getLessonById(Long lessonId) {
        return lessonRepository.findById(lessonId);
    }

    // Save lesson
    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    // Delete lesson
    public void deleteLesson(Long lessonId) {
        lessonRepository.deleteById(lessonId);
    }

    // Get lesson count for course
    public Long getLessonCountForCourse(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }

    // 🚨 REMOVED methods that use 'completed':
    // - getFirstLessonOfCourse
    // - getCompletedLessonsForCourse
    // Since your database doesn't have 'completed' column
}
