package com.example.Forge.controller;

import com.example.Forge.entity.Lesson;
import com.example.Forge.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses/{courseId}/lessons")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        System.out.println("🎯 API: GET /courses/" + courseId + "/lessons");
        List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<Lesson> getLessonById(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        System.out.println("🎯 API: GET /courses/" + courseId + "/lessons/" + lessonId);
        Lesson lesson = lessonService.getLessonById(lessonId);
        return ResponseEntity.ok(lesson);
    }

    @PostMapping
    public ResponseEntity<Lesson> createLesson(
            @PathVariable Long courseId,
            @RequestBody Lesson lesson) {

        System.out.println("🎯 API: POST /courses/" + courseId + "/lessons");
        Lesson created = lessonService.createLesson(courseId, lesson);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<Lesson> updateLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @RequestBody Lesson lessonDetails) {

        System.out.println("🎯 API: PUT /courses/" + courseId + "/lessons/" + lessonId);
        Lesson updated = lessonService.updateLesson(lessonId, lessonDetails);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long courseId,
            @PathVariable Long lessonId) {

        System.out.println("🎯 API: DELETE /courses/" + courseId + "/lessons/" + lessonId);
        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countLessons(@PathVariable Long courseId) {
        Long count = lessonService.countLessonsByCourseId(courseId);
        return ResponseEntity.ok(count);
    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Lesson>> searchLessons(@RequestParam String keyword) {
//        List<Lesson> lessons = lessonService.searchLessons(keyword);
//        return ResponseEntity.ok(lessons);
//    }
}
