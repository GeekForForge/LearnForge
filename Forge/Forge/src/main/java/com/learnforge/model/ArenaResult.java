package com.learnforge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArenaResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "topic")
    private String topic;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "score")
    private int score;

    @Column(name = "total_questions")
    private int totalQuestions;

    @Column(name = "accuracy")
    private double accuracy;

    @Column(name = "time_taken")
    private int timeTaken;

    @Column(name = "played_at")
    private LocalDateTime playedAt;

    @PrePersist
    protected void onCreate() {
        if (playedAt == null) {
            playedAt = LocalDateTime.now();
        }
    }
}
