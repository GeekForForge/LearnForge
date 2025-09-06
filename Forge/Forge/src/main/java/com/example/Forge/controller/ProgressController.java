package com.example.Forge.controller;

import com.example.Forge.entity.Progress;
import com.example.Forge.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/progress")
public class ProgressController {
    private final ProgressService progSvc;

    public ProgressController(ProgressService progSvc) {
        this.progSvc = progSvc;
    }

    @PostMapping
    public ResponseEntity<Progress> record(
            @RequestParam String userId,
            @RequestParam Long courseId,
            @RequestParam int completedLessons) {

        Progress saved = progSvc.recordProgress(userId, courseId, completedLessons);
        return ResponseEntity.ok(saved);
    }
}
