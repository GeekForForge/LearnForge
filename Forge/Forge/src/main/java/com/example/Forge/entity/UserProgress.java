package com.example.Forge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_progress")
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private int totalQuestions;
    private int correctAnswers;
    private int xpPoints;
    private int streakDays;

    private LocalDateTime lastPlayed;
}
