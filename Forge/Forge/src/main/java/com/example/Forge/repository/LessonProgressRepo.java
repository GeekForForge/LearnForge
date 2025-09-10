package com.example.Forge.repository;

import com.example.Forge.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepo extends JpaRepository<LessonProgress, Long> {
    List<LessonProgress> findByUserId(String userId);

    /**
     * Find progress for specific user and lesson
     */
    Optional<LessonProgress> findByUserIdAndLessonId(String userId, Long lessonId);

    /**
     * Find completed lessons for a user
     */
    List<LessonProgress> findByUserIdAndCompletedTrue(String userId);

    /**
     * Count completed lessons for a user
     */
    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.userId = :userId AND lp.completed = true")
    Long countCompletedLessonsByUserId(@Param("userId") String userId);

    /**
     * Get total watch time for a user
     */
    @Query("SELECT SUM(lp.watchTimeSeconds) FROM LessonProgress lp WHERE lp.userId = :userId")
    Integer getTotalWatchTimeByUserId(@Param("userId") String userId);
}
