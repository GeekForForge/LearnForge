package com.learnforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "progress")
@Data
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // ✅ Store lesson IDs as integers in a Set
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "completed_lessons", joinColumns = @JoinColumn(name = "progress_id"))
    @Column(name = "lesson_id")
    private Set<Integer> completedLessons = new HashSet<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public void addCompletedLesson(Integer lessonId) {
        if (completedLessons == null) {
            completedLessons = new HashSet<>();
        }
        completedLessons.add(lessonId);
    }

    public void removeCompletedLesson(Integer lessonId) {
        if (completedLessons != null) {
            completedLessons.remove(lessonId);
        }
    }

    public boolean isLessonCompleted(Integer lessonId) {
        return completedLessons != null && completedLessons.contains(lessonId);
    }

    public int getCompletedLessonsCount() {
        return completedLessons != null ? completedLessons.size() : 0;
    }

    @Override
    public String toString() {
        return "Progress{" +
                "id=" + id +
                ", completedLessons=" + (completedLessons != null ? completedLessons.size() : 0) +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
