package com.example.Forge.repository;

import com.example.Forge.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    /**
     * Find all lessons for a specific course (ordered by lesson ID)
     */
    List<Lesson> findByCourseIdOrderByLessonIdAsc(Long courseId);

    /**
     * Count lessons in a course
     */
    Long countByCourseId(Long courseId);

    // 🚨 REMOVED all methods that use 'completed' field:
    // - findByCourseIdAndCompletedTrueOrderByLessonIdAsc
    // - findFirstLessonByCourseId
    // Since your database doesn't have 'completed' column
}
