package com.learnforge.service;

import com.learnforge.model.Question;
import com.learnforge.entity.UserProgress;
import com.learnforge.repository.QuestionRepository;
import com.learnforge.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ArenaService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    /**
     * Get random set of questions (10 by default)
     */
    public List<Question> getRandomQuestions(int count) {
        return questionRepository.findRandomQuestions(count);
    }

    /**
     * Evaluate answers and update XP + progress
     */
    public Map<String, Object> evaluateAnswers(Long userId, Map<Long, String> submittedAnswers) {
        int correct = 0;
        int total = submittedAnswers.size();
        int xpEarned = 0;

        for (Map.Entry<Long, String> entry : submittedAnswers.entrySet()) {
            Long questionId = entry.getKey();
            String userAnswer = entry.getValue();

            Optional<Question> questionOpt = questionRepository.findById(questionId);
            if (questionOpt.isPresent()) {
                if (questionOpt.get().getCorrectAnswer().equalsIgnoreCase(userAnswer)) {
                    correct++;
                    xpEarned += 10; // 10 XP per correct answer
                }
            }
        }

        if (correct == total) {
            xpEarned += 50; // bonus for perfect score
        }

        // Update user progress
        UserProgress progress = userProgressRepository.findByUserId(userId).orElseGet(() -> {
            UserProgress p = new UserProgress();
            p.setUserId(userId);
            p.setXpPoints(0);
            p.setTotalQuestions(0);
            p.setCorrectAnswers(0);
            p.setStreakDays(0);
            return p;
        });

        progress.setTotalQuestions(progress.getTotalQuestions() + total);
        progress.setCorrectAnswers(progress.getCorrectAnswers() + correct);
        progress.setXpPoints(progress.getXpPoints() + xpEarned);
        progress.setLastPlayed(LocalDateTime.now());
        userProgressRepository.save(progress);

        Map<String, Object> result = new HashMap<>();
        result.put("correctAnswers", correct);
        result.put("totalQuestions", total);
        result.put("xpEarned", xpEarned);
        result.put("newXpTotal", progress.getXpPoints());

        return result;
    }

    public Optional<UserProgress> getUserProgress(Long userId) {
        return userProgressRepository.findByUserId(userId);
    }
}
