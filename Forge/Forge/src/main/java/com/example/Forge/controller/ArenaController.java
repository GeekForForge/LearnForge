package com.example.Forge.controller;

import com.example.Forge.model.Question;
import com.example.Forge.entity.UserProgress;
import com.example.Forge.service.ArenaService;
import com.example.Forge.service.QuestionService;
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


//    @GetMapping("/start")
//    public List<Question> startGame(@RequestParam(defaultValue = "10") int count) {
//        return arenaService.getRandomQuestions(count);
//    }
    @GetMapping("/start")
    public List<Question> startArena(
            @RequestParam String topic,
            @RequestParam String difficulty,
            @RequestParam(defaultValue = "5") int count) {

        return questionService.getRandomQuestions(topic, difficulty, count);
    }
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
