package com.example.Forge.service;

import com.example.Forge.entity.UserStreak;
import com.example.Forge.repository.UserStreakRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class UserStreakService {

    @Autowired
    private UserStreakRepository streakRepository;

    @Transactional
    public UserStreak updateStreakOnLessonComplete(String userId) {
        System.out.println("🔥 Updating streak for user: " + userId);

        UserStreak streak = streakRepository.findByUserId(userId)
                .orElseGet(() -> createNewStreak(userId));

        LocalDate today = LocalDate.now();
        LocalDate lastActive = streak.getLastActiveDate();

        if (lastActive == null) {
            streak.setCurrentStreak(1);
            streak.setLongestStreak(1);
            streak.setLastActiveDate(today);
            streak.setTotalLessonsCompleted(1);
            System.out.println("🎉 New streak started!");

        } else if (lastActive.equals(today)) {
            streak.setTotalLessonsCompleted(streak.getTotalLessonsCompleted() + 1);
            System.out.println("✅ Lesson completed today (streak maintained)");

        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastActive, today);

            if (daysBetween == 1) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                streak.setLastActiveDate(today);
                streak.setTotalLessonsCompleted(streak.getTotalLessonsCompleted() + 1);

                if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                    streak.setLongestStreak(streak.getCurrentStreak());
                }

                System.out.println("🔥 Streak increased to: " + streak.getCurrentStreak());

            } else {
                System.out.println("💔 Streak broken! Starting fresh...");
                streak.setCurrentStreak(1);
                streak.setLastActiveDate(today);
                streak.setTotalLessonsCompleted(streak.getTotalLessonsCompleted() + 1);
            }
        }

        return streakRepository.save(streak);
    }

    public UserStreak getUserStreak(String userId) {
        Optional<UserStreak> streak = streakRepository.findByUserId(userId);

        if (streak.isPresent()) {
            UserStreak userStreak = streak.get();
            LocalDate lastActive = userStreak.getLastActiveDate();
            LocalDate today = LocalDate.now();

            if (lastActive != null && !lastActive.equals(today)) {
                long daysBetween = ChronoUnit.DAYS.between(lastActive, today);

                if (daysBetween > 1) {
                    userStreak.setCurrentStreak(0);
                    System.out.println("⚠️ Streak expired for user: " + userId);
                }
            }

            return userStreak;
        }

        return createNewStreak(userId);
    }

    private UserStreak createNewStreak(String userId) {
        UserStreak streak = new UserStreak();
        streak.setUserId(userId);
        streak.setCurrentStreak(0);
        streak.setLongestStreak(0);
        streak.setTotalLessonsCompleted(0);
        return streak;
    }
}
