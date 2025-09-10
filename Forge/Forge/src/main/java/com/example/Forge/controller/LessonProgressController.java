package com.example.Forge.controller;

import com.example.Forge.entity.LessonProgress;
import com.example.Forge.service.LessonProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
public class LessonProgressController {

    private final LessonProgressService lessonProgressService;

    public LessonProgressController(LessonProgressService lessonProgressService) {
        this.lessonProgressService = lessonProgressService;
    }

    /**
     * Get user's dashboard progress data
     */
    @GetMapping("/users/{id}/dashboard")
    public ResponseEntity<List<LessonProgress>> getUserProgress(@PathVariable("id") String userId) {
        List<LessonProgress> progressList = lessonProgressService.getProgressByUserId(userId);
        return ResponseEntity.ok(progressList);
    }

    /**
     * Get progress for specific lesson
     */
    @GetMapping("/users/{userId}/lessons/{lessonId}")
    public ResponseEntity<LessonProgress> getLessonProgress(
            @PathVariable String userId,
            @PathVariable Long lessonId) {
        Optional<LessonProgress> progress = lessonProgressService.getProgressByUserAndLesson(userId, lessonId);
        return progress.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Record video play event
     */
//    @PostMapping("/play")
//    public ResponseEntity<LessonProgress> recordVideoPlay(
//            @RequestParam String userId,
//            @RequestParam Long lessonId) {
//        LessonProgress progress = lessonProgressService.recordVideoPlay(userId, lessonId);
//        return ResponseEntity.ok(progress);
//    }

    /**
     * Record video pause event
     */
    @PostMapping("/pause")
    public ResponseEntity<LessonProgress> recordVideoPause(
            @RequestParam String userId,
            @RequestParam Long lessonId,
            @RequestParam(required = false) String currentPosition) {
        LessonProgress progress = lessonProgressService.recordVideoPause(userId, lessonId, currentPosition);
        return ResponseEntity.ok(progress);
    }

    /**
     * Mark lesson as completed
     */
    @PostMapping("/complete")
    public ResponseEntity<LessonProgress> markLessonComplete(
            @RequestParam String userId,
            @RequestParam Long lessonId) {
        LessonProgress progress = lessonProgressService.markLessonComplete(userId, lessonId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Update watch time
     */
    @PostMapping("/watch-time")
    public ResponseEntity<LessonProgress> updateWatchTime(
            @RequestParam String userId,
            @RequestParam Long lessonId,
            @RequestParam Integer watchTimeSeconds) {
        LessonProgress progress = lessonProgressService.updateWatchTime(userId, lessonId, watchTimeSeconds);
        return ResponseEntity.ok(progress);
    }
    @PostMapping("/play")
    public ResponseEntity<LessonProgress> recordVideoPlay(
            @RequestParam String userId,
            @RequestParam Long lessonId) {
        System.out.println(" Received play request: userId=" + userId + ", lessonId=" + lessonId);
        LessonProgress progress = lessonProgressService.recordVideoPlay(userId, lessonId);
        System.out.println(" Saved progress: " + progress.getId());
        return ResponseEntity.ok(progress);
    }
}
