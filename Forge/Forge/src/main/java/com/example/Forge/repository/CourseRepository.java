package com.example.Forge.repository;

import com.example.Forge.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Find courses by category
     */
    List<Course> findByCategory(String category);

    /**
     * Find courses by title containing keyword (case-insensitive)
     */
    List<Course> findByCourseTitleContainingIgnoreCase(String keyword);

    /**
     * 🎯 SIMPLIFIED - Get course by ID (no lessons join needed)
     */
    Optional<Course> findById(Long courseId);

    // 🚨 REMOVED ALL QUERIES THAT REFERENCE c.lessons:
    // - findByIdWithLessons
    // - findAllWithLessonCount
    // - findByCategoryWithLessons

    // These are removed because Course entity no longer has lessons relationship
    // We'll fetch lessons separately using LessonService
}
