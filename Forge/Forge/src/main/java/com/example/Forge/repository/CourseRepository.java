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
     * Get course with all its lessons
     */
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.lessons WHERE c.courseId = :courseId")
    Optional<Course> findByIdWithLessons(@Param("courseId") Long courseId);

    /**
     * Get all courses with their lesson count
     */
    @Query("SELECT c, SIZE(c.lessons) as lessonCount FROM Course c")
    List<Object[]> findAllWithLessonCount();

    /**
     * Get courses by category with lessons
     */
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.lessons WHERE c.category = :category")
    List<Course> findByCategoryWithLessons(@Param("category") String category);
}