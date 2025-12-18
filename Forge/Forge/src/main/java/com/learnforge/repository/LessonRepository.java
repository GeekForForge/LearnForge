package com.learnforge.repository;

import com.learnforge.entity.Course;
import com.learnforge.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    // Find all lessons for a course (ordered by lesson ID)
    List<Lesson> findByCourseOrderByLessonIdAsc(Course course);

    // Find all lessons by course ID (ordered)
    @Query("SELECT l FROM Lesson l WHERE l.course.courseId = :courseId ORDER BY l.lessonId ASC")
    List<Lesson> findByCourseIdOrderByLessonIdAsc(@Param("courseId") Long courseId);

    // Find lessons by course (for ProgressService)
    List<Lesson> findByCourse(Course course);

    // Count lessons in a course
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.courseId = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);

    // Count lessons by Course entity
    Long countByCourse(Course course);

    // Find first lesson of a course
    Optional<Lesson> findFirstByCourseOrderByLessonIdAsc(Course course);

    // Find first lesson by course ID
    @Query("SELECT l FROM Lesson l WHERE l.course.courseId = :courseId ORDER BY l.lessonId ASC LIMIT 1")
    Optional<Lesson> findFirstByCourseId(@Param("courseId") Long courseId);

    // Find lesson by ID and course ID (for validation)
    @Query("SELECT l FROM Lesson l WHERE l.lessonId = :lessonId AND l.course.courseId = :courseId")
    Optional<Lesson> findByLessonIdAndCourse_CourseId(@Param("lessonId") Long lessonId, @Param("courseId") Long courseId);

    // Check if lesson exists in course
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM Lesson l WHERE l.lessonId = :lessonId AND l.course.courseId = :courseId")
    boolean existsByLessonIdAndCourse_CourseId(@Param("lessonId") Long lessonId, @Param("courseId") Long courseId);

    // Delete all lessons for a course (using Course entity)
    @Transactional
    @Modifying
    void deleteByCourse(Course course);

    // Delete all lessons by course ID (using @Query)
    @Transactional
    @Modifying
    @Query("DELETE FROM Lesson l WHERE l.course.courseId = :courseId")
    void deleteByCourseId(@Param("courseId") Long courseId);

    // Find lessons by name pattern (search)
    List<Lesson> findByLessonNameContainingIgnoreCase(String keyword);

    // Find lessons by course and name pattern
    List<Lesson> findByCourseAndLessonNameContainingIgnoreCase(Course course, String keyword);
}
