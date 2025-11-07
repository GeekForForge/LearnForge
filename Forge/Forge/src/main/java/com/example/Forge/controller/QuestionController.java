package com.example.Forge.controller;

import com.example.Forge.model.Question;
import com.example.Forge.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arena")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/questions")
    public List<Question> getQuestions(
            @RequestParam String topic,
            @RequestParam String difficulty,
            @RequestParam(defaultValue = "10") int limit) {
        return questionService.getRandomQuestions(topic, difficulty, limit);
    }
}
