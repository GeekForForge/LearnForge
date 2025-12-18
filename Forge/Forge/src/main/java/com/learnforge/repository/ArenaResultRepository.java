package com.learnforge.repository;

import com.learnforge.model.ArenaResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArenaResultRepository extends JpaRepository<ArenaResult, Long> {
    List<ArenaResult> findTop10ByOrderByAccuracyDesc();
    List<ArenaResult> findTop10ByTopicOrderByAccuracyDesc(String topic);
    List<ArenaResult> findByUserIdOrderByPlayedAtDesc(String userId);
}

