package com.learnforge.service;

import com.learnforge.entity.LessonProgress;
import com.learnforge.repository.LessonProgressRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LessonProgressService {

    private final LessonProgressRepo lessonProgressRepository;

    public LessonProgressService(LessonProgressRepo lessonProgressRepository) {
        this.lessonProgressRepository = lessonProgressRepository;
    }

    /**
     * Get all lesson progress for a specific user
     */
    public List<LessonProgress> getProgressByUserId(String userId) {
        return lessonProgressRepository.findByUserId(userId);
    }

    /**
     * Get progress for a specific lesson and user
     */
    public Optional<LessonProgress> getProgressByUserAndLesson(String userId, Long lessonId) {
        return lessonProgressRepository.findByUserIdAndLessonId(userId, lessonId);
    }

    /**
     * Record video play event
     */
    public LessonProgress recordVideoPlay(String userId, Long lessonId) {
        Optional<LessonProgress> existingProgress = getProgressByUserAndLesson(userId, lessonId);

        LessonProgress progress = existingProgress.orElseGet(() -> {
            LessonProgress newProgress = new LessonProgress();
            newProgress.setUserId(userId);
            newProgress.setLessonId(lessonId);
            newProgress.setPlayCount(0);
            newProgress.setPauseCount(0);
            newProgress.setWatchTimeSeconds(0);
            newProgress.setCompleted(false);
            return newProgress;
        });

        progress.setPlayCount(progress.getPlayCount() + 1);
        progress.setLastWatchedAt(LocalDateTime.now());

        return lessonProgressRepository.save(progress);
    }

    /**
     * Record video pause event
     */
    public LessonProgress recordVideoPause(String userId, Long lessonId, String currentPosition) {
        Optional<LessonProgress> existingProgress = getProgressByUserAndLesson(userId, lessonId);

        if (existingProgress.isPresent()) {
            LessonProgress progress = existingProgress.get();
            progress.setPauseCount(progress.getPauseCount() + 1);
            progress.setLastPosition(currentPosition);
            progress.setLastWatchedAt(LocalDateTime.now());
            return lessonProgressRepository.save(progress);
        }

        return recordVideoPlay(userId, lessonId); // Create if doesn't exist
    }

    /**
     * Mark lesson as completed
     */
    public LessonProgress markLessonComplete(String userId, Long lessonId) {
        Optional<LessonProgress> existingProgress = getProgressByUserAndLesson(userId, lessonId);

        LessonProgress progress = existingProgress.orElseGet(() -> {
            LessonProgress newProgress = new LessonProgress();
            newProgress.setUserId(userId);
            newProgress.setLessonId(lessonId);
            newProgress.setPlayCount(0);
            newProgress.setPauseCount(0);
            newProgress.setWatchTimeSeconds(0);
            newProgress.setCompleted(false);
            return newProgress;
        });

        progress.setCompleted(true);
        progress.setLastWatchedAt(LocalDateTime.now());

        return lessonProgressRepository.save(progress);
    }

    /**
     * Update watch time for a lesson
     */
    public LessonProgress updateWatchTime(String userId, Long lessonId, Integer watchTimeSeconds) {
        Optional<LessonProgress> existingProgress = getProgressByUserAndLesson(userId, lessonId);

        if (existingProgress.isPresent()) {
            LessonProgress progress = existingProgress.get();
            progress.setWatchTimeSeconds(
                    Math.max(progress.getWatchTimeSeconds(), watchTimeSeconds)
            );
            progress.setLastWatchedAt(LocalDateTime.now());
            return lessonProgressRepository.save(progress);
        }

        return recordVideoPlay(userId, lessonId); // Create if doesn't exist
    }
}
