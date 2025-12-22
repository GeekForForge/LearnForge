package com.learnforge.controller;

import com.learnforge.model.Question;
import com.learnforge.entity.UserProgress;
import com.learnforge.service.ArenaService;
import com.learnforge.service.QuestionService;
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
    @Autowired
    private QuestionService questionService;

    // @GetMapping("/start")
    // public List<Question> startGame(@RequestParam(defaultValue = "10") int count)
    // {
    // return arenaService.getRandomQuestions(count);
    // }
    @GetMapping("/start")
    public List<Question> startArena(
            @RequestParam String topic,
            @RequestParam String difficulty,
            @RequestParam(defaultValue = "5") int count) {

        return questionService.getRandomQuestions(topic, difficulty, count);
    }

    @PostMapping("/submit")
    public Map<String, Object> submitAnswers(@RequestParam String userId, @RequestBody Map<Long, String> answers) {
        return arenaService.evaluateAnswers(userId, answers);
    }

    /**
     * GET /api/arena/stats/{userId}
     * Returns user progress (XP, accuracy, etc.)
     */
    /**
     * GET /api/arena/stats/{userId}
     * Returns user progress (XP, accuracy, etc.)
     */
    @GetMapping("/stats/{userId}")
    public Optional<UserProgress> getProgress(@PathVariable String userId) {
        return arenaService.getUserProgress(userId);
    }

    @GetMapping("/leaderboard")
    public List<com.learnforge.dto.LeaderboardEntryDto> getLeaderboard(
            @RequestParam(defaultValue = "week") String type) {
        return arenaService.getLeaderboard(type);
    }
}
