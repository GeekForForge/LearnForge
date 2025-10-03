package com.example.Forge.controller;

import com.example.Forge.entity.Lesson;
import com.example.Forge.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // Get all lessons for a specific course
    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        System.out.println("🎯 Fetching lessons for course ID: " + courseId);
        List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
        System.out.println("✅ Found " + lessons.size() + " lessons for course " + courseId);
        return ResponseEntity.ok(lessons);
    }

    // Get specific lesson
    @GetMapping("/{courseId}/lessons/{lessonId}")
    public ResponseEntity<Lesson> getLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        if (!lessonService.lessonExistsInCourse(lessonId, courseId)) {
            return ResponseEntity.notFound().build();
        }

        Lesson lesson = lessonService.getLessonById(lessonId);
        return ResponseEntity.ok(lesson);
    }

    // Get first lesson of a course
    @GetMapping("/{courseId}/lessons/first")
    public ResponseEntity<Lesson> getFirstLesson(@PathVariable Long courseId) {
        try {
            Lesson lesson = lessonService.getFirstLessonOfCourse(courseId);
            return ResponseEntity.ok(lesson);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Count lessons in a course
    @GetMapping("/{courseId}/lessons/count")
    public ResponseEntity<Long> countLessons(@PathVariable Long courseId) {
        Long count = lessonService.countLessonsByCourseId(courseId);
        return ResponseEntity.ok(count);
    }

    // Create new lesson (admin only)
    @PostMapping("/{courseId}/lessons")
    public ResponseEntity<Lesson> createLesson(
            @PathVariable Long courseId,
            @RequestBody Lesson lesson) {
        try {
            Lesson createdLesson = lessonService.createLesson(courseId, lesson);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdLesson);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update lesson (admin only)
    @PutMapping("/{courseId}/lessons/{lessonId}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody Lesson lessonDetails) {
        try {
            if (!lessonService.lessonExistsInCourse(lessonId, courseId)) {
                return ResponseEntity.notFound().build();
            }

            Lesson updatedLesson = lessonService.updateLesson(lessonId, lessonDetails);
            return ResponseEntity.ok(updatedLesson);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete lesson (admin only)
    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {
        try {
            if (!lessonService.lessonExistsInCourse(lessonId, courseId)) {
                return ResponseEntity.notFound().build();
            }

            lessonService.deleteLesson(lessonId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Search lessons
    @GetMapping("/lessons/search")
    public ResponseEntity<List<Lesson>> searchLessons(@RequestParam String keyword) {
        List<Lesson> lessons = lessonService.searchLessons(keyword);
        return ResponseEntity.ok(lessons);
    }
}
