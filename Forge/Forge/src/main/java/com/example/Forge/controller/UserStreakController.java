package com.example.Forge.controller;

import com.example.Forge.entity.UserStreak;
import com.example.Forge.service.UserStreakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/streaks")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserStreakController {

    @Autowired
    private UserStreakService streakService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserStreak> getUserStreak(@PathVariable String userId) {
        System.out.println("🔥 GET /streaks/" + userId);
        UserStreak streak = streakService.getUserStreak(userId);
        return ResponseEntity.ok(streak);
    }

    @PostMapping("/{userId}/update")
    public ResponseEntity<UserStreak> updateStreak(@PathVariable String userId) {
        System.out.println("🔥 POST /streaks/" + userId + "/update");
        UserStreak streak = streakService.updateStreakOnLessonComplete(userId);
        return ResponseEntity.ok(streak);
    }
}
