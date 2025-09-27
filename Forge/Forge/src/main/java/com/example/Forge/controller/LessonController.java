package com.example.Forge.controller;

import com.example.Forge.entity.Lesson;
import com.example.Forge.service.LessonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        allowCredentials = "false",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
        System.out.println("🎯 LessonController initialized!");
    }

    // 🎯 GET all lessons for a course
    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        try {
            System.out.println("🎯 Fetching lessons for course ID: " + courseId);
            List<Lesson> lessons = lessonService.getLessonsByCourseId(courseId);
            System.out.println("✅ Found " + lessons.size() + " lessons for course " + courseId);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            System.err.println("❌ Error fetching lessons for course " + courseId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 GET specific lesson by ID
    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long lessonId) {
        try {
            System.out.println("🎯 Fetching lesson ID: " + lessonId);
            Optional<Lesson> lesson = lessonService.getLessonById(lessonId);

            if (lesson.isPresent()) {
                System.out.println("✅ Found lesson: " + lesson.get().getLessonName());
                return ResponseEntity.ok(lesson.get());
            } else {
                System.out.println("❌ Lesson not found: " + lessonId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error fetching lesson " + lessonId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 POST - Create new lesson for a course
    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<Lesson> createLesson(@PathVariable Long courseId, @RequestBody Lesson lesson) {
        try {
            System.out.println("🎯 Creating lesson for course " + courseId + ": " + lesson.getLessonName());
            lesson.setCourseId(courseId);
            Lesson savedLesson = lessonService.saveLesson(lesson);
            System.out.println("✅ Created lesson with ID: " + savedLesson.getLessonId());
            return ResponseEntity.ok(savedLesson);
        } catch (Exception e) {
            System.err.println("❌ Error creating lesson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 PUT - Update existing lesson
    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long lessonId, @RequestBody Lesson lesson) {
        try {
            System.out.println("🎯 Updating lesson ID: " + lessonId);
            lesson.setLessonId(lessonId);
            Lesson updatedLesson = lessonService.saveLesson(lesson);
            System.out.println("✅ Updated lesson: " + updatedLesson.getLessonName());
            return ResponseEntity.ok(updatedLesson);
        } catch (Exception e) {
            System.err.println("❌ Error updating lesson " + lessonId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🎯 DELETE - Delete lesson
    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<String> deleteLesson(@PathVariable Long lessonId) {
        try {
            System.out.println("🎯 Deleting lesson ID: " + lessonId);
            lessonService.deleteLesson(lessonId);
            System.out.println("✅ Deleted lesson successfully");
            return ResponseEntity.ok("Lesson deleted successfully");
        } catch (Exception e) {
            System.err.println("❌ Error deleting lesson " + lessonId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
