package com.learnforge.repository;

import com.learnforge.model.ArenaResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ArenaResultRepository extends JpaRepository<ArenaResult, Long> {

    // Helper query for weekly/monthly leaderboards
    @Query("SELECT r.userId, SUM(r.score) as totalScore FROM ArenaResult r WHERE r.playedAt >= :startDate GROUP BY r.userId ORDER BY totalScore DESC")
    List<Object[]> findLeaderboardSince(@Param("startDate") LocalDateTime startDate);

    List<ArenaResult> findTop10ByTopicOrderByAccuracyDesc(String topic);

    List<ArenaResult> findTop10ByOrderByAccuracyDesc();
}
