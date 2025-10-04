package com.example.Forge.controller;

import com.example.Forge.entity.VideoProgress;
import com.example.Forge.repository.VideoProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/video-progress")
@CrossOrigin(origins = "http://localhost:3000")
public class VideoProgressController {

    @Autowired
    private VideoProgressRepository videoProgressRepository;

    // Save video progress
    @PostMapping("/save")
    public ResponseEntity<?> saveProgress(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            Long lessonId = Long.parseLong(request.get("lessonId").toString());
            Double currentTime = Double.parseDouble(request.get("currentTime").toString());
            Double duration = request.get("duration") != null ?
                    Double.parseDouble(request.get("duration").toString()) : null;

            Optional<VideoProgress> existingProgress =
                    videoProgressRepository.findByUserIdAndLessonId(userId, lessonId);

            VideoProgress progress;
            if (existingProgress.isPresent()) {
                progress = existingProgress.get();
                progress.setWatchTime(currentTime);  // ✅ Changed method name
                if (duration != null) {
                    progress.setDuration(duration);
                }
            } else {
                progress = new VideoProgress();
                progress.setUserId(userId);
                progress.setLessonId(lessonId);
                progress.setWatchTime(currentTime);  // ✅ Changed method name
                progress.setDuration(duration);
            }

            videoProgressRepository.save(progress);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get video progress
    @GetMapping("/get/{userId}/{lessonId}")
    public ResponseEntity<?> getProgress(@PathVariable String userId, @PathVariable Long lessonId) {
        try {
            Optional<VideoProgress> progress =
                    videoProgressRepository.findByUserIdAndLessonId(userId, lessonId);

            if (progress.isPresent()) {
                // Return with currentTime for frontend compatibility
                return ResponseEntity.ok(Map.of(
                        "currentTime", progress.get().getWatchTime(),
                        "duration", progress.get().getDuration() != null ? progress.get().getDuration() : 0
                ));
            } else {
                return ResponseEntity.ok(Map.of("currentTime", 0, "duration", 0));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
