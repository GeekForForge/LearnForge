package com.example.Forge.repository;

import com.example.Forge.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, Long> {

    Optional<UserStreak> findByUserId(String userId);

    @Query("SELECT s FROM UserStreak s ORDER BY s.currentStreak DESC")
    List<UserStreak> findTopStreaks();

    @Query("SELECT s FROM UserStreak s ORDER BY s.longestStreak DESC")
    List<UserStreak> findTopLongestStreaks();
}
