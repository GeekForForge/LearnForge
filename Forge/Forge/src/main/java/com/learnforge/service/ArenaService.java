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
    private com.learnforge.repository.ArenaResultRepository arenaResultRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;

    public List<Question> getRandomQuestions(int count) {
        return questionRepository.findRandomQuestions(count);
    }

    public Map<String, Object> evaluateAnswers(String userId, Map<Long, String> submittedAnswers) {
        int correct = 0;
        int total = submittedAnswers.size();
        int xpEarned = 0;

        // Calculate Score
        for (Map.Entry<Long, String> entry : submittedAnswers.entrySet()) {
            Long questionId = entry.getKey();
            String userAnswer = entry.getValue();

            Optional<Question> questionOpt = questionRepository.findById(questionId);
            if (questionOpt.isPresent()) {
                if (questionOpt.get().getCorrectAnswer().equalsIgnoreCase(userAnswer)) {
                    correct++;
                    xpEarned += 10;
                }
            }
        }

        if (correct == total && total > 0) {
            xpEarned += 50;
        }

        // 1. Save specific Game Result
        com.learnforge.model.ArenaResult result = new com.learnforge.model.ArenaResult();
        result.setUserId(userId);
        result.setScore(xpEarned);
        result.setTotalQuestions(total);
        result.setAccuracy(total > 0 ? (double) correct / total * 100 : 0);
        result.setPlayedAt(LocalDateTime.now());
        // result.setTopic(...) // requires passing topic from controller if needed,
        // omitting for now
        arenaResultRepository.save(result);

        // 2. Update Aggregate User Progress
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

        Map<String, Object> response = new HashMap<>();
        response.put("correctAnswers", correct);
        response.put("totalQuestions", total);
        response.put("xpEarned", xpEarned);
        response.put("newXpTotal", progress.getXpPoints());

        return response;
    }

    public Optional<UserProgress> getUserProgress(String userId) {
        return userProgressRepository.findByUserId(userId);
    }

    @Autowired
    private com.learnforge.repository.UserRepository userRepository;

    public List<com.learnforge.dto.LeaderboardEntryDto> getLeaderboard(String timeRange) {
        List<com.learnforge.dto.LeaderboardEntryDto> leaderboard = new ArrayList<>();

        // 1. Fetch Raw Data (UserId + XP)
        Map<String, Long> userScores = new HashMap<>();

        if ("all-time".equalsIgnoreCase(timeRange)) {
            List<UserProgress> allProgress = userProgressRepository.findAll();
            for (UserProgress p : allProgress) {
                userScores.put(p.getUserId(), (long) p.getXpPoints());
            }
        } else {
            LocalDateTime startDate = LocalDateTime.now();
            if ("week".equalsIgnoreCase(timeRange)) {
                startDate = startDate.minusDays(7);
            } else if ("month".equalsIgnoreCase(timeRange)) {
                startDate = startDate.minusDays(30);
            }

            List<Object[]> results = arenaResultRepository.findLeaderboardSince(startDate);
            for (Object[] row : results) {
                String uId = (String) row[0];
                Long score = (Long) row[1];
                userScores.put(uId, score);
            }
        }

        // 2. Sort by Score DESC
        List<Map.Entry<String, Long>> sortedEntries = new ArrayList<>(userScores.entrySet());
        sortedEntries.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));

        // 3. Limit to Top 50 and Enhance with User Details
        int rank = 1;
        for (Map.Entry<String, Long> entry : sortedEntries) {
            if (rank > 50)
                break;

            String uId = entry.getKey();
            Long xp = entry.getValue();

            Optional<com.learnforge.entity.User> userOpt = userRepository.findById(uId);
            if (userOpt.isPresent()) {
                com.learnforge.entity.User u = userOpt.get();
                com.learnforge.dto.LeaderboardEntryDto dto = new com.learnforge.dto.LeaderboardEntryDto();

                dto.setRank(rank);
                dto.setName(u.getName());
                dto.setUsername("@" + u.getName().toLowerCase().replace(" ", "")); // simple generation
                dto.setAvatar(u.getAvatarUrl() != null ? u.getAvatarUrl()
                        : "https://ui-avatars.com/api/?name=" + u.getName());
                dto.setXp(xp);

                // Simple Level Logic: Level = sqrt(XP) / 10 + 1
                int level = (int) (Math.sqrt(xp) / 5) + 1;
                dto.setLevel(level);

                dto.setStreak(0); // placeholder, would need UserProgress lookup for streak
                dto.setBadge(getBadgeForRank(rank));
                dto.setProgress((int) (xp % 100)); // simplified progress

                leaderboard.add(dto);
                rank++;
            }
        }

        return leaderboard;
    }

    private String getBadgeForRank(int rank) {
        if (rank == 1)
            return "💎";
        if (rank == 2)
            return "⭐";
        if (rank == 3)
            return "🔥";
        return "✨";
    }
}
