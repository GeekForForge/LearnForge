package com.example.Forge.controller;

import com.example.Forge.entity.Progress;
import com.example.Forge.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    // Get user's progress for a specific course
    @GetMapping("/user/{userId}/course/{courseId}")
    public ResponseEntity<?> getUserCourseProgress(
            @PathVariable String userId,
            @PathVariable Long courseId) {
        try {
            Progress progress = progressService.getUserCourseProgress(userId, courseId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get all progress for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllUserProgress(@PathVariable String userId) {
        try {
            List<Progress> progressList = progressService.getAllUserProgress(userId);
            return ResponseEntity.ok(progressList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Update progress (mark lesson as complete)
    @PostMapping("/update")
    public ResponseEntity<?> updateProgress(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            Long courseId = Long.valueOf(request.get("courseId").toString());
            Integer lessonId = (Integer) request.get("lessonId");

            Progress progress = progressService.markLessonComplete(userId, courseId, lessonId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Mark lesson as incomplete (undo)
    @PostMapping("/undo")
    public ResponseEntity<?> undoProgress(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            Long courseId = Long.valueOf(request.get("courseId").toString());
            Integer lessonId = (Integer) request.get("lessonId");

            Progress progress = progressService.markLessonIncomplete(userId, courseId, lessonId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get progress summary for dashboard
    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<?> getProgressSummary(@PathVariable String userId) {
        try {
            Map<String, Object> summary = progressService.getProgressSummary(userId);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
