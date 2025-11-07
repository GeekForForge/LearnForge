package com.example.Forge.controller;

import com.example.Forge.model.Question;
import com.example.Forge.entity.UserProgress;
import com.example.Forge.service.ArenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/arena")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "https://learn-forge-xi.vercel.app"
}, allowCredentials = "true")
public class ArenaController {

    @Autowired
    private ArenaService arenaService;

    /**
     * GET /api/arena/start
     * Returns 10 random questions
     */
    @GetMapping("/start")
    public List<Question> startGame(@RequestParam(defaultValue = "10") int count) {
        return arenaService.getRandomQuestions(count);
    }

    /**
     * POST /api/arena/submit
     * Receives answers and returns XP + results
     */
    @PostMapping("/submit")
    public Map<String, Object> submitAnswers(@RequestParam Long userId, @RequestBody Map<Long, String> answers) {
        return arenaService.evaluateAnswers(userId, answers);
    }

    /**
     * GET /api/arena/stats/{userId}
     * Returns user progress (XP, accuracy, etc.)
     */
    @GetMapping("/stats/{userId}")
    public Optional<UserProgress> getProgress(@PathVariable Long userId) {
        return arenaService.getUserProgress(userId);
    }
}
